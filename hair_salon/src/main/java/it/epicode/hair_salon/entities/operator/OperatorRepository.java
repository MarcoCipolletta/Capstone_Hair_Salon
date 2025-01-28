package it.epicode.hair_salon.entities.operator;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;


public interface OperatorRepository extends JpaRepository<Operator, UUID> {

}
