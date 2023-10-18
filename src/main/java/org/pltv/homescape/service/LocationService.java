package org.pltv.homescape.service;

import java.util.Collection;

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
    private CityRepository cityRepo;
    @Autowired
    private DistrictRepository districtRepo;
    @Autowired
    private WardRepository wardRepo;

    public Collection<City> getCities() {
        return cityRepo.findAll();
    }

    public Collection<District> getDistricts(Long cityId) {
        return districtRepo.findByCityId(cityId);
    }

    public Collection<Ward> getWards(Long districtId) {
        return wardRepo.findByDistrictId(districtId);
    }

    public Ward getWardFromId(Long id) {
        return wardRepo.findById(id).orElse(null);
    }

    public String getAddress(String street, Ward ward) {
        return street + ", " + ward.getName() + ", " + ward.getDistrict().getName() + ", "
                + ward.getDistrict().getCity().getName();
    }
}
