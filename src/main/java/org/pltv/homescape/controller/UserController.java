package org.pltv.homescape.controller;

import java.util.List;

import org.pltv.homescape.dto.ErrorResponse;
import org.pltv.homescape.dto.SuccessReponse;
import org.pltv.homescape.dto.user.ChangePasswordReq;
import org.pltv.homescape.dto.user.ForgetPasswordReq;
import org.pltv.homescape.dto.user.LoginReq;
import org.pltv.homescape.dto.user.LoginRes;
import org.pltv.homescape.dto.user.MyPropertiesRes;
import org.pltv.homescape.dto.user.RegisterReq;
import org.pltv.homescape.dto.user.RegisterRes;
import org.pltv.homescape.dto.user.ResetPasswordReq;
import org.pltv.homescape.dto.user.UserInfoReq;
import org.pltv.homescape.model.User;
import org.pltv.homescape.service.JwtService;
import org.pltv.homescape.service.PropertyService;
import org.pltv.homescape.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import lombok.extern.slf4j.Slf4j;

@RestController
@Slf4j
public class UserController {
    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserService userService;

    @Autowired
    private PropertyService propertyService;

    @Autowired
    private JwtService JwtService;

    @PostMapping("/api/user/login")
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
                                JwtService.generateToken((User) authentication.getPrincipal())));
            } else {
                log.error("Authentication failed");
                return ResponseEntity.internalServerError()
                        .body(ErrorResponse.builder().code("500").error("Internal Server Error")
                                .message("Authentication failed").build());
            }
        } catch (BadCredentialsException e) {
            log.info(e.getMessage());
            return ResponseEntity.badRequest().body(ErrorResponse.builder().code("400").error("Bad Request")
                    .message("Invalid email or password").build());
        } catch (Exception e) {
            log.error(e.getMessage());
            return ResponseEntity.internalServerError()
                    .body(ErrorResponse.builder().code("500").error("Internal Server Error").message(e.getMessage())
                            .build());
        }

    }

    @PostMapping("/api/user/register")
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

        try {
            userService.register(registerPost);
            return ResponseEntity.ok().body(new RegisterRes(registerPost.getEmail(), "Registration successful"));
        } catch (Exception e) {
            log.error(e.getMessage());
            return ResponseEntity.internalServerError()
                    .body(ErrorResponse.builder().code("500").error("Internal Server Error").message(e.getMessage())
                            .build());
        }

    }

    @GetMapping("/api/user/verify/{token}")
    public ResponseEntity<Object> verify(@PathVariable("token") String token) throws Exception {
        userService.verifyEmail(token);
        return ResponseEntity.ok().body(SuccessReponse.builder().message("Email verified").build());
    }

    @PostMapping("/api/user/forgot")
    public ResponseEntity<Object> forgotPassword(@RequestBody ForgetPasswordReq forgetPasswordReq) {
        if (forgetPasswordReq.getEmail() == null) {
            return ResponseEntity.badRequest()
                    .body(ErrorResponse.builder().code("400").error("Bad Request").message("Missing field").build());
        }

        try {
            return ResponseEntity.ok().body(SuccessReponse.builder().message("Email sent")
                    .data(userService.forgotPassword(forgetPasswordReq.getEmail())).build());
        } catch (Exception e) {
            log.error(e.getMessage());
            return ResponseEntity.internalServerError()
                    .body(ErrorResponse.builder().code("500").error("Internal Server Error").message(e.getMessage())
                            .build());
        }
    }

    @PostMapping("/api/user/reset")
    public ResponseEntity<Object> resetPassword(@RequestBody ResetPasswordReq resetPasswordPost) {
        if (resetPasswordPost.getNewPassword() == null || resetPasswordPost.getConfirmPassword() == null) {
            return ResponseEntity.badRequest()
                    .body(ErrorResponse.builder().code("400").error("Bad Request").message("Missing field").build());
        }

        if (!resetPasswordPost.getNewPassword().equals(resetPasswordPost.getConfirmPassword())) {
            return ResponseEntity.badRequest().body(ErrorResponse.builder().code("400").error("Bad Request")
                    .message("Passwords don't match").build());
        }

        try {
            userService.resetPassword(resetPasswordPost.getToken(), resetPasswordPost.getNewPassword());
            return ResponseEntity.ok().body(SuccessReponse.builder().message("Password reset successful").build());
        } catch (Exception e) {
            log.error(e.getMessage());
            return ResponseEntity.internalServerError()
                    .body(ErrorResponse.builder().code("500").error("Internal Server Error").message(e.getMessage())
                            .build());
        }
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

        try {
            userService.changePassword(email, changePasswordPost.getOldPassword(),
                    changePasswordPost.getNewPassword());
            return ResponseEntity.ok().body(SuccessReponse.builder().message("Password changed").build());
        } catch (Exception e) {
            log.error(e.getMessage());
            return ResponseEntity.internalServerError()
                    .body(ErrorResponse.builder().code("500").error("Internal Server Error").message(e.getMessage())
                            .build());
        }
    }

    @GetMapping("/api/user/info")
    public ResponseEntity<Object> getInfo() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getPrincipal().toString();

        try {
            return ResponseEntity.ok().body(SuccessReponse.builder().message("User info")
                    .data(userService.getUserInfo(email)).build());
        } catch (Exception e) {
            log.error(e.getMessage());
            return ResponseEntity.internalServerError()
                    .body(ErrorResponse.builder().code("500").error("Internal Server Error").message(e.getMessage())
                            .build());
        }
    }

    @PostMapping("/api/user/info")
    public ResponseEntity<Object> changeInfo(@RequestBody UserInfoReq info) {
        if (info.getName() == null || info.getPhone() == null || info.getStreet() == null || info.getWard() == null) {
            return ResponseEntity.badRequest()
                    .body(ErrorResponse.builder().code("400").error("Bad Request").message("Missing field").build());
        }

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getPrincipal().toString();

        try {
            return ResponseEntity.ok().body(SuccessReponse.builder().message("User info updated")
                    .data(userService.updateUserInfo(info, email)).build());
        } catch (Exception e) {
            log.error(e.getMessage());
            return ResponseEntity.internalServerError()
                    .body(ErrorResponse.builder().code("500").error("Internal Server Error").message(e.getMessage())
                            .build());
        }
    }

    @GetMapping("/api/user/myProperties")
    public ResponseEntity<Object> getMyProperties() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getPrincipal().toString();

        List<MyPropertiesRes> myProperties = userService.getProperties(email);
        return ResponseEntity.ok().body(SuccessReponse.builder().message("My properties").data(myProperties).build());
    }

    @GetMapping("/api/user/myFavorites")
    public ResponseEntity<Object> getMyFavorites() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getPrincipal().toString();

        List<MyPropertiesRes> myProperties = userService.getFavoritesProperties(email);
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
}
