import { CustomFetch } from "./custom-fetch";
import { RouteResponse } from "./types";

export class ApiService {
    static getRouteToken(payload: { origin: string, destination: string }) {
        return CustomFetch({
            path: '/route',
            method: 'post',
            payload,
        }) as Promise<{ token: string }>
    }

    static getRouteFromToken(token: string) {
        return CustomFetch({
            path: `/route/${token}`,
            method: 'get',
        }) as Promise<RouteResponse>
    }


    // ========================= mock 接口
    static mock500Get() {
        return CustomFetch({
            path: '/mock/route/500',
            method: 'get',
        })
    }
    static mock500Post() {
        return CustomFetch({
            path: '/mock/route/500',
            method: 'post',
        })
    }

    static mockRouteSuccess() {
        return CustomFetch({
            path: '/mock/route/success',
            method: 'get',
        }) as Promise<RouteResponse>
    }

    static mockTokenSuccess() {
        return CustomFetch({
            path: '/mock/route/success',
            method: 'post',
        }) as Promise<{ token: string }>
    }

    static mockInprogress() {
        return CustomFetch({
            path: '/mock/route/inprogress',
            method: 'get',
        })
    }
    static mockFailure() {
        return CustomFetch({
            path: '/mock/route/failure',
            method: 'get',
        })
    }
}