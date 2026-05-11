package com.buspay.service;

import java.time.LocalDateTime;
import java.util.List; // Added missing import

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.buspay.model.DepositRequest;
import com.buspay.repository.DepositRepository;

@Service
public class DepositService {

    private final DepositRepository depositRepository;
    private final AuthService authService;

    public DepositService(DepositRepository depositRepository, AuthService authService) {
        this.depositRepository = depositRepository;
        this.authService = authService;
    }

    /**
     * FETCH ALL DEPOSITS
     * Required for the Admin Panel table.
     */
    public List<DepositRequest> getAllDeposits() {
        return depositRepository.findAll();
    }

    @Transactional
    public DepositRequest createDepositRequest(String email, Double amount, String refNum) {
        // SECURITY CHECK: Check if Reference Number already exists
        if (depositRepository.findByRefNumber(refNum).isPresent()) {
            throw new RuntimeException("This reference number has already been submitted.");
        }

        DepositRequest deposit = new DepositRequest();
        deposit.setEmail(email);
        deposit.setAmount(amount);
        deposit.setRefNumber(refNum);
        deposit.setStatus("PENDING");
        deposit.setTimestamp(LocalDateTime.now());
        
        return depositRepository.save(deposit);
    }

    @Transactional
    public void approveDeposit(Long depositId) {
        DepositRequest deposit = depositRepository.findById(depositId)
            .orElseThrow(() -> new RuntimeException("Deposit request not found with ID: " + depositId));

        if ("PENDING".equals(deposit.getStatus())) {
            // Update user balance in AuthService
            boolean success = authService.updateBalance(deposit.getEmail(), deposit.getAmount());
            
            if (success) {
                deposit.setStatus("APPROVED");
                depositRepository.save(deposit);
            } else {
                throw new RuntimeException("Failed to update user balance.");
            }
        } else {
            throw new RuntimeException("This deposit has already been processed (Status: " + deposit.getStatus() + ")");
        }
    }
}