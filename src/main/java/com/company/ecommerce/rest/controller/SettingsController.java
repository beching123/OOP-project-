package com.company.ecommerce.rest.controller;

import com.company.ecommerce.persistence.SettingsRepo;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/settings")
public class SettingsController {

    private final SettingsRepo settingsRepo;

    public SettingsController(SettingsRepo settingsRepo) {
        this.settingsRepo = settingsRepo;
    }

    @GetMapping
    public ResponseEntity<Map<String, String>> getSettings() {
        return ResponseEntity.ok(settingsRepo.findAll());
    }

    @GetMapping("/{key}")
    public ResponseEntity<?> getSetting(@PathVariable String key) {
        var value = settingsRepo.findValueByKey(key);
        if (value.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of("error", "Setting not found"));
        }
        return ResponseEntity.ok(Map.of("key", key, "value", value.get()));
    }

    @PutMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> saveSettings(@RequestBody Map<String, String> settings) {
        for (Map.Entry<String, String> entry : settings.entrySet()) {
            settingsRepo.save(entry.getKey(), entry.getValue());
        }
        return ResponseEntity.ok(Map.of("message", "Settings saved"));
    }

    @PutMapping("/{key}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> saveSetting(@PathVariable String key, @RequestBody Map<String, String> body) {
        String value = body.get("value");
        if (value == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Value is required"));
        }
        settingsRepo.save(key, value);
        return ResponseEntity.ok(Map.of("key", key, "value", value));
    }
}
