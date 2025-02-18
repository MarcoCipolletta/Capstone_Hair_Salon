package it.epicode.hair_salon.utils.email;

import it.epicode.hair_salon.utils.email.dto.ContactEmailRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/email")
public class EmailController {
    @Autowired
    private EmailSvc emailSvc;

    @PostMapping
    public ResponseEntity<Map<String, String>> sendContactEmail(@RequestBody ContactEmailRequest request){
        String message = emailSvc.sendContactEmail(request);
        Map<String, String> response = new HashMap<>();
        response.put("message", message);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }
}
