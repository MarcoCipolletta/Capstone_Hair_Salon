package it.epicode.hair_salon.auth.configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig {
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings( CorsRegistry registry) {
                registry.addMapping("/**")//Consente tutte le richieste su tutti gli endpoint
                        .allowedOrigins("*")//Inserire i domini da cui arriverrano le richieste
                        .allowedMethods("*")//Consente tutti i metodi (GET, POST, PUT, DELETE,OPTIONS)
                        .allowedHeaders("*")//Consente tutti i headers
                        .allowCredentials(false); // Consente l'invio di credenziali, mettere false se allowedOrigins è "*"
            }
        };
    }
}
