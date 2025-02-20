package it.epicode.hair_salon.auth.jwt;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import it.epicode.hair_salon.auth.AuthUser;
import it.epicode.hair_salon.auth.AuthUserRepo;
import it.epicode.hair_salon.auth.Role;
import jakarta.annotation.PostConstruct;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.spec.SecretKeySpec;
import java.security.Key;
import java.util.Base64;
import java.util.Date;
import java.util.function.Function;

@Component
public class JwtTokenUtil {
    @Autowired
    private AuthUserRepo authUserRepo;

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration}")
    private long jwtExpirationInMs;

    private Key key;

    @PostConstruct
    public void init() {
        byte[] keyBytes = Base64.getDecoder().decode(secret);
       key = new SecretKeySpec(keyBytes, 0, keyBytes.length, "HmacSHA256");
    }



    private Claims getAllClaimsFromToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }


    public <T> T getClaimFromToken(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = getAllClaimsFromToken(token);
        return claimsResolver.apply(claims);
    }
    public String getUsernameFromToken(String token) {
        return getClaimFromToken(token, Claims::getSubject);
    }
    public Date getExpirationDateFromToken(String token) {
        return getClaimFromToken(token, Claims::getExpiration);
    }


    public Boolean isTokenExpired(String token) {
        final Date expiration = getExpirationDateFromToken(token);
        return expiration.before(new Date());
    }

    public String generateToken(UserDetails userDetails) {
        AuthUser authUser = authUserRepo.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new EntityNotFoundException("User not found"));


        return Jwts.builder()
                .setSubject(userDetails.getUsername())
                .claim("role", authUser.getRole()) // Aggiunge il ruolo come claim
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + jwtExpirationInMs))
                .signWith(key)
                .compact();
    }


    public String generateTokenResetPassword(AuthUser authUser) {
        return Jwts.builder()
                .setSubject(authUser.getUsername())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + 1000 *60*15))
                .signWith(key)
                .compact();
    }



    public Role getRoleFromToken(String token) {
        Claims claims = getAllClaimsFromToken(token);

        return Role.valueOf((String) claims.get("role"));
    }

    public Boolean validateToken(String token, UserDetails userDetails) {
        final String username = getUsernameFromToken(token);

        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }

    public Boolean isValidToken(String token) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }



}
