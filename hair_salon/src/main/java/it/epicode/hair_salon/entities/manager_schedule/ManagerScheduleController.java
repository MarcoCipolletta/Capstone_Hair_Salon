package it.epicode.hair_salon.entities.manager_schedule;

import it.epicode.hair_salon.entities.manager_schedule.dto.ManagerScheduleCreateRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/manager-schedule")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class ManagerScheduleController {
    private final ManagerScheduleSvc managerScheduleSvc;

    @PostMapping
    public ResponseEntity<Map<String, String>> insertSchedule(@RequestBody ManagerScheduleCreateRequest managerScheduleCreateRequest){
        String message = managerScheduleSvc.create(managerScheduleCreateRequest);
        Map<String, String> response = new HashMap<>();
        response.put("message", message);
        return new ResponseEntity<>( response, HttpStatus.CREATED);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteSchedule(@PathVariable UUID id){
        String message = managerScheduleSvc.delete(id);
          Map<String, String> response = new HashMap<>();
        response.put("message", message);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    // Aggiungere eventuale modifica e cancellazione

    @GetMapping
    public List<ManagerSchedule> getAll(){
        return managerScheduleSvc.findAll();
    }
}
