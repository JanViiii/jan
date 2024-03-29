import React, { useState } from "react";
import { Select, Row, Typography, Toast } from "@douyinfe/semi-ui";
import { useGlobalStore } from "@/store";
import debounce from "lodash-es/debounce";
import { PoiItem, PoiList } from "@/constant/map";
import { processCallback } from "@/util";
import "./index.scss";

interface _PlaceSearch {
  value: any;
  onChange: (value: any) => void;
  placeholder: string;
  label: string;
}

const PlaceSearch: React.FC<_PlaceSearch> = (props) => {
  const { value, onChange, placeholder, label } = props;
  const mapCore = useGlobalStore((state) => state.mapCore);
  const [options, setOptions] = useState<PoiItem[]>([]);
  const [loading, setLoading] = useState(false);

  const onSearch = debounce((keyword: string) => {
    if (keyword && !loading) {
      setLoading(true);
      mapCore?.mapSearch.search(
        keyword,
        (status: string, response: { poiList: PoiList }) => {
          processCallback(status, response)
            .then((resp) => {
              const { poiList } = resp;
              setOptions(
                poiList?.pois.map((i) => ({
                  label: (
                    <Row type="flex" style={{ flexDirection: "column" }}>
                      <div>{i.name}</div>
                      <Typography.Text
                        style={{
                          fontSize: 12,
                          color: "var(--semi-color-text-2)",
                          maxWidth: 400,
                        }}
                        ellipsis={{ showTooltip: true }}
                      >
                        {i.address}
                      </Typography.Text>
                    </Row>
                  ),
                  value: `${i.id}_${i.location.toString()}`,
                  ...i,
                }))
              );
            })
            .catch((err) => {
              Toast.error(`查询错误，${err.message}`);
            })
            .finally(() => {
              setLoading(false);
            });
        }
      );
    }
  }, 200);

  const handleChange = (value: PoiItem) => {
    onChange?.(value);
    mapCore?.locate(value.location);
    mapCore?.addUniqueMark(label, value.location);
  };

  return (
    <Row type="flex" align="middle" className="place-search">
      <Typography.Text>{label}</Typography.Text>
      <Select
        filter
        onChangeWithObject
        loading={loading}
        onSearch={onSearch}
        optionList={options}
        placeholder={placeholder}
        value={value}
        onChange={handleChange as any}
      />
    </Row>
  );
};

export default PlaceSearch;
