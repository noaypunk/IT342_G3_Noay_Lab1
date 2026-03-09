package com.buspay.controller;

import com.buspay.dto.LoginRequest; // You'll need to create this DTO
import com.buspay.dto.RegisterRequest;
import com.buspay.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
// 1. Add CrossOrigin to allow your React app (usually port 5173 or 3000) to talk to the backend
@CrossOrigin(origins = "http://localhost:5173") 
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        try {
            return ResponseEntity.ok(authService.register(request));
        } catch (Exception e) {
            // 2. Add basic error handling so the frontend knows why it failed
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // 3. Add the Login endpoint
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            return ResponseEntity.ok(authService.login(request));
        } catch (Exception e) {
            return ResponseEntity.status(401).body("Invalid email or password");
        }
    }
}