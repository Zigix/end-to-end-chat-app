package com.example.endtoendchatapp.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ChatMessage {

    private String sender;
    private String channel;
    private String content;
    private MessageType type;
    private String[] activeUsers;

    public enum MessageType {
        CHAT, JOIN, LEAVE, UPDATE
    }
}
