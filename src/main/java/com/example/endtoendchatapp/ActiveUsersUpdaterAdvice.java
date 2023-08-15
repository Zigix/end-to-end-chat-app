package com.example.endtoendchatapp;

import com.example.endtoendchatapp.model.ChatMessage;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.annotation.After;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.stereotype.Component;

@Aspect
@Component
@Slf4j
@AllArgsConstructor
public class ActiveUsersUpdaterAdvice {

    SimpMessageSendingOperations messageSendingOperations;
    ActiveUsers activeUsers;

    @Pointcut("execution(* com.example.endtoendchatapp.controller.ChatController.registerUserToChat(..))")
    private void onUserConnect() {}

    @Pointcut("execution(* com.example.endtoendchatapp.WebSocketEventListener.onDisconnectUserEventHandler(..))")
    private void onUserDisconnect() {}

    @After("onUserConnect() || onUserDisconnect()")
    private void updateActiveUsers() {
        log.info("Active aspect advice");
        ChatMessage chatMessage = new ChatMessage();
        chatMessage.setType(ChatMessage.MessageType.UPDATE);
        chatMessage.setActiveUsers(activeUsers.getActiveUsers().toArray(new String[0]));

        messageSendingOperations.convertAndSend("/topic/public", chatMessage);
    }
}
