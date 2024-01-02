package org.pltv.homescape.service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.pltv.homescape.dto.property.PropertyFileRes;
import org.pltv.homescape.model.File;
import org.pltv.homescape.model.Property;
import org.pltv.homescape.repository.FileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.method.annotation.StreamingResponseBody;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class FileService {
    @Autowired
    private FileRepository fileRepo;

    @Autowired
    private S3Service s3Service;

    @Autowired
    @Lazy
    private PropertyService propertyService;

    public String getFirstImage(Long propertyId) {
        File file = fileRepo.findFirstByPropertyIdAndType(propertyId, "image");

        return file == null ? "" : file.getPath();
    }

    public List<PropertyFileRes> getFiles(Long propertyId) {
        List<File> files = fileRepo.findByPropertyId(propertyId);
        List<PropertyFileRes> propertyFiles = new ArrayList<PropertyFileRes>();

        for (File file : files) {
            PropertyFileRes propertyFile = PropertyFileRes.builder()
                    .type(file.getType())
                    .url(file.getPath())
                    .build();

            propertyFiles.add(propertyFile);
        }

        return propertyFiles;
    }

    public String getFileExtension(MultipartFile file) {
        String fileName = file.getOriginalFilename();
        if (fileName != null && fileName.contains(".")) {
            return fileName.substring(fileName.lastIndexOf(".") + 1);
        }
        return null;
    }

    public void save(MultipartFile file, Property property, String type) throws IllegalStateException, IOException {
        String fileExtension = getFileExtension(file);

        if (fileExtension == null) {
            throw new IOException("File extension is not supported");
        }

        String fileName = property.getId() + "_" + UUID.randomUUID().toString() + "." + fileExtension;

        File newFile = new File();
        newFile.setProperty(property);
        newFile.setType(type);
        newFile.setPath(property.getId() + "/" + fileName);

        // // Create directory if not exist
        // java.io.File directory = new java.io.File("properties/" + property.getId());
        // if (!directory.exists()) {
        // directory.mkdirs();
        // }

        // Save file to local storage
        // java.io.File dest = new java.io.File(
        // "properties/" + property.getId() + "/" + fileName);
        // dest = dest.getAbsoluteFile();
        // file.transferTo(dest);

        // Save file to S3
        s3Service.uploadFile(file, "properties/" + property.getId() + "/" +
                fileName);

        fileRepo.save(newFile);
    }

    public StreamingResponseBody getPropertyFile(Long propertyId, String filename) throws IOException {
        // java.io.File file = new java.io.File("properties/" + propertyId + "/" +
        // filename);
        // if (file.exists()) {
        // byte[] fileContent = FileCopyUtils.copyToByteArray(file);
        // return new ByteArrayResource(fileContent);
        // }

        // S3
        try {
            StreamingResponseBody outputStream = s3Service.downloadFile("properties/" +
                    propertyId + "/" + filename);
            return outputStream;
        } catch (Exception e) {
            log.error("Error downloading file from S3: " + e.getMessage());
        }

        return null;
    }

    public void deleteAllFiles(Long propertyId) {
        List<File> files = fileRepo.findByPropertyId(propertyId);

        // java.io.File directory = new java.io.File("properties/" + propertyId);
        // if (directory.exists()) {
        // java.io.File[] filesInDirectory = directory.listFiles();
        // for (java.io.File file : filesInDirectory) {
        // file.delete();
        // }
        // directory.delete();
        // }

        // S3
        try {
            s3Service.deleteAllFiles("properties/" + propertyId);
        } catch (Exception e) {
            log.error("Error deleting files from S3: " + e.getMessage());
        }

        fileRepo.deleteAll(files);
    }

    public void saveVideo(String video, Long id) {
        Property property = propertyService.getProperty(id);

        if (property == null) {
            log.error("Property not found");
            throw new IllegalArgumentException("Property not found");
        }

        File newFile = new File();
        newFile.setProperty(property);
        newFile.setType("video");
        newFile.setPath(video);

        fileRepo.save(newFile);
    }
}
