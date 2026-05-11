package com.buspay.service;

import java.util.Collections;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.buspay.dto.LoginRequest;
import com.buspay.dto.RegisterRequest;
import com.buspay.dto.UserUpdateDTO;
import com.buspay.model.User;
import com.buspay.repository.UserRepository;

@Service
public class AuthService implements UserDetailsService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository, BCryptPasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));

        return new org.springframework.security.core.userdetails.User(
            user.getEmail(),
            user.getPassword(),
            Collections.singletonList(new SimpleGrantedAuthority(user.getRole())) 
            // If user.getRole() returns "ADMIN", change this to:
            // Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + user.getRole()))
        );
    }

    @Transactional
    public User register(RegisterRequest request) {
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

    @Transactional
    public User updateProfile(String email, UserUpdateDTO updateDTO) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found: " + email));
        
        user.setFirstName(updateDTO.getFirstName());
        user.setLastName(updateDTO.getLastName());
        
        return userRepository.save(user);
    }

    public User login(LoginRequest request) {
        User user = getUserByEmail(request.getEmail());
        if (passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return user;
        }
        throw new RuntimeException("Invalid credentials");
    }

    @Transactional
    public boolean updateBalance(String email, Double amount) {
        return userRepository.findByEmail(email).map(user -> {
            double newBalance = user.getBalance() + (amount != null ? amount : 0.0);
            if (newBalance < 0) throw new RuntimeException("Insufficient funds");
            
            user.setBalance(newBalance);
            if (amount != null && amount >= 100) {
                user.setRewardPoints(user.getRewardPoints() + (int)(amount / 100));
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