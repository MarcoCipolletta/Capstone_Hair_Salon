package it.epicode.hair_salon.utils.email;


import it.epicode.hair_salon.auth.AuthUser;
import org.springframework.stereotype.Component;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;

@Component
public class EmailMapper {

    private String website = "http://localhost:4200/";

    public EmailRequest fromAppUserToEmailRequest(String text, AuthUser user) {
        EmailRequest request = new EmailRequest();
        request.setTo(user.getEmail());
        request.setSubject("Energyservices - " + text);
        request.setBody(fromAppUserToEmailBody(text, user));
        return request;
    }


    public String fromAppUserToEmailBody(String text, AuthUser user) {
        String template = loadTemplate("src/main/resources/templates/user.html");
        Map<String, String> values = new HashMap<>();
        values.put("text", text);
        values.put("username", user.getUsername());
        values.put("email", user.getEmail());
        values.put("website", website);
        return processTemplate(template, values);
    }

    public String forResetPasswordRequestBody(String link){
        String template = loadTemplate("src/main/resources/templates/resetPassword.html");
        Map<String, String> values = new HashMap<>();
        values.put("link", link);
        values.put("website", website);
        return processTemplate(template, values);
    }

    public EmailRequest fromResetPasswordBodyToEmailRequest(String link, AuthUser user) {
        EmailRequest request = new EmailRequest();
        request.setTo(user.getEmail());
        request.setSubject("Energyservices - Reset password");
        request.setBody(forResetPasswordRequestBody(link));
        return request;
    }

    public String forResetPasswordSuccess(){
        String template = loadTemplate("src/main/resources/templates/resetPasswordSuccess.html");
        Map<String, String> values = new HashMap<>();

        return processTemplate(template, values);
    }

    public EmailRequest fromResetPasswordSuccessBodyToEmailRequest(AuthUser user) {
        EmailRequest request = new EmailRequest();
        request.setTo(user.getEmail());
        request.setSubject("Energyservices - Reset password");
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
