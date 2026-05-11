package com.buspay.model;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long userId;

    @Column(name = "first_name", nullable = false)
    @JsonProperty("firstName")
    private String firstName;

    @Column(name = "last_name", nullable = false)
    @JsonProperty("lastName")
    private String lastName;

    @Column(unique = true, nullable = false)
    private String email;

    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    @Column(nullable = false)
    private String password; 

    @Column(name = "balance", nullable = false)
    private Double balance = 0.0; 

    @Column(name = "reward_points", nullable = false)
    private Integer rewardPoints = 0;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    private String role = "ROLE_USER";

    public User() {}

    // --- ADD THESE MISSING METHODS ---

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    // --- EXISTING GETTERS & SETTERS ---

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public Double getBalance() {
        return (this.balance == null) ? 0.0 : this.balance;
    }

    public void setBalance(Double balance) {
        this.balance = (balance == null) ? 0.0 : balance;
    }

    public Integer getRewardPoints() {
        return (this.rewardPoints == null) ? 0 : this.rewardPoints;
    }

    public void setRewardPoints(Integer rewardPoints) {
        this.rewardPoints = (rewardPoints == null) ? 0 : rewardPoints;
    }

    public LocalDateTime getCreatedAt() { return createdAt; }
}