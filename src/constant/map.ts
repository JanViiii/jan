export interface PoiItem {
    "id": string,
    "name": string,
    "type": string,
    "location": number[],
    "address": string,
    "tel": string,
    "distance": any,
    "shopinfo": string
}

export interface PoiList {
    count: number
    pageIndex: number
    pageSize: number
    pois: PoiItem[]
}

export interface StepItem {
    action: string
    assistant_action: string
    instruction: string
    orientation: string
    road: string
    distance: number
}

export interface RouteItem {
    distance: number
    time: number
    policy: string
    steps: StepItem[]
}

export interface DrivingResp {
    routes: RouteItem[]
}