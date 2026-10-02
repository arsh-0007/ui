import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AdminService } from '../../../core/services/admin.service';
import { PlantService } from '../../../core/services/plant.service';
import { ProductService } from '../../../core/services/product.service';
import { ArticleService } from '../../../core/services/article.service';
import { OrderService } from '../../../core/services/order.service';

import { Plant, PlantRequest } from '../../../core/models/plant';
import {
  Product,
  ProductCategory,
  ProductRequest,
} from '../../../core/models/product';

import { Article } from '../../../core/models/article';

import { NavbarComponent } from '../../../shared/navbar/navbar.component';
import {
  AdminOrder,
  AdminOrderService,
  OrderStatus,
} from '../../../core/services/admin-order.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [FormsModule, DatePipe],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css',
})
export class AdminDashboardComponent implements OnInit {
  // =====================================================
  // SERVICES
  // =====================================================

  private adminService = inject(AdminService);
  private plantService = inject(PlantService);
  private productService = inject(ProductService);
  private articleService = inject(ArticleService);
  private orderService = inject(OrderService);
  private adminOrderService = inject(AdminOrderService);

  // =====================================================
  // COMMON
  // =====================================================

  loading = false;

  activeTab: 'plants' | 'products' | 'articles' | 'orders' = 'plants';

  // =====================================================
  // DASHBOARD STATISTICS
  // =====================================================

  productCount = 0;
  plantCount = 0;
  articleCount = 0;
  orderCount = 0;

  // =====================================================
  // PLANTS
  // =====================================================

  plants: Plant[] = [];

  editingPlantId: number | null = null;

  plantSaving = false;

  plantForm: PlantRequest = {
    name: '',
    category: '',
    description: '',
    sunlight: '',
    wateringFrequency: '',
    soilType: '',
    season: '',
    imageUrl: '',
  };

  // =====================================================
  // PRODUCTS
  // =====================================================

  products: Product[] = [];

  editingProductId: number | null = null;

  productSaving = false;

  productForm: ProductRequest = {
    name: '',
    description: '',
    category: 'SEEDS',
    price: 0,
    stock: 0,
    imageUrl: '',
  };

  categories: ProductCategory[] = [
    'SEEDS',
    'PLANTS',
    'FERTILIZERS',
    'POTS',
    'TOOLS',
  ];

  // =====================================================
  // ARTICLES
  // =====================================================

  articles: Article[] = [];

  editingArticleId: number | null = null;

  articleSaving = false;

  articleForm = {
    title: '',
    content: '',
    category: '',
    imageUrl: '',
  };

  // =====================================================
  // ORDER
  // =====================================================

  orders: AdminOrder[] = [];

  orderLoading = false;

  selectedOrder: AdminOrder | null = null;

  orderPage = 0;
  orderPageSize = 10;
  orderTotalPages = 0;
  orderTotalElements = 0;

  selectedOrderStatus: OrderStatus | '' = '';
  orderStatuses: OrderStatus[] = [
    'PLACED',
    'CONFIRMED',
    'SHIPPED',
    'DELIVERED',
    'CANCELLED',
  ];

  orderSearchTerm = '';

  // =====================================================
  // INIT
  // =====================================================

  ngOnInit(): void {
    this.loadPlants();

    this.loadProducts();

    this.loadArticles();

    this.loadOrders();

    this.loadDashboardStats();
  }

  // =====================================================
  // PLANT METHODS
  // =====================================================

  loadPlants(): void {
    this.plantService.getPlants(0, 100).subscribe({
      next: (response) => {
        this.plants = response.content;
      },

      error: (error) => {
        console.error('Failed to load plants', error);
      },
    });
  }

  savePlant(): void {
    if (!this.plantForm.name.trim()) {
      alert('Plant name is required');

      return;
    }

    this.plantSaving = true;

    if (this.editingPlantId !== null) {
      this.adminService
        .updatePlant(this.editingPlantId, this.plantForm)
        .subscribe({
          next: () => {
            alert('Plant updated successfully');

            this.plantSaving = false;

            this.resetPlantForm();

            this.loadPlants();

            this.loadDashboardStats();
          },

          error: (error) => {
            console.error('Failed to update plant', error);

            this.plantSaving = false;

            alert(error.error?.message || 'Unable to update plant');
          },
        });
    } else {
      this.adminService.createPlant(this.plantForm).subscribe({
        next: () => {
          alert('Plant created successfully');

          this.plantSaving = false;

          this.resetPlantForm();

          this.loadPlants();

          this.loadDashboardStats();
        },

        error: (error) => {
          console.error('Failed to create plant', error);

          this.plantSaving = false;

          alert(error.error?.message || 'Unable to create plant');
        },
      });
    }
  }

  editPlant(plant: Plant): void {
    this.editingPlantId = plant.id;

    this.plantForm = {
      name: plant.name,

      category: plant.category,

      description: plant.description,

      sunlight: plant.sunlight,

      wateringFrequency: plant.wateringFrequency,

      soilType: plant.soilType,

      season: plant.season,

      imageUrl: plant.imageUrl,
    };

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }

