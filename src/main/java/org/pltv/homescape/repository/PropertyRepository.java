package org.pltv.homescape.repository;

import java.util.List;
import java.util.UUID;

import org.pltv.homescape.model.Property;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PropertyRepository extends JpaRepository<Property, Long> {
    public List<Property> findByUserId(UUID userId);
}
