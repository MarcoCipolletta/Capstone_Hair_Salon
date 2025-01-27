package it.epicode.hair_salon.utils;

import it.epicode.hair_salon.auth.dto.RegisterRequest;

public class Utils {

    public static String getAvatar(RegisterRequest u) {
        if (u.getCustomer() == null) return "https://ui-avatars.com/api/?uppercase=true&background=88425a&color=f0efec&bold=true&font-size=0.6&size=120&name=A" ;
        return "https://ui-avatars.com/api/?uppercase=true&background=88425a&color=f0efec&bold=true&font-size=0.6&size=120&name=" + u.getCustomer().getName() + "+" + u.getCustomer().getSurname();
    }
}
