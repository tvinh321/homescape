package org.pltv.homescape.service;

import java.util.UUID;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

import org.pltv.homescape.repository.PropertyRepository;
import org.pltv.homescape.dto.property.PropertySearchQuery;
import org.pltv.homescape.dto.property.PropertyInfoRes;
import org.pltv.homescape.dto.property.PropertyListRes;
import org.pltv.homescape.dto.property.PropertyPostReq;
import org.pltv.homescape.model.Property;
import org.pltv.homescape.model.Ward;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class PropertyService {
    @Autowired
    private PropertyRepository propertyRepo;

    @Autowired
    private LocationService locationService;

    @Autowired
    private UserService userService;

    @Autowired
    private FileService fileService;

    public List<PropertyListRes> convertToPropertyListRes(List<Property> properties, String email) {
        List<PropertyListRes> myProperties = new ArrayList<PropertyListRes>();

        for (Property property : properties) {
            LocalDateTime createdAt = property.getCreatedAt();
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss");

            PropertyListRes myProperty = PropertyListRes.builder()
                    .id(property.getId())
                    .title(property.getTitle())
                    .price(property.getPrice())
                    .area(property.getArea())
                    .location(locationService.getAddress(property.getStreet(), property.getWard()))
                    .image(fileService.getFirstImage(property.getId()))
                    .createdAt(createdAt.format(formatter))
                    .favorite(email != null
                            ? property.getFavoriteUsers().stream().anyMatch(u -> u.getEmail().equals(email))
                            : false)
                    .build();

            myProperties.add(myProperty);
        }

        return myProperties;
    }

    public PropertyInfoRes convertToPropertyInfoRes(Property property, String email) {
        LocalDateTime createdAt = property.getCreatedAt();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss");

        return PropertyInfoRes.builder()
                .id(property.getId())
                .title(property.getTitle())
                .description(property.getDescription())
                .type(property.getType())
                .price(property.getPrice())
                .area(property.getArea())
                .direction(property.getDirection())
                .bedroom(property.getBedroom())
                .bathroom(property.getBathroom())
                .floor(property.getFloor())
                .createdAt(createdAt.format(formatter))
                .location(locationService.getAddress(property.getStreet(), property.getWard()))
                .files(fileService.getFiles(property.getId()))
                .author(userService.changeToPropertyAuthorRes(property.getUser()))
                .favorite(email != null
                        ? property.getFavoriteUsers().stream().anyMatch(u -> u.getEmail().equals(email))
                        : false)
                .build();
    }

    public Property getProperty(Long propertyId) {
        return propertyRepo.findById(propertyId).orElse(null);
    }

    public List<PropertyListRes> getOutstandingProperties(String email) {
        return convertToPropertyListRes(propertyRepo.findTop6ByOrderByViewCountDesc(), email);
    }

    public void saveProperty(Property property) {
        propertyRepo.save(property);
    }

    public List<PropertyListRes> getPropertiesQuery(PropertySearchQuery query, int page, String email) {
        if (page < 1) {
            return null;
        }

        if (query.getTitle() != null) {
            query.setTitle(query.getTitle().toLowerCase());
        }

        List<Double> price = query.getPrice();
        List<Double> area = query.getArea();

        List<String> bedroom = query.getBedroom();

        return convertToPropertyListRes(propertyRepo.searchProperties(
                query.getTitle(),
                query.getType(),
                query.getCity(),
                query.getDistrict(),
                query.getWard(),
                price == null ? null : price.get(0),
                price == null ? null : price.get(1),
                area == null ? null : area.get(0),
                area == null ? null : area.get(1),
                bedroom == null ? null : bedroom.stream().filter(b -> !b.equals("5+")).toList(),
                bedroom == null ? null : bedroom.contains("5+"),
                query.getDirection(),
                query.getSort(),
                PageRequest.of(page - 1, 10)), email);
    }

    public PropertyInfoRes getPropertyInfo(Long propertyId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = null;

        if (auth != null) {
            email = (String) auth.getPrincipal();
            log.info("Email: " + email);
        }

        Property property = propertyRepo.findById(propertyId).orElse(null);

        if (property == null) {
            return null;
        }

        property.setViewCount(property.getViewCount() + 1);
        propertyRepo.save(property);

        return convertToPropertyInfoRes(property, email);
    }

    public Long saveProperty(PropertyPostReq property, String email) {
        Ward ward = locationService.getWardFromId(property.getWard());

        Property newProperty = Property.builder()
                .title(property.getTitle())
                .description(property.getDescription())
                .type(property.getType())
                .price(property.getPrice())
                .area(property.getArea())
                .direction(property.getDirection())
                .bedroom(property.getBedroom())
                .bathroom(property.getBathroom())
                .floor(property.getFloor())
                .street(property.getStreet())
                .ward(ward)
                .user(userService.getUserByEmail(email))
                .build();

        propertyRepo.save(newProperty);

        return newProperty.getId();
    }

    public String getAuthorEmail(Long propertyId) {
        Property property = propertyRepo.findById(propertyId).orElse(null);

        if (property == null) {
            return null;
        }

        return property.getUser().getEmail();
    }

    public void updateProperty(PropertyPostReq property, Long propertyId) {
        Property oldProperty = propertyRepo.findById(propertyId).orElse(null);

        if (oldProperty == null) {
            log.error("Property not found");
            throw new IllegalArgumentException("Property not found");
        }

        Ward ward = locationService.getWardFromId(property.getWard());

        oldProperty.setTitle(property.getTitle());
        oldProperty.setDescription(property.getDescription());
        oldProperty.setType(property.getType());
        oldProperty.setPrice(property.getPrice());
        oldProperty.setArea(property.getArea());
        oldProperty.setDirection(property.getDirection());
        oldProperty.setBedroom(property.getBedroom());
        oldProperty.setBathroom(property.getBathroom());
        oldProperty.setFloor(property.getFloor());
        oldProperty.setStreet(property.getStreet());
        oldProperty.setWard(ward);

        propertyRepo.save(oldProperty);

        fileService.deleteAllFiles(propertyId);
    }

    public void deleteProperty(Long propertyId) {
        // Delete all files
        fileService.deleteAllFiles(propertyId);

        // Delete property
        propertyRepo.deleteById(propertyId);
    }

    public void savePropertyFile(MultipartFile file, Long propertyId, String type) {
        try {
            Property property = propertyRepo.findById(propertyId).orElse(null);

            if (property == null) {
                log.error("Property not found");
                throw new IllegalArgumentException("Property not found");
            }

            fileService.save(file, property, type);
        } catch (Exception e) {
            log.error("Error when saving file: " + e.getMessage());
            throw new IllegalArgumentException("Error when saving file");
        }
    }

    public Resource getFile(Long propertyId, String filename) {
        return fileService.getPropertyFile(propertyId, filename);
    }
}
