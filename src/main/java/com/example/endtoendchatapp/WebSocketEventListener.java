package com.example.endtoendchatapp;

import com.example.endtoendchatapp.model.ChatMessage;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Service;
import org.springframework.web.socket.messaging.SessionConnectedEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

@Service
@Slf4j
@AllArgsConstructor
public class WebSocketEventListener {

    private ActiveUsers activeUsers;
    private SimpMessageSendingOperations simpMessageSendingOperations;

    @EventListener(SessionConnectedEvent.class)
    public void onConnectedEventHandler(SessionConnectedEvent event) {
        StompHeaderAccessor headerAccessor =
                StompHeaderAccessor.wrap(event.getMessage());

        String username = headerAccessor.getUser().getName();
        log.info(username + " connected to chat");

        if(!activeUsers.getActiveUsers().contains(username)) {
            activeUsers.addUser(username);
            log.info("Active users: " + activeUsers.getActiveUsers().toString());
        }
    }

    @EventListener(SessionDisconnectEvent.class)
    public void onDisconnectUserEventHandler(SessionDisconnectEvent event) {
        StompHeaderAccessor headerAccessor =
                StompHeaderAccessor.wrap(event.getMessage());

        String username = headerAccessor.getUser().getName();
        log.info(username + " disconnected from chat");

        if(activeUsers.getActiveUsers().contains(username)) {
            activeUsers.removeUser(username);
            log.info("Active users: " + activeUsers.getActiveUsers().toString());

            ChatMessage chatMessage = new ChatMessage();
            chatMessage.setSender(username);
            chatMessage.setType(ChatMessage.MessageType.LEAVE);

            simpMessageSendingOperations.convertAndSend("/topic/public", chatMessage);
        }
    }

}
