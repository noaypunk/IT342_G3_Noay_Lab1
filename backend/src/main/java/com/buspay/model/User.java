package com.buspay.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@NoArgsConstructor 
@AllArgsConstructor
@Builder  
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long userId;

    @Column(name = "first_name", nullable = false)
    private String firstName;

    @Column(name = "last_name", nullable = false)
    private String lastName;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password; 

    @Builder.Default
    @Column(name = "balance", nullable = false)
    private Double balance = 0.0; 

    @Builder.Default
    @Column(name = "reward_points", nullable = false)
    private Integer rewardPoints = 0;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Builder.Default
    private String role = "ROLE_USER";

    // --- MANUAL GETTERS & SETTERS (To bypass Lombok IDE errors) ---

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public Double getBalance() {
        return this.balance != null ? this.balance : 0.0;
    }

    public void setBalance(Double balance) {
        this.balance = (balance != null) ? balance : 0.0;
    }

    public Integer getRewardPoints() {
        return this.rewardPoints != null ? this.rewardPoints : 0;
    }

    public void setRewardPoints(Integer rewardPoints) {
        this.rewardPoints = (rewardPoints != null) ? rewardPoints : 0;
    }
}