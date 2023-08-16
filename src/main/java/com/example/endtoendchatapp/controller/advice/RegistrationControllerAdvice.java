package com.example.endtoendchatapp.controller.advice;

import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.servlet.ModelAndView;

@ControllerAdvice
public class RegistrationControllerAdvice {

    @ExceptionHandler(Exception.class)
    public ModelAndView handleAllExceptions(Exception exception) {
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("error");
        modelAndView.addObject("message", exception.getMessage());
        return modelAndView;
    }
}
