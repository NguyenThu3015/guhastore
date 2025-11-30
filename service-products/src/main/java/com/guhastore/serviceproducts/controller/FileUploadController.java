
package com.guhastore.serviceproducts.controller;

import com.guhastore.serviceproducts.service.StorageService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/files")
@CrossOrigin(origins = "http://localhost:3000")
public class FileUploadController {
    private static final Logger logger = LoggerFactory.getLogger(FileUploadController.class);

    @Autowired
    private StorageService storageService;

    
    @PostMapping("/upload")
    public ResponseEntity<Map<String, String>> uploadFile(@RequestParam("file") MultipartFile file) {
        try {
            String filePath = storageService.store(file);
            return ResponseEntity.ok(Map.of("filePath", filePath));
        } catch (Exception e) {
            logger.error("Error while uploading file", e);
            return ResponseEntity.status(500).body(Map.of("error", "Server error while uploading file."));
        }
    }
}