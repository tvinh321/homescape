package org.pltv.homescape.repository;

import org.pltv.homescape.model.City;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CityRepository extends JpaRepository<City, Long> {
}
