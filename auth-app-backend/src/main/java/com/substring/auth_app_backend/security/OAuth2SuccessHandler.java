package com.substring.auth_app_backend.security;

import com.substring.auth_app_backend.entities.RefreshToken;
import com.substring.auth_app_backend.entities.User;
import com.substring.auth_app_backend.enums.Provider;
import com.substring.auth_app_backend.repositories.RefreshTokenRepository;
import com.substring.auth_app_backend.repositories.UserRepository;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.time.Instant;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class OAuth2SuccessHandler implements AuthenticationSuccessHandler {

    private final Logger logger = LoggerFactory.getLogger(this.getClass());
    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final CookieService cookieService;
    private final RefreshTokenRepository refreshTokenRepository;

    @Value("${app.auth.frontend.success-redirect}")
    private String frontendSuccessUrl;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        logger.info("Successful authentication");
        logger.info(authentication.toString());

        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();

        // Identify the user
        String registrationId = "unknown";
        if (authentication instanceof OAuth2AuthenticationToken token) {
            registrationId = token.getAuthorizedClientRegistrationId();
        }

        logger.info("registrationId: {}", registrationId);
        logger.info("User attributes: {}", oAuth2User.getAttributes().toString());

        User user;
        switch (registrationId) {
            case "google" -> {
                String googleId = oAuth2User.getAttributes().getOrDefault("sub", "").toString();
                String name = oAuth2User.getAttributes().getOrDefault("name", "").toString();
                String email = oAuth2User.getAttributes().getOrDefault("email", "").toString();
                String picture = oAuth2User.getAttributes().getOrDefault("picture", "").toString();

                User newUser = User.builder()
                        .email(email)
                        .name(name)
                        .image(picture)
                        .provider(Provider.GOOGLE)
                        .providerId(googleId)
                        .enabled(true)
                        .build();

                // Here you would typically check if the user exists in your database and create them if not
                user = userRepository.findByEmail(email).orElseGet(() -> {
                    logger.info("Creating new user with email: {}", email);
                    return userRepository.save(newUser);
                });
            }
            case "github" -> {
                String githubId = oAuth2User.getAttributes().getOrDefault("id", "").toString();
                String name = oAuth2User.getAttributes().getOrDefault("login", "").toString();
                String email = oAuth2User.getAttributes().getOrDefault("email", "").toString();
                String picture = oAuth2User.getAttributes().getOrDefault("avatar_url", "").toString();

                if (email == null) {
                    email = name + "@github.com";
                }

                User newUser = User.builder()
                        .email(email)
                        .name(name)
                        .image(picture)
                        .provider(Provider.GITHUB)
                        .providerId(githubId)
                        .enabled(true)
                        .build();

                user = userRepository.findByEmail(email).orElseGet(() -> {
                    return userRepository.save(newUser);
                });
            }
            default -> {
                logger.warn("Unknown registrationId: {}", registrationId);
                throw new RuntimeException("Invalid registrationId: " + registrationId);
            }
        }
        
        String jti = UUID.randomUUID().toString();
        RefreshToken refreshTokenObj = RefreshToken.builder()
                .jti(jti)
                .user(user)
                .revoked(false)
                .createdAt(Instant.now())
                .expiresAt(Instant.now().plusSeconds(jwtService.getRefreshTtlSeconds()))
                .build();
        refreshTokenRepository.save(refreshTokenObj);
        String accessToken = jwtService.generateToken(user);
        String refreshToken = jwtService.generateRefreshToken(user, refreshTokenObj.getJti());
        cookieService.attachRefreshTokenToCookie(response, refreshToken, (int) jwtService.getRefreshTtlSeconds());

        // response.getWriter().write("Login successful");
        response.sendRedirect(frontendSuccessUrl);

    }
}
