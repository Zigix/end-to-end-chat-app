package com.example.endtoendchatapp.registration.email;

public interface EmailSender {

    void sendEmail(String to, String htmlEmailTemplate);

}
