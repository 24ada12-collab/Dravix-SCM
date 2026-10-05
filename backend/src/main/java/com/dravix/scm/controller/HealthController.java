package com.dravix.scm.controller;

import com.dravix.scm.dto.HealthResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;

@RestController
@RequestMapping("/api")
public class HealthController {

    @GetMapping("/health")
    public ResponseEntity<HealthResponse> getHealth() {
        HealthResponse response = HealthResponse.builder()
                .status("UP")
                .application("DRAVIX SCM")
                .timestamp(Instant.now().toString())
                .build();
        return ResponseEntity.ok(response);
    }
}
