package it.epicode.hair_salon.entities.opening_hours;

import it.epicode.hair_salon.entities.opening_hours.dto.OpeningHoursDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.time.DayOfWeek;

@Component
@RequiredArgsConstructor
@Order(2)
public class OpeningHoursRunner implements ApplicationRunner {
    private final OpeningHoursSvc openingHoursSvc;

    @Override
    public void run(ApplicationArguments args) throws Exception {
        if (!openingHoursSvc.findAll().isEmpty()) return;
        OpeningHoursDTO monday = new OpeningHoursDTO();
        monday.setDay(DayOfWeek.MONDAY);
        monday.setOpeningTime(0);
        monday.setClosingTime(0);
        monday.setClosed(true);
        openingHoursSvc.create(monday);
        OpeningHoursDTO tuesday = new OpeningHoursDTO();
        tuesday.setDay(DayOfWeek.TUESDAY);
        tuesday.setOpeningTime((9*3600));
        tuesday.setLaunchBreakStartTime((13*3600));
        tuesday.setLaunchBreakEndTime((15*3600));
        tuesday.setClosingTime((19*3600)+ (30*60));
        tuesday.setClosed(false);
        openingHoursSvc.create(tuesday);
        OpeningHoursDTO wednesday = new OpeningHoursDTO();
        wednesday.setDay(DayOfWeek.WEDNESDAY);
        wednesday.setOpeningTime((9*3600));
        wednesday.setLaunchBreakStartTime((13*3600));
        wednesday.setLaunchBreakEndTime((15*3600));
        wednesday.setClosingTime((20*3600));
        wednesday.setClosed(false);
        openingHoursSvc.create(wednesday);
        OpeningHoursDTO thursday = new OpeningHoursDTO();
        thursday.setDay(DayOfWeek.THURSDAY);
        thursday.setOpeningTime((9*3600));
        thursday.setLaunchBreakStartTime((13*3600));
        thursday.setLaunchBreakEndTime((15*3600));
        thursday.setClosingTime((19*3600)+ (30*60));
        thursday.setClosed(false);
        openingHoursSvc.create(thursday);
        OpeningHoursDTO friday = new OpeningHoursDTO();
        friday.setDay(DayOfWeek.FRIDAY);
        friday.setOpeningTime((8*3600));
        friday.setLaunchBreakStartTime(0);
        friday.setLaunchBreakEndTime(0);
        friday.setClosingTime((20*3600)+ (30*60));
        friday.setClosed(false);
        openingHoursSvc.create(friday);
        OpeningHoursDTO saturday = new OpeningHoursDTO();
        saturday.setDay(DayOfWeek.SATURDAY);
        saturday.setOpeningTime((8*3600));
        saturday.setLaunchBreakStartTime(0);
        saturday.setLaunchBreakEndTime(0);
        saturday.setClosingTime((20*3600)+ (30*60));
        saturday.setClosed(false);
        openingHoursSvc.create(saturday);
        OpeningHoursDTO sunday = new OpeningHoursDTO();
        sunday.setDay(DayOfWeek.SUNDAY);
        sunday.setOpeningTime(0);
        sunday.setLaunchBreakStartTime(0);
        sunday.setLaunchBreakEndTime(0);
        sunday.setClosingTime(0);
        sunday.setClosed(true);
        openingHoursSvc.create(sunday);


    }
}
