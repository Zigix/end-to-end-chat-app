package com.example.endtoendchatapp.exception;

public class TokenExpiredException extends RuntimeException {

    private String token;

    public TokenExpiredException(String message, String token) {
        super(message);
        this.token = token;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }
}
