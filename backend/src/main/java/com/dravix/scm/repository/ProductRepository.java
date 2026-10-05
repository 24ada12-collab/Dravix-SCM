package com.dravix.scm.repository;

import com.dravix.scm.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByFarmerIdOrderByCreatedAtDesc(Long farmerId);
    List<Product> findByStatusOrderByCreatedAtDesc(String status);
    List<Product> findByCategoryIgnoreCase(String category);
    long countByFarmerId(Long farmerId);
}
