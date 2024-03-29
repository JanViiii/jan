import { create } from 'zustand'
import { MapCore } from '../core/map'
import { StepItem } from '@/constant/map';

interface GlobalStoreState {
    mapCore?: MapCore
    setMapCore: (core: MapCore) => void;
    condition: Record<string, any>;
    updateCondition: (values: Record<string, any>) => void
}

export const useGlobalStore = create<GlobalStoreState>((set) => ({
    mapCore: undefined,
    setMapCore: (mapCore: MapCore) => set({ mapCore }),
    condition: {},
    updateCondition: (values) => set((state) => ({ condition: { ...state.condition, ...values } })),
}))

interface RouteStoreState {
    show: boolean,
    total_distance: number,
    total_time: number,
    policy: string
    steps: StepItem[]
    setRouteState?: (values: Partial<RouteStoreState>) => void
}
export const useRouteStore = create<RouteStoreState>((set) => ({
    show: false,
    total_distance: 0,
    total_time: 0,
    policy: '',
    steps: [],
    setRouteState: (values: Partial<RouteStoreState>) => set(values)
}))
