package com.buspay.dto;

import lombok.Data;

@Data
public class RegisterRequest {
    private String username;
    private String email;
    private String password;

    public String getUsername() {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    public CharSequence getPassword() {
        throw new UnsupportedOperationException("Not supported yet.");
    }
}