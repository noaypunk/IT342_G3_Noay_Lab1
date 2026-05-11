package com.buspay.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.buspay.dto.UserUpdateDTO;
import com.buspay.model.User;
import com.buspay.service.AuthService;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final AuthService authService;

    public UserController(AuthService authService) {
        this.authService = authService;
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(@AuthenticationPrincipal UserDetails userDetails) {
        // userDetails.getUsername() contains the email from the JWT
        return ResponseEntity.ok(authService.getUserByEmail(userDetails.getUsername()));
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(
            @AuthenticationPrincipal UserDetails userDetails, 
            @RequestBody UserUpdateDTO updateDTO) {
        
        User updatedUser = authService.updateProfile(userDetails.getUsername(), updateDTO);
        return ResponseEntity.ok(updatedUser);
    }
}