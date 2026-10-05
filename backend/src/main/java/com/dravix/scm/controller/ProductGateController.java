package com.dravix.scm.controller;

import com.dravix.scm.entity.Role;
import com.dravix.scm.entity.User;
import com.dravix.scm.entity.VerificationStatus;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/products")
public class ProductGateController {

    /**
     * Requirement: Gate-check demonstrating that unverified Farmers/FPO Members
     * are strictly forbidden from adding/storing products, returning HTTP 403.
     */
    @PostMapping("/gate-check")
    public ResponseEntity<?> checkProductAccess(@AuthenticationPrincipal User currentUser) {
        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "User not authenticated"));
        }

        Role role = currentUser.getRole();
        if (role == Role.FARMER || role == Role.FPO_MEMBER) {
            if (currentUser.getVerificationStatus() != VerificationStatus.VERIFIED) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of(
                        "status", "FORBIDDEN",
                        "verificationStatus", currentUser.getVerificationStatus(),
                        "message", "Verification Required: Your account is currently " +
                                currentUser.getVerificationStatus() + ". To add and store agricultural products, please submit the required verification documents and wait for admin approval."
                ));
            }
        }

        return ResponseEntity.ok(Map.of(
                "status", "ALLOWED",
                "message", "Access granted. Verified agricultural producer permitted to add and store products.",
                "verificationStatus", currentUser.getVerificationStatus()
        ));
    }
}
