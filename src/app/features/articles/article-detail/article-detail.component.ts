import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ArticleService } from '../../../core/services/article.service';
import { Article } from '../../../core/models/article';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-article-detail',
  standalone: true,
  imports: [RouterLink, DatePipe],
  templateUrl: './article-detail.component.html',
  styleUrl: './article-detail.component.css',
})
export class ArticleDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private articleService = inject(ArticleService);

  article: Article | null = null;

  loading = true;

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!id) {
      this.loading = false;
      return;
    }

    this.loadArticle(id);
  }

  loadArticle(id: number): void {
    this.loading = true;

    this.articleService.getArticleById(id).subscribe({
      next: (article) => {
        this.article = article;
        this.loading = false;
      },

      error: (error) => {
        console.error('Failed to load article', error);
        this.loading = false;
      },
    });
  }
}
