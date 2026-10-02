import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PlantService } from '../../../core/services/plant.service';
import { Plant } from '../../../core/models/plant';
import { NavbarComponent } from '../../../shared/navbar/navbar.component';

@Component({
  selector: 'app-plant-detail',
  standalone: true,
  imports: [RouterLink,
    NavbarComponent],
  templateUrl: './plant-detail.component.html',
  styleUrl: './plant-detail.component.css'
})
export class PlantDetailComponent implements OnInit {
    private route = inject(ActivatedRoute);
  private plantService = inject(PlantService);

  plant?: Plant;
  loading = true;
  error = false;

  ngOnInit(): void {

    const id = Number(
      this.route.snapshot.paramMap.get('id')
    );

    this.loadPlant(id);
  }

  loadPlant(id: number): void {

    this.loading = true;

    this.plantService.getPlantById(id).subscribe({

      next: (plant:any) => {
        this.plant = plant;
        this.loading = false;
      },

      error: error => {
        console.error('Failed to load plant', error);
        this.error = true;
        this.loading = false;
      }

    });
  }
}
