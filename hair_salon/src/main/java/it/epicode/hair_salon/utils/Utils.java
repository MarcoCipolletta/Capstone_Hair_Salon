package it.epicode.hair_salon.utils;

import it.epicode.hair_salon.auth.dto.RegisterRequest;

public class Utils {

    public static String getAvatar(RegisterRequest u) {
        if (u.getCustomer() == null) return "https://ui-avatars.com/api/?name=A" ;
        return "https://ui-avatars.com/api/?name=" + u.getCustomer().getName() + "+" + u.getCustomer().getSurname();
    }
}
