package com.substring.auth_app_backend.services.impl;

import com.substring.auth_app_backend.dtos.UserDto;
import com.substring.auth_app_backend.services.AuthService;
import com.substring.auth_app_backend.services.UserService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class AuthServiceImpl implements AuthService {

    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    public AuthServiceImpl(UserService userService, PasswordEncoder passwordEncoder, JavaMailSender mailSender) {
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
        this.mailSender = mailSender;
    }

    @Override
    public UserDto registerUser(UserDto userDto) {
        userDto.setPassword(passwordEncoder.encode(userDto.getPassword()));
        UserDto savedUser = userService.createUser(userDto);
        sendWelcomeEmail(savedUser);
        return savedUser;
    }

    private void sendWelcomeEmail(UserDto user) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(user.getEmail());
            message.setSubject("Welcome to Auth App!");
            message.setText(
                    "Hi " + user.getName() + ",\n\n" +
                            "Your account has been created successfully.\n\n" +
                            "Here are your account details:\n" +
                            "  Name:  " + user.getName() + "\n" +
                            "  Email: " + user.getEmail() + "\n\n" +
                            "You can now log in and explore the platform.\n\n" +
                            "If you didn't create this account, please contact us immediately.\n\n" +
                            "– The Auth App Team"
            );
            mailSender.send(message);
            log.info("Welcome email sent to: {}", user.getEmail());
        } catch (Exception e) {
            log.error("Failed to send welcome email to {}: {}", user.getEmail(), e.getMessage());
        }
    }
}