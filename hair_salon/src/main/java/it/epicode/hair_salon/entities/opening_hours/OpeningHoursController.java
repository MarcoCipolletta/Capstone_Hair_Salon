package it.epicode.hair_salon.entities.opening_hours;

import it.epicode.hair_salon.entities.opening_hours.dto.OpeningHoursDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
    public ResponseEntity<OpeningHours> createOpeningHours(@RequestBody OpeningHoursDTO openingHoursDTO) {
        return new ResponseEntity<>(openingHoursSvc.create(openingHoursDTO), HttpStatus.CREATED);
    }

    @GetMapping
    // ALL
    public ResponseEntity<List<OpeningHours>> getOpeningHours() {

        return new ResponseEntity<>(openingHoursSvc.findAll(),HttpStatus.OK);}


    @GetMapping("/{day}")
    // ALL
    public ResponseEntity<OpeningHours> getOpeningHoursByDay(@PathVariable DayOfWeek day) {
        return new ResponseEntity<>(openingHoursSvc.findByDay(day),HttpStatus.OK);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<OpeningHours> updateOpeningHours(@PathVariable UUID id, @RequestBody OpeningHours openingHours) {
        if (!id.equals(openingHours.getId())) {
            throw new IllegalArgumentException("ID dell'URL e del body non corrispondono");
        }
        return new ResponseEntity<>( openingHoursSvc.update(openingHours), HttpStatus.OK);
    }
}