  deletePlant(id: number): void {
    if (!confirm('Delete this plant?')) {
      return;
    }

    this.adminService.deletePlant(id).subscribe({
      next: () => {
        alert('Plant deleted successfully');

        this.loadPlants();

        this.loadDashboardStats();
      },

      error: (error) => {
        console.error('Failed to delete plant', error);

        alert(error.error?.message || 'Unable to delete plant');
      },
    });
  }

  resetPlantForm(): void {
    this.editingPlantId = null;

    this.plantForm = {
      name: '',

      category: '',

      description: '',

      sunlight: '',

      wateringFrequency: '',

      soilType: '',

      season: '',

      imageUrl: '',
    };
  }

  // =====================================================
  // PRODUCT METHODS
  // =====================================================

  loadProducts(): void {
    this.productService.getProducts(0, 100).subscribe({
      next: (response) => {
        this.products = response.content;
      },

      error: (error) => {
        console.error('Failed to load products', error);
      },
    });
  }

  saveProduct(): void {
    if (!this.productForm.name.trim()) {
      alert('Product name is required');

      return;
    }

    if (this.productForm.price < 0) {
      alert('Product price cannot be negative');

      return;
    }

    if (this.productForm.stock < 0) {
      alert('Product stock cannot be negative');

      return;
    }

    this.productSaving = true;

    if (this.editingProductId !== null) {
      this.adminService
        .updateProduct(this.editingProductId, this.productForm)
        .subscribe({
          next: () => {
            alert('Product updated successfully');

            this.productSaving = false;

            this.resetProductForm();

            this.loadProducts();

            this.loadDashboardStats();
          },

          error: (error) => {
            console.error('Failed to update product', error);

            this.productSaving = false;

            alert(error.error?.message || 'Unable to update product');
          },
        });
    } else {
      this.adminService.createProduct(this.productForm).subscribe({
        next: () => {
          alert('Product created successfully');

          this.productSaving = false;

          this.resetProductForm();

          this.loadProducts();

          this.loadDashboardStats();
        },

        error: (error) => {
          console.error('Failed to create product', error);

          this.productSaving = false;

          alert(error.error?.message || 'Unable to create product');
        },
      });
    }
  }

  editProduct(product: Product): void {
    this.editingProductId = product.id;

    this.productForm = {
      name: product.name,

      description: product.description,

      category: product.category,

      price: product.price,

      stock: product.stock,

      imageUrl: product.imageUrl,
    };

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }

  deleteProduct(id: number): void {
    if (!confirm('Delete this product?')) {
      return;
    }

    this.adminService.deleteProduct(id).subscribe({
      next: () => {
        alert('Product deleted successfully');

        this.loadProducts();

        this.loadDashboardStats();
      },

      error: (error) => {
        console.error('Failed to delete product', error);

        alert(error.error?.message || 'Unable to delete product');
      },
    });
  }

  resetProductForm(): void {
    this.editingProductId = null;

    this.productForm = {
      name: '',

      description: '',

      category: 'SEEDS',

      price: 0,

      stock: 0,

      imageUrl: '',
    };
  }

  // =====================================================
  // ARTICLE METHODS
  // =====================================================

  loadArticles(): void {
    this.articleService.getArticles(0, 100).subscribe({
      next: (response) => {
        this.articles = response.content;
      },

      error: (error) => {
        console.error('Failed to load articles', error);
      },
    });
  }

  saveArticle(): void {
    if (!this.articleForm.title.trim()) {
      alert('Article title is required');

      return;
    }

    if (!this.articleForm.content.trim()) {
      alert('Article content is required');

      return;
    }

    this.articleSaving = true;

    if (this.editingArticleId !== null) {
      this.articleService
        .updateArticle(this.editingArticleId, this.articleForm)
        .subscribe({
          next: () => {
            alert('Article updated successfully');

            this.articleSaving = false;

            this.resetArticleForm();

            this.loadArticles();

            this.loadDashboardStats();
          },

          error: (error) => {
            console.error('Failed to update article', error);

            this.articleSaving = false;

            alert(error.error?.message || 'Unable to update article');
          },
        });
    } else {
      this.articleService.createArticle(this.articleForm).subscribe({
        next: () => {
          alert('Article created successfully');

          this.articleSaving = false;

          this.resetArticleForm();

          this.loadArticles();

          this.loadDashboardStats();
        },

        error: (error) => {
          console.error('Failed to create article', error);

          this.articleSaving = false;

          alert(error.error?.message || 'Unable to create article');
        },
      });
    }
  }

  editArticle(article: Article): void {
    this.editingArticleId = article.id;

    this.articleForm = {
      title: article.title,

      content: article.content,

      category: article.category,

      imageUrl: article.imageUrl,
    };

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }

