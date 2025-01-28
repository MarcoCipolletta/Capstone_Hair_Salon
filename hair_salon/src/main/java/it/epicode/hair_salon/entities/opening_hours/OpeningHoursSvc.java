package it.epicode.hair_salon.entities.opening_hours;

import it.epicode.hair_salon.entities.opening_hours.dto.OpeningHoursDTO;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;

import java.time.DayOfWeek;
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

    public List<OpeningHours> findAll() {return openingHoursRepo.findAll();}
    public OpeningHours findByDay(DayOfWeek day) {return openingHoursRepo.findByDay(day).orElseThrow(() -> new RuntimeException("Day not found"));}

    public OpeningHours update(@Valid OpeningHoursDTO openingHoursDTO) {
        OpeningHours openingHours = findByDay(openingHoursDTO.getDay());
        BeanUtils.copyProperties(openingHoursDTO, openingHours);
        return openingHoursRepo.save(openingHours);
    }
}
