package com.example.endtoendchatapp.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.*;

@Constraint(validatedBy = FieldMatchValidator.class)
@Target({ ElementType.TYPE, ElementType.ANNOTATION_TYPE })
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface FieldMatch {

    String first();

    String second();

    String message() default "Fields doesn't match";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};

}