  deleteArticle(id: number): void {
    if (!confirm('Delete this article?')) {
      return;
    }

    this.articleService.deleteArticle(id).subscribe({
      next: () => {
        alert('Article deleted successfully');

        this.loadArticles();

        this.loadDashboardStats();
      },

      error: (error) => {
        console.error('Failed to delete article', error);

        alert(error.error?.message || 'Unable to delete article');
      },
    });
  }

  resetArticleForm(): void {
    this.editingArticleId = null;

    this.articleForm = {
      title: '',

      content: '',

      category: '',

      imageUrl: '',
    };
  }

  // =====================================================
  // DASHBOARD STATISTICS
  // =====================================================

  loadDashboardStats(): void {
    // Products
    this.productService.getProducts(0, 1).subscribe({
      next: (response) => {
        this.productCount = response.totalElements;
      },
      error: (error) => {
        console.error('Failed to load product count', error);
      },
    });

    // Plants
    this.plantService.getPlants(0, 1).subscribe({
      next: (response) => {
        this.plantCount = response.totalElements;
      },
      error: (error) => {
        console.error('Failed to load plant count', error);
      },
    });

    // Articles
    this.articleService.getArticles(0, 1).subscribe({
      next: (response) => {
        this.articleCount = response.totalElements;
      },
      error: (error) => {
        console.error('Failed to load article count', error);
      },
    });

    // Orders
    this.adminOrderService.getAllOrders().subscribe({
      next: (orders) => {
        this.orderCount = orders.content.length;
      },
      error: (error) => {
        console.error('Failed to load order count', error);
      },
    });
  }

  // loadOrders(): void {
  //   this.orderLoading = true;

  //   const status = this.selectedOrderStatus || undefined;

  //   this.adminOrderService
  //     .getAllOrders(this.orderPage, this.orderPageSize, status)
  //     .subscribe({
  //       next: (response) => {
  //         this.orders = response.content;

  //         this.orderTotalPages = response.totalPages;
  //         this.orderTotalElements = response.totalElements;

  //         this.orderLoading = false;
  //       },

  //       error: (error) => {
  //         console.error('Failed to load admin orders', error);

  //         this.orderLoading = false;
  //       },
  //     });
  // }
  loadOrders(): void {
    this.orderLoading = true;

    const keyword = this.orderSearchTerm.trim();
    const status = this.selectedOrderStatus || undefined;

    this.adminOrderService
      .getAllOrders(this.orderPage, this.orderPageSize, keyword, status)
      .subscribe({
        next: (response) => {
          this.orders = response.content;

          this.orderTotalPages = response.totalPages;
          this.orderTotalElements = response.totalElements;

          this.orderLoading = false;
        },

        error: (error) => {
          console.error('Failed to load admin orders', error);

          this.orderLoading = false;
        },
      });
  }

  updateOrderStatus(order: AdminOrder, status: OrderStatus): void {
    this.adminOrderService.updateStatus(order.orderId, status).subscribe({
      next: (updatedOrder) => {
        const index = this.orders.findIndex(
          (item) => item.orderId === updatedOrder.orderId,
        );

        if (index !== -1) {
          this.orders[index] = updatedOrder;
        }

        if (this.selectedOrder?.orderId === updatedOrder.orderId) {
          this.selectedOrder = updatedOrder;
        }
      },

      error: (error) => {
        console.error('Failed to update order status', error);

        alert(error.error?.message || 'Unable to update order status');
      },
    });
  }

  viewOrder(order: AdminOrder): void {
    this.selectedOrder = order;
  }

  closeOrder(): void {
    this.selectedOrder = null;
  }

  getAvailableStatuses(order: AdminOrder): OrderStatus[] {
    switch (order.status) {
      case 'PLACED':
        return ['PLACED', 'CONFIRMED', 'CANCELLED'];

      case 'CONFIRMED':
        return ['CONFIRMED', 'SHIPPED', 'CANCELLED'];

      case 'SHIPPED':
        return ['SHIPPED', 'DELIVERED'];

      case 'DELIVERED':
        return ['DELIVERED'];

      case 'CANCELLED':
        return ['CANCELLED'];

      default:
        return [order.status];
    }
  }

  // searchOrders(): void {
  //   this.orderPage = 0;

  //   const keyword = this.orderSearchTerm.trim();

  //   if (!keyword) {
  //     this.loadOrders();
  //     return;
  //   }

  //   this.orderLoading = true;

  //   this.adminOrderService
  //     .searchOrders(keyword, this.orderPage, this.orderPageSize)
  //     .subscribe({
  //       next: (response) => {
  //         this.orders = response.content;
  //         this.orderTotalPages = response.totalPages;
  //         this.orderTotalElements = response.totalElements;
  //         this.orderLoading = false;
  //       },
  //       error: (error) => {
  //         console.error('Failed to search orders', error);
  //         this.orderLoading = false;
  //       },
  //     });
  // }

  filterOrders(): void {
    this.orderPage = 0;
    this.loadOrders();
  }
  goToOrderPage(page: number): void {
    if (page < 0 || page >= this.orderTotalPages) {
      return;
    }

    this.orderPage = page;
    this.loadOrders();
  }
}
