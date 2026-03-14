package com.substring.auth_app_backend.controllers;

import com.substring.auth_app_backend.dtos.ChangePasswordRequest;
import com.substring.auth_app_backend.dtos.UserDto;
import com.substring.auth_app_backend.entities.User;
import com.substring.auth_app_backend.repositories.UserRepository;
import com.substring.auth_app_backend.services.UserService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/users")
@AllArgsConstructor
public class UserController {

    private UserService userService;
    private UserRepository userRepository;
    private PasswordEncoder passwordEncoder;

    //  create user api
    @PostMapping
    public ResponseEntity<UserDto> createUser(@RequestBody UserDto userDto) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(userService.createUser(userDto));
    }

    //  get all users api
    @GetMapping
    public ResponseEntity<Iterable<UserDto>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    //  get user by email
    @GetMapping("/email/{email}")
    public ResponseEntity<UserDto> getUserByEmail(@PathVariable String email) {
        return ResponseEntity.ok(userService.getUserByEmail(email));
    }

    //  get user by id
    @GetMapping("/userId/{userId}")
    public ResponseEntity<UserDto> getUserById(@PathVariable String userId) {
        return ResponseEntity.ok(userService.getUserById(userId));
    }

    //  delete user by id
    @DeleteMapping("/{userId}")
    public void deleteUserById(@PathVariable String userId) {
        userService.deleteUser(userId);
    }

    //  update user
    @PutMapping("/{userId}")
    public ResponseEntity<UserDto> updateUser(@RequestBody UserDto userDto, @PathVariable String userId) {
        return ResponseEntity.ok(userService.updateUser(userDto, userId));
    }

    /**
     * POST /api/v1/users/change-password — requires Bearer token
     */
    @PostMapping("/change-password")
    public ResponseEntity<Map<String, String>> changePassword(
            @RequestBody ChangePasswordRequest request
    ) {
        // The JWT filter sets the email as the principal string
        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BadCredentialsException("User not found."));

        if (!passwordEncoder.matches(request.currentPassword(), user.getPassword())) {
            throw new BadCredentialsException("Current password does not match.");
        }

        user.setPassword(passwordEncoder.encode(request.newPassword()));
        userRepository.save(user);

        return ResponseEntity.ok(Map.of("message", "Password changed successfully."));
    }
}
