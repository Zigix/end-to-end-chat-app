package com.example.endtoendchatapp.registration.token;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
@AllArgsConstructor
public class ConfirmationTokenService {

    private final ConfirmationTokenRepository confirmationTokenRepository;


    public Optional<ConfirmationToken> findToken(String token) {
        return confirmationTokenRepository.findByToken(token);
    }

    public ConfirmationToken saveToken(ConfirmationToken confirmationToken) {
        return confirmationTokenRepository.save(confirmationToken);
    }

    @Transactional
    public int setConfirmationTime(String token) {
        return confirmationTokenRepository
                .setConfirmationTime(token, LocalDateTime.now());
    }
}
