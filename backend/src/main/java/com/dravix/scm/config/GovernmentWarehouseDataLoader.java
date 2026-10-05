package com.dravix.scm.config;

import com.dravix.scm.entity.OwnershipType;
import com.dravix.scm.entity.SourceType;
import com.dravix.scm.entity.Warehouse;
import com.dravix.scm.entity.WarehouseType;
import com.dravix.scm.repository.WarehouseRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;

@Component
@RequiredArgsConstructor
@Slf4j
public class GovernmentWarehouseDataLoader implements CommandLineRunner {

    private final WarehouseRepository warehouseRepository;
    private final ResourceLoader resourceLoader;

    @Value("${dravix.seed.government-warehouses:true}")
    private boolean seedEnabled;

    @Override
    @Transactional
    public void run(String... args) {
        if (!seedEnabled) {
            log.info("[GovernmentWarehouseDataLoader] Government warehouse seeding disabled via configuration.");
            return;
        }

        try {
            Resource resource = resourceLoader.getResource("classpath:data/government-warehouses.csv");
            if (!resource.exists()) {
                log.warn("[GovernmentWarehouseDataLoader] Seed file 'data/government-warehouses.csv' not found.");
                return;
            }

            int loadedCount = 0;
            int skippedCount = 0;

            try (BufferedReader reader = new BufferedReader(new InputStreamReader(resource.getInputStream(), StandardCharsets.UTF_8))) {
                String header = reader.readLine(); // Skip header row
                String line;
                int rowNumber = 1;

                while ((line = reader.readLine()) != null) {
                    rowNumber++;
                    if (line.trim().isEmpty()) continue;

                    String[] cols = line.split(",", -1);
                    if (cols.length < 18) {
                        log.error("[GovernmentWarehouseDataLoader] Invalid column count at row {}: expected 18, found {}", rowNumber, cols.length);
                        throw new IllegalStateException("Malformed CSV row at line " + rowNumber);
                    }

                    // Extract columns
                    String name = cols[0].trim();
                    String district = cols[1].trim();
                    String location = cols[2].trim();
                    String warehouseTypeStr = cols[3].trim();
                    String ownershipTypeStr = cols[4].trim();
                    String sourceTypeStr = cols[5].trim();
                    String numberOfGodownsStr = cols[6].trim();
                    String capacityMtStr = cols[7].trim();
                    String latStr = cols[8].trim();
                    String lngStr = cols[9].trim();
                    String availCapStr = cols[10].trim();
                    String storageType = cols[11].trim();
                    String costStr = cols[12].trim();
                    String wdraStr = cols[13].trim();
                    String enwrStr = cols[14].trim();
                    String verifiedStr = cols[15].trim();
                    String activeStr = cols[16].trim();
                    String sourceReference = cols[17].trim();

                    // Validation rule checks
                    if (name.isEmpty() || district.isEmpty()) {
                        log.error("[GovernmentWarehouseDataLoader] Missing mandatory name or district at row {}", rowNumber);
                        throw new IllegalArgumentException("Mandatory name/district missing at row " + rowNumber);
                    }

                    WarehouseType warehouseType = WarehouseType.valueOf(warehouseTypeStr);
                    OwnershipType ownershipType = OwnershipType.valueOf(ownershipTypeStr);
                    SourceType sourceType = SourceType.valueOf(sourceTypeStr);

                    if (ownershipType != OwnershipType.GOVERNMENT || sourceType != SourceType.GOVERNMENT_OFFICIAL) {
                        log.error("[GovernmentWarehouseDataLoader] Invalid government ownership/source classification at row {}", rowNumber);
                        throw new IllegalArgumentException("Row " + rowNumber + " must be GOVERNMENT and GOVERNMENT_OFFICIAL");
                    }

                    double capacityMt = Double.parseDouble(capacityMtStr);
                    if (capacityMt < 0) {
                        throw new IllegalArgumentException("Capacity cannot be negative at row " + rowNumber);
                    }

                    // Unit Conversion: 1 MT = 1000 kg
                    double totalCapacityKg = capacityMt * 1000.0;

                    // Nullable available capacity (do not invent live availability)
                    Double availableCapacityKg = availCapStr.isEmpty() ? null : Double.parseDouble(availCapStr);

                    // Nullable geographic coordinates (do not invent fake coordinates)
                    Double latitude = latStr.isEmpty() ? null : Double.parseDouble(latStr);
                    Double longitude = lngStr.isEmpty() ? null : Double.parseDouble(lngStr);

                    Double storageCostPerKg = costStr.isEmpty() ? null : Double.parseDouble(costStr);
                    Boolean wdraRegistered = wdraStr.isEmpty() ? null : Boolean.parseBoolean(wdraStr);
                    Boolean eNwrEligible = enwrStr.isEmpty() ? null : Boolean.parseBoolean(enwrStr);
                    boolean verified = verifiedStr.isEmpty() ? true : Boolean.parseBoolean(verifiedStr);
                    boolean active = activeStr.isEmpty() ? true : Boolean.parseBoolean(activeStr);

                    // Uniqueness check for idempotency: sourceType + district + location + name
                    boolean exists = warehouseRepository.existsBySourceTypeAndDistrictAndLocationAndName(
                            sourceType, district, location, name);

                    if (exists) {
                        skippedCount++;
                        continue;
                    }

                    Warehouse warehouse = Warehouse.builder()
                            .name(name)
                            .district(district)
                            .location(location)
                            .warehouseType(warehouseType)
                            .ownershipType(ownershipType)
                            .sourceType(sourceType)
                            .totalCapacityKg(totalCapacityKg)
                            .availableCapacityKg(availableCapacityKg)
                            .latitude(latitude)
                            .longitude(longitude)
                            .storageType(storageType.isEmpty() ? null : storageType)
                            .storageCostPerKg(storageCostPerKg)
                            .wdraRegistered(wdraRegistered)
                            .eNwrEligible(eNwrEligible)
                            .verified(verified)
                            .active(active)
                            .sourceReference(sourceReference)
                            .build();

                    warehouseRepository.save(warehouse);
                    loadedCount++;
                }
            }

            log.info("[GovernmentWarehouseDataLoader] Completed seed loading: {} records inserted, {} existing skipped.", loadedCount, skippedCount);

        } catch (Exception e) {
            log.error("[GovernmentWarehouseDataLoader] Error while loading seed data: {}", e.getMessage(), e);
            throw new RuntimeException("Government warehouse seed loading failed: " + e.getMessage(), e);
        }
    }
}
