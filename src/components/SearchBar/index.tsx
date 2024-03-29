import React, { useState } from "react";
import { useGlobalStore, useRouteStore } from "@/store";
import PlaceSearch from "../PlaceSearch";
import { Button, Row, Toast } from "@douyinfe/semi-ui";
import { ApiService } from "@/service";
import "./index.scss";
import RouteTip from "../RouteTip";

const SearchBar: React.FC = () => {
  const mapCore = useGlobalStore((state) => state.mapCore);
  const condition = useGlobalStore((state) => state.condition);
  const updateCondition = useGlobalStore((state) => state.updateCondition);
  const setRouteState = useRouteStore((state) => state.setRouteState);

  const [loading, setLoading] = useState(false);

  const onClear = () => {
    setRouteState?.({ show: false });
    updateCondition({
      origin: undefined,
      destination: undefined,
    });
  };

  const handleSearch = () => {
    setLoading(true);
    setRouteState?.({ show: false });
    ApiService.getRouteToken({
      origin: condition.origin.name,
      destination: condition.destination.name,
    })
      .then((res) => ApiService.getRouteFromToken(res.token))
      .then((res) => {
        const { path } = res;
        const positionList = path?.map((position, index) => ({
          name: `途径点${index + 1}`,
          position: position?.reverse(),
        }));
        mapCore?.addGroupMark("route", positionList);
        mapCore?.showRoute("route").then((resp) => {
          const targetRoute = resp.routes[0];
          setRouteState?.({
            show: true,
            policy: targetRoute.policy,
            steps: targetRoute.steps,
            total_distance: targetRoute.distance,
            total_time: targetRoute.time,
          });
        });
        mapCore?.locate(positionList[0]?.position);
      })
      .catch((err) => {
        Toast.error(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="search-bar">
      <PlaceSearch
        label="起点"
        placeholder="请输入起点"
        value={condition.origin}
        onChange={(origin) => updateCondition({ origin })}
      />
      <PlaceSearch
        label="终点"
        placeholder="请输入终点"
        value={condition.destination}
        onChange={(destination) => updateCondition({ destination })}
      />
      <Row type="flex" justify="end" style={{ gap: 8 }}>
        <Button onClick={onClear}>重置</Button>
        <Button
          loading={loading}
          theme="solid"
          onClick={handleSearch}
          disabled={!condition.origin || !condition.destination}
        >
          查询路线
        </Button>
      </Row>
      <RouteTip />
    </div>
  );
};

export default SearchBar;
