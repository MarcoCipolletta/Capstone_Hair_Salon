package it.epicode.hair_salon.entities.opening_hours;

import it.epicode.hair_salon.entities.opening_hours.dto.OpeningHoursDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.DayOfWeek;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/opening-hours")
@RequiredArgsConstructor
public class OpeningHoursController {
    private final OpeningHoursSvc openingHoursSvc;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public OpeningHours createOpeningHours(@RequestBody OpeningHoursDTO openingHoursDTO) {
        return openingHoursSvc.create(openingHoursDTO);
    }

    @GetMapping
    // ALL
    public List<OpeningHours> getOpeningHours() {return openingHoursSvc.findAll();}

    @GetMapping("/{day}")
    // ALL
    public OpeningHours getOpeningHoursByDay(@PathVariable DayOfWeek day) {
        return openingHoursSvc.findByDay(day);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public OpeningHours updateOpeningHours(@PathVariable UUID id, @RequestBody OpeningHours openingHours) {
        if (!id.equals(openingHours.getId())) {
            throw new IllegalArgumentException("ID dell'URL e del body non corrispondono");
        }
        return openingHoursSvc.update(openingHours);
    }
}
