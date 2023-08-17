package org.pltv.homescape.controller;

import java.util.Collection;

import org.pltv.homescape.dto.CityDTO;
import org.pltv.homescape.dto.DistrictDTO;
import org.pltv.homescape.dto.WardDTO;
import java.util.stream.Collectors;

import org.pltv.homescape.service.LocationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class LocationController {
    @Autowired
    private LocationService locationService;

    @GetMapping("/api/location/cities")
    public Collection<CityDTO> getCities() {
        return locationService.getCities().stream().map(city -> new CityDTO(city.getId(), city.getName()))
                .collect(Collectors.toList());
    }

    @GetMapping("/api/location/districts/{id}")
    public Collection<DistrictDTO> getDistricts(@PathVariable("id") Long cityId) {
        return locationService.getDistricts(cityId).stream()
                .map(district -> new DistrictDTO(district.getId(), district.getName()))
                .collect(Collectors.toList());
    }

    @GetMapping("/api/location/wards/{id}")
    public Collection<WardDTO> getWards(@PathVariable("id") Long districtId) {
        return locationService.getWards(districtId).stream().map(ward -> new WardDTO(ward.getId(), ward.getName()))
                .collect(Collectors.toList());
    }
}
