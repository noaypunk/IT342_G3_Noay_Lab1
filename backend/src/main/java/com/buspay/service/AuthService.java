package com.buspay.service;

import com.buspay.dto.LoginRequest;
import com.buspay.dto.RegisterRequest;
import com.buspay.model.User;
import com.buspay.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder; // Remove the = new ...

    // Inject both through the constructor
    public AuthService(UserRepository userRepository, BCryptPasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User register(RegisterRequest request) {
        User user = new User();
        String firstName = null;
        try {
            java.lang.reflect.Field f = request.getClass().getDeclaredField("firstName");
            f.setAccessible(true);
            firstName = (String) f.get(request);
        } catch (NoSuchFieldException e1) {
            try {
                java.lang.reflect.Field f2 = request.getClass().getDeclaredField("firstname");
                f2.setAccessible(true);
                firstName = (String) f2.get(request);
            } catch (Exception ignored) { }
        } catch (Exception ignored) { }
        // set firstName (use setter if present, otherwise set field via reflection)
        try {
            try {
                java.lang.reflect.Method m = user.getClass().getMethod("setFirstName", String.class);
                m.invoke(user, firstName);
            } catch (NoSuchMethodException e) {
                java.lang.reflect.Field uf = user.getClass().getDeclaredField("firstName");
                uf.setAccessible(true);
                uf.set(user, firstName);
            }
        } catch (Exception ignored) { }

        String lastName = null;
        try {
            java.lang.reflect.Field f = request.getClass().getDeclaredField("lastName");
            f.setAccessible(true);
            lastName = (String) f.get(request);
        } catch (NoSuchFieldException e1) {
            try {
                java.lang.reflect.Field f2 = request.getClass().getDeclaredField("lastname");
                f2.setAccessible(true);
                lastName = (String) f2.get(request);
            } catch (Exception ignored) {
                try {
                    java.lang.reflect.Method gm = request.getClass().getMethod("getLastName");
                    lastName = (String) gm.invoke(request);
                } catch (Exception ignored2) { }
            }
        } catch (Exception ignored) { }
        // set lastName (use setter if present, otherwise set field via reflection)
        try {
            try {
                java.lang.reflect.Method m2 = user.getClass().getMethod("setLastName", String.class);
                m2.invoke(user, lastName);
            } catch (NoSuchMethodException e) {
                java.lang.reflect.Field uf2 = user.getClass().getDeclaredField("lastName");
                uf2.setAccessible(true);
                uf2.set(user, lastName);
            }
        } catch (Exception ignored) { }

        String email = null;
        try {
            try {
                java.lang.reflect.Method gm = request.getClass().getMethod("getEmail");
                email = (String) gm.invoke(request);
            } catch (NoSuchMethodException e1) {
                try {
                    java.lang.reflect.Field f = request.getClass().getDeclaredField("email");
                    f.setAccessible(true);
                    email = (String) f.get(request);
                } catch (Exception ignored) {
                    try {
                        java.lang.reflect.Field f2 = request.getClass().getDeclaredField("eMail");
                        f2.setAccessible(true);
                        email = (String) f2.get(request);
                    } catch (Exception ignored2) { }
                }
            } catch (Exception ignored) { }

            try {
                java.lang.reflect.Method m3 = user.getClass().getMethod("setEmail", String.class);
                m3.invoke(user, email);
            } catch (NoSuchMethodException e) {
                java.lang.reflect.Field uf3 = user.getClass().getDeclaredField("email");
                uf3.setAccessible(true);
                uf3.set(user, email);
            }
        } catch (Exception ignored) { }

        String rawPassword = null;
        try {
            try {
                java.lang.reflect.Method gm = request.getClass().getMethod("getPassword");
                rawPassword = (String) gm.invoke(request);
            } catch (NoSuchMethodException e1) {
                try {
                    java.lang.reflect.Field f = request.getClass().getDeclaredField("password");
                    f.setAccessible(true);
                    rawPassword = (String) f.get(request);
                } catch (Exception ignored) {
                    try {
                        java.lang.reflect.Field f2 = request.getClass().getDeclaredField("pwd");
                        f2.setAccessible(true);
                        rawPassword = (String) f2.get(request);
                    } catch (Exception ignored2) { }
                }
            } catch (Exception ignored) { }
        } catch (Exception ignored) { }

        String encodedPassword = rawPassword == null ? null : passwordEncoder.encode(rawPassword);
        try {
            java.lang.reflect.Method m4 = user.getClass().getMethod("setPassword", String.class);
            m4.invoke(user, encodedPassword);
        } catch (NoSuchMethodException e) {
            try {
                java.lang.reflect.Field uf4 = user.getClass().getDeclaredField("password");
                uf4.setAccessible(true);
                uf4.set(user, encodedPassword);
            } catch (Exception ignored) { }
        } catch (Exception ignored) { }

        try {
            java.lang.reflect.Method m5 = user.getClass().getMethod("setRole", String.class);
            m5.invoke(user, "ROLE_USER");
        } catch (NoSuchMethodException e) {
            try {
                java.lang.reflect.Field uf5 = user.getClass().getDeclaredField("role");
                uf5.setAccessible(true);
                uf5.set(user, "ROLE_USER");
            } catch (Exception ignored) { }
        } catch (Exception ignored) { }

        return userRepository.save(user);
    }

   // Inside AuthService.java

public User login(LoginRequest request) {
    // extract email (try getter, then common field names)
    String email = null;
    try {
        try {
            java.lang.reflect.Method gm = request.getClass().getMethod("getEmail");
            email = (String) gm.invoke(request);
        } catch (NoSuchMethodException e1) {
            try {
                java.lang.reflect.Field f = request.getClass().getDeclaredField("email");
                f.setAccessible(true);
                email = (String) f.get(request);
            } catch (Exception ignored) {
                try {
                    java.lang.reflect.Field f2 = request.getClass().getDeclaredField("username");
                    f2.setAccessible(true);
                    email = (String) f2.get(request);
                } catch (Exception ignored2) { }
            }
        } catch (Exception ignored) { }
    } catch (Exception ignored) { }

    // extract raw password (try getter, then common field names)
    String rawPassword = null;
    try {
        try {
            java.lang.reflect.Method gm = request.getClass().getMethod("getPassword");
            rawPassword = (String) gm.invoke(request);
        } catch (NoSuchMethodException e1) {
            try {
                java.lang.reflect.Field f = request.getClass().getDeclaredField("password");
                f.setAccessible(true);
                rawPassword = (String) f.get(request);
            } catch (Exception ignored) {
                try {
                    java.lang.reflect.Field f2 = request.getClass().getDeclaredField("pwd");
                    f2.setAccessible(true);
                    rawPassword = (String) f2.get(request);
                } catch (Exception ignored2) { }
            }
        } catch (Exception ignored) { }
    } catch (Exception ignored) { }

    if (email == null) {
        throw new RuntimeException("Email not provided");
    }

    // 1. Find user by email
    final String emailToFind = email;
    User user = userRepository.findByEmail(emailToFind)
            .orElseThrow(() -> new RuntimeException("User not found with email: " + emailToFind));

    if (rawPassword == null) {
        throw new RuntimeException("Password not provided");
    }

    // 2. Check if the password matches the BCrypt hash in the database
    String storedPassword = null;
    try {
        try {
            java.lang.reflect.Method gm = user.getClass().getMethod("getPassword");
            storedPassword = (String) gm.invoke(user);
        } catch (NoSuchMethodException e1) {
            try {
                java.lang.reflect.Field f = user.getClass().getDeclaredField("password");
                f.setAccessible(true);
                storedPassword = (String) f.get(user);
            } catch (NoSuchFieldException e2) {
                try {
                    java.lang.reflect.Field f2 = user.getClass().getDeclaredField("pwd");
                    f2.setAccessible(true);
                    storedPassword = (String) f2.get(user);
                } catch (Exception ignored) { }
            }
        } catch (Exception ignored) { }
    } catch (Exception ignored) { }

    if (storedPassword == null) {
        throw new RuntimeException("Stored password not available for user");
    }

    if (passwordEncoder.matches(rawPassword, storedPassword)) {
        return user;
    } else {
        throw new RuntimeException("Invalid password");
    }
}
}