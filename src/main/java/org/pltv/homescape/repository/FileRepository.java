package org.pltv.homescape.repository;

import java.util.List;
import java.util.UUID;
import org.pltv.homescape.model.File;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FileRepository extends JpaRepository<File, UUID> {
    File findFirstByPropertyIdAndType(Long propertyId, String type);

    List<File> findByPropertyId(Long propertyId);
}
