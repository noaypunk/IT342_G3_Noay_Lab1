package com.ecommerse.shopify.service;

import com.ecommerse.shopify.model.User;
import com.ecommerse.shopify.repository.UserRepository;
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

    public String loginUser(String email, String password) {
        Optional<User> user = userRepository.findByEmail(email);
        if (user.isPresent() && user.get().getPassword_hash().equals(password)) {
            return "Login Successful!";
        }
        return "Invalid email or password";
    }
}