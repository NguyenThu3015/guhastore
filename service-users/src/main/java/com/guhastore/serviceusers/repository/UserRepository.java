 package com.guhastore.serviceusers.repository;

import com.guhastore.serviceusers.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    @Query("SELECT COUNT(u) FROM User u WHERE u.registrationDate BETWEEN :startDate AND :endDate")
    Long countNewUsersBetween(Instant startDate, Instant endDate);
}