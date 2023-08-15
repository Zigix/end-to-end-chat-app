package com.example.endtoendchatapp.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.*;

@Constraint(validatedBy = UniqueUsernameValidator.class)
@Target({ ElementType.METHOD, ElementType.FIELD })
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface UniqueUsername {

    String message() default " this username already exists";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};

}
