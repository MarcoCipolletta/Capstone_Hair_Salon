package it.epicode.hair_salon.entities.salon_service;

import it.epicode.hair_salon.entities.salon_service.dto.SalonServiceCreateRequest;
import it.epicode.hair_salon.entities.salon_service.dto.SalonServiceResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/salon-service")
@RequiredArgsConstructor
public class SalonServiceController {
    private final SalonServiceSvc salonServiceSvc;

    @GetMapping
    // ALL
    @PreAuthorize("hasRole('ADMIN')")
    public List<SalonServiceResponse> getAll() {
        return salonServiceSvc.findAllResponse();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public SalonServiceResponse getById(@PathVariable UUID id) {
        return salonServiceSvc.findByIdResponse(id);
    }

    @PostMapping
    // ADMIN
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> create(@RequestBody SalonServiceCreateRequest salonServiceCreateRequest) {
        String message = salonServiceSvc.create(salonServiceCreateRequest);
        Map<String, String> response = new HashMap<>();
        response.put("message", message);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    // ADMIN
    @PreAuthorize("hasRole('ADMIN')")
    public SalonServiceResponse update(@PathVariable UUID id, @RequestBody SalonServiceResponse salonServiceResponse) {
        if (!id.equals(salonServiceResponse.getId())) {
            throw new IllegalArgumentException("ID nell'URL e ID nel body non corrispondono.");
        }
        return salonServiceSvc.updateWithId(salonServiceResponse);
    }

    @DeleteMapping("/{id}")
    // ADMIN
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> delete(@PathVariable UUID id) {
        String message = salonServiceSvc.delete(id);
        Map<String, String> response = new HashMap<>();
        response.put("message", message);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PatchMapping("/hide/{id}")
    // ADMIN
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> hide(@PathVariable UUID id, @RequestBody boolean hidden) {
        String message = salonServiceSvc.updateHiddenValue(id, hidden);
        Map<String, String> response = new HashMap<>();
        response.put("message", message);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }


    @GetMapping("/available")
    public List<SalonServiceResponse> getAvailable() {
        return salonServiceSvc.findNotHidden();
    }


}
