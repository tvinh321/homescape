package org.pltv.homescape.repository;

import java.util.List;

import org.pltv.homescape.model.Ward;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WardRepository extends JpaRepository<Ward, Long> {
    public List<Ward> findByDistrict(Long districtId);
}
