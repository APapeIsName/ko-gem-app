import { create } from 'zustand';
import { PlaceCity, PopularPlace, RecommendPlace } from '../types/places';

interface PlacesState {
  recommendedPlaces: RecommendPlace[];
  popularPlaces: PopularPlace[];
//   filterOptions: PlaceFilterOptions;
//   setFilterOptions: (options: PlaceFilterOptions) => void;
  placeCity: PlaceCity;
  setPlaceCity: (city: PlaceCity) => void;
}   

export const usePlacesStore = create<PlacesState>((set) => ({
  recommendedPlaces: [],
  popularPlaces: [],
  placeCity: PlaceCity.BUSAN,
  setPlaceCity: (city) => set({ placeCity: city }),
}));

export default usePlacesStore;