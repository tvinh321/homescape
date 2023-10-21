package org.pltv.homescape.controller;

import java.util.List;
import java.util.UUID;

import org.pltv.homescape.dto.ErrorResponse;
import org.pltv.homescape.dto.SuccessReponse;
import org.pltv.homescape.dto.user.ChangePasswordReq;
import org.pltv.homescape.dto.user.ForgetPasswordReq;
import org.pltv.homescape.dto.user.LoginReq;
import org.pltv.homescape.dto.user.LoginRes;
import org.pltv.homescape.dto.property.PropertyListRes;
import org.pltv.homescape.dto.user.RegisterReq;
import org.pltv.homescape.dto.user.RegisterRes;
import org.pltv.homescape.dto.user.ResetPasswordReq;
import org.pltv.homescape.dto.user.UserInfoReq;
import org.pltv.homescape.model.User;
import org.pltv.homescape.service.JwtService;
import org.pltv.homescape.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import lombok.extern.slf4j.Slf4j;

@RestController
@Slf4j
public class UserController {
    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserService userService;

    @Autowired
    private JwtService jwtService;

    @PostMapping("/api/login")
    public ResponseEntity<Object> login(@RequestBody LoginReq loginPost) {
        if (loginPost.getEmail() == null || loginPost.getPassword() == null) {
            return ResponseEntity.badRequest()
                    .body(ErrorResponse.builder().code("400").error("Bad Request").message("Missing field").build());
        }

        try {
            if (userService.checkUserVerified(loginPost.getEmail()) == false) {
                return ResponseEntity.badRequest().body(ErrorResponse.builder().code("400").error("Bad Request")
                        .message("User not verified").build());
            }

            Authentication authentication = authenticationManager
                    .authenticate(new UsernamePasswordAuthenticationToken(loginPost.getEmail(),
                            loginPost.getPassword()));

            if (authentication.isAuthenticated()) {
                return ResponseEntity.ok().body(
                        new LoginRes(loginPost.getEmail(),
                                jwtService.generateToken((User) authentication.getPrincipal())));
            } else {
                log.error("Authentication failed");
                return ResponseEntity.internalServerError()
                        .body(ErrorResponse.builder().code("500").error("Internal Server Error")
                                .message("Authentication failed").build());
            }
        } catch (BadCredentialsException e) {
            log.info(e.getMessage());
            return ResponseEntity.badRequest().body(ErrorResponse.builder().code("400").error("Bad Request")
                    .message("Invalid password").build());
        } catch (UsernameNotFoundException e) {
            return ResponseEntity.badRequest().body(ErrorResponse.builder().code("400").error("Bad Request")
                    .message("Email not found").build());
        }
    }

    @PostMapping("/api/register")
    public ResponseEntity<Object> register(@RequestBody RegisterReq registerPost) {
        if (registerPost.getEmail() == null || registerPost.getPassword() == null
                || registerPost.getConfirmPassword() == null) {
            return ResponseEntity.badRequest()
                    .body(ErrorResponse.builder().code("400").error("Bad Request").message("Missing field").build());
        }

        if (!registerPost.getPassword().equals(registerPost.getConfirmPassword())) {
            return ResponseEntity.badRequest().body(ErrorResponse.builder().code("400").error("Bad Request")
                    .message("Passwords don't match").build());
        }

        userService.register(registerPost);
        return ResponseEntity.ok().body(new RegisterRes(registerPost.getEmail(), "Registration successful"));

    }

    @GetMapping("/api/verify/{token}")
    public ResponseEntity<Object> verify(@PathVariable("token") String token) throws Exception {
        userService.verifyEmail(token);
        return ResponseEntity.ok().body(SuccessReponse.builder().message("Email verified").build());
    }

    @PostMapping("/api/forgotPassword")
    public ResponseEntity<Object> forgotPassword(@RequestBody ForgetPasswordReq forgetPasswordReq) throws Exception {
        if (forgetPasswordReq.getEmail() == null) {
            return ResponseEntity.badRequest()
                    .body(ErrorResponse.builder().code("400").error("Bad Request").message("Missing field").build());
        }

        return ResponseEntity.ok().body(SuccessReponse.builder().message("Email sent")
                .data(userService.forgotPassword(forgetPasswordReq.getEmail())).build());
    }

