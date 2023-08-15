package com.example.endtoendchatapp.validation;

import com.example.endtoendchatapp.AppUserService;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import lombok.AllArgsConstructor;

@AllArgsConstructor
public class UniqueEmailValidator implements ConstraintValidator<UniqueEmail, String> {

    private final AppUserService appUserService;

    public void initialize(UniqueEmail constraint) {
    }

    public boolean isValid(String email, ConstraintValidatorContext context) {
        return appUserService.findByEmail(email).isEmpty();
    }
}