package org.pltv.homescape.dto.user;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserInfoRes {
    private String name;
    private String phone;
    private String street;
    private Long ward;
    private Long district;
    private Long city;
}
