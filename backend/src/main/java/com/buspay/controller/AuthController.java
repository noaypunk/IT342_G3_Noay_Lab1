package com.buspay.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.buspay.config.JwtUtil;
import com.buspay.dto.LoginRequest;
import com.buspay.dto.RegisterRequest;
import com.buspay.model.User;
import com.buspay.service.AuthService;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173") 
public class AuthController {

    private final AuthService authService;
    private final JwtUtil jwtUtil;

    public AuthController(AuthService authService, JwtUtil jwtUtil) {
        this.authService = authService;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        try {
            return ResponseEntity.ok(authService.register(request));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/login")
        public ResponseEntity<?> login(@RequestBody LoginRequest request) {
            try {
                User user = authService.login(request);
                String token = jwtUtil.generateToken(user.getEmail());
                
                Map<String, Object> response = new HashMap<>();
                response.put("token", token);
                response.put("firstName", user.getFirstName());
                response.put("lastName", user.getLastName());
                response.put("email", user.getEmail());
                response.put("balance", user.getBalance());
                response.put("rewardPoints", user.getRewardPoints());
                // CRITICAL: Ensure this matches the string "ROLE_ADMIN" in your DB
                response.put("role", user.getRole()); 

                return ResponseEntity.ok(response);
            } catch (Exception e) {
                return ResponseEntity.status(401).body(Map.of("error", "Invalid email or password"));
            }
        }
}