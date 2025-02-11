package it.epicode.hair_salon.entities.customer;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;


public interface CustomerRepository extends JpaRepository<Customer, UUID> {

    boolean existsByPhoneNumber(String phoneNumber);

    Optional<Customer> findByAuthUserUsername(String username);
    Optional<Customer> findByPhoneNumber(String phoneNumber);

    List<Customer> findAllByOrderByNameAscSurnameAsc();

}
