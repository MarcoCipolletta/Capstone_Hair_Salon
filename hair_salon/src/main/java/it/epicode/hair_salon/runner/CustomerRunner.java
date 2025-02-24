package it.epicode.hair_salon.runner;


import com.github.javafaker.Faker;
import it.epicode.hair_salon.auth.AuthUserSvc;
import it.epicode.hair_salon.auth.dto.RegisterRequest;
import it.epicode.hair_salon.entities.customer.CustomerSvc;
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
@Order(10)
public class CustomerRunner implements ApplicationRunner {
    private final Faker faker = new Faker(Locale.ITALIAN);
    private final AuthUserSvc authUserSvc;
    private final CustomerSvc customerSvc;

    @Override
    public void run(ApplicationArguments args) throws Exception {

//        for (int i = 0; i < 20; i++) {
//            RegisterRequest basicData = new RegisterRequest();
//            basicData.setPassword("string");
//            CustomerCreateRequest customerCreateRequest = new CustomerCreateRequest();
//            customerCreateRequest.setName(faker.name().firstName());
//            customerCreateRequest.setSurname(faker.name().lastName());
//            basicData.setUsername(customerCreateRequest.getName() + "." + customerCreateRequest.getSurname() + i);
//            basicData.setEmail(customerCreateRequest.getName() + "." + customerCreateRequest.getSurname() + i + "@mail.com");
//            customerCreateRequest.setDateOfBirth(faker.date().birthday().toInstant().atZone(ZoneId.systemDefault()).toLocalDate());
//            customerCreateRequest.setPhoneNumber(faker.phoneNumber().cellPhone());
//            basicData.setCustomer(customerCreateRequest);
//            authUserSvc.registerUser(basicData);
//        }

        System.out.println("Customers created");


    }
}