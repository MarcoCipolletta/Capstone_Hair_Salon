package it.epicode.hair_salon.entities.operator.dto;

import it.epicode.hair_salon.entities.operator.Operator;
import lombok.Data;

@Data
public class AvailabilityResult {
    private Operator operator;
    private boolean crossesLunchBreak;
    private boolean exceedsClosingTime;

}
