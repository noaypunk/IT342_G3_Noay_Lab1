package com.buspay.service;

import com.buspay.dto.LoginRequest;
import com.buspay.dto.RegisterRequest;
import com.buspay.model.User;
import com.buspay.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository, BCryptPasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public User register(RegisterRequest request) {
        // Check if email already exists to prevent DataIntegrityViolationException
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered: " + request.getEmail());
        }

        User user = new User();
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole("ROLE_USER");
        user.setBalance(0.0);
        user.setRewardPoints(0);

        return userRepository.save(user);
    }

    public User login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found: " + request.getEmail()));

        if (passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return user;
        }
        throw new RuntimeException("Invalid credentials");
    }

    @Transactional
    public boolean updateBalance(String email, Double amount) {
        return userRepository.findByEmail(email).map(user -> {
            // Use the null-safe getter we wrote in User.java
            double currentBalance = user.getBalance();
            user.setBalance(currentBalance + amount);
            
            // Logic: 1 point for every 100 deposited
            if (amount >= 100) {
                int pointsToAdd = (int) (amount / 100);
                int currentPoints = user.getRewardPoints(); // Uses our null-safe getter
                user.setRewardPoints(currentPoints + pointsToAdd);
            }
            
            userRepository.save(user);
            return true;
        }).orElse(false);
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found: " + email));
    }
}