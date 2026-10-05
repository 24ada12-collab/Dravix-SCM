package com.dravix.scm.controller;

import com.dravix.scm.entity.GovMarketObservation;
import com.dravix.scm.service.MarketForecastService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/forecast")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class MarketForecastController {

    private final MarketForecastService forecastService;

    @GetMapping("/filters")
    public ResponseEntity<Map<String, List<String>>> getFilters() {
        return ResponseEntity.ok(forecastService.getFilters());
    }

    @GetMapping("/filters/states")
    public ResponseEntity<Map<String, List<String>>> getStates(@RequestParam String commodity) {
        return ResponseEntity.ok(Map.of("states", forecastService.getStatesForCommodity(commodity)));
    }

    @GetMapping("/filters/districts")
    public ResponseEntity<Map<String, List<String>>> getDistricts(
            @RequestParam(required = false) String commodity,
            @RequestParam String state) {
        return ResponseEntity.ok(Map.of("districts", forecastService.getDistricts(commodity, state)));
    }

    @GetMapping("/filters/markets")
    public ResponseEntity<Map<String, List<String>>> getMarkets(
            @RequestParam(required = false) String commodity,
            @RequestParam String state,
            @RequestParam String district) {
        return ResponseEntity.ok(Map.of("markets", forecastService.getMarkets(commodity, state, district)));
    }

    @GetMapping("/filters/varieties")
    public ResponseEntity<Map<String, List<String>>> getVarieties(
            @RequestParam String commodity,
            @RequestParam String state,
            @RequestParam String district,
            @RequestParam String market) {
        return ResponseEntity.ok(Map.of("varieties", forecastService.getVarieties(commodity, state, district, market)));
    }

    @GetMapping("/market-prices")
    public ResponseEntity<?> getMarketPrice(
            @RequestParam String commodity,
            @RequestParam String state,
            @RequestParam String district,
            @RequestParam String market,
            @RequestParam(required = false) String variety) {
        GovMarketObservation obs = forecastService.getLatestMarketPrice(commodity, state, district, market, variety);
        if (obs == null) {
            return ResponseEntity.ok(Map.of("error", "GOVERNMENT_DATA_UNAVAILABLE"));
        }
        return ResponseEntity.ok(obs);
    }

    @GetMapping("/data-status")
    public ResponseEntity<Map<String, Object>> getDataStatus(
            @RequestParam(required = false) String commodity,
            @RequestParam(required = false) String state,
            @RequestParam(required = false) String district,
            @RequestParam(required = false) String market,
            @RequestParam(required = false) String variety) {
        return ResponseEntity.ok(forecastService.getDataStatus(commodity, state, district, market, variety));
    }

    @GetMapping("/history/{productName}")
    public ResponseEntity<List<Map<String, Object>>> getPriceHistory(@PathVariable String productName) {
        return ResponseEntity.ok(forecastService.getPriceHistory(productName));
    }

    @GetMapping("/parameters")
    public ResponseEntity<Map<String, Object>> getParameters(
            @RequestParam String productName,
            @RequestParam String region,
            @RequestParam String month) {
        return ResponseEntity.ok(forecastService.getForecastParameters(productName, region, month));
    }

    @PostMapping("/predict")
    public ResponseEntity<Map<String, Object>> predict(@RequestBody Map<String, Object> request) {
        return ResponseEntity.ok(forecastService.predict(request));
    }
}
