package it.epicode.hair_salon.booking_service.dto;

import it.epicode.hair_salon.entities.manager_schedule.ManagerSchedule;
import lombok.Data;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Data
public class DayWithAvaibleTime {
    private LocalDate date;
    private String dayName;
    private String dayNumber;
    private List<AvailableTime> availableTimes;
    private boolean isAvailable;
    private List<ManagerSchedule> managerSchedules = new ArrayList<>();
    //Private List<SalonService> salonServices;
}
