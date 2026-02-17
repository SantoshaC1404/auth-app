package com.substring.auth_app_backend.controllers;

import com.substring.auth_app_backend.dtos.LoginRequest;
import com.substring.auth_app_backend.dtos.RefreshTokenRequest;
import com.substring.auth_app_backend.dtos.TokenResponse;
import com.substring.auth_app_backend.dtos.UserDto;
import com.substring.auth_app_backend.entities.RefreshToken;
import com.substring.auth_app_backend.entities.User;
import com.substring.auth_app_backend.repositories.RefreshTokenRepository;
import com.substring.auth_app_backend.repositories.UserRepository;
import com.substring.auth_app_backend.security.CookieService;
import com.substring.auth_app_backend.security.JwtService;
import com.substring.auth_app_backend.services.AuthService;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.Arrays;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/auth")
@AllArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final ModelMapper modelMapper;
    private final RefreshTokenRepository refreshTokenRepository;
    private final CookieService cookieService;

    @PostMapping("/register")
    public ResponseEntity<UserDto> registerUser(@RequestBody UserDto userDto) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(authService.registerUser(userDto));
    }

    @PostMapping("/login")
    public ResponseEntity<TokenResponse> login(@RequestBody LoginRequest loginRequest, HttpServletResponse response) {

        // authenticate
        Authentication authenticate = authenticate(loginRequest);
        User user = userRepository.findByEmail(loginRequest.email()).orElseThrow(
                () -> new BadCredentialsException("Invalid Email or Password.")
        );

        // check user is enabled or not
        if (!user.isEnabled()) {
            throw new DisabledException("User is disabled.");
        }

        // refresh token
        String jti = UUID.randomUUID().toString();
        var refreshTokenObject = RefreshToken.builder()
                .jti(jti)
                .user(user)
                .createdAt(Instant.now())
                .expiresAt(Instant.now().plusSeconds(jwtService.getRefreshTtlSeconds()))
                .revoked(false)
                .build();

        // save refresh token to the db
        refreshTokenRepository.save(refreshTokenObject);

        // access token generate
        String accessToken = jwtService.generateToken(user);
        String refreshToken = jwtService.generateRefreshToken(user, refreshTokenObject.getJti());

        // use cookie service to attach the refresh token to a cookie in the response
        cookieService.attachRefreshTokenToCookie(response, refreshToken, (int) jwtService.getRefreshTtlSeconds());
        cookieService.addNoStoreHeaders(response);

        TokenResponse tokenResponse = TokenResponse.of(accessToken, refreshToken, jwtService.getAccessTtlSeconds(), modelMapper.map(user, UserDto.class));
        return ResponseEntity.ok(tokenResponse);
    }

    private Authentication authenticate(LoginRequest loginRequest) {
        try {
            return authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.email(), loginRequest.password())
            );
        } catch (AuthenticationException e) {
            throw new BadCredentialsException("Invalid Email or Password.");
        }
    }

    /* Access token and refresh token renew */
    @PostMapping("refresh-token")
    public ResponseEntity<TokenResponse> refreshToken(
            @RequestBody(required = false) RefreshTokenRequest body,
            HttpServletRequest request,
            HttpServletResponse response
    ) {
        String refreshToken = readRefreshTokenFromRequest(body, request).orElseThrow(() -> new BadCredentialsException("Invalid token."));

        if (!jwtService.isRefreshToken(refreshToken)) {
            throw new BadCredentialsException("Invalid refresh token type.");
        }
        String jti = jwtService.getJti(refreshToken);
        String userId = jwtService.getUserId(refreshToken);

        RefreshToken storedRefreshToken = refreshTokenRepository.findByJti(jti)
                .orElseThrow(() -> new BadCredentialsException("Invalid refresh token."));

        if (storedRefreshToken.isRevoked()) {
            throw new BadCredentialsException("Refresh token has been revoked.");
        }
        if (storedRefreshToken.getExpiresAt().isBefore(Instant.now())) {
            throw new BadCredentialsException("Refresh token has expired.");
        }
        if (!storedRefreshToken.getUser().getId().equals(userId)) {
            throw new BadCredentialsException("Refresh token does not belong to the expected user.");
        }

        // replace stored refresh token with a new one
        storedRefreshToken.setRevoked(true);
        String newJti = UUID.randomUUID().toString();
        storedRefreshToken.setReplacedByToken(newJti);
        refreshTokenRepository.save(storedRefreshToken);

        User storedRefreshTokenUser = storedRefreshToken.getUser();

        // generate new refresh token
        var newRefreshTokenObject = RefreshToken.builder()
                .jti(newJti)
                .user(storedRefreshTokenUser)
                .createdAt(Instant.now())
                .expiresAt(Instant.now().plusSeconds(jwtService.getRefreshTtlSeconds()))
                .revoked(false)
                .build();

        refreshTokenRepository.save(newRefreshTokenObject);
        String newAccessToken = jwtService.generateToken(storedRefreshTokenUser);
        String newRefreshToken = jwtService.generateRefreshToken(storedRefreshTokenUser, newRefreshTokenObject.getJti());

        cookieService.attachRefreshTokenToCookie(response, newRefreshToken, (int) jwtService.getRefreshTtlSeconds());
        cookieService.addNoStoreHeaders(response);
        return ResponseEntity
                .ok(TokenResponse.of(newAccessToken, newRefreshToken, jwtService.getAccessTtlSeconds(), modelMapper.map(storedRefreshTokenUser, UserDto.class)));

    }

    // logout endpoint to revoke the refresh token
    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletRequest request, HttpServletResponse response) {
        readRefreshTokenFromRequest(null, request).ifPresent(token -> {
            try {
                if (jwtService.isRefreshToken(token)) {
                    String jti = jwtService.getJti(token);
                    refreshTokenRepository.findByJti(jti).ifPresent(rt -> {
                        rt.setRevoked(true);
                        refreshTokenRepository.save(rt);
                    });
                }
            } catch (JwtException ignored) {
            }
        });

        // Use CookieUtil
        cookieService.clearRefreshTokenCookie(response);
        cookieService.addNoStoreHeaders(response);
        SecurityContextHolder.clearContext();
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    /* this method will read the refresh token from the request body or
     * from the cookie if it's not present in the body
     * */
    private Optional<String> readRefreshTokenFromRequest(RefreshTokenRequest body, HttpServletRequest request) {
        // 1. prefer reading refresh token from the cookie
        if (request.getCookies() != null) {
            Optional<String> refreshTokenFromCookie = Arrays
                    .stream(request.getCookies())
                    .filter(c -> cookieService.getRefreshTokenCookieName().equals(c.getName()))
                    .map(Cookie::getValue)
                    .filter(value -> !value.isBlank())
                    .findFirst();

            if (refreshTokenFromCookie.isPresent()) {
                return refreshTokenFromCookie;
            }
        }

        // 2. if not present in the cookie, read from the request body
        if (body != null && body.refreshToken() != null && !body.refreshToken().isBlank()) {
            return Optional.of(body.refreshToken());
        }

        // 3. custom header
        String customHeaderName = "X-Refresh-Token";
        String refreshTokenFromHeader = request.getHeader(customHeaderName);
        if (refreshTokenFromHeader != null && !refreshTokenFromHeader.isBlank()) {
            return Optional.of(refreshTokenFromHeader.trim());
        }

        // 4. Authorization header with Bearer scheme
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.regionMatches(true, 0, "Bearer ", 0, 7)) {
            String token = authHeader.substring(7).trim();
            if (!token.isEmpty()) {
                try {
                    if (jwtService.isRefreshToken(token)) {
                        return Optional.of(token);
                    }
                } catch (Exception ignored) {

                }
            }
        }
        return Optional.empty();
    }
}
