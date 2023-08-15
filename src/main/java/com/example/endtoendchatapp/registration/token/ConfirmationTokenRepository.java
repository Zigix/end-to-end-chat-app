package com.example.endtoendchatapp.registration.token;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface ConfirmationTokenRepository extends JpaRepository<ConfirmationToken, Long> {

    Optional<ConfirmationToken> findByToken(String token);

    void deleteAllByOwnerId(Long ownerId);

    @Modifying
    @Query("update ConfirmationToken ct set ct.confirmedAt=?2 where ct.token=?1")
    int setConfirmationTime(String token, LocalDateTime confirmationTime);

}
