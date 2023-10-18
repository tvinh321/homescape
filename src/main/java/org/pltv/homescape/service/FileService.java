package org.pltv.homescape.service;

import org.pltv.homescape.model.File;
import org.pltv.homescape.repository.FileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class FileService {
    @Autowired
    private FileRepository fileRepo;

    public String getFirstImage(Long propertyId) {
        File file = fileRepo.findFirstByPropertyIdAndType(propertyId, "image");

        return file == null ? "" : file.getPath();
    }
}
