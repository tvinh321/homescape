package org.pltv.homescape.service;

import java.util.UUID;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

import org.pltv.homescape.repository.PropertyRepository;
import org.pltv.homescape.dto.user.MyPropertiesRes;
import org.pltv.homescape.model.Property;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PropertyService {
    @Autowired
    private PropertyRepository propertyRepo;

    @Autowired
    private LocationService locationService;

    @Autowired
    private FileService fileService;

    public List<MyPropertiesRes> convertToMyPropertiesRes(List<Property> properties) {
        List<MyPropertiesRes> myProperties = new ArrayList<MyPropertiesRes>();

        for (Property property : properties) {
            LocalDateTime createdAt = property.getCreatedAt();
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss");

            MyPropertiesRes myProperty = MyPropertiesRes.builder()
                    .id(property.getId())
                    .title(property.getTitle())
                    .price(property.getPrice())
                    .area(property.getArea())
                    .location(locationService.getAddress(property.getStreet(), property.getWard()))
                    .image(fileService.getFirstImage(property.getId()))
                    .createdAt(createdAt.format(formatter))
                    .build();

            myProperties.add(myProperty);
        }

        return myProperties;
    }

    public Property getProperty(Long propertyId) {
        return propertyRepo.findById(propertyId).orElse(null);
    }

}
