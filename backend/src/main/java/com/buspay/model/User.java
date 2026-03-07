package com.buspay.model;

import java.time.LocalDateTime;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "users")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password; // This will store the BCrypt hash

    private String role = "ROLE_USER"; 

    public void setUsername(String username) {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    public void setPassword1(String encode) {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    public void setPassword(String encode) {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    public void setLast_login(LocalDateTime now) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'setLast_login'");
    }

    public Object getPassword1() {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    public Object getPassword() {
        throw new UnsupportedOperationException("Not supported yet.");
    }
}