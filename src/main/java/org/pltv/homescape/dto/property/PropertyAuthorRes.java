package org.pltv.homescape.dto.property;

import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PropertyAuthorRes {
    private UUID id;
    private String name;
    private String phone;
    private String email;
    private String avatar;
}
