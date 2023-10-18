package org.pltv.homescape.repository;

import java.util.UUID;
import org.pltv.homescape.model.File;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FileRepository extends JpaRepository<File, UUID> {
    public File findFirstByPropertyIdAndType(Long propertyId, String type);
}
