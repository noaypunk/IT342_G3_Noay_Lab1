package com.buspay.controller;

import com.buspay.dto.RegisterRequest;
import com.buspay.model.User;
import com.buspay.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*") // Allows React/Android to connect
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            return ResponseEntity.badRequest().body("Error: Username is already taken!");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        
        // If RegisterRequest does not provide an email field, omit setting it here
        // or set a default/placeholder if required:
        // user.setEmail("no-reply@example.com");
        
        // ENCRYPTION: Hash the password before saving to Supabase
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        userRepository.save(user);
        return ResponseEntity.ok("User registered successfully!");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login() {
        // We will implement JWT here next
        return ResponseEntity.ok("Login logic triggered!");
    }
}