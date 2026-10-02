import { Component, inject, OnInit } from '@angular/core';
import { Article } from '../../../core/models/article';
import { ArticleService } from '../../../core/services/article.service';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-article-list',
  standalone: true,
  imports: [FormsModule, RouterLink, DatePipe],
  templateUrl: './article-list.component.html',
  styleUrl: './article-list.component.css',
})
export class ArticleListComponent implements OnInit {
  articles: Article[] = [];
  private articleService = inject(ArticleService);

  loading = false;

  searchTerm = '';

  // 👇 pagination
  currentPage = 0;
  pageSize = 8;

  totalPages = 0;
  totalElements = 0;

  ngOnInit(): void {
    this.loadArticles();
  }

  loadArticles(): void {
    this.loading = true;

    this.articleService.getArticles(this.currentPage, this.pageSize).subscribe({
      next: (response) => {
        this.articles = response.content;

        this.totalPages = response.totalPages;
        this.totalElements = response.totalElements;

        this.loading = false;
      },
      error: (error) => {
        console.error('Failed to load articles', error);

        this.loading = false;
      },
    });
  }

  search(): void {
    this.currentPage = 0;

    const keyword = this.searchTerm.trim();

    // If search box is empty, load all articles
    if (!keyword) {
      this.loadArticles();
      return;
    }

    this.loading = true;

    this.articleService
      .searchArticles(keyword, this.currentPage, this.pageSize)
      .subscribe({
        next: (response) => {
          this.articles = response.content;

          this.totalPages = response.totalPages;
          this.totalElements = response.totalElements;

          this.loading = false;
        },

        error: (error) => {
          console.error('Article search failed', error);

          this.loading = false;
        },
      });
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.loadArticles();
    }
  }

  previousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadArticles();
    }
  }

  goToPage(page: number): void {
    if (page < 0 || page >= this.totalPages) {
      return;
    }

    this.currentPage = page;

    const keyword = this.searchTerm.trim();

    if (keyword) {
      this.loading = true;

      this.articleService
        .searchArticles(keyword, this.currentPage, this.pageSize)
        .subscribe({
          next: (response) => {
            this.articles = response.content;
            this.totalPages = response.totalPages;
            this.totalElements = response.totalElements;

            this.loading = false;
          },

          error: (error) => {
            console.error('Article search failed', error);

            this.loading = false;
          },
        });
    } else {
      this.loadArticles();
    }
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, index) => index);
  }
}
