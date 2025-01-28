package it.epicode.hair_salon.runner;


import it.epicode.hair_salon.entities.operator.OperatorSvc;
import it.epicode.hair_salon.entities.operator.dto.OperatorCreateRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Order(2)
public class OperatorRunner implements ApplicationRunner {
    private final OperatorSvc operatorSvc;


    @Override
    public void run(ApplicationArguments args) throws Exception {

        for (int i = 0; i < 2; i++) {
            OperatorCreateRequest op = new OperatorCreateRequest();
            op.setName("operator" + (i+1));
            operatorSvc.createOperator(op);
        }
    }
}