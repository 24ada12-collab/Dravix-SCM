package com.dravix.scm.controller;

import com.dravix.scm.dto.*;
import com.dravix.scm.service.AuthService;
import com.dravix.scm.service.OtpService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final OtpService otpService;

    @PostMapping("/send-otp")
    public ResponseEntity<?> sendOtp(@RequestBody SendOtpRequest request) {
        try {
            if (request.getEmail() == null || request.getEmail().isBlank()) {
                return ResponseEntity.badRequest().body(Map.of("message", "Email is required"));
            }
            otpService.generateAndSendOtp(request.getEmail().trim());
            return ResponseEntity.ok(Map.of(
                    "message", "Verification code sent to your email.",
                    "status", "SENT",
                    "success", true
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestBody VerifyOtpRequest request) {
        try {
            boolean valid = otpService.verifyOtp(request.getEmail(), request.getOtp());
            if (valid) {
                return ResponseEntity.ok(Map.of(
                        "message", "Email verified successfully",
                        "status", "VERIFIED"
                ));
            } else {
                return ResponseEntity.badRequest().body(Map.of("message", "Invalid OTP entered"));
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/register/farmer")
    public ResponseEntity<?> registerFarmer(@RequestBody FarmerRegisterRequest request) {
        try {
            AuthResponse response = authService.registerFarmer(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/register/warehouse")
    public ResponseEntity<?> registerWarehouse(@RequestBody com.dravix.scm.dto.WarehouseRegisterRequest request) {
        try {
            AuthResponse response = authService.registerWarehouse(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            AuthResponse response = authService.login(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}
