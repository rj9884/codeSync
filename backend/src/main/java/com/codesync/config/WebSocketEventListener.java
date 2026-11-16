package com.codesync.config;

import com.codesync.model.RoomUser;
import com.codesync.service.RoomService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

@Component
@RequiredArgsConstructor
@Slf4j
public class WebSocketEventListener {

    private final RoomService roomService;
    private final SimpMessagingTemplate messagingTemplate;

    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        String sessionId = headerAccessor.getSessionId();
        if (headerAccessor.getSessionAttributes() == null) return;
        String roomId = (String) headerAccessor.getSessionAttributes().get("roomId");
        String userName = (String) headerAccessor.getSessionAttributes().get("userName");

        if (roomId != null && sessionId != null) {
            roomService.leaveRoom(roomId, sessionId);
            log.info("User {} (session {}) disconnected from room {}", userName, sessionId, roomId);
            RoomUser user = new RoomUser(sessionId, userName != null ? userName : "Unknown", 1);
            try {
                messagingTemplate.convertAndSend("/topic/room/" + roomId + "/user-left", user);
            } catch (Exception e) {
                log.warn("Failed to broadcast user-left on disconnect: {}", e.getMessage());
            }
        }
    }
}