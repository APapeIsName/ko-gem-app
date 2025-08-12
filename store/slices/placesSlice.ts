import { create } from 'zustand';
import { PlaceCity, PlaceFilterOptions, PopularPlace, RecommendPlace } from '../types/places';

interface PlacesState {
  recommendedPlaces: RecommendPlace[];
  popularPlaces: PopularPlace[];
  filterOptions: PlaceFilterOptions;
  setFilterOptions: (options: PlaceFilterOptions) => void;
}   

export const usePlacesStore = create<PlacesState>((set) => ({
  recommendedPlaces: [],
  popularPlaces: [],
  filterOptions: {
    city: PlaceCity.SEOUL,
    categories: [],
    priceRange: [0, 100000],
    rating: 0,
    distance: 0,
  },
  setFilterOptions: (options) => set({ filterOptions: options }),
}));

export default usePlacesStore;