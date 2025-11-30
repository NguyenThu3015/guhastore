
package com.guhastore.serviceproducts.controller;

import com.guhastore.serviceproducts.model.Article;
import com.guhastore.serviceproducts.repository.ArticleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/articles")
@CrossOrigin(origins = "http://localhost:3000")
public class ArticleController {

    @Autowired
    private ArticleRepository articleRepository;

    
    @GetMapping
    public ResponseEntity<List<Article>> getPublishedArticles() {
        List<Article> published = articleRepository.findByStatusOrderByPublishDateDesc("PUBLISHED");
        return ResponseEntity.ok(published);
    }

    
    @GetMapping("/{id}")
    public ResponseEntity<Article> getArticleById(@PathVariable Long id) {
        Optional<Article> articleOpt = articleRepository.findById(id);
        if (articleOpt.isPresent() && articleOpt.get().getStatus().equals("PUBLISHED")) {
            return ResponseEntity.ok(articleOpt.get());
        }
        return ResponseEntity.notFound().build();
    }
}