package com.example.university.controller;

import com.example.university.model.TimetableEntry;
import com.example.university.repository.TimetableEntryJpaRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/timetables")
public class TimetableController {

    private final TimetableEntryJpaRepository timetableRepository;

    public TimetableController(TimetableEntryJpaRepository timetableRepository) {
        this.timetableRepository = timetableRepository;
    }

    @GetMapping
    public List<TimetableEntry> getTimetables() {
        return timetableRepository.findAll();
    }

    @PostMapping
    public TimetableEntry addTimetable(@RequestBody TimetableEntry timetableEntry) {
        return timetableRepository.save(timetableEntry);
    }

    @PutMapping("/{id}")
    public TimetableEntry updateTimetable(@PathVariable int id, @RequestBody TimetableEntry timetableEntry) {
        TimetableEntry existingEntry = timetableRepository.findById(id).orElseThrow();
        existingEntry.setDayOfWeek(timetableEntry.getDayOfWeek());
        existingEntry.setStartTime(timetableEntry.getStartTime());
        existingEntry.setEndTime(timetableEntry.getEndTime());
        existingEntry.setRoom(timetableEntry.getRoom());
        existingEntry.setCourse(timetableEntry.getCourse());
        existingEntry.setProfessor(timetableEntry.getProfessor());
        existingEntry.setAcademicClass(timetableEntry.getAcademicClass());
        return timetableRepository.save(existingEntry);
    }

    @DeleteMapping("/{id}")
    public void deleteTimetable(@PathVariable int id) {
        timetableRepository.deleteById(id);
    }
}
