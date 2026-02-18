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
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.time.Instant;
import java.util.UUID;

@Component
@AllArgsConstructor
public class OAuth2SuccessHandler implements AuthenticationSuccessHandler {

    private final Logger logger = LoggerFactory.getLogger(this.getClass());
    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final CookieService cookieService;
    private final RefreshTokenRepository refreshTokenRepository;

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

                user = User.builder()
                        .email(email)
                        .name(name)
                        .image(picture)
                        .provider(Provider.GOOGLE)
                        .enabled(true)
                        .build();

                // Here you would typically check if the user exists in your database and create them if not
                userRepository.findByEmail(email).ifPresentOrElse(user1 -> {
                    logger.info("User already exists: {}", user1.getEmail());
                    logger.info(user1.toString());
                }, () -> {
                    userRepository.save(user);
                    logger.info("New user created: {}", user.getEmail());
                });
            }
            /*case "github" -> {
                String email = oAuth2User.getAttribute("email");
                String name = oAuth2User.getAttribute("name");
                logger.info("GitHub user email: {}, name: {}", email, name);
                // Here you would typically check if the user exists in your database and create them if not
            }*/
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

        response.getWriter().write("Login successful");

    }
}
