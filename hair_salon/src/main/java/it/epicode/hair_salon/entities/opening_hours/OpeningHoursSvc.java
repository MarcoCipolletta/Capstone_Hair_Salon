package it.epicode.hair_salon.entities.opening_hours;

import it.epicode.hair_salon.entities.opening_hours.dto.OpeningHoursDTO;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
@Validated
public class OpeningHoursSvc {
    private final OpeningHoursRepository openingHoursRepo;

    public OpeningHours create(@Valid OpeningHoursDTO openingHoursDTO) {
        OpeningHours openingHours = new OpeningHours();
        BeanUtils.copyProperties(openingHoursDTO, openingHours);
        return openingHoursRepo.save(openingHours);

    }

    public List<OpeningHours> findAll() {
        return openingHoursRepo.findAll();
    }

    public OpeningHours findByDay(DayOfWeek day) {
        return openingHoursRepo.findByDay(day).orElseThrow(() -> new RuntimeException("Day not found"));
    }

    public OpeningHours update(@Valid OpeningHours o) {
        OpeningHours openingHours = findByDay(o.getDay());
        BeanUtils.copyProperties(o, openingHours);
        return openingHoursRepo.save(openingHours);
    }

//    public boolean isWithinOpeningHours(LocalDate date, long startTime, long endTime) {
//        DayOfWeek dayOfWeek = date.getDayOfWeek();
//        OpeningHours openingHours = findByDay(dayOfWeek);
//        Long openingTime = openingHours.getOpeningTime();
//        Long closingTime = openingHours.getClosingTime();
//        Long launchBreakStartTime = openingHours.getLaunchBreakStartTime();
//        Long launchBreakEndTime = openingHours.getLaunchBreakEndTime();
//
//        // Se non c'è pausa pranzo, controlla solo apertura e chiusura
//        if (launchBreakStartTime == 0 && launchBreakEndTime == 0) {
//            return startTime >= openingTime && endTime <= closingTime;
//        }
//
//        // Verifica che l'intervallo sia completamente nel turno del mattino o del pomeriggio
//        boolean isWithinMorning = startTime >= openingTime && endTime <= launchBreakStartTime;
//        boolean isWithinAfternoon = startTime >= launchBreakEndTime && endTime <= closingTime;
//
//        // L'intervallo è valido solo se è interamente in uno dei due turni
//        return isWithinMorning || isWithinAfternoon;
//    }

    public boolean crossesLunchBreak(LocalDate date, long startTime, long endTime) {
        DayOfWeek dayOfWeek = date.getDayOfWeek();
        OpeningHours openingHours = findByDay(dayOfWeek);
        Long launchBreakStartTime = openingHours.getLaunchBreakStartTime();
        Long launchBreakEndTime = openingHours.getLaunchBreakEndTime();

        if (launchBreakStartTime == 0 && launchBreakEndTime == 0) {
            return false;
        }

        return startTime < launchBreakEndTime && endTime > launchBreakStartTime;
    }





}
