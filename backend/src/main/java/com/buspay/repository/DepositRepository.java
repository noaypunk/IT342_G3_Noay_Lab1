package com.buspay.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.buspay.model.DepositRequest;

@Repository
public interface DepositRepository extends JpaRepository<DepositRequest, Long> {
    // Find all deposits by a specific user to show their history
    List<DepositRequest> findByEmail(String email);

    // Used to check if a Reference Number has already been submitted
    Optional<DepositRequest> findByRefNumber(String refNumber);
}