package it.epicode.hair_salon.entities.manager_schedule;

import it.epicode.hair_salon.entities.manager_schedule.dto.ManagerScheduleCreateRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/manager-schedule")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class ManagerScheduleController {
    private final ManagerScheduleSvc managerScheduleSvc;

    @PostMapping
    public ResponseEntity<String> insertSchedule(@RequestBody ManagerScheduleCreateRequest managerScheduleCreateRequest){
        return new ResponseEntity<>( managerScheduleSvc.create(managerScheduleCreateRequest), HttpStatus.CREATED);
    }

    // Aggiungere eventuale modifica e cancellazione

    @GetMapping
    public List<ManagerSchedule> getAll(){
        return managerScheduleSvc.findAll();
    }
}
