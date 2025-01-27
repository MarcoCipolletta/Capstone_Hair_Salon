package it.epicode.hair_salon.auth;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {
    @Autowired
    private AuthUserRepo authUserRepo;
    @Override
    public UserDetails loadUserByUsername(String identifier)  {
        AuthUser user = authUserRepo.findByUsernameOrEmail(identifier, identifier)
                .orElseThrow(()-> new UsernameNotFoundException("User not found"));


        return User.builder()
                .username(user.getUsername())
                .password(user.getPassword())
                .roles(String.valueOf(user.getRole()))
                .build();
    }
}
