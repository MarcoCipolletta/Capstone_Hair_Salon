package it.epicode.hair_salon.entities.manager_schedule;

import it.epicode.hair_salon.entities.manager_schedule.dto.ManagerScheduleCreateRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/manager_schedule")
@RequiredArgsConstructor
//@PreAuthorize("hasRole('ADMIN')")
public class ManagerScheduleController {
    private final ManagerScheduleSvc managerScheduleSvc;

    @PostMapping
    public String insertSchedule(@RequestBody ManagerScheduleCreateRequest managerScheduleCreateRequest){

        return managerScheduleSvc.create(managerScheduleCreateRequest);

    }

    @GetMapping
    public List<ManagerSchedule> getAll(){
        return managerScheduleSvc.findAll();
    }
}
