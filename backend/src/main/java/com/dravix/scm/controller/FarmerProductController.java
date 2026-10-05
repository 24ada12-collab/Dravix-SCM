package com.dravix.scm.controller;

import com.dravix.scm.dto.CreateClaimRequest;
import com.dravix.scm.dto.CreateProductRequest;
import com.dravix.scm.entity.InsuranceClaim;
import com.dravix.scm.entity.Product;
import com.dravix.scm.entity.User;
import com.dravix.scm.service.FarmerProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/farmer")
@RequiredArgsConstructor
public class FarmerProductController {

    private final FarmerProductService farmerProductService;

    @PostMapping("/products")
    public ResponseEntity<?> addProduct(
            @AuthenticationPrincipal User currentUser,
            @Valid @RequestBody CreateProductRequest request) {
        if (currentUser == null) {
            return ResponseEntity.status(401).body(Map.of("message", "User not authenticated"));
        }
        Product created = farmerProductService.createProduct(currentUser, request);
        return ResponseEntity.ok(created);
    }

    @GetMapping("/products")
    public ResponseEntity<?> getMyProducts(@AuthenticationPrincipal User currentUser) {
        if (currentUser == null) {
            return ResponseEntity.status(401).body(Map.of("message", "User not authenticated"));
        }
        List<Product> products = farmerProductService.getFarmerProducts(currentUser.getId());
        return ResponseEntity.ok(products);
    }

    @GetMapping("/stats")
    public ResponseEntity<?> getStats(@AuthenticationPrincipal User currentUser) {
        if (currentUser == null) {
            return ResponseEntity.status(401).body(Map.of("message", "User not authenticated"));
        }
        Map<String, Object> stats = farmerProductService.getFarmerOverviewStats(currentUser.getId());
        return ResponseEntity.ok(stats);
    }

    @PostMapping("/insurance-claims")
    public ResponseEntity<?> submitClaim(
            @AuthenticationPrincipal User currentUser,
            @Valid @RequestBody CreateClaimRequest request) {
        if (currentUser == null) {
            return ResponseEntity.status(401).body(Map.of("message", "User not authenticated"));
        }
        InsuranceClaim claim = farmerProductService.submitClaim(currentUser, request);
        return ResponseEntity.ok(claim);
    }

    @GetMapping("/insurance-claims")
    public ResponseEntity<?> getMyClaims(@AuthenticationPrincipal User currentUser) {
        if (currentUser == null) {
            return ResponseEntity.status(401).body(Map.of("message", "User not authenticated"));
        }
        List<InsuranceClaim> claims = farmerProductService.getFarmerClaims(currentUser.getId());
        return ResponseEntity.ok(claims);
    }
}
