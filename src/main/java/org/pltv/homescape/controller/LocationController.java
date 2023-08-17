package org.pltv.homescape.controller;

import java.util.Collection;
import org.pltv.homescape.model.City;
import org.pltv.homescape.model.District;
import org.pltv.homescape.model.Ward;

import org.pltv.homescape.service.LocationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class LocationController {
    @Autowired
    private LocationService locationService;

    @GetMapping("/api/location/cities")
    public Collection<City> getCities() {
        return locationService.getCities();
    }

    @GetMapping("/api/location/districts")
    public Collection<District> getDistricts(Long cityId) {
        return locationService.getDistricts(cityId);
    }

    @GetMapping("/api/location/wards")
    public Collection<Ward> getWards(Long districtId) {
        return locationService.getWards(districtId);
    }
}
