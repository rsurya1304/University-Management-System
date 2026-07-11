package com.example.university.controller;

import com.example.university.model.Announcement;
import com.example.university.repository.AnnouncementJpaRepository;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/announcements")
public class AnnouncementController {

    private final AnnouncementJpaRepository announcementRepository;

    public AnnouncementController(AnnouncementJpaRepository announcementRepository) {
        this.announcementRepository = announcementRepository;
    }

    @GetMapping
    public List<Announcement> getAnnouncements() {
        return announcementRepository.findAllByOrderByPublishDateDescAnnouncementIdDesc();
    }

    @PostMapping
    public Announcement addAnnouncement(@RequestBody Announcement announcement) {
        validate(announcement);
        return announcementRepository.save(announcement);
    }

    @PutMapping("/{announcementId}")
    public Announcement updateAnnouncement(
            @PathVariable int announcementId,
            @RequestBody Announcement announcement) {
        Announcement existingAnnouncement = announcementRepository.findById(announcementId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Announcement not found with id: " + announcementId
                ));

        validate(announcement);
        existingAnnouncement.setTitle(announcement.getTitle());
        existingAnnouncement.setMessage(announcement.getMessage());
        existingAnnouncement.setAudience(announcement.getAudience());
        existingAnnouncement.setPriority(announcement.getPriority());
        existingAnnouncement.setPublishDate(announcement.getPublishDate());
        existingAnnouncement.setExpiresOn(announcement.getExpiresOn());
        return announcementRepository.save(existingAnnouncement);
    }

    @DeleteMapping("/{announcementId}")
    public void deleteAnnouncement(@PathVariable int announcementId) {
        Announcement announcement = announcementRepository.findById(announcementId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Announcement not found with id: " + announcementId
                ));
        announcementRepository.delete(announcement);
    }

    private void validate(Announcement announcement) {
        if (announcement.getTitle() == null || announcement.getTitle().trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Announcement title is required");
        }

        if (announcement.getMessage() == null || announcement.getMessage().trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Announcement message is required");
        }

        if (announcement.getAudience() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Announcement audience is required");
        }

        if (announcement.getPriority() == null || announcement.getPriority().trim().isEmpty()) {
            announcement.setPriority("NORMAL");
        }

        if (announcement.getPublishDate() == null) {
            announcement.setPublishDate(LocalDate.now());
        }
    }
}
