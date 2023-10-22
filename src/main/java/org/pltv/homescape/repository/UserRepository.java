package org.pltv.homescape.repository;

import java.util.UUID;
import org.pltv.homescape.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {
    User findByEmail(String email);
}
