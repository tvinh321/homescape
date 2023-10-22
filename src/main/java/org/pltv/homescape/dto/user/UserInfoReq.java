package org.pltv.homescape.dto.user;

import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserInfoReq {
    private UUID id;
    private String avatar;
    private String email;
    private String name;
    private String phone;
    private String street;
    private Long ward;
    private Long district;
    private Long city;
}
