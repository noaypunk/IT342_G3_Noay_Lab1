package com.buspay.repository;

import com.buspay.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    // This is critical for fetching the logged-in user's data
    Optional<User> findByEmail(String email);
}