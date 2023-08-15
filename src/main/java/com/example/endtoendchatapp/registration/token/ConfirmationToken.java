package com.example.endtoendchatapp.registration.token;

import com.example.endtoendchatapp.entity.AppUser;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "confirmation_token")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ConfirmationToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String token;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "expires_at")
    private LocalDateTime expiresAt;

    @Column(name = "confirmed_at")
    private LocalDateTime confirmedAt;

    @ManyToOne
    @JoinColumn(name = "app_user_id")
    private AppUser owner;


    public ConfirmationToken(String token, LocalDateTime createdAt, LocalDateTime expiresAt, AppUser owner) {
        this.token = token;
        this.createdAt = createdAt;
        this.expiresAt = expiresAt;
        this.owner = owner;
    }

}
