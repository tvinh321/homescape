package org.pltv.homescape.controller;

import org.pltv.homescape.dto.property.PropertyPost;
import org.pltv.homescape.dto.property.PropertySearchQuery;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
public class PropertyController {

    @GetMapping("/api/property/outstanding")
    public String getOutstandingProperties() {
        return "Outstanding properties";
    }

    @PostMapping("/api/property/query")
    public String getProperties(@RequestBody PropertySearchQuery query, @RequestParam("page") int page) {
        return "Query";
    }

    @GetMapping("/api/property/{id}")
    public String getProperty(@PathVariable("id") Long id) {
        return "One Property";
    }

    @PostMapping("/api/property")
    public String postMethodName(@RequestBody PropertyPost property) {
        return "Post Property";
    }

    @PutMapping("/api/property/{id}")
    public String updateProperty(@PathVariable("id") Long id, @RequestBody PropertyPost property) {
        return "Update Property";
    }

    @DeleteMapping("/api/property/{id}")
    public String deleteProperty(@PathVariable("id") Long id) {
        return "Delete Property";
    }

    @PostMapping("/api/property/uploadFile")
    public String uploadFile(@RequestParam("file") MultipartFile file) {
        return "Upload File";
    }

    @GetMapping("/api/property/file/{filename:.+}")
    public String getFile(@PathVariable String filename) {
        return "Get File";
    }
}
