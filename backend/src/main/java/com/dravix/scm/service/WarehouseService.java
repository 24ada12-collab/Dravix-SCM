package com.dravix.scm.service;

import com.dravix.scm.dto.WarehouseResponse;
import com.dravix.scm.entity.Warehouse;
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
        List<Warehouse> warehouses = warehouseRepository.findByActiveTrueOrderByDistrictAscNameAsc();
        return warehouses.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
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
