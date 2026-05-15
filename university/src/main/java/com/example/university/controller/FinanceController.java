package com.example.university.controller;

import com.example.university.model.Fee;
import com.example.university.repository.FeeJpaRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/fees")
public class FinanceController {

    private final FeeJpaRepository feeRepository;

    public FinanceController(FeeJpaRepository feeRepository) {
        this.feeRepository = feeRepository;
    }

    @GetMapping
    public List<Fee> getFees() {
        return feeRepository.findAll();
    }

    @PostMapping
    public Fee addFee(@RequestBody Fee fee) {
        return feeRepository.save(fee);
    }

    @PutMapping("/{id}")
    public Fee updateFee(@PathVariable int id, @RequestBody Fee fee) {
        Fee existingFee = feeRepository.findById(id).orElseThrow();
        existingFee.setStudent(fee.getStudent());
        existingFee.setAmount(fee.getAmount());
        existingFee.setStatus(fee.getStatus());
        existingFee.setDueDate(fee.getDueDate());
        existingFee.setPaymentDate(fee.getPaymentDate());
        return feeRepository.save(existingFee);
    }

    @DeleteMapping("/{id}")
    public void deleteFee(@PathVariable int id) {
        feeRepository.deleteById(id);
    }
}
