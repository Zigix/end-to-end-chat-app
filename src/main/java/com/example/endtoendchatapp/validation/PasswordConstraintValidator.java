package com.example.endtoendchatapp.validation;

import jakarta.validation.ConstraintValidator;
import org.passay.*;

import jakarta.validation.ConstraintValidatorContext;

import java.util.ArrayList;
import java.util.List;

public class PasswordConstraintValidator implements ConstraintValidator<ValidPassword, String> {

    private SecurityType securityType;

    public void initialize(ValidPassword constraint) {
        this.securityType = constraint.security();
    }

    public boolean isValid(String password, ConstraintValidatorContext context) {
        List<Rule> passwordRules = new ArrayList<>();

        // at least 8 characters
        passwordRules.add(new LengthRule(8, 25));

        // no whitespaces
        passwordRules.add(new WhitespaceRule());

        if(securityType == SecurityType.MEDIUM || securityType == SecurityType.STRONG) {

            // at least one uppercase character
            passwordRules.add(new CharacterRule(EnglishCharacterData.UpperCase, 1));

            // at least one lowercase character
            passwordRules.add(new CharacterRule(EnglishCharacterData.LowerCase, 1));

            // at least one digit character
            passwordRules.add(new CharacterRule(EnglishCharacterData.Digit, 1));
        }

        if(securityType == SecurityType.STRONG) {

            // at least one special character
            passwordRules.add(new CharacterRule(EnglishCharacterData.Special, 1));
        }

        // create password validator based on rules
        PasswordValidator passwordValidator = new PasswordValidator(passwordRules);

        // check password rules against given password
        RuleResult result = passwordValidator.validate(new PasswordData(password));

        if(result.isValid()) {
            return true;
        }

        List<String> messages = passwordValidator.getMessages(result);
        String messageTemplate = String.join(",", messages);

        context.buildConstraintViolationWithTemplate(messageTemplate)
                .addConstraintViolation()
                .disableDefaultConstraintViolation();

        return false;
    }
}
