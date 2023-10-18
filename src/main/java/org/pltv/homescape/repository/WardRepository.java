package org.pltv.homescape.repository;

import java.util.List;

import org.pltv.homescape.model.Ward;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WardRepository extends JpaRepository<Ward, Long> {
    public List<Ward> findByDistrictId(Long districtId);
}
