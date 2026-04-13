package com.buspay.controller;

import com.buspay.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
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
    public ResponseEntity<?> deposit(@RequestBody Map<String, Object> payload) {
        try {
            String email = (String) payload.get("email");
            // Safer way to parse the double regardless of numeric type in JSON
            Double amount = Double.parseDouble(payload.get("amount").toString());

            if (amount <= 0) {
                return ResponseEntity.badRequest().body(Map.of("error", "Amount must be greater than 0"));
            }

            // The service should return the updated User object or a DTO containing new totals
            // For now, let's assume updateBalance handles the math
            boolean success = authService.updateBalance(email, amount);
            
            if (success) {
                // Fetch the updated user to get the real balance and points
                var user = authService.getUserByEmail(email); 
                
                Map<String, Object> response = new HashMap<>();
                response.put("message", "Deposit Successful");
                response.put("newBalance", user.getBalance());
                response.put("rewardPoints", user.getRewardPoints()); // Send points back to UI
                
                return ResponseEntity.ok(response);
            }
            
            return ResponseEntity.badRequest().body(Map.of("error", "Transaction Failed: User not found"));
            
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "Processing error: " + e.getMessage()));
        }
    }
}