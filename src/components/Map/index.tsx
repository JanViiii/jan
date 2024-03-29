import React, { useEffect } from "react";
import { useGlobalStore } from "@/store";
import { MapCore } from "@/core/map";

const MAP_DOM_ID = "map-container";

const Map: React.FC = () => {
  const mapCore = useGlobalStore((state) => state.mapCore);
  const setMapCore = useGlobalStore((state) => state.setMapCore);

  useEffect(() => {
    if (!mapCore) {
      setMapCore(
        new MapCore({
          target: MAP_DOM_ID,
        })
      );
    }
  }, []);

  return <div id={MAP_DOM_ID}></div>;
};

export default Map;
