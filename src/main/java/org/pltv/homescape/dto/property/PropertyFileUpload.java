package org.pltv.homescape.dto.property;

import org.springframework.web.multipart.MultipartFile;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PropertyFileUpload {
    private Long property;
    private String type;
    private MultipartFile file;
}
