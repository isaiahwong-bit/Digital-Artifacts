import { AbsoluteFill, useVideoConfig } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { IntroScene } from "./scenes/IntroScene";
import { ProblemScene } from "./scenes/ProblemScene";
import { WorkflowScene } from "./scenes/WorkflowScene";
import { ValueScene } from "./scenes/ValueScene";
import { OutroScene } from "./scenes/OutroScene";
import "./fonts";

export const AutomationVideo: React.FC = () => {
  const { fps } = useVideoConfig();

  const transitionDuration = Math.round(0.5 * fps); // 15 frames = 0.5s fade

  return (
    <AbsoluteFill>
      <TransitionSeries>
        {/* Scene 1: Branded Intro — 3 seconds */}
        <TransitionSeries.Sequence durationInFrames={3 * fps}>
          <IntroScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: transitionDuration })}
        />

        {/* Scene 2: Problem Statement — 5 seconds */}
        <TransitionSeries.Sequence durationInFrames={5 * fps}>
          <ProblemScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: transitionDuration })}
        />

        {/* Scene 3: Workflow Screen Recording — 15 seconds */}
        <TransitionSeries.Sequence durationInFrames={15 * fps}>
          <WorkflowScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: transitionDuration })}
        />

        {/* Scene 4: Value Proposition — 5 seconds */}
        <TransitionSeries.Sequence durationInFrames={5 * fps}>
          <ValueScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: transitionDuration })}
        />

        {/* Scene 5: Outro CTA — 3 seconds */}
        <TransitionSeries.Sequence durationInFrames={3 * fps}>
          <OutroScene />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
