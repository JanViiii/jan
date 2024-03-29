import { useRouteStore } from "@/store";
import React from "react";
import { Row } from "@douyinfe/semi-ui";
import "./index.scss";

const RouteTip: React.FC = () => {
  const { show, total_distance, total_time, policy, steps } = useRouteStore();

  const distance = `${(total_distance / 1000).toFixed(2)}km`;
  const time = `${(total_time / (60 * 60)).toFixed(2)}h`;

  return (
    show && (
      <Row className="route-tip">
        <div>已为您规划好「{policy}」路线</div>
        <Row type="flex" align="middle">
          预估距离：{distance} 预计用时：{time}
        </Row>

        <div className="steps">
          {steps?.map((i, index) => (
            <Row key={i.instruction}>
              {index + 1}. {i.instruction}
            </Row>
          ))}
        </div>
      </Row>
    )
  );
};

export default RouteTip;
