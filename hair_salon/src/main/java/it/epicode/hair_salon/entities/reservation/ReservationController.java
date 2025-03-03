package it.epicode.hair_salon.entities.reservation;

import it.epicode.hair_salon.entities.reservation.dto.ReservationAndCustomerCreateByAdminRequest;
import it.epicode.hair_salon.entities.reservation.dto.ReservationCreateRequest;
import it.epicode.hair_salon.entities.reservation.dto.ReservationResponse;
import it.epicode.hair_salon.entities.reservation.dto.ReservationResponseForCustomer;
import lombok.RequiredArgsConstructor;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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

    @GetMapping("/page")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<ReservationResponse>> findAllPageable(@ParameterObject Pageable pageable) {
        return ResponseEntity.ok(reservationSvc.findAllPageable(pageable));
    }

    @GetMapping("/pageCustomer/{customerId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<ReservationResponse>> findByCustomerId(@ParameterObject Pageable pageable,@PathVariable UUID customerId) {
        return ResponseEntity.ok(reservationSvc.findByCustomerId(customerId,pageable));
    }

    @GetMapping("/pageStatus/{status}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<ReservationResponse>> findByStatus(@ParameterObject Pageable pageable,@PathVariable Status status ) {
        return ResponseEntity.ok(reservationSvc.findByStatus(status,pageable));
    }

    @GetMapping("/pageSalonService/{salonServiceId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<ReservationResponse>> findBySalonServicesId(@ParameterObject Pageable pageable,@PathVariable UUID salonServiceId ) {
        return ResponseEntity.ok(reservationSvc.findBySalonServicesId(salonServiceId,pageable));
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

    @PatchMapping("/updateStatus/{reservationId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ReservationResponse> updateStatus(@PathVariable UUID reservationId, @RequestBody String status) {
        Status statusEnum = Status.valueOf(status);
        return ResponseEntity.ok(reservationSvc.updateStatus(reservationId, statusEnum));
    }

    @PostMapping("/byAdminWithCustomer/{customerId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> createReservationByAdminWithCustomer(@RequestBody ReservationCreateRequest reservationCreateRequest, @PathVariable UUID customerId) {
        String message =reservationSvc.createReservationByAdminWithExistingCustomer(reservationCreateRequest, customerId);
        Map<String, String> response = new HashMap<>();
        response.put("message", message);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PostMapping("/byAdminWithNewCustomer")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> createReservationByAdminWithNewCustomer(@RequestBody ReservationAndCustomerCreateByAdminRequest reservationCreateRequest) {
        String message =reservationSvc.createCustomerForReservationByAdmin(reservationCreateRequest);
        Map<String, String> response = new HashMap<>();
        response.put("message", message);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }



    @PatchMapping("/cancelReservation/{reservationId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ReservationResponseForCustomer> cancelReservation(@PathVariable String reservationId, @AuthenticationPrincipal User userDetails) {
        UUID id = UUID.fromString(reservationId);
        return ResponseEntity.ok(reservationSvc.cancelReservationByCustomer(id, userDetails));
    }
}
