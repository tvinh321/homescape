package org.pltv.homescape.controller;

import java.util.Collection;
import java.util.List;

import org.pltv.homescape.dto.location.CityResult;
import org.pltv.homescape.dto.location.DistrictResult;
import org.pltv.homescape.dto.location.WardResult;

import java.util.stream.Collectors;

import org.pltv.homescape.service.LocationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class LocationController {
    @Autowired
    private LocationService locationService;

    @GetMapping("/api/location/cities")
    public ResponseEntity<List<CityResult>> getCities() {
        List<CityResult> cities = locationService.getCities().stream()
                .map(city -> CityResult.builder().id(city.getId()).name(city.getName()).build())
                .collect(Collectors.toList());

        return ResponseEntity.ok(cities);
    }

    @GetMapping("/api/location/districts/{id}")
    public ResponseEntity<List<DistrictResult>> getDistricts(@PathVariable("id") Long cityId) {
        List<DistrictResult> districts = locationService.getDistricts(cityId).stream()
                .map(district -> DistrictResult.builder().id(district.getId()).name(district.getName()).build())
                .collect(Collectors.toList());

        return ResponseEntity.ok(districts);
    }

    @GetMapping("/api/location/wards/{id}")
    public ResponseEntity<Collection<WardResult>> getWards(@PathVariable("id") Long districtId) {
        List<WardResult> wards = locationService.getWards(districtId).stream()
                .map(ward -> WardResult.builder().id(ward.getId()).name(ward.getName()).build())
                .collect(Collectors.toList());

        return ResponseEntity.ok(wards);
    }
}
