package it.epicode.hair_salon.entities.customer;

import it.epicode.hair_salon.entities.customer.dto.CustomerResponse;
import it.epicode.hair_salon.entities.customer.dto.CustomerResponseForAdmin;
import it.epicode.hair_salon.entities.reservation.Reservation;
import lombok.RequiredArgsConstructor;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/customer")
@RequiredArgsConstructor
public class CustomerController {
    private final CustomerSvc customerSvc;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<CustomerResponseForAdmin>> getCustomer() {
        return ResponseEntity.ok(customerSvc.findAll());
    }

    @GetMapping("/page")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<CustomerResponseForAdmin>> getCustomerPage(@ParameterObject Pageable pageable) {
        return ResponseEntity.ok(customerSvc.getAllPageable(pageable));
    }

    @GetMapping("/phone/{phone}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CustomerResponse> getCustomerByPhone(@PathVariable String phone) {
        return ResponseEntity.ok(customerSvc.findByPhone(phone));
    }

    @GetMapping("/id/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CustomerResponseForAdmin> getCustomerById(@PathVariable UUID id) {
        return ResponseEntity.ok(customerSvc.findByIdResponse(id));
    }



}
