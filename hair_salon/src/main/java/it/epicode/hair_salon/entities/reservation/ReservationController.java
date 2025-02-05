package it.epicode.hair_salon.entities.reservation;

import it.epicode.hair_salon.entities.reservation.dto.ReservationCreateRequest;
import it.epicode.hair_salon.entities.reservation.dto.ReservationResponse;
import it.epicode.hair_salon.entities.reservation.dto.ReservationResponseForCustomer;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.User;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/reservation")
@RequiredArgsConstructor
public class ReservationController {
    private final ReservationSvc reservationSvc;

    @PostMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Map<String, String>> createReservationByUser(@RequestBody ReservationCreateRequest reservationCreateRequest, @AuthenticationPrincipal User userDetails) {
        String message = reservationSvc.createReservationByUser(reservationCreateRequest, userDetails);
        Map<String, String> response = new HashMap<>();
        response.put("message", message);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ReservationResponse>> findAll() {
        return ResponseEntity.ok(reservationSvc.findAll());
    }

    @GetMapping("/byCustomer")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<List<ReservationResponseForCustomer>> findAllByLoggedCustomer(@AuthenticationPrincipal User userDetails) {
        return ResponseEntity.ok(reservationSvc.findAllByLoggedCustomer(userDetails));
    }

    @GetMapping("/confirmedAndPending")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ReservationResponse>> findConfirmedAndPending() {
        return ResponseEntity.ok(reservationSvc.findConfirmedAndPending());
    }

    @PatchMapping("/cancelReservation/{reservationId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ReservationResponseForCustomer> cancelReservation(@PathVariable String reservationId, @AuthenticationPrincipal User userDetails) {
        System.out.println(reservationId);
        System.out.println(userDetails);
        UUID id = UUID.fromString(reservationId);
        return ResponseEntity.ok(reservationSvc.cancelReservationByCustomer(id, userDetails));
    }
}
