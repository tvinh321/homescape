package org.pltv.homescape.service;

import java.util.Collection;

import org.pltv.homescape.dto.CityDTO;
import org.pltv.homescape.dto.DistrictDTO;
import org.pltv.homescape.dto.WardDTO;
import org.pltv.homescape.model.City;
import org.pltv.homescape.model.District;
import org.pltv.homescape.model.Ward;
import org.pltv.homescape.repository.CityRepository;
import org.pltv.homescape.repository.DistrictRepository;
import org.pltv.homescape.repository.WardRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class LocationService {
    @Autowired
    private CityRepository cityRepository;
    @Autowired
    private DistrictRepository districtRepository;
    @Autowired
    private WardRepository wardRepository;

    public Collection<City> getCities() {
        return cityRepository.findAll();
    }

    public Collection<District> getDistricts(Long cityId) {
        return districtRepository.findByCityId(cityId);
    }

    public Collection<Ward> getWards(Long districtId) {
        return wardRepository.findByDistrictId(districtId);
    }
}
