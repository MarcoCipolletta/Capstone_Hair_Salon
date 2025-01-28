package it.epicode.hair_salon.entities.operator;

import it.epicode.hair_salon.entities.operator.dto.TestAvaiableOperator;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/operator")
@RequiredArgsConstructor
public class OperatorController {
    private final OperatorSvc operatorSvc;

    @PostMapping("/available-operator")
    public ResponseEntity<Operator> getAvailableOperator(@RequestBody TestAvaiableOperator testAvaiableOperator) {
        return new ResponseEntity<>(operatorSvc.findAvailableOperator(
                testAvaiableOperator.getDate(),
                testAvaiableOperator.getStartTime(),
                testAvaiableOperator.getEndTime()),
                HttpStatus.OK
        );
    }

}
