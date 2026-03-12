package com.substring.auth_app_backend.services.impl;

import com.substring.auth_app_backend.entities.PasswordResetToken;
import com.substring.auth_app_backend.entities.User;
import com.substring.auth_app_backend.exceptions.ResourceNotFoundException;
import com.substring.auth_app_backend.repositories.PasswordResetTokenRepository;
import com.substring.auth_app_backend.repositories.UserRepository;
import com.substring.auth_app_backend.services.PasswordResetService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
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
    private final PasswordEncoder passwordEncoder;

    @Value("${app.auth.frontend.reset-password-url}")
    private String resetPasswordUrl;

    @Value("${spring.mail.username}")
    private String fromEmail;

    private static final long TOKEN_EXPIRY_MINUTES = 15;

    @Override
    @Transactional
    public void initiatePasswordReset(String email) {
        // Always silently succeed — prevents user enumeration
        userRepository.findByEmail(email).ifPresent(user -> {
            // Delete any existing tokens for this user
            tokenRepository.deleteAllByUserId(user.getId());

            // Create new token
            String rawToken = UUID.randomUUID().toString();
            PasswordResetToken resetToken = PasswordResetToken.builder()
                    .token(rawToken)
                    .user(user)
                    .expiresAt(Instant.now().plusSeconds(TOKEN_EXPIRY_MINUTES * 60))
                    .used(false)
                    .build();

            tokenRepository.save(resetToken);

            // Send email
            sendResetEmail(user, rawToken);
        });
    }

    @Override
    @Transactional
    public void resetPassword(String token, String newPassword) {
        PasswordResetToken resetToken = tokenRepository.findByToken(token)
                .orElseThrow(() -> new BadCredentialsException("Invalid or expired reset link."));

        if (resetToken.isUsed()) {
            throw new BadCredentialsException("This reset link has already been used.");
        }

        if (resetToken.isExpired()) {
            throw new BadCredentialsException("This reset link has expired. Please request a new one.");
        }

        User user = resetToken.getUser();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        resetToken.setUsed(true);
        tokenRepository.save(resetToken);

        log.info("Password reset successfully for user: {}", user.getEmail());
    }

    private void sendResetEmail(User user, String token) {
        try {
            String resetLink = resetPasswordUrl + "?token=" + token;

            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(user.getEmail());
            message.setSubject("Reset Your Password – Auth App");
            message.setText(
                    "Hi " + user.getName() + ",\n\n" +
                            "We received a request to reset your password.\n\n" +
                            "Click the link below to reset it (valid for " + TOKEN_EXPIRY_MINUTES + " minutes):\n\n" +
                            resetLink + "\n\n" +
                            "If you didn't request this, you can safely ignore this email.\n\n" +
                            "– The Auth App Team"
            );

            mailSender.send(message);
            log.info("Password reset email sent to: {}", user.getEmail());
        } catch (Exception e) {
            log.error("Failed to send password reset email to {}: {}", user.getEmail(), e.getMessage());
        }
    }
}