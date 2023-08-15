package com.example.endtoendchatapp;

import lombok.Getter;
import lombok.Setter;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.Set;

@Component
@Getter
@Setter
public class ActiveUsers {

    private Set<String> activeUsers;

    public ActiveUsers() {
        activeUsers = new HashSet<>();
    }

    public void addUser(String username) {
        activeUsers.add(username);
    }

    public void removeUser(String username) {
        activeUsers.remove(username);
    }
}
