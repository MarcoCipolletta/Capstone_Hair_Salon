package it.epicode.hair_salon.entities.customer;

import it.epicode.hair_salon.auth.AuthUser;
import it.epicode.hair_salon.entities.customer.dto.CustomerCreateRequest;
import it.epicode.hair_salon.entities.customer.dto.CustomerMapper;
import it.epicode.hair_salon.entities.customer.dto.CustomerResponse;
import it.epicode.hair_salon.entities.customer.dto.CustomerResponseForAuthResponse;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Validated
public class CustomerSvc {
    private final CustomerRepository customerRepo;
    private final CustomerMapper mapper;

    public List<CustomerResponse> findAll() {
        List<Customer> customers = customerRepo.findAll();
        return customers.stream().map(mapper::toCustomerResponse).toList();
    }

    public Page<CustomerResponse> getAllPageable(Pageable pageable) {
        Page<Customer> customers = customerRepo.findAll(pageable);
        return customers.map(mapper::toCustomerResponse);
    }

    public Customer findByAuthUserUsername(String username) {
        return customerRepo.findByAuthUserUsername(username).orElseThrow(() -> new EntityNotFoundException("User non trovato"));
    }

    public CustomerResponse findByPhone(String phone) {
        Customer customer = customerRepo.findByPhoneNumber(phone).orElseThrow(() -> new EntityNotFoundException("User non trovato"));
        return mapper.toCustomerResponse(customer);
    }

    public CustomerResponse findById(UUID id) {
        Customer customer = customerRepo.findById(id).orElseThrow(() -> new EntityNotFoundException("User non trovato"));
        return mapper.toCustomerResponse(customer);
    }

    @Transactional
    public Customer create(@Valid CustomerCreateRequest customerCreateRequest, AuthUser authUser) {
        Customer customer = new Customer();
        BeanUtils.copyProperties(customerCreateRequest, customer);
        customer.setAuthUser(authUser);
        return customerRepo.save(customer);
    }

    @Transactional
    public Customer update(@Valid CustomerResponseForAuthResponse customerResponseForAuthResponse, AuthUser authUser) {
        Customer customer = findByAuthUserUsername(authUser.getUsername());
        BeanUtils.copyProperties(customerResponseForAuthResponse, customer);
        return customerRepo.save(customer);
    }


}
