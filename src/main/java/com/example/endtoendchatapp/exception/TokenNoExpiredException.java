package com.example.endtoendchatapp.exception;

public class TokenNoExpiredException extends RuntimeException {

    public TokenNoExpiredException(String message) {
        super(message);
    }

}
