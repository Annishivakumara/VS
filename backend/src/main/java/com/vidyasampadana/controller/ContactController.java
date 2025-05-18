package com.vidyasampadana.controller;

import com.vidyasampadana.model.ContactMessage;
import com.vidyasampadana.repository.ContactMessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class ContactController {

    @Autowired
    private ContactMessageRepository contactMessageRepository;

    @PostMapping("/contact")
    public ResponseEntity<?> submitContactForm(@Valid @RequestBody ContactMessage contactMessage) {
        try {
            ContactMessage savedMessage = contactMessageRepository.save(contactMessage);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Message sent successfully");
            response.put("id", savedMessage.getId());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Failed to send message");
            return ResponseEntity.badRequest().body(response);
        }
    }
} 