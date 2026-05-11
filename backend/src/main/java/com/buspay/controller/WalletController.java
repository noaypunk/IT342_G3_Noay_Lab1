package com.buspay.controller;

import com.buspay.model.User;
import com.buspay.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/wallet")
@CrossOrigin(origins = "http://localhost:5173")
public class WalletController {

    @Autowired
    private AuthService authService;

    @PostMapping("/deposit")
    public ResponseEntity<?> deposit(@RequestBody Map<String, Object> payload, Authentication authentication) {
        try {
            // Security: Get email from the auth token, not the request body
            String email = authentication.getName();
            Double amount = Double.parseDouble(payload.get("amount").toString());

            if (amount <= 0) {
                return ResponseEntity.badRequest().body(Map.of("error", "Amount must be greater than 0"));
            }

            boolean success = authService.updateBalance(email, amount);
            
            if (success) {
                User user = authService.getUserByEmail(email); 
                Map<String, Object> response = new HashMap<>();
                response.put("message", "Deposit Successful");
                response.put("newBalance", user.getBalance());
                response.put("rewardPoints", user.getRewardPoints());
                return ResponseEntity.ok(response);
            }
            
            return ResponseEntity.badRequest().body(Map.of("error", "User not found"));
            
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "Processing error: " + e.getMessage()));
        }
    }

    @PostMapping("/pay")
    public ResponseEntity<?> payFare(@RequestBody Map<String, Object> payload, Authentication authentication) {
        try {
            String email = authentication.getName();
            Double amount = Double.parseDouble(payload.get("amount").toString());

            if (amount <= 0) {
                return ResponseEntity.badRequest().body(Map.of("error", "Invalid payment amount"));
            }

            User user = authService.getUserByEmail(email);
            if (user.getBalance() < amount) {
                return ResponseEntity.badRequest().body(Map.of("error", "Insufficient balance"));
            }

            // Deduct balance (using negative amount)
            boolean success = authService.updateBalance(email, -amount);

            if (success) {
                // Optional: Increment reward points for taking a trip
                int currentPoints = user.getRewardPoints() != null ? user.getRewardPoints() : 0;
                user.setRewardPoints(currentPoints + 5); // Example: 5 points per ride
                // Save user points here if updateBalance doesn't handle points
                
                Map<String, Object> response = new HashMap<>();
                response.put("message", "Payment Successful");
                response.put("newBalance", user.getBalance());
                return ResponseEntity.ok(response);
            }

            return ResponseEntity.badRequest().body(Map.of("error", "Transaction Failed"));

        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "Payment error: " + e.getMessage()));
        }
    }
}