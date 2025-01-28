package it.epicode.hair_salon.runner;


import com.github.javafaker.Faker;
import it.epicode.hair_salon.entities.salon_service.SalonServiceSvc;
import it.epicode.hair_salon.entities.salon_service.dto.SalonServiceCreateRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.util.Locale;

@Component
@RequiredArgsConstructor
@Order(4)
public class SalonServiceRunner implements ApplicationRunner {
    private final SalonServiceSvc salonServiceSvc;
private final Faker faker = new Faker(Locale.ITALIAN);


    @Override
    public void run(ApplicationArguments args) throws Exception {
        for (int i = 0; i< 15; i++){
            SalonServiceCreateRequest salonService = new SalonServiceCreateRequest();
            salonService.setName(faker.name().firstName() + i);
            salonService.setDescription(faker.lorem().characters(100));
            salonService.setDuration(faker.number().numberBetween(15*60,90*60));
            salonService.setPrice(faker.number().randomDouble(2,5,70));
            salonServiceSvc.create(salonService);
        }


    }
}