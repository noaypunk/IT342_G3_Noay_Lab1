package com.ecommerse.shopify.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import org.hibernate.annotations.CreationTimestamp;
import com.fasterxml.jackson.annotation.JsonProperty; 

@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long user_id;

    private String username;
    
    @Column(unique = true, nullable = false)
    private String email;

    // This annotation allows React to send "password" while Java stores it as "password_hash"
    @JsonProperty("password") 
    private String password_hash;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime created_at;

    private LocalDateTime last_login;

    private String status = "ACTIVE"; 

    // --- Getters and Setters ---
    public Long getUser_id() { return user_id; }
    public void setUser_id(Long user_id) { this.user_id = user_id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    // Use getPassword_hash for internal Java logic, but Jackson will use setPassword for JSON
    public String getPassword_hash() { return password_hash; }
    public void setPassword_hash(String password_hash) { this.password_hash = password_hash; }

    public LocalDateTime getCreated_at() { return created_at; }
    public LocalDateTime getLast_login() { return last_login; }
    public void setLast_login(LocalDateTime last_login) { this.last_login = last_login; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}