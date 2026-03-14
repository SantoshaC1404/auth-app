package com.substring.auth_app_backend.services.impl;

import com.substring.auth_app_backend.entities.PasswordResetToken;
import com.substring.auth_app_backend.entities.User;
import com.substring.auth_app_backend.repositories.PasswordResetTokenRepository;
import com.substring.auth_app_backend.repositories.UserRepository;
import com.substring.auth_app_backend.services.PasswordResetService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class PasswordResetServiceImpl implements PasswordResetService {

    private final UserRepository userRepository;
    private final PasswordResetTokenRepository tokenRepository;
    private final JavaMailSender mailSender;

    @Value("${app.auth.frontend.login-url}")
    private String loginUrl;

    @Value("${spring.mail.username}")
    private String fromEmail;

    private static final long TOKEN_EXPIRY_MINUTES = 15;

    @Override
    @Transactional
    public void initiatePasswordReset(String email) {
        userRepository.findByEmail(email).ifPresent(user -> {
            tokenRepository.deleteAllByUserId(user.getId());

            String rawToken = UUID.randomUUID().toString();
            PasswordResetToken resetToken = PasswordResetToken.builder()
                    .token(rawToken)
                    .user(user)
                    .expiresAt(Instant.now().plusSeconds(TOKEN_EXPIRY_MINUTES * 60))
                    .used(false)
                    .build();

            tokenRepository.save(resetToken);
            sendForgotPasswordEmail(user);
        });
    }

    private void sendForgotPasswordEmail(User user) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(user.getEmail());
            message.setSubject("Forgot Your Password? – Auth App");
            message.setText(
                    "Hi " + user.getName() + ",\n\n" +
                            "We received a request to reset your password.\n\n" +
                            "To change your password:\n" +
                            "1. Log in to your account: " + loginUrl + "\n" +
                            "2. Click your profile icon (top right)\n" +
                            "3. Select 'Change Password'\n\n" +
                            "If you didn't request this, you can safely ignore this email.\n\n" +
                            "– The Auth App Team"
            );

            mailSender.send(message);
            log.info("Forgot password email sent to: {}", user.getEmail());
        } catch (Exception e) {
            log.error("Failed to send forgot password email to {}: {}", user.getEmail(), e.getMessage());
        }
    }
}