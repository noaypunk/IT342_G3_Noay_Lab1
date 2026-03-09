package com.buspay.dto;

import lombok.Data;

@Data
public class LoginRequest {
    private String email; // Changed from username to email
    private String password;
}