    @PostMapping("/api/resetPassword")
    public ResponseEntity<Object> resetPassword(@RequestBody ResetPasswordReq resetPasswordPost) throws Exception {
        if (resetPasswordPost.getNewPassword() == null || resetPasswordPost.getConfirmPassword() == null) {
            return ResponseEntity.badRequest()
                    .body(ErrorResponse.builder().code("400").error("Bad Request").message("Missing field").build());
        }

        if (!resetPasswordPost.getNewPassword().equals(resetPasswordPost.getConfirmPassword())) {
            return ResponseEntity.badRequest().body(ErrorResponse.builder().code("400").error("Bad Request")
                    .message("Passwords don't match").build());
        }

        userService.resetPassword(resetPasswordPost.getToken(), resetPasswordPost.getNewPassword());
        return ResponseEntity.ok().body(SuccessReponse.builder().message("Password reset successful").build());

    }

    @PostMapping("/api/user/changePassword")
    public ResponseEntity<Object> changePassword(@RequestBody ChangePasswordReq changePasswordPost) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        if (changePasswordPost.getOldPassword() == null || changePasswordPost.getNewPassword() == null
                || changePasswordPost.getConfirmPassword() == null) {
            return ResponseEntity.badRequest()
                    .body(ErrorResponse.builder().code("400").error("Bad Request").message("Missing field").build());
        }

        if (changePasswordPost.getOldPassword().equals(changePasswordPost.getNewPassword())) {
            return ResponseEntity.badRequest().body(ErrorResponse.builder().code("400").error("Bad Request")
                    .message("New password must be different from old password").build());
        }

        if (!changePasswordPost.getNewPassword().equals(changePasswordPost.getConfirmPassword())) {
            return ResponseEntity.badRequest().body(ErrorResponse.builder().code("400").error("Bad Request")
                    .message("Passwords don't match").build());
        }

        userService.changePassword(email, changePasswordPost.getOldPassword(),
                changePasswordPost.getNewPassword());
        return ResponseEntity.ok().body(SuccessReponse.builder().message("Password changed").build());

    }

    @GetMapping("/api/user/info")
    public ResponseEntity<Object> getInfo() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getPrincipal().toString();

        return ResponseEntity.ok().body(SuccessReponse.builder().message("User info")
                .data(userService.getUserInfo(email)).build());
    }

    @PostMapping("/api/user/info")
    public ResponseEntity<Object> changeInfo(@RequestBody UserInfoReq info) {
        if (info.getName() == null || info.getPhone() == null || info.getStreet() == null || info.getWard() == null) {
            return ResponseEntity.badRequest()
                    .body(ErrorResponse.builder().code("400").error("Bad Request").message("Missing field").build());
        }

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getPrincipal().toString();

        return ResponseEntity.ok().body(SuccessReponse.builder().message("User info updated")
                .data(userService.updateUserInfo(info, email)).build());
    }

    @GetMapping("/api/user/myProperties")
    public ResponseEntity<Object> getMyProperties() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getPrincipal().toString();

        List<PropertyListRes> myProperties = userService.getProperties(email);
        return ResponseEntity.ok().body(SuccessReponse.builder().message("My properties").data(myProperties).build());
    }

    @GetMapping("/api/user/myFavorites")
    public ResponseEntity<Object> getMyFavorites() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getPrincipal().toString();

        List<PropertyListRes> myProperties = userService.getFavoritesProperties(email);
        return ResponseEntity.ok()
                .body(SuccessReponse.builder().message("My favorite properties").data(myProperties).build());
    }

    @GetMapping("/api/user/favorite/{id}")
    public ResponseEntity<Object> favorite(@PathVariable("id") Long id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getPrincipal().toString();

        userService.addToFavorite(email, id);
        return ResponseEntity.ok().body(SuccessReponse.builder().message("Favorite added").build());
    }

    @DeleteMapping("/api/user/favorite/{id}")
    public ResponseEntity<Object> unfavorite(@PathVariable("id") Long id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getPrincipal().toString();

        userService.removeFromFavorite(email, id);
        return ResponseEntity.ok().body(SuccessReponse.builder().message("Favorite removed").build());
    }

    @GetMapping("/api/avatar/{id}")
    public ResponseEntity<Resource> getAvatar(@PathVariable("id") UUID id) {
        Resource file = userService.getAvatar(id);
        if (file == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + file.getFilename() + "\"")
                .body(file);
    }

    @PostMapping("/api/user/avatar")
    public ResponseEntity<Object> uploadAvatar(@ModelAttribute MultipartFile file) throws Exception {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getPrincipal().toString();

        userService.saveAvatar(file, email);
        return ResponseEntity.ok().body(SuccessReponse.builder().message("Avatar uploaded").build());
    }
}
