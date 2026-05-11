package com.buspay.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.buspay.model.DepositRequest;
import com.buspay.service.DepositService;

@RestController
@RequestMapping("/api/deposits")
@CrossOrigin(origins = "http://localhost:5173") 
public class DepositController {

    private final DepositService depositService;

    public DepositController(DepositService depositService) {
        this.depositService = depositService;
    }

    /**
     * GET ALL DEPOSITS (MISSING PIECE)
     * This is what your React AdminDashboard.jsx calls.
     */
    @GetMapping("/all")
    public ResponseEntity<List<DepositRequest>> getAllDeposits() {
        // This will fetch all records from the deposit_requests table
        return ResponseEntity.ok(depositService.getAllDeposits());
    }

    /**
     * Step 1: User submits their GCash Reference Number
     */
    @PostMapping("/request")
    public ResponseEntity<?> requestDeposit(@RequestBody Map<String, Object> payload) {
        try {
            String email = (String) payload.get("email");
            Double amount = Double.parseDouble(payload.get("amount").toString());
            String refNumber = (String) payload.get("refNumber");

            DepositRequest request = depositService.createDepositRequest(email, amount, refNumber);
            return ResponseEntity.ok(request);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", "Error submitting deposit: " + e.getMessage()));
        }
    }

    /**
     * Step 2: Admin approves the deposit
     */
    @PostMapping("/approve/{id}")
    public ResponseEntity<?> approveDeposit(@PathVariable Long id) {
        try {
            depositService.approveDeposit(id);
            return ResponseEntity.ok(Map.of("message", "Deposit approved and balance updated!"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}