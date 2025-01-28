package it.epicode.hair_salon.entities.reservation;

import it.epicode.hair_salon.entities.reservation.dto.ReservationCreateRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/reservation")
@RequiredArgsConstructor
public class ReservationController {
    private final ReservationSvc reservationSvc;

    @PostMapping
    public Reservation createReservation(@RequestBody ReservationCreateRequest reservationCreateRequest){
        return reservationSvc.createReservation(reservationCreateRequest);
    }
}
