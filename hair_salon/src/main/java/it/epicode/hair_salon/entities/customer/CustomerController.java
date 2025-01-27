package it.epicode.hair_salon.entities.customer;

import it.epicode.hair_salon.entities.customer.dto.CustomerResponse;
import lombok.RequiredArgsConstructor;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.query.Param;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/customer")
@RequiredArgsConstructor
public class CustomerController {
    private final CustomerSvc customerSvc;

    @GetMapping
    public ResponseEntity<List<CustomerResponse>> getCustomer() {
        return ResponseEntity.ok(customerSvc.findAll());
    }

    @GetMapping("/page")
    public ResponseEntity<Page<CustomerResponse>> getCustomerPage(@ParameterObject Pageable pageable) {
        return ResponseEntity.ok(customerSvc.getAllPageable(pageable));
    }

    @GetMapping("/phone/{phone}")
    public ResponseEntity<CustomerResponse> getCustomerByPhone(@PathVariable String phone) {
        return ResponseEntity.ok(customerSvc.findByPhone(phone));
    }

    @GetMapping("/id/{id}")
    public ResponseEntity<CustomerResponse> getCustomerById(@PathVariable UUID id) {
        return ResponseEntity.ok(customerSvc.findById(id));
    }

}
