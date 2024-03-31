import { DrivingResp } from "@/constant/map";
import { processCallback } from "@/util";
import AMapLoader from "@amap/amap-jsapi-loader";

interface MapCoreConstructor {
    target: string
}

export class MapCore {
    target: string;
    AMap: any;
    mapInstance?: any;
    mapSearch?: any;
    mapGeo?: any
    mapDriving?: any

    markMap: Record<string, any>;
    groupMarkMap: Record<string, any>;

    constructor(params: MapCoreConstructor) {
        this.target = params.target;
        this.markMap = {};
        this.groupMarkMap = {};

        this.init();
    }

    async init() {
        (window as any)._AMapSecurityConfig = {
            securityJsCode: import.meta.env.VITE_SECRET,
        };

        AMapLoader.load({
            key: import.meta.env.VITE_KEY, //申请好的 Web 端开发者 Key，首次调用 load 时必填
            version: "2.0",
            plugins: ['AMap.PlaceSearch', 'AMap.Geolocation', 'AMap.Driving'],
        }).then((AMap) => {
            this.AMap = AMap;
            this.mapSearch = new AMap.PlaceSearch({
                city: "", //城市
                type: "", //数据类别
                pageSize: 40, //每页结果数,默认10
                pageIndex: 1, //请求页码，默认1
                extensions: "base", //返回信息详略，默认为base（基本信息）
            });
            this.mapGeo = new AMap.Geolocation({
                enableHighAccuracy: true, // 是否使用高精度定位，默认：true
                timeout: 10000, // 设置定位超时时间，默认：无穷大
                offset: [10, 20],  // 定位按钮的停靠位置的偏移量
                zoomToAccuracy: true,  //  定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
                position: 'RB' //  定位按钮的排放位置,  RB表示右下
            })
            this.mapInstance = new AMap.Map(this.target);
            this.mapDriving = new AMap.Driving({
                policy: 0, //驾车路线规划策略，0是速度优先的策略
                map: this.mapInstance
            })
            // 获取定位
            this.mapGeo.getCurrentPosition((status: string, result: any) => {
                processCallback(status, result)
                    .then(res => {
                        this.locate(res.position)
                    })
                    .catch(err => {
                        console.error(err);
                    })
            });


        }).catch((e) => {
            console.log(e);
        });
    }

    locate(position: any) {
        this.mapInstance.panTo(position)
    }

    createMark(label: string, position: any,) {
        const newMark = new this.AMap.Marker({
            position: position,
            offset: new this.AMap.Pixel(-10, -10),
            title: label,
            label: {
                content: label
            },
        })
        newMark.setMap(this.mapInstance)
        return newMark;
    }

    addUniqueMark(label: string, position: any) {
        // 移除旧的mark
        const oldMark = this.markMap[label];
        if (oldMark instanceof this.AMap.Marker) {
            oldMark.setMap(null);
            delete this.markMap[label]
        }
        this.markMap[label] = this.createMark(label, position);
    }

    addGroupMark(groupKey: string, positionList: { name: string, position: number[] }[]) {
        // 移除旧的mark group
        const oldGroup = this.groupMarkMap[groupKey];
        if (Array.isArray(oldGroup)) {
            oldGroup.forEach(oldMark => oldMark.setMap(null));
            delete this.groupMarkMap[groupKey];
        }
        this.groupMarkMap[groupKey] = positionList.map(item => this.createMark(item.name, item.position))

    }

    showRoute(groupKey: string): Promise<DrivingResp> {
        return new Promise((rs, rj) => {
            const points = this.groupMarkMap[groupKey]?.map((i: any) => i._position);
            const origin = points.shift();
            const end = points.pop();
            const waypoints = points;

            this.mapDriving.search(
                origin,
                end,
                { waypoints },
                (status: string, response: any) => {
                    processCallback(status, response)
                        .then((res) => {
                            rs(res)
                        })
                        .catch((err) => {
                            rj(err);
                        })
                }
            );
        })
    }
}