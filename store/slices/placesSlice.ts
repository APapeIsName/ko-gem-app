import { create } from 'zustand';
import { AreaCodeItem, PlaceCity, PopularPlace, RecommendPlace } from '../types/places';

interface PlacesState {
  recommendedPlaces: RecommendPlace[];
  popularPlaces: PopularPlace[];
//   filterOptions: PlaceFilterOptions;
//   setFilterOptions: (options: PlaceFilterOptions) => void;
  placeCity: PlaceCity;
  setPlaceCity: (city: PlaceCity) => void;
  // API 지역 코드 관련
  areaCodes: AreaCodeItem[];
  selectedAreaCode: AreaCodeItem | null;
  setAreaCodes: (codes: AreaCodeItem[]) => void;
  setSelectedAreaCode: (areaCode: AreaCodeItem | null) => void;
}   

export const usePlacesStore = create<PlacesState>((set) => ({
  recommendedPlaces: [],
  popularPlaces: [],
  placeCity: PlaceCity.BUSAN,
  setPlaceCity: (city) => set({ placeCity: city }),
  // API 지역 코드 관련
  areaCodes: [],
  selectedAreaCode: null,
  setAreaCodes: (codes) => set({ areaCodes: codes }),
  setSelectedAreaCode: (areaCode) => set({ selectedAreaCode: areaCode }),
}));

export default usePlacesStore;