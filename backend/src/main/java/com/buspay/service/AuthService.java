package com.buspay.service;

import com.buspay.model.User;
import com.buspay.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    public User registerUser(User user) {
        // space for logic of redandant email entries
        return userRepository.save(user);
    }

    public String login(String username, String rawPassword) {
    // Search by username instead of email
    Optional<User> userOpt = userRepository.findByUsername(username);
    
    // Using simple string comparison since we skipped encryption for now
    if (userOpt.isPresent()) {
        User user = userOpt.get();
        if (user.getPassword() != null && user.getPassword().equals(rawPassword)) {
            user.setLast_login(java.time.LocalDateTime.now());
            userRepository.save(user);
            return "Login Successful!";
        }
    }
    return "Invalid credentials!";
}
}