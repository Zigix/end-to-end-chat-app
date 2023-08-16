package com.example.endtoendchatapp.controller;

import com.example.endtoendchatapp.entity.AppUser;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HomeController {

    @GetMapping("/public-chat")
    public String showPublicChatPage(Model model, @AuthenticationPrincipal AppUser user) {
        model.addAttribute("username", user.getUsername());
        model.addAttribute("isEmailConfirmed", user.isEmailConfirmed());
        return "public-chat";

    }
}