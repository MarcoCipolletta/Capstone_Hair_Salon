package it.epicode.hair_salon.entities.customer;


import com.github.javafaker.Faker;
import it.epicode.hair_salon.auth.AuthUserSvc;
import it.epicode.hair_salon.auth.dto.RegisterRequest;
import it.epicode.hair_salon.entities.customer.dto.CustomerCreateRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.time.ZoneId;
import java.util.Locale;

@Component
@RequiredArgsConstructor
@Order(1)
public class CustomerRunner implements ApplicationRunner {
    private final Faker faker = new Faker(Locale.ITALIAN);
    private final AuthUserSvc authUserSvc;

    @Override
    public void run(ApplicationArguments args) throws Exception {

        for (int i = 0; i < 100; i++) {
            RegisterRequest basicData = new RegisterRequest();
            basicData.setUsername(faker.name().username());
            basicData.setEmail(faker.internet().emailAddress());
            basicData.setPassword("string");
            CustomerCreateRequest customerCreateRequest = new CustomerCreateRequest();
            customerCreateRequest.setName(faker.name().firstName());
            customerCreateRequest.setSurname(faker.name().lastName());
            customerCreateRequest.setDateOfBirth(faker.date().birthday().toInstant().atZone(ZoneId.systemDefault()).toLocalDate());
            customerCreateRequest.setPhoneNumber(faker.phoneNumber().cellPhone());
            basicData.setCustomer(customerCreateRequest);
            authUserSvc.registerUser(basicData);
        }

        System.out.println("Customers created");


    }
}