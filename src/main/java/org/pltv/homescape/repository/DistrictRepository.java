package org.pltv.homescape.repository;

import java.util.List;
import org.pltv.homescape.model.District;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DistrictRepository extends JpaRepository<District, Long> {
    public List<District> findByCity(Long cityId);
}
