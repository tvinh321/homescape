package org.pltv.homescape.dto.user;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MyPropertiesRes {
    private Long id;
    private String title;
    private Integer price;
    private Float area;
    private String createdAt;
    private String location;
    private String image;
}