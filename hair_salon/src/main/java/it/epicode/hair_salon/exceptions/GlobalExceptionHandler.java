package it.epicode.hair_salon.exceptions;

import io.jsonwebtoken.MalformedJwtException;
import jakarta.persistence.EntityExistsException;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.HttpMediaTypeNotSupportedException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.multipart.MaxUploadSizeExceededException;

import java.security.InvalidParameterException;
import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(value = EntityNotFoundException.class)
    protected ResponseEntity<ErrorMessage> entityNotFound(EntityNotFoundException ex) {
        ErrorMessage e = new ErrorMessage(ex.getMessage(), HttpStatus.NOT_FOUND);
        return new ResponseEntity<>(e, HttpStatus.NOT_FOUND);
    }
    @ExceptionHandler(value = UsernameNotFoundException.class)
    protected ResponseEntity<ErrorMessage> usernameNotFound(UsernameNotFoundException ex) {
        ErrorMessage e = new ErrorMessage(ex.getMessage(), HttpStatus.NOT_FOUND);
        return new ResponseEntity<>(e, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(value = EntityExistsException.class)
    protected ResponseEntity<ErrorMessage> entityExists(EntityExistsException ex) {
        ErrorMessage e = new ErrorMessage(ex.getMessage(), HttpStatus.CONFLICT);
        return new ResponseEntity<>(e, HttpStatus.CONFLICT);
    }
    @ExceptionHandler(value = MalformedJwtException.class)
    protected ResponseEntity<ErrorMessage> alformedJwtException(MalformedJwtException ex) {
        ErrorMessage e = new ErrorMessage(ex.getMessage(), HttpStatus.BAD_REQUEST);
        return new ResponseEntity<>(e, HttpStatus.CONFLICT);
    }

    @ExceptionHandler(value = HttpMessageNotReadableException.class)
    protected ResponseEntity<ErrorMessage> httpMessageNotReadable(HttpMessageNotReadableException ex) {
        ErrorMessage e = new ErrorMessage(ex.getMessage(), HttpStatus.BAD_REQUEST);
        return new ResponseEntity<>(e, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(value = SecurityException.class)
    protected ResponseEntity<ErrorMessage> securityException(SecurityException ex) {
        ErrorMessage e = new ErrorMessage(ex.getMessage(), HttpStatus.BAD_REQUEST);
        return new ResponseEntity<>(e, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(value = AlreadyExistsException.class)
    protected ResponseEntity<ErrorMessage> alreadyExists(AlreadyExistsException ex) {
        ErrorMessage e = new ErrorMessage(ex.getMessage(), HttpStatus.CONFLICT);
        return new ResponseEntity<>(e, HttpStatus.CONFLICT);
    }

    @ExceptionHandler(value = EmailAlreadyUsedException.class)
    protected ResponseEntity<ErrorMessage> emailAlreadyExists(EmailAlreadyUsedException ex) {
        ErrorMessage e = new ErrorMessage(ex.getMessage(), HttpStatus.CONFLICT);
        return new ResponseEntity<>(e, HttpStatus.CONFLICT);
    }

    @ExceptionHandler(value = InvalidParameterException.class)
    protected ResponseEntity<ErrorMessage> handleInvalidParameterException(InvalidParameterException ex) {
        ErrorMessage e = new ErrorMessage(ex.getMessage(), HttpStatus.BAD_REQUEST);
        return new ResponseEntity<>(e, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(value = MaxUploadSizeExceededException.class)
    protected ResponseEntity<ErrorMessage> maxUploadSize(MaxUploadSizeExceededException ex) {
        ErrorMessage e = new ErrorMessage("Max upload size exceeded global", HttpStatus.BAD_REQUEST);

        return new ResponseEntity<>(e, HttpStatus.BAD_REQUEST);
    }
    @ExceptionHandler(value = HttpMediaTypeNotSupportedException.class)
    protected ResponseEntity<ErrorMessage> mediaNotSupported(HttpMediaTypeNotSupportedException ex) {
        ErrorMessage e = new ErrorMessage("Media type not supported", HttpStatus.BAD_REQUEST);

        return new ResponseEntity<>(e, HttpStatus.BAD_REQUEST);
    }
    @ExceptionHandler(value = MaxSizeException.class)
    protected ResponseEntity<ErrorMessage> maxSizeException(MaxSizeException ex) {
        ErrorMessage e = new ErrorMessage(ex.getMessage(), HttpStatus.BAD_REQUEST);

        return new ResponseEntity<>(e, HttpStatus.BAD_REQUEST);
    }
    @ExceptionHandler(value = IllegalArgumentException.class)
    protected ResponseEntity<ErrorMessage> illegalArgumentException(IllegalArgumentException ex) {
        ErrorMessage e = new ErrorMessage(ex.getMessage(), HttpStatus.BAD_REQUEST);

        return new ResponseEntity<>(e, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(value = ConstraintViolationException.class)
    public ResponseEntity<Map<String, String>> handleConstraintViolationException(ConstraintViolationException ex) {
        Map<String, String> errors = new HashMap<>();
        for (ConstraintViolation<?> violation : ex.getConstraintViolations()) {
            String fieldName = violation.getPropertyPath().toString();
            if (fieldName.contains(".")) {
                fieldName = fieldName.substring(fieldName.lastIndexOf('.') + 1);
            }
            errors.put(fieldName, violation.getMessage());

        }
        return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(value=ForbiddenException.class)
    protected ResponseEntity<ErrorMessage> handleForbiddenException(ForbiddenException ex) {
        ErrorMessage e = new ErrorMessage(ex.getMessage(), HttpStatus.FORBIDDEN);
        return new ResponseEntity<>(e, HttpStatus.FORBIDDEN);
    }
}
