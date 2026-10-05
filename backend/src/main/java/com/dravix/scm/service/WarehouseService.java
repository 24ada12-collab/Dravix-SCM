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
