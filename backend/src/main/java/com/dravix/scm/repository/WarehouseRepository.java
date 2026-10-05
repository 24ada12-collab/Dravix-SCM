package com.dravix.scm.repository;

import com.dravix.scm.entity.OwnershipType;
import com.dravix.scm.entity.Warehouse;
import com.dravix.scm.entity.WarehouseType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WarehouseRepository extends JpaRepository<Warehouse, Long>, JpaSpecificationExecutor<Warehouse> {
    List<Warehouse> findByDistrictIgnoreCase(String district);
    List<Warehouse> findByWarehouseType(WarehouseType warehouseType);
    List<Warehouse> findByOwnershipType(OwnershipType ownershipType);
    boolean existsByNameAndDistrict(String name, String district);
}
