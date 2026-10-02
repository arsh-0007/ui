import { Component, inject, OnInit } from '@angular/core';
import { Product } from '../../../core/models/product';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { NavbarComponent } from '../../../shared/navbar/navbar.component';
import { CartService } from '../../../core/services/cart.service';
import { ReviewService } from '../../../core/services/review.service';
import { Review, ReviewRequest } from '../../../core/models/review';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [RouterLink, FormsModule, DatePipe],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css',
})
export class ProductDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  private reviewService = inject(ReviewService);

  product: Product | null = null;

  reviews: Review[] = [];

  loading = true;
  reviewsLoading = false;
  addingToCart = false;

  quantity = 1;

  selectedRating = 5;
  reviewComment = '';

  submittingReview = false;

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!id) {
      this.loading = false;
      return;
    }

    this.loadProduct(id);
    this.loadReviews(id);
  }

  loadProduct(id: number): void {
    this.loading = true;

    this.productService.getProductById(id).subscribe({
      next: (product) => {
        this.product = product;

        this.loading = false;
      },

      error: (error) => {
        console.error('Failed to load product', error);

        this.loading = false;
      },
    });
  }

  loadReviews(productId: number): void {
    this.reviewsLoading = true;

    this.reviewService.getReviews(productId).subscribe({
      next: (reviews) => {
        this.reviews = reviews;

        this.reviewsLoading = false;
      },

      error: (error) => {
        console.error('Failed to load reviews', error);

        this.reviewsLoading = false;
      },
    });
  }

  increaseQuantity(): void {
    if (this.product && this.quantity < this.product.stock) {
      this.quantity++;
    }
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  addToCart(): void {
    if (!this.product || this.product.stock <= 0) {
      return;
    }

    this.addingToCart = true;

    this.cartService
      .addToCart({
        productId: this.product.id,
        quantity: this.quantity,
      })
      .subscribe({
        next: () => {
          this.addingToCart = false;
        },

        error: (error) => {
          console.error('Failed to add product to cart', error);

          this.addingToCart = false;
        },
      });
  }

  selectRating(rating: number): void {
    this.selectedRating = rating;
  }

  submitReview(): void {
    if (!this.product) {
      return;
    }

    if (!this.reviewComment.trim()) {
      return;
    }

    const request: ReviewRequest = {
      rating: this.selectedRating,
      comment: this.reviewComment.trim(),
    };

    this.submittingReview = true;

    this.reviewService.addReview(this.product.id, request).subscribe({
      next: () => {
        this.reviewComment = '';
        this.selectedRating = 5;

        this.submittingReview = false;

        this.loadReviews(this.product!.id);
      },

      error: (error) => {
        console.error('Failed to submit review', error);

        this.submittingReview = false;
      },
    });
  }

  deleteReview(reviewId: number): void {
    if (!this.product) {
      return;
    }

    this.reviewService.deleteReview(this.product.id, reviewId).subscribe({
      next: () => {
        this.loadReviews(this.product!.id);
      },

      error: (error) => {
        console.error('Failed to delete review', error);
      },
    });
  }

  getStars(rating: number): string {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  }
}
