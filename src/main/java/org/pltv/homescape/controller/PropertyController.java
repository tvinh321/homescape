package org.pltv.homescape.controller;

import java.util.List;

import org.pltv.homescape.dto.ErrorResponse;
import org.pltv.homescape.dto.SuccessReponse;
import org.pltv.homescape.dto.property.PropertyPostReq;
import org.pltv.homescape.dto.property.PropertyPostRes;
import org.pltv.homescape.dto.property.PropertySearchQuery;
import org.pltv.homescape.dto.property.PropertyFileUpload;
import org.pltv.homescape.dto.property.PropertyInfoRes;
import org.pltv.homescape.dto.property.PropertyListRes;
import org.pltv.homescape.service.PropertyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import lombok.extern.slf4j.Slf4j;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
@Slf4j
public class PropertyController {

    @Autowired
    private PropertyService propertyService;

    @GetMapping("/api/property/outstanding")
    public ResponseEntity<Object> getOutstandingProperties() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = null;

        if (auth != null) {
            email = (String) auth.getPrincipal();
            log.info("Email: " + email);
        }

        List<PropertyListRes> properties = propertyService.getOutstandingProperties(email);

        return ResponseEntity.ok(SuccessReponse.builder().data(properties).message("Success").build());
    }

    @PostMapping("/api/property/query")
    public ResponseEntity<Object> getProperties(@RequestBody PropertySearchQuery query,
            @RequestParam("page") int page) {
        if (page < 1) {
            return ResponseEntity.badRequest().body(ErrorResponse.builder().error("Bad Request").code("400")
                    .message("Page must be greater than 0").build());
        }

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = null;

        if (auth != null) {
            email = (String) auth.getPrincipal();
            log.info("Email: " + email);
        }

        List<PropertyListRes> properties = propertyService.getPropertiesQuery(query, page, email);

        return ResponseEntity.ok(SuccessReponse.builder().data(properties).message("Success").build());
    }

    @GetMapping("/api/property/{id}")
    public ResponseEntity<Object> getProperty(@PathVariable("id") Long id) {
        PropertyInfoRes property = propertyService.getPropertyInfo(id);

        if (property == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(SuccessReponse.builder().data(property).message("Success").build());
    }

    @PostMapping("/api/user/property")
    public ResponseEntity<Object> postMethodName(@RequestBody PropertyPostReq property) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null) {
            return ResponseEntity.badRequest().body(ErrorResponse.builder().error("Bad Request").code("400")
                    .message("You must login to post a property").build());
        }

        String email = (String) auth.getPrincipal();

        Long id = propertyService.saveProperty(property, email);

        return ResponseEntity.ok(PropertyPostRes.builder().message("Property created").id(id).build());
    }

    @PutMapping("/api/user/property/{id}")
    public ResponseEntity<Object> updateProperty(@PathVariable("id") Long id, @RequestBody PropertyPostReq property) {
        String authorEmail = propertyService.getAuthorEmail(id);
        if (authorEmail == null) {
            return ResponseEntity.notFound().build();
        }

        String tokenEmail = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (!authorEmail.equals(tokenEmail)) {
            return ResponseEntity.badRequest().body(ErrorResponse.builder().error("Bad Request").code("400")
                    .message("You are not the owner of this property").build());
        }

        propertyService.updateProperty(property, id);

        return ResponseEntity.ok(SuccessReponse.builder().message("Success").build());
    }

    @DeleteMapping("/api/user/property/{id}")
    public ResponseEntity<Object> deleteProperty(@PathVariable("id") Long id) {
        String authorEmail = propertyService.getAuthorEmail(id);
        if (authorEmail == null) {
            return ResponseEntity.notFound().build();
        }

        String tokenEmail = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (!authorEmail.equals(tokenEmail)) {
            return ResponseEntity.badRequest().body(ErrorResponse.builder().error("Bad Request").code("400")
                    .message("You are not the owner of this property").build());
        }

        propertyService.deleteProperty(id);

        return ResponseEntity.ok(SuccessReponse.builder().message("Success").build());
    }

    @PostMapping("/api/user/property/uploadFile")
    public ResponseEntity<Object> uploadFile(@ModelAttribute PropertyFileUpload upload) {
        String authorEmail = propertyService.getAuthorEmail(upload.getProperty());
        if (authorEmail == null) {
            return ResponseEntity.notFound().build();
        }

        String tokenEmail = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (!authorEmail.equals(tokenEmail)) {
            return ResponseEntity.badRequest().body(ErrorResponse.builder().error("Bad Request").code("400")
                    .message("You are not the owner of this property").build());
        }

        propertyService.savePropertyFile(upload.getFile(), upload.getProperty(), upload.getType());

        return ResponseEntity.ok(SuccessReponse.builder().message("Success").build());
    }

    @GetMapping("/api/property/file/{propertyId}/{filename:.+}")
    public ResponseEntity<Resource> getFile(@PathVariable String filename, @PathVariable Long propertyId) {
        Resource file = propertyService.getFile(propertyId, filename);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + file.getFilename() + "\"")
                .body(file);
    }
}
