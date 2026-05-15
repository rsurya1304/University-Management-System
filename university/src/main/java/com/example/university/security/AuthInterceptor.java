package com.example.university.security;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
public class AuthInterceptor implements HandlerInterceptor {

    public static final String AUTH_USER_ATTRIBUTE = "authUser";

    private final JwtService jwtService;

    public AuthInterceptor(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    @Override
    public boolean preHandle(
            HttpServletRequest request,
            HttpServletResponse response,
            Object handler) throws Exception {

        if (isPublic(request)) {
            return true;
        }

        String authorization = request.getHeader("Authorization");

        if (authorization == null || !authorization.startsWith("Bearer ")) {
            response.sendError(HttpStatus.UNAUTHORIZED.value(), "Authorization token is required");
            return false;
        }

        AuthUser authUser;
        try {
            authUser = jwtService.verifyToken(authorization.substring(7));
        } catch (Exception e) {
            response.sendError(HttpStatus.UNAUTHORIZED.value(), "Invalid or expired token");
            return false;
        }

        if (!isAllowed(request, authUser)) {
            response.sendError(HttpStatus.FORBIDDEN.value(), "Access level does not allow this action");
            return false;
        }

        request.setAttribute(AUTH_USER_ATTRIBUTE, authUser);
        return true;
    }

    private boolean isPublic(HttpServletRequest request) {
        String path = request.getRequestURI();
        return HttpMethod.OPTIONS.matches(request.getMethod())
                || "/".equals(path)
                || path.equals("/auth/login")
                || path.equals("/auth/register")
                || path.equals("/auth/access-levels");
    }

    private boolean isAllowed(HttpServletRequest request, AuthUser authUser) {
        String role = authUser.getAccessLevel();
        String path = request.getRequestURI();
        String method = request.getMethod();

        if ("ADMIN".equals(role)) {
            return true;
        }

        if (path.startsWith("/me")) {
            return true;
        }

        if ("REGISTRAR".equals(role)) {
            boolean readOnly = HttpMethod.GET.matches(method);
            return path.startsWith("/students")
                    || path.startsWith("/courses")
                    || path.startsWith("/departments")
                    || path.startsWith("/semesters")
                    || path.startsWith("/classes")
                    || path.startsWith("/fees")
                    || path.startsWith("/syllabi")
                    || path.startsWith("/reports")
                    || (readOnly && path.startsWith("/professors"));
        }

        if ("PROFESSOR".equals(role)) {
            boolean readOnly = HttpMethod.GET.matches(method);
            boolean teachingWrite = path.startsWith("/marks")
                    || path.startsWith("/timetables");
            boolean academicLookupRead = path.startsWith("/students")
                    || path.startsWith("/professors")
                    || path.startsWith("/courses")
                    || path.startsWith("/departments")
                    || path.startsWith("/semesters")
                    || path.startsWith("/classes")
                    || path.startsWith("/syllabi")
                    || path.startsWith("/reports");

            return teachingWrite || (readOnly && academicLookupRead);
        }

        if ("STUDENT".equals(role)) {
            return HttpMethod.GET.matches(method)
                    && (path.startsWith("/courses")
                    || path.startsWith("/timetables")
                    || path.startsWith("/syllabi"));
        }

        return false;
    }
}
