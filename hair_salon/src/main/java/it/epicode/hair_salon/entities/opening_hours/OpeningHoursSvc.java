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


    // qui controllo se la richiesta sfora nel lunch break
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
