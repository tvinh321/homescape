package org.pltv.homescape.model;

import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class File {
    @Id
    private Long id;
    private String name;
    private String path;
    private String type;
}
