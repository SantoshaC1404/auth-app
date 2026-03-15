package com.substring.auth_app_backend.services.impl;

import com.substring.auth_app_backend.dtos.VerifyOtpResponse;
import com.substring.auth_app_backend.entities.PasswordResetToken;
import com.substring.auth_app_backend.entities.User;
import com.substring.auth_app_backend.repositories.PasswordResetTokenRepository;
import com.substring.auth_app_backend.exceptions.ResourceNotFoundException;
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

import java.security.SecureRandom;
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

    @Value("${spring.mail.username}")
    private String fromEmail;

    private static final long OTP_EXPIRY_MINUTES = 10;
    private static final long RESET_TOKEN_EXPIRY_MINUTES = 15;
    private static final int MAX_OTP_ATTEMPTS = 5;
    private static final SecureRandom RANDOM = new SecureRandom();

    // ─── Step 1: Send OTP ─────────────────────────────────────────────────────

    @Override
    @Transactional
    public void sendOtp(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("No account found with that email."));

        // Invalidate any existing tokens for this user
        tokenRepository.deleteAllByUserId(user.getId());

        // Generate 6-digit OTP
        String otp = String.format("%06d", RANDOM.nextInt(1_000_000));

        PasswordResetToken resetToken = PasswordResetToken.builder()
                .otp(otp)
                .resetToken(null)
                .user(user)
                .expiresAt(Instant.now().plusSeconds(OTP_EXPIRY_MINUTES * 60))
                .used(false)
                .build();

        tokenRepository.save(resetToken);
        sendOtpEmail(user, otp);
    }

    // ─── Step 2: Verify OTP ───────────────────────────────────────────────────

    @Override
    @Transactional
    public VerifyOtpResponse verifyOtp(String email, String otp) {
        PasswordResetToken record = tokenRepository
                .findTopByUserEmailOrderByIdDesc(email)
                .orElseThrow(() -> new BadCredentialsException("No OTP request found for this email."));

        if (record.isUsed()) {
            throw new BadCredentialsException("This OTP has already been used.");
        }

        if (record.isExpired()) {
            throw new BadCredentialsException("OTP has expired. Please request a new one.");
        }

        if (!record.getOtp().equals(otp)) {
            throw new BadCredentialsException("Invalid OTP. Please try again.");
        }

        // OTP verified — issue a short-lived reset token
        String resetToken = UUID.randomUUID().toString();
        record.setResetToken(resetToken);
        record.setExpiresAt(Instant.now().plusSeconds(RESET_TOKEN_EXPIRY_MINUTES * 60));
        tokenRepository.save(record);

        log.info("OTP verified for: {}", email);
        return new VerifyOtpResponse(resetToken, "OTP verified successfully.");
    }

    // ─── Step 3: Reset Password ───────────────────────────────────────────────

    @Override
    @Transactional
    public void resetPassword(String resetToken, String newPassword) {
        PasswordResetToken record = tokenRepository.findByResetToken(resetToken)
                .orElseThrow(() -> new BadCredentialsException("Invalid or expired session. Please start over."));

        if (record.isUsed()) {
            throw new BadCredentialsException("This reset session has already been used.");
        }

        if (record.isExpired()) {
            throw new BadCredentialsException("Reset session expired. Please request a new OTP.");
        }

        User user = record.getUser();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        record.setUsed(true);
        tokenRepository.save(record);

        log.info("Password reset successfully for: {}", user.getEmail());
    }

    // ─── Email ────────────────────────────────────────────────────────────────

    private void sendOtpEmail(User user, String otp) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(user.getEmail());
            message.setSubject("Your Password Reset OTP – Auth App");
            message.setText(
                    "Hi " + user.getName() + ",\n\n" +
                            "We received a request to reset your password.\n\n" +
                            "Your one-time password (OTP) is:\n\n" +
                            "    " + otp + "\n\n" +
                            "This OTP is valid for " + OTP_EXPIRY_MINUTES + " minutes.\n" +
                            "Do not share this code with anyone.\n\n" +
                            "If you didn't request this, you can safely ignore this email.\n\n" +
                            "– The Auth App Team"
            );

            mailSender.send(message);
            log.info("OTP email sent to: {}", user.getEmail());
        } catch (Exception e) {
            log.error("Failed to send OTP email to {}: {}", user.getEmail(), e.getMessage());
        }
    }
}