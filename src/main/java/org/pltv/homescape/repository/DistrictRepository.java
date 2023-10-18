package org.pltv.homescape.repository;

import java.util.List;

import org.pltv.homescape.model.District;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DistrictRepository extends JpaRepository<District, Long> {
    public List<District> findByCityId(Long cityId);
}
