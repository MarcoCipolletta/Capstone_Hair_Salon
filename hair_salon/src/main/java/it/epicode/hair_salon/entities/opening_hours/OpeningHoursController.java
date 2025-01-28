package it.epicode.hair_salon.entities.opening_hours;

import it.epicode.hair_salon.entities.opening_hours.dto.OpeningHoursDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.time.DayOfWeek;
import java.util.List;

@RestController
@RequestMapping("/opening-hours")
@RequiredArgsConstructor
public class OpeningHoursController {
    private final OpeningHoursSvc openingHoursSvc;

    @PostMapping
    public OpeningHours createOpeningHours(@RequestBody OpeningHoursDTO openingHoursDTO) {
        return openingHoursSvc.create(openingHoursDTO);
    }

    @GetMapping
    public List<OpeningHours> getOpeningHours() {return openingHoursSvc.findAll();}

    @GetMapping("/{day}")
    public OpeningHours getOpeningHoursByDay(@PathVariable DayOfWeek day) {
        return openingHoursSvc.findByDay(day);
    }

    @PutMapping
    public OpeningHours updateOpeningHours(@RequestBody OpeningHoursDTO openingHoursDTO) {
        return openingHoursSvc.update(openingHoursDTO);
    }
}
