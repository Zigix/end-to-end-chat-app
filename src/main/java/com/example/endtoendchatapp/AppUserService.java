package com.example.endtoendchatapp;

import com.example.endtoendchatapp.entity.AppUser;
import lombok.AllArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@AllArgsConstructor
public class AppUserService implements UserDetailsService {

    private final AppUserRepository appUserRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return appUserRepository
                .findByUsername(username)
                .orElseThrow(() ->
                        new UsernameNotFoundException("User with username " + username + " not found"));
    }

    public Optional<AppUser> findByUsername(String username) {
        return appUserRepository.findByUsername(username);
    }

    public Optional<AppUser> findByEmail(String email) {
        return appUserRepository.findByEmail(email);
    }

    @Transactional
    public AppUser saveAppUser(AppUser appUser) {
        return appUserRepository.saveAndFlush(appUser);
    }

    @Transactional
    public int confirmUserEmail(String email) {
        return appUserRepository.confirmUserEmail(email);
    }
}
