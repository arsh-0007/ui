export interface Plant {
  id: number;

  name: string;

  category: string;

  description: string;

  sunlight: string;

  wateringFrequency: string;

  soilType: string;

  season: string;

  imageUrl: string;
}

export interface PlantRequest {
  name: string;

  category: string;

  description: string;

  sunlight: string;

  wateringFrequency: string;

  soilType: string;

  season: string;

  imageUrl: string;
}
