package com.guhastore.serviceproducts.controller;

import com.guhastore.serviceproducts.dto.ArticleStatusUpdateDto;
import com.guhastore.serviceproducts.model.Article;
import com.guhastore.serviceproducts.repository.ArticleRepository;
import com.guhastore.serviceproducts.service.ArticleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/admin/articles")
// Đã xóa @CrossOrigin và @PreAuthorize để tuân thủ SecurityConfig
public class AdminArticleController {

    @Autowired
    private ArticleRepository articleRepository;

    @Autowired
    private ArticleService articleService;

    // Helper: Lấy tên người dùng hiện tại an toàn hơn
    private String getCurrentAuthorName() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return "Anonymous";
        }
        Object principal = authentication.getPrincipal();
        if (principal instanceof UserDetails) {
            return ((UserDetails) principal).getUsername();
        } else {
            return principal.toString();
        }
    }

    // --- GET ALL (Admin/Employee) ---
    @GetMapping
    public ResponseEntity<List<Article>> getAllArticlesForAdmin() {
        // Sắp xếp bài mới nhất lên đầu
        List<Article> allArticles = articleRepository.findAll(
            org.springframework.data.domain.Sort.by(org.springframework.data.domain.Sort.Direction.DESC, "publishDate")
        );
        return ResponseEntity.ok(allArticles);
    }

    // --- GET ONE ---
    @GetMapping("/{id}")
    public ResponseEntity<Article> getArticleById(@PathVariable Long id) {
        Optional<Article> articleOptional = articleRepository.findById(id);
        return articleOptional.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // --- CREATE ---
    @PostMapping
    public ResponseEntity<Article> createArticle(@RequestBody Article article) {
        article.setAuthorName(getCurrentAuthorName()); // Tự động lấy tên người đang login
        // Nếu không gửi ngày, tự lấy ngày giờ hiện tại
        if (article.getPublishDate() == null) {
            article.setPublishDate(LocalDateTime.now());
        }
        article.setStatus(article.getStatus() != null ? article.getStatus() : "DRAFT");
        
        Article savedArticle = articleRepository.save(article);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedArticle);
    }

    // --- UPDATE ---
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
        // Không cập nhật AuthorName để giữ nguyên người tạo ban đầu
        
        Article savedArticle = articleRepository.save(existingArticle);
        return ResponseEntity.ok(savedArticle);
    }

    // --- UPDATE STATUS ---
    @PutMapping("/{id}/status")
    public ResponseEntity<Article> updateArticleStatus(@PathVariable Long id, @RequestBody ArticleStatusUpdateDto statusUpdate) {
        try {
            Article updatedArticle = articleService.updateStatus(id, statusUpdate.getStatus());
            return ResponseEntity.ok(updatedArticle);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // --- DELETE ---
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteArticle(@PathVariable Long id) {
        if (!articleRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        articleRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}