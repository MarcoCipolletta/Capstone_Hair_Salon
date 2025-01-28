package it.epicode.hair_salon.entities.operator.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class TestAvaiableOperator {
    private LocalDate date;
    private Long startTime;
    private Long endTime;
}
