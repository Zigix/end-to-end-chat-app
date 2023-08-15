package com.example.endtoendchatapp.validation;

import com.example.endtoendchatapp.AppUserService;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import lombok.AllArgsConstructor;

@AllArgsConstructor
public class UniqueUsernameValidator implements ConstraintValidator<UniqueUsername, String> {

    private final AppUserService appUserService;

    @Override
    public void initialize(UniqueUsername constraint) {
    }

    @Override
    public boolean isValid(String username, ConstraintValidatorContext context) {
        return appUserService.findByUsername(username).isEmpty();
    }
}
