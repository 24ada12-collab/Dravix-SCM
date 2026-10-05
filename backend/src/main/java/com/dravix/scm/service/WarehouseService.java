package com.dravix.scm.service;

import com.dravix.scm.dto.WarehouseResponse;
import com.dravix.scm.entity.OwnershipType;
import com.dravix.scm.entity.Warehouse;
import com.dravix.scm.entity.WarehouseType;
import com.dravix.scm.repository.WarehouseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WarehouseService {

    private final WarehouseRepository warehouseRepository;

    @Transactional(readOnly = true)
    public List<WarehouseResponse> getAllWarehouses() {
        return getWarehouses(null, null, null);
    }

    @Transactional(readOnly = true)
    public List<WarehouseResponse> getWarehouses(String district, WarehouseType warehouseType, OwnershipType ownershipType) {
        org.springframework.data.jpa.domain.Specification<Warehouse> spec = (root, query, cb) -> {
            java.util.List<jakarta.persistence.criteria.Predicate> predicates = new java.util.ArrayList<>();

            // Rule 5: Active filter - always active = true
            predicates.add(cb.isTrue(root.get("active")));

            // Rule 2: District filter - case-insensitive, trimmed
            if (district != null && !district.trim().isEmpty()) {
                predicates.add(cb.equal(cb.lower(root.get("district")), district.trim().toLowerCase()));
            }

            // Rule 3: WarehouseType filter
            if (warehouseType != null) {
                predicates.add(cb.equal(root.get("warehouseType"), warehouseType));
            }

            // Rule 4: OwnershipType filter
            if (ownershipType != null) {
                predicates.add(cb.equal(root.get("ownershipType"), ownershipType));
            }

            return cb.and(predicates.toArray(new jakarta.persistence.criteria.Predicate[0]));
        };

        org.springframework.data.domain.Sort sort = org.springframework.data.domain.Sort.by(
                org.springframework.data.domain.Sort.Order.asc("district"),
                org.springframework.data.domain.Sort.Order.asc("name")
        );

        List<Warehouse> warehouses = warehouseRepository.findAll(spec, sort);
        return warehouses.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public java.util.Optional<WarehouseResponse> getWarehouseById(Long id) {
        return warehouseRepository.findByIdAndActiveTrue(id)
                .map(this::mapToResponse);
    }

    @Transactional(readOnly = true)
    public List<com.dravix.scm.dto.WarehouseRecommendationResponse> getNearestRecommendations(
            com.dravix.scm.dto.WarehouseRecommendationRequest request) {

        double farmerLat = request.getLatitude();
        double farmerLon = request.getLongitude();
        double requestedQty = request.getQuantityKg();
        String requestedCategory = request.getProductCategory() != null ? request.getProductCategory().trim() : "";

        // Query active warehouses
        List<Warehouse> activeWarehouses = warehouseRepository.findByActiveTrueOrderByDistrictAscNameAsc();

        List<com.dravix.scm.dto.WarehouseRecommendationResponse> eligibleWarehouses = new java.util.ArrayList<>();

        for (Warehouse wh : activeWarehouses) {
            // Rule A: Active warehouse
            if (wh.getActive() == null || !wh.getActive()) {
                continue;
            }

            // Rule B: Genuine coordinates must be present
            if (wh.getLatitude() == null || wh.getLongitude() == null) {
                continue;
            }

            // Rule C: Capacity check - null means not eligible for automatic matching
            if (wh.getAvailableCapacityKg() == null || wh.getAvailableCapacityKg() < requestedQty) {
                continue;
            }

            // Rule E: Ownership and verification checks
            if (wh.getOwnershipType() == OwnershipType.GOVERNMENT) {
                // Government: must have official source pedigree
                if (wh.getSourceType() != com.dravix.scm.entity.SourceType.GOVERNMENT_OFFICIAL) {
                    continue;
                }
            } else if (wh.getOwnershipType() == OwnershipType.PRIVATE) {
                // Private: must be admin verified and verified == true
                if (wh.getSourceType() != com.dravix.scm.entity.SourceType.PRIVATE_ADMIN_VERIFIED
                        || wh.getVerified() == null || !wh.getVerified()) {
                    continue;
                }
            } else if (wh.getOwnershipType() == OwnershipType.COOPERATIVE) {
                // Cooperative: must be cooperative verified and verified == true
                if (wh.getSourceType() != com.dravix.scm.entity.SourceType.COOPERATIVE_VERIFIED
                        || wh.getVerified() == null || !wh.getVerified()) {
                    continue;
                }
            } else {
                continue;
            }

            // Rule D: Category matching check
            if (!isCategorySupported(wh.getSupportedCategories(), requestedCategory)) {
                continue;
            }

            // Calculate Haversine distance
            double distanceKm = calculateHaversineDistance(farmerLat, farmerLon, wh.getLatitude(), wh.getLongitude());

            // Round to 2 decimal places
            double roundedDistanceKm = Math.round(distanceKm * 100.0) / 100.0;

            eligibleWarehouses.add(com.dravix.scm.dto.WarehouseRecommendationResponse.builder()
                    .warehouseId(wh.getId())
                    .warehouseName(wh.getName())
                    .district(wh.getDistrict())
                    .location(wh.getLocation())
                    .warehouseType(wh.getWarehouseType())
                    .ownershipType(wh.getOwnershipType())
                    .sourceType(wh.getSourceType())
                    .distanceKm(roundedDistanceKm)
                    .totalCapacityKg(wh.getTotalCapacityKg())
                    .availableCapacityKg(wh.getAvailableCapacityKg())
                    .storageType(wh.getStorageType())
                    .verified(wh.getVerified())
                    .wdraRegistered(wh.getWdraRegistered())
                    .eNwrEligible(wh.getENwrEligible())
                    .build());
        }

        // Rank by distance ascending, name ascending, id ascending (deterministic)
        eligibleWarehouses.sort((w1, w2) -> {
            int distComp = Double.compare(w1.getDistanceKm(), w2.getDistanceKm());
            if (distComp != 0) return distComp;
            int nameComp = w1.getWarehouseName().compareToIgnoreCase(w2.getWarehouseName());
            if (nameComp != 0) return nameComp;
            return Long.compare(w1.getWarehouseId(), w2.getWarehouseId());
        });

        // Return up to top 5 results
        return eligibleWarehouses.stream().limit(5).collect(Collectors.toList());
    }

    private boolean isCategorySupported(String supportedCategories, String requestedCategory) {
        if (requestedCategory.isEmpty()) return true;
        if (supportedCategories == null || supportedCategories.trim().isEmpty()) {
            // If the warehouse does not restrict categories, it is considered general/compatible
            return true;
        }
        String[] categories = supportedCategories.split(",");
        for (String cat : categories) {
            if (cat.trim().equalsIgnoreCase(requestedCategory)) {
                return true;
            }
        }
        return false;
    }

    private double calculateHaversineDistance(double lat1, double lon1, double lat2, double lon2) {
        final double R = 6371.0; // Earth radius in kilometers

        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);

        double a = Math.sin(dLat / 2.0) * Math.sin(dLat / 2.0)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(dLon / 2.0) * Math.sin(dLon / 2.0);

        double c = 2.0 * Math.atan2(Math.sqrt(a), Math.sqrt(1.0 - a));

        return R * c;
    }

    private WarehouseResponse mapToResponse(Warehouse warehouse) {
        return WarehouseResponse.builder()
                .id(warehouse.getId())
                .name(warehouse.getName())
                .warehouseType(warehouse.getWarehouseType())
                .ownershipType(warehouse.getOwnershipType())
                .sourceType(warehouse.getSourceType())
                .district(warehouse.getDistrict())
                .location(warehouse.getLocation())
                .address(warehouse.getAddress())
                .latitude(warehouse.getLatitude())
                .longitude(warehouse.getLongitude())
                .totalCapacityKg(warehouse.getTotalCapacityKg())
                .availableCapacityKg(warehouse.getAvailableCapacityKg())
                .storageType(warehouse.getStorageType())
                .supportedCategories(warehouse.getSupportedCategories())
                .storageCostPerKg(warehouse.getStorageCostPerKg())
                .wdraRegistered(warehouse.getWdraRegistered())
                .eNwrEligible(warehouse.getENwrEligible())
                .verified(warehouse.getVerified())
                .active(warehouse.getActive())
                .sourceReference(warehouse.getSourceReference())
                .build();
    }
}
