package it.epicode.hair_salon.entities.salon_service;

import it.epicode.hair_salon.entities.salon_service.dto.SalonServiceCreateRequest;
import it.epicode.hair_salon.entities.salon_service.dto.SalonServiceResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/salon-service")
@RequiredArgsConstructor
public class SalonServiceController {
    private final SalonServiceSvc salonServiceSvc;

    @GetMapping
    // ALL
    public List<SalonServiceResponse> getAll(){
        return salonServiceSvc.findAllResponse();
    }

    @GetMapping("/{id}")
    // Per ora ALL
    public SalonServiceResponse getById(@PathVariable UUID id){
        return salonServiceSvc.findByIdResponse(id);
    }

    @PostMapping
    // ADMIN
    public String create(@RequestBody SalonServiceCreateRequest salonServiceCreateRequest){
        return salonServiceSvc.create(salonServiceCreateRequest);
    }

    @PutMapping("/{id}")
    // ADMIN
    public SalonServiceResponse update(@PathVariable UUID id,@RequestBody SalonServiceResponse salonServiceResponse){
        if (!id.equals(salonServiceResponse.getId())) {
            throw new IllegalArgumentException("ID nell'URL e ID nel body non corrispondono.");
        }
        return salonServiceSvc.updateWithId(salonServiceResponse);
    }

    @DeleteMapping("/{id}")
    // ADMIN
    public String delete(@PathVariable UUID id){
        return salonServiceSvc.delete(id);
    }




}
