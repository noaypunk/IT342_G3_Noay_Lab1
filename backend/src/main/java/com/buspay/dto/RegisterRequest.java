package com.buspay.dto;

import lombok.Data;

@Data // This generates getters, setters, and toString automatically
public class RegisterRequest {
    private String firstName;
    private String lastName;
    private String email;
    private String password;
}