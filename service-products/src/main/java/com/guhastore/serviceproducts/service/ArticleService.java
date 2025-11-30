package com.guhastore.serviceproducts.service;

import com.guhastore.serviceproducts.model.Article;
import com.guhastore.serviceproducts.repository.ArticleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service 
public class ArticleService {

    @Autowired 
    private ArticleRepository articleRepository;

    
    public Article updateStatus(Long id, String newStatus) {

        Article article = articleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bài viết với ID: " + id));


        if (!"PUBLISHED".equals(newStatus) && !"DRAFT".equals(newStatus)) {

            throw new IllegalArgumentException("Trạng thái không hợp lệ: " + newStatus);
        }

        article.setStatus(newStatus);


        return articleRepository.save(article);
    }

}