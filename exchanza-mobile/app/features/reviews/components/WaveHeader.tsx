import { lightColors } from "@/app/components/theme/colors";
import { useTheme } from "@/context/ThemeContext";
import { View } from "react-native";
import Svg, { Path } from "react-native-svg";

export default function WaveHeader() {
  const { theme } = useTheme();
  return (
    <View
      style={{
        width: "100%",
        height: 140,
        overflow: "hidden",
        marginTop: -2, 
      }}
    >
      <Svg
        width="100%"
        height="100%"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none" 
        style={{ position: "absolute", top: 0 }}
      >
        <Path
          fill={theme?.primary || lightColors.primary}
          d="M0,160L80,150C160,140,320,120,480,130C640,140,800,180,960,170C1120,160,1280,120,1360,100L1440,80V0H0Z"
        />
      </Svg>

      <Svg
        width="100%"
        height="100%"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
        style={{ position: "absolute", opacity: 0.3, top: 10 }}
      >
        <Path
          fill={theme?.tagBg || lightColors.tagBg}
          d="M0,200L100,180C200,160,400,120,600,130C800,140,1000,180,1200,170C1300,165,1400,140,1440,120V0H0Z"
        />
      </Svg>
    </View>
  );
}
