package it.epicode.hair_salon.utils.email;


import it.epicode.hair_salon.auth.AuthUser;
import it.epicode.hair_salon.utils.email.dto.ContactEmailRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;

@Component
public class EmailMapper {

    @Value("${server.address}")
    private String address;

    private final String website = "http://"+address+":4200";

    public EmailRequest fromAuthUserToEmailRequest(AuthUser user) {
        EmailRequest request = new EmailRequest();
        request.setTo(user.getEmail());
        request.setSubject("Parrucchieri Nicoletta & Sandro - Nuovo account creato ");
        request.setBody(fromAuthUserToEmailBody( user));
        return request;
    }


    // Carica template per registrazione avvenuta
    public String fromAuthUserToEmailBody( AuthUser user) {
        String template = loadTemplate("src/main/resources/templates/user.html");
        Map<String, String> values = new HashMap<>();
        values.put("username", user.getUsername());
        values.put("email", user.getEmail());
        values.put("website", website);
        return processTemplate(template, values);
    }

    //Carica template per form di contatto
    public String fromContactToEmailBody(ContactEmailRequest request) {
        String template = loadTemplate("src/main/resources/templates/contactEmail.html");
        Map<String ,String> values = new HashMap<>();
        values.put("website", website);
        values.put("name", request.getName());
        values.put("email", request.getEmail());
        values.put("message", request.getMessage());
        return processTemplate(template, values);
    }

    public EmailRequest fromContactToEmailRequest(ContactEmailRequest request) {
        EmailRequest emailRequest = new EmailRequest();
        emailRequest.setTo(request.getEmail());
        emailRequest.setSubject("Parrucchieri Nicoletta & Sandro - Messaggio ricevuto");
        emailRequest.setBody(fromContactToEmailBody(request));
        return emailRequest;
    }

    // Carica template Reset Password
    public String forResetPasswordRequestBody(String link){
        String template = loadTemplate("src/main/resources/templates/resetPassword.html");
        Map<String, String> values = new HashMap<>();
        values.put("link", link);
        values.put("website", website);
        return processTemplate(template, values);
    }

    // Invio email per reset password
    public EmailRequest fromResetPasswordBodyToEmailRequest(String link, AuthUser user) {
        EmailRequest request = new EmailRequest();
        request.setTo(user.getEmail());
        request.setSubject("Parrucchieri Nicoletta e Sandro - Reset password");
        request.setBody(forResetPasswordRequestBody(link));
        return request;
    }

    // Carica template Reset Password success
    public String forResetPasswordSuccess(){
        String template = loadTemplate("src/main/resources/templates/resetPasswordSuccess.html");
        Map<String, String> values = new HashMap<>();
        values.put("website", website);
        return processTemplate(template, values);
    }

    // Invia mail Reset Password success
    public EmailRequest fromResetPasswordSuccessBodyToEmailRequest(AuthUser user) {
        EmailRequest request = new EmailRequest();
        request.setTo(user.getEmail());
        request.setSubject("Parrucchieri Nicoletta e Sandro - Password aggiornata con successo");
        request.setBody(forResetPasswordSuccess());
        return request;
    }



    private String loadTemplate(String filePath)  {
        try {
            return new String(Files.readAllBytes(Paths.get(filePath)));
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    private String processTemplate(String template, Map<String, String> values) {
        for (Map.Entry<String, String> entry : values.entrySet()) {
            template = template.replace("{{" + entry.getKey() + "}}", entry.getValue());
        }
        return template;
    }
}
