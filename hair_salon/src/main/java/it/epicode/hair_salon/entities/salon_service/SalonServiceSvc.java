package it.epicode.hair_salon.entities.salon_service;

import it.epicode.hair_salon.entities.reservation.ReservationRepository;
import it.epicode.hair_salon.entities.salon_service.dto.SalonServiceCreateRequest;
import it.epicode.hair_salon.entities.salon_service.dto.SalonServiceResponse;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Validated
public class SalonServiceSvc {
    private final SalonServiceRepository salonServiceRepo;
    private final ReservationRepository reservationRepo;

    public String create(@Valid SalonServiceCreateRequest salonServiceCreateRequest) {
        SalonService salonService = new SalonService();
        BeanUtils.copyProperties(salonServiceCreateRequest, salonService);
        salonServiceRepo.save(salonService);
        return "Servizio creato con successo";
    }

    public SalonService findById(UUID id) {
        return salonServiceRepo.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Servizio non trovato"));
    }

    public SalonServiceResponse updateWithId(@Valid SalonServiceResponse salonServiceResponse) {
        SalonService salonService = findById(salonServiceResponse.getId());
        BeanUtils.copyProperties(salonServiceResponse, salonService);
        salonServiceRepo.save(salonService);
        return salonServiceResponse;
    }

    public String delete(UUID id) {
        if (reservationRepo.existsBySalonServicesId(id)) {
            throw new IllegalArgumentException("Impossibile cancellare il servizio, perchè è già stato prenotato");
        }
        SalonService salonService = findById(id);
        salonServiceRepo.delete(salonService);
        return "Servizio cancellato con successo";
    }

    public SalonServiceResponse findByIdResponse(UUID id) {
        SalonService salonService = findById(id);
        SalonServiceResponse salonServiceResponse = new SalonServiceResponse();
        BeanUtils.copyProperties(salonService, salonServiceResponse);
        return salonServiceResponse;
    }

    public List<SalonServiceResponse> findAllResponse() {
        List<SalonService> salonServices = salonServiceRepo.findAll(Sort.by(Sort.Order.by("name").ignoreCase()));
        return salonServices.stream().map(s -> {
            SalonServiceResponse salonServiceResponse = new SalonServiceResponse();
            BeanUtils.copyProperties(s, salonServiceResponse);
            return salonServiceResponse;
        }).toList();
    }

    public List<SalonServiceResponse> findNotHidden(){
        List<SalonService> salonServices = salonServiceRepo.findAllByHiddenIsFalse();
        return salonServices.stream().map(s -> {
            SalonServiceResponse salonServiceResponse = new SalonServiceResponse();
            BeanUtils.copyProperties(s, salonServiceResponse);
            return salonServiceResponse;
        }).toList();
    }

    public String updateHiddenValue(UUID id, boolean hidden) {
        SalonService salonService = findById(id);
        salonService.setHidden(hidden);
        salonServiceRepo.save(salonService);
        return "Servizio aggiornato con successo";
    }


}
