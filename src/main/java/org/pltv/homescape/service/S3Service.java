package org.pltv.homescape.service;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.io.FilenameUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.net.URL;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class S3Service {
    @Value("${aws.bucket-name}")
    private String bucketName;

    @Autowired
    private final AmazonS3 s3Client;

    public String uploadFile(MultipartFile multipartFile, String fileName) throws IOException {
        // convert multipart file to a file
        File file = new File(multipartFile.getOriginalFilename());
        try (FileOutputStream fileOutputStream = new FileOutputStream(file)) {
            fileOutputStream.write(multipartFile.getBytes());
        }

        // upload file
        PutObjectRequest request = new PutObjectRequest(bucketName, fileName, file);
        ObjectMetadata metadata = new ObjectMetadata();
        metadata.setContentType("plain/" + FilenameUtils.getExtension(multipartFile.getOriginalFilename()));
        metadata.addUserMetadata("Title", "File Upload - " + fileName);
        metadata.setContentLength(file.length());
        request.setMetadata(metadata);
        s3Client.putObject(request);

        // delete file
        file.delete();

        return fileName;
    }

    public ByteArrayResource downloadFile(String fileName) throws IOException {
        S3Object s3Object = s3Client.getObject(bucketName, fileName);
        S3ObjectInputStream inputStream = s3Object.getObjectContent();
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        byte[] buffer = new byte[4096];
        int bytesRead = -1;
        while ((bytesRead = inputStream.read(buffer)) != -1) {
            outputStream.write(buffer, 0, bytesRead);
        }
        byte[] fileAsBytes = outputStream.toByteArray();
        return new ByteArrayResource(fileAsBytes);
    }

    public boolean delete(String fileName) {
        try {
            s3Client.deleteObject(bucketName, fileName);
            return true;
        } catch (Exception e) {
            log.error("Error while deleting file from S3", e);
            throw e;
        }
    }

    private boolean bucketIsEmpty() {
        ListObjectsV2Result result = s3Client.listObjectsV2(this.bucketName);
        if (result == null) {
            return false;
        }
        List<S3ObjectSummary> objects = result.getObjectSummaries();
        return objects.isEmpty();
    }

    public void deleteAllFiles(String directory) {
        ListObjectsV2Result result = s3Client.listObjectsV2(this.bucketName, directory);
        List<S3ObjectSummary> objects = result.getObjectSummaries();
        for (S3ObjectSummary os : objects) {
            s3Client.deleteObject(this.bucketName, os.getKey());
        }
    }
}