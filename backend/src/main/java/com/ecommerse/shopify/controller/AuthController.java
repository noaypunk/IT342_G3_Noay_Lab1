package com.ecommerse.shopify.controller;

import com.ecommerse.shopify.model.User;
import com.ecommerse.shopify.service.AuthService;
import com.ecommerse.shopify.repository.UserRepository; 
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List; 
@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private UserRepository userRepository; 

    @PostMapping("/register")
    public User register(@RequestBody User user) {
        return authService.registerUser(user);
    }

    @PostMapping("/login")
    public String login(@RequestBody User user) {
        // This returns the string "Login Successful!" or "Invalid..." from your Service
        return authService.loginUser(user.getEmail(), user.getPassword_hash());
    }

    // New endpoint to help you check the users from React or Browser
    @GetMapping("/all")
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
}