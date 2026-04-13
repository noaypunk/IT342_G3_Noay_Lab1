package com.buspay.repository;

import com.buspay.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import org.springframework.stereotype.Repository;

@Repository // Optional, but good practice for clarity
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email); 
}