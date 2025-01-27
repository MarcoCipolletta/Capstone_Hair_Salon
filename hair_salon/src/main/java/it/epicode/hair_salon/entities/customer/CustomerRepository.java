package it.epicode.hair_salon.entities.customer;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;
import java.util.UUID;


public interface CustomerRepository extends JpaRepository<Customer, UUID> {

    boolean existsByPhoneNumber(String phoneNumber);

    Optional<Customer> findByAuthUserUsername(String username);
    Optional<Customer> findByPhoneNumber(String phoneNumber);

}
