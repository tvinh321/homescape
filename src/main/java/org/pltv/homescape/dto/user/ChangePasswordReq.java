package org.pltv.homescape.dto.user;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChangePasswordReq {
    private String oldPassword;
    private String newPassword;
    private String confirmPassword;
}
