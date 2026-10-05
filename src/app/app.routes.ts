import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login.component').then(
        (m) => m.LoginComponent,
      ),
  },

  {
    path: 'register',
    loadComponent: () =>
      import('./features/auth/register/register.component').then(
        (m) => m.RegisterComponent,
      ),
  },

  {
    path: 'plants',
    loadComponent: () =>
      import('./features/plants/plant-list/plant-list.component').then(
        (m) => m.PlantListComponent,
      ),
  },
  {
    path: 'plants/:id',
    loadComponent: () =>
      import('./features/plants/plant-detail/plant-detail.component').then(
        (m) => m.PlantDetailComponent,
      ),
  },
  {
    path: 'products',
    loadComponent: () =>
      import('./features/products/product-list/product-list.component').then(
        (m) => m.ProductListComponent,
      ),
  },
  {
    path: 'products/:id',
    loadComponent: () =>
      import('./features/products/product-detail/product-detail.component').then(
        (m) => m.ProductDetailComponent,
      ),
  },
  {
    path: 'orders',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/orders/order-list/order-list.component').then(
        (m) => m.OrderListComponent,
      ),
  },

  {
    path: 'articles',
    loadComponent: () =>
      import('./features/articles/article-list/article-list.component').then(
        (m) => m.ArticleListComponent,
      ),
  },
  {
    path: 'articles/:id',
    loadComponent: () =>
      import('./features/articles/article-detail/article-detail.component').then(
        (m) => m.ArticleDetailComponent,
      ),
  },

  {
    path: 'cart',
    loadComponent: () =>
      import('./features/cart/cart/cart.component').then(
        (m) => m.CartComponent,
      ),
  },

  {
    path: 'about',
    loadComponent: () =>
      import('./features/about/about.component').then((m) => m.AboutComponent),
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./features/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'admin',

    canActivate: [authGuard, adminGuard],

    loadComponent: () =>
      import('./features/admin/admin-dashboard/admin-dashboard.component').then(
        (m) => m.AdminDashboardComponent,
      ),
  },

  {
    path: '',
    redirectTo: 'about',
    pathMatch: 'full',
  },

  {
    path: '**',
    redirectTo: 'plants',
  },
];
