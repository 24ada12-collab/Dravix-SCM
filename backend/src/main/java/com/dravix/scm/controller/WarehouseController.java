package com.dravix.scm.controller;

import com.dravix.scm.dto.WarehouseResponse;
import com.dravix.scm.service.WarehouseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/warehouses")
@RequiredArgsConstructor
public class WarehouseController {

    private final WarehouseService warehouseService;

    @GetMapping
    public ResponseEntity<?> getWarehouses(
            @org.springframework.web.bind.annotation.RequestParam(required = false) String district,
            @org.springframework.web.bind.annotation.RequestParam(required = false) String warehouseType,
            @org.springframework.web.bind.annotation.RequestParam(required = false) String ownershipType
    ) {
        com.dravix.scm.entity.WarehouseType parsedWarehouseType = null;
        if (warehouseType != null && !warehouseType.trim().isEmpty()) {
            try {
                parsedWarehouseType = com.dravix.scm.entity.WarehouseType.valueOf(warehouseType.trim());
            } catch (IllegalArgumentException e) {
                return ResponseEntity.badRequest().body(java.util.Map.of(
                        "status", 400,
                        "error", "Bad Request",
                        "message", "Invalid warehouseType: '" + warehouseType + "'. Allowed values: GENERAL, COLD_STORAGE, GODOWN"
                ));
            }
        }

        com.dravix.scm.entity.OwnershipType parsedOwnershipType = null;
        if (ownershipType != null && !ownershipType.trim().isEmpty()) {
            try {
                parsedOwnershipType = com.dravix.scm.entity.OwnershipType.valueOf(ownershipType.trim());
            } catch (IllegalArgumentException e) {
                return ResponseEntity.badRequest().body(java.util.Map.of(
                        "status", 400,
                        "error", "Bad Request",
                        "message", "Invalid ownershipType: '" + ownershipType + "'. Allowed values: GOVERNMENT, PRIVATE, COOPERATIVE"
                ));
            }
        }

        List<WarehouseResponse> warehouses = warehouseService.getWarehouses(district, parsedWarehouseType, parsedOwnershipType);
        return ResponseEntity.ok(warehouses);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getWarehouseById(@org.springframework.web.bind.annotation.PathVariable String id) {
        Long warehouseId;
        try {
            warehouseId = Long.parseLong(id.trim());
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().body(java.util.Map.of(
                    "status", 400,
                    "error", "Bad Request",
                    "message", "Invalid warehouse ID format: '" + id + "'. ID must be a numeric value."
            ));
        }

        return warehouseService.getWarehouseById(warehouseId)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(org.springframework.http.HttpStatus.NOT_FOUND).body(java.util.Map.of(
                        "status", 404,
                        "error", "Warehouse not found",
                        "message", "No active warehouse found with id: " + warehouseId
                )));
    }

    @org.springframework.web.bind.annotation.PostMapping("/recommendations")
    public ResponseEntity<?> getNearestRecommendations(
            @jakarta.validation.Valid @org.springframework.web.bind.annotation.RequestBody com.dravix.scm.dto.WarehouseRecommendationRequest request,
            org.springframework.validation.BindingResult bindingResult
    ) {
        if (bindingResult.hasErrors()) {
            String errorMessage = bindingResult.getFieldErrors().stream()
                    .map(org.springframework.validation.FieldError::getDefaultMessage)
                    .collect(java.util.stream.Collectors.joining("; "));
            return ResponseEntity.badRequest().body(java.util.Map.of(
                    "status", 400,
                    "error", "Bad Request",
                    "message", errorMessage
            ));
        }

        List<com.dravix.scm.dto.WarehouseRecommendationResponse> recommendations =
                warehouseService.getNearestRecommendations(request);
        return ResponseEntity.ok(recommendations);
    }
}
