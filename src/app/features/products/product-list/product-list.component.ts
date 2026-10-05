import { Component, inject, OnInit } from '@angular/core';
import { ProductService } from '../../../core/services/product.service';
import { Product, ProductCategory } from '../../../core/models/product';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../../../shared/navbar/navbar.component';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css',
})
export class ProductListComponent implements OnInit {
  private productService = inject(ProductService);

  products: Product[] = [];

  loading = false;

  searchText = '';

  selectedCategory = '';

  currentPage = 0;
  pageSize = 8;

  totalPages = 0;
  totalElements = 0;

  categories: ProductCategory[] = [
    'SEEDS',
    'PLANTS',
    'FERTILIZERS',
    'POTS',
    'TOOLS',
  ];

  ngOnInit(): void {
    this.loadProducts();
  }

  // loadProducts(): void {

  //   this.loading = true;

  //   this.productService.getProducts().subscribe({

  //     next: data => {
  //       this.products = data;
  //       this.loading = false;
  //     },

  //     error: error => {
  //       console.error('Failed to load products', error);
  //       this.loading = false;
  //     }

  //   });
  // }
  loadProducts(): void {
    this.loading = true;

    this.productService
      .searchProducts(this.searchText, this.currentPage, this.pageSize)
      .subscribe({
        next: (response) => {
          this.products = response.content;
          this.totalPages = response.totalPages;
          this.totalElements = response.totalElements;

          this.loading = false;
        },

        error: (error) => {
          console.error('Failed to load products', error);

          this.loading = false;
        },
      });
  }

  search(): void {
    const search = this.searchText.trim();

    if (!search) {
      this.loadProducts();
      return;
    }

    this.loading = true;

    this.productService
      .searchProducts(search, this.currentPage, this.pageSize)
      .subscribe({
        next: (data) => {
          this.products = data.content;
          this.totalPages = data.totalPages;
          this.totalElements = data.totalElements;
          this.loading = false;
        },

        error: (error) => {
          console.error('Search failed', error);
          this.loading = false;
        },
      });
  }

  filterByCategory(): void {
    if (!this.selectedCategory) {
      this.loadProducts();
      return;
    }

    this.loading = true;

    this.productService.getProductsByCategory(this.selectedCategory).subscribe({
      next: (data) => {
        this.products = data.content;
        this.totalPages = data.totalPages;
        this.totalElements = data.totalElements;
        this.loading = false;
      },

      error: (error) => {
        console.error('Category filter failed', error);
        this.loading = false;
      },
    });
  }

  getCategoryLabel(category: string): string {
    return category
      .toLowerCase()
      .replace('_', ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase());
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;

      this.loadProducts();
    }
  }

  previousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;

      this.loadProducts();
    }
  }

  goToPage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;

      this.loadProducts();
    }
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, index) => index);
  }
}
