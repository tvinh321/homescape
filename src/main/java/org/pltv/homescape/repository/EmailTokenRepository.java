package org.pltv.homescape.repository;

import org.pltv.homescape.model.EmailToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EmailTokenRepository extends JpaRepository<EmailToken, Long> {
    void deleteByToken(String email);

    boolean existsByToken(String token);

    EmailToken findByToken(String token);
}
