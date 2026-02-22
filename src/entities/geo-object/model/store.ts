import type { Feature } from 'geojson';
import { create } from 'zustand';

interface UIState {
  addMode: boolean;
  tempCoords: [number, number] | null;
  selectedFeature: Feature | null;
  select: (f: Feature | null) => void;
  setAddMode: (v: boolean) => void;
  setTempCoords: (c: [number, number] | null) => void;
}

export const useUIStore = create<UIState>((set) => ({
  selectedFeature: null,
  addMode: false,
  tempCoords: null,
  select: (f) => set({ selectedFeature: f }),
  setAddMode: (v) => set({ addMode: v }),
  setTempCoords: (c) => set({ tempCoords: c }),
}));
