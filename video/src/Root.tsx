import { Composition } from "remotion";
import { AutomationVideo } from "./AutomationVideo";

// Total duration calculation:
// 5 scenes: 3s + 5s + 15s + 5s + 3s = 31s raw
// 4 transitions: 4 × 0.5s = 2s overlap
// Net: 31s - 2s = 29s = 870 frames at 30fps
const DURATION_FRAMES = 870;

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="AutomationDemo"
      component={AutomationVideo}
      durationInFrames={DURATION_FRAMES}
      fps={30}
      width={1920}
      height={1080}
    />
  );
};
