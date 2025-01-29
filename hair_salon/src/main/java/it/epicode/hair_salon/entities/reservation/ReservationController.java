package it.epicode.hair_salon.entities.reservation;

import it.epicode.hair_salon.entities.reservation.dto.ReservationCreateRequest;
import it.epicode.hair_salon.entities.reservation.dto.ReservationResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.User;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/reservation")
@RequiredArgsConstructor
public class ReservationController {
    private final ReservationSvc reservationSvc;

    @PostMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<String> createReservationByUser(@RequestBody ReservationCreateRequest reservationCreateRequest, @AuthenticationPrincipal User userDetails) {
        return new ResponseEntity<>(reservationSvc.createReservationByUser(reservationCreateRequest, userDetails), HttpStatus.CREATED);
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ReservationResponse>> findAll() {
        return ResponseEntity.ok(reservationSvc.findAll());
    }
}
