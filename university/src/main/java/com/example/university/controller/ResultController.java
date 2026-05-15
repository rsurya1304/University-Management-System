package com.example.university.controller;

import com.example.university.model.MarkRecord;
import com.example.university.repository.MarkRecordJpaRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/marks")
public class ResultController {

    private final MarkRecordJpaRepository markRepository;

    public ResultController(MarkRecordJpaRepository markRepository) {
        this.markRepository = markRepository;
    }

    @GetMapping
    public List<MarkRecord> getMarks() {
        return markRepository.findAll();
    }

    @PostMapping
    public MarkRecord addMark(@RequestBody MarkRecord markRecord) {
        return markRepository.save(markRecord);
    }

    @PutMapping("/{id}")
    public MarkRecord updateMark(@PathVariable int id, @RequestBody MarkRecord markRecord) {
        MarkRecord existingMark = markRepository.findById(id).orElseThrow();
        existingMark.setStudent(markRecord.getStudent());
        existingMark.setCourse(markRecord.getCourse());
        existingMark.setSemester(markRecord.getSemester());
        existingMark.setMarks(markRecord.getMarks());
        return markRepository.save(existingMark);
    }

    @DeleteMapping("/{id}")
    public void deleteMark(@PathVariable int id) {
        markRepository.deleteById(id);
    }
}
