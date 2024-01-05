package org.pltv.homescape.controller;

import java.io.IOException;
import java.util.List;
import java.util.concurrent.TimeUnit;

import org.pltv.homescape.dto.SuccessReponse;
import org.pltv.homescape.dto.property.PropertyPostReq;
import org.pltv.homescape.dto.property.PropertyPostRes;
import org.pltv.homescape.dto.property.PropertyQueryRes;
import org.pltv.homescape.dto.property.PropertySearchQuery;
import org.pltv.homescape.exception.ForbiddenException;
import org.pltv.homescape.exception.NegativePageException;
import org.pltv.homescape.exception.NotFoundException;
import org.pltv.homescape.exception.UnauthenticateException;
import org.pltv.homescape.dto.property.PropertyFileUpload;
import org.pltv.homescape.dto.property.PropertyInfoRes;
import org.pltv.homescape.dto.property.PropertyListRes;
import org.pltv.homescape.service.PropertyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.CacheControl;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.StreamingResponseBody;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
public class PropertyController {

    @Autowired
    private PropertyService propertyService;

    @GetMapping("/api/property/outstanding")
    public ResponseEntity<SuccessReponse> getOutstandingProperties() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = null;

        if (auth != null) {
            email = (String) auth.getPrincipal();
        }

        List<PropertyListRes> properties = propertyService.getOutstandingProperties(email);

        return ResponseEntity.ok(SuccessReponse.builder().data(properties).message("Success").build());
    }

    @PostMapping("/api/property/query")
    public ResponseEntity<SuccessReponse> getProperties(@RequestBody PropertySearchQuery query,
            @RequestParam("page") int page) throws NegativePageException {
        if (page < 1) {
            throw new NegativePageException();
        }

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = null;

        if (auth != null) {
            email = (String) auth.getPrincipal();
        }

        PropertyQueryRes properties = propertyService.getPropertiesQuery(query, page, email);

        return ResponseEntity.ok(SuccessReponse.builder().data(properties).message("Success").build());
    }

    @GetMapping("/api/property/{id}")
    public ResponseEntity<SuccessReponse> getProperty(@PathVariable("id") Long id) throws NotFoundException {
        PropertyInfoRes property = propertyService.getPropertyInfo(id);

        if (property == null) {
            throw new NotFoundException();
        }

        return ResponseEntity.ok(SuccessReponse.builder().data(property).message("Success").build());
    }

    @PostMapping("/api/user/property")
    public ResponseEntity<PropertyPostRes> postMethodName(@RequestBody PropertyPostReq property)
            throws UnauthenticateException {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null) {
            throw new UnauthenticateException("You must login to post a property");
        }

        String email = (String) auth.getPrincipal();

        Long id = propertyService.saveProperty(property, email);

        return ResponseEntity.ok(PropertyPostRes.builder().message("Property created").id(id).build());
    }

    @PutMapping("/api/user/property/{id}")
    public ResponseEntity<SuccessReponse> updateProperty(@PathVariable("id") Long id,
            @RequestBody PropertyPostReq property)
            throws NotFoundException, ForbiddenException {
        String authorEmail = propertyService.getAuthorEmail(id);
        if (authorEmail == null) {
            throw new NotFoundException();
        }

        String tokenEmail = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (!authorEmail.equals(tokenEmail)) {
            throw new ForbiddenException("You are not the owner of this property");
        }

        propertyService.updateProperty(property, id);

        return ResponseEntity.ok(SuccessReponse.builder().message("Success").build());
    }

    @DeleteMapping("/api/user/property/{id}")
    public ResponseEntity<SuccessReponse> deleteProperty(@PathVariable("id") Long id)
            throws NotFoundException, ForbiddenException {
        String authorEmail = propertyService.getAuthorEmail(id);
        if (authorEmail == null) {
            throw new NotFoundException();
        }

        String tokenEmail = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (!authorEmail.equals(tokenEmail)) {
            throw new ForbiddenException("You are not the owner of this property");
        }

        propertyService.deleteProperty(id);

        return ResponseEntity.ok(SuccessReponse.builder().message("Success").build());
    }

    @PostMapping("/api/user/property/uploadFile")
    public ResponseEntity<SuccessReponse> uploadFile(@ModelAttribute PropertyFileUpload upload)
            throws NotFoundException, ForbiddenException {
        String authorEmail = propertyService.getAuthorEmail(upload.getProperty());
        if (authorEmail == null) {
            throw new NotFoundException();
        }

        String tokenEmail = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (!authorEmail.equals(tokenEmail)) {
            throw new ForbiddenException("You are not the owner of this property");
        }

        propertyService.savePropertyFile(upload.getFile(), upload.getProperty(), upload.getType());

        return ResponseEntity.ok(SuccessReponse.builder().message("Success").build());
    }

    @GetMapping("/api/property/file/{propertyId}/{filename:.+}")
    public ResponseEntity<StreamingResponseBody> getFile(@PathVariable String filename, @PathVariable Long propertyId)
            throws IOException, NotFoundException {
        StreamingResponseBody file = propertyService.getFile(propertyId, filename);

        if (file == null) {
            throw new NotFoundException();
        }

        return ResponseEntity.ok()
                .contentType(MediaType.IMAGE_JPEG)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .cacheControl(CacheControl.maxAge(1, TimeUnit.HOURS))
                .body(file);
    }
}
