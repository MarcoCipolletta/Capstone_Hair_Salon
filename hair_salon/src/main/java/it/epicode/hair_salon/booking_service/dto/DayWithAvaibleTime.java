package it.epicode.hair_salon.booking_service.dto;

import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class DayWithAvaibleTime {
    private LocalDate date;
    private String dayName;
    private String dayNumber;
    private List<AvailableTime> avaiableTimes;
    private boolean isAvailable;
}
