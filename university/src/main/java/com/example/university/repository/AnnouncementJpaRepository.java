package com.example.university.repository;

import com.example.university.model.Announcement;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AnnouncementJpaRepository extends JpaRepository<Announcement, Integer> {

    List<Announcement> findAllByOrderByPublishDateDescAnnouncementIdDesc();
}
