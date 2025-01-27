package it.epicode.hair_salon.auth;



import it.epicode.hair_salon.auth.dto.RegisterRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Order(1)
public class AuthRunner implements ApplicationRunner {
    private final AuthUserSvc authUserSvc;



    @Override
    public void run(ApplicationArguments args) throws Exception {

        if(authUserSvc.existByUsername("admin") || authUserSvc.existByUsername("user")) return;

        RegisterRequest admin = new RegisterRequest();

        admin.setUsername("admin");
        admin.setEmail("admin@admin.com");
        admin.setPassword("adminpwd");

        authUserSvc.registerAdmin(admin);
        

    }
}