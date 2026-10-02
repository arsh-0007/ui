import { Component, inject, OnInit } from '@angular/core';
import { Plant } from '../../../core/models/plant';
import { PlantService } from '../../../core/services/plant.service';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../../../shared/navbar/navbar.component';

@Component({
  selector: 'app-plant-list',
  standalone: true,
  imports: [FormsModule, RouterLink, NavbarComponent],
  templateUrl: './plant-list.component.html',
  styleUrl: './plant-list.component.css',
})
export class PlantListComponent implements OnInit {
  private plantService = inject(PlantService);

  plants: Plant[] = [];

  searchText = '';

  loading = false;

  currentPage = 0;
  pageSize = 8;

  totalPages = 0;
  totalElements = 0;

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, index) => index);
  }

  ngOnInit(): void {
    this.loadPlants();
  }

  loadPlants(): void {
    this.loading = true;

    this.plantService.getPlants(this.currentPage, this.pageSize).subscribe({
      next: (response) => {
        this.plants = response.content;

        this.totalPages = response.totalPages;
        this.totalElements = response.totalElements;

        this.loading = false;
      },
      error: (error) => {
        console.error('Failed to load plants', error);
        this.plants = [];
        this.loading = false;
      },
    });
  }

  search(): void {
    if (!this.searchText.trim()) {
      this.loadPlants();
      return;
    }

    this.plantService.searchPlants(this.searchText).subscribe({
      next: (data: any) => {
        this.plants = data;
      },

      error: (error: any) => {
        console.error('Search failed', error);
      },
    });
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.loadPlants();
    }
  }

  previousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadPlants();
    }
  }

  goToPage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.loadPlants();
    }
  }
}
