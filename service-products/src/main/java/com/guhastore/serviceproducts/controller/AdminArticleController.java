package com.guhastore.serviceproducts.controller;

import com.guhastore.serviceproducts.dto.ArticleStatusUpdateDto;
import com.guhastore.serviceproducts.model.Article;
import com.guhastore.serviceproducts.repository.ArticleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication; 
import org.springframework.security.core.context.SecurityContextHolder; 
import org.springframework.web.bind.annotation.*;
import com.guhastore.serviceproducts.service.ArticleService;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/admin/articles")
@CrossOrigin(origins = "http://localhost:3000") 
@PreAuthorize("hasAuthority('ADMIN')") 
public class AdminArticleController {

    @Autowired
    private ArticleRepository articleRepository;

    @Autowired
    private ArticleService articleService;

    
    private String getCurrentAuthorName() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication.getPrincipal().toString(); 
    }

    
    
    @GetMapping
    public ResponseEntity<List<Article>> getAllArticlesForAdmin() {
        
        List<Article> allArticles = articleRepository.findAll(org.springframework.data.domain.Sort.by(org.springframework.data.domain.Sort.Direction.DESC, "publishDate"));
        return ResponseEntity.ok(allArticles);
    }
    
    
    @PostMapping
    public ResponseEntity<Article> createArticle(@RequestBody Article article) {
        article.setAuthorName(getCurrentAuthorName());
        article.setPublishDate(LocalDateTime.now());
        article.setStatus(article.getStatus() != null ? article.getStatus() : "DRAFT");
        
        Article savedArticle = articleRepository.save(article);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedArticle);
    }
    
    
    @PutMapping("/{id}")
    public ResponseEntity<Article> updateArticle(@PathVariable Long id, @RequestBody Article updatedArticle) {
        Optional<Article> articleOpt = articleRepository.findById(id);
        if (articleOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        Article existingArticle = articleOpt.get();
        existingArticle.setTitle(updatedArticle.getTitle());
        existingArticle.setSummary(updatedArticle.getSummary());
        existingArticle.setContent(updatedArticle.getContent());
        existingArticle.setImageUrl(updatedArticle.getImageUrl());
        existingArticle.setStatus(updatedArticle.getStatus());
        
        Article savedArticle = articleRepository.save(existingArticle);
        return ResponseEntity.ok(savedArticle);
    }

    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteArticle(@PathVariable Long id) {
        if (!articleRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        articleRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
     @PutMapping("/{id}/status")
    public ResponseEntity<Article> updateArticleStatus(@PathVariable Long id, @RequestBody ArticleStatusUpdateDto statusUpdate) {
        try {
            Article updatedArticle = articleService.updateStatus(id, statusUpdate.getStatus());
            return ResponseEntity.ok(updatedArticle);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    @GetMapping("/{id}")
    public ResponseEntity<Article> getArticleById(@PathVariable Long id) {
        
        Optional<Article> articleOptional = articleRepository.findById(id);

        if (articleOptional.isPresent()) {
            return ResponseEntity.ok(articleOptional.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}