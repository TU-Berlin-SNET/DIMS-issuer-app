import React from "react";
import { View } from "react-native";
import Svg, { Rect, Text } from "react-native-svg";

const RED = "#ff5050";
const WHITE = "#fefefe";

const DIMSLogo = ({ style = { width: 50, height: 50 } }) => {
  return (
    <View style={style}>
      <Svg width="100%" height="100%" viewBox="0 0 100 100">
        <Rect
          x={0}
          y={0}
          width={50}
          height={50}
          stroke={WHITE}
          strokeWidth={5}
          fill={RED}
        />
        <Text
          x={25}
          y={35}
          fill="#fefefe"
          fontSize={28}
          fontWeight="bold"
          textAnchor="middle"
        >
          D
        </Text>
        <Rect
          x={50}
          y={0}
          width={50}
          height={50}
          stroke={WHITE}
          strokeWidth={5}
          fill={RED}
        />
        <Text
          x={75}
          y={35}
          fill="#fefefe"
          fontSize={28}
          fontWeight="bold"
          textAnchor="middle"
        >
          I
        </Text>
        <Rect
          x={0}
          y={50}
          width={50}
          height={50}
          stroke={WHITE}
          strokeWidth={5}
          fill={RED}
        />
        <Text
          x={25}
          y={85}
          fill="#fefefe"
          fontSize={28}
          fontWeight="bold"
          textAnchor="middle"
        >
          M
        </Text>
        <Rect
          x={50}
          y={50}
          width={50}
          height={50}
          stroke={WHITE}
          strokeWidth={5}
          fill={RED}
        />
        <Text
          x={75}
          y={85}
          fill="#fefefe"
          fontSize={28}
          fontWeight="bold"
          textAnchor="middle"
        >
          S
        </Text>
      </Svg>
    </View>
  );
};

export default DIMSLogo;
