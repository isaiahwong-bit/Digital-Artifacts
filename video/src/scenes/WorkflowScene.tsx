import {
  AbsoluteFill,
  Sequence,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  staticFile,
} from "remotion";
import { Video } from "@remotion/media";
import { BRAND } from "../theme";
import "../fonts";

type Callout = {
  text: string;
  startSec: number;
  x: number;
  y: number;
};

const CALLOUTS: Callout[] = [
  { text: "Workflow triggers automatically", startSec: 1, x: 140, y: 80 },
  { text: "Analysing 100 audits from the past 7 days", startSec: 4, x: 140, y: 80 },
  { text: "AI scores, sorts, and summarises", startSec: 8, x: 140, y: 80 },
  { text: "Summary delivered. 2 hours saved.", startSec: 11, x: 140, y: 80 },
];

const CalloutLabel: React.FC<{ text: string; durationFrames: number }> = ({
  text,
  durationFrames,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, 0.3 * fps], [0, 1], {
    extrapolateRight: "clamp",
  });
  const fadeOut = interpolate(
    frame,
    [durationFrames - 0.3 * fps, durationFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const opacity = Math.min(fadeIn, fadeOut);

  const slideX = interpolate(frame, [0, 0.3 * fps], [-20, 0], {
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        opacity,
        transform: `translateX(${slideX}px)`,
        backgroundColor: "rgba(0, 200, 83, 0.95)",
        padding: "12px 24px",
        borderRadius: 8,
        display: "inline-flex",
        alignItems: "center",
        gap: 10,
      }}
    >
      <div
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          backgroundColor: BRAND.navy,
        }}
      />
      <span
        style={{
          fontFamily: "General Sans",
          fontWeight: 500,
          fontSize: 22,
          color: BRAND.navy,
        }}
      >
        {text}
      </span>
    </div>
  );
};

export const WorkflowScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Fade in the whole scene
  const sceneOpacity = interpolate(frame, [0, 0.4 * fps], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Browser chrome scale-in
  const chromeScale = interpolate(frame, [0, 0.5 * fps], [0.95, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: BRAND.navy,
        justifyContent: "center",
        alignItems: "center",
        opacity: sceneOpacity,
      }}
    >
      {/* Browser chrome frame */}
      <div
        style={{
          width: 1680,
          transform: `scale(${chromeScale})`,
          borderRadius: 16,
          overflow: "hidden",
          boxShadow: "0 30px 80px rgba(0,0,0,0.5)",
          border: `1px solid rgba(255,255,255,0.1)`,
        }}
      >
        {/* Browser title bar */}
        <div
          style={{
            height: 48,
            backgroundColor: "#0F1923",
            display: "flex",
            alignItems: "center",
            padding: "0 20px",
            gap: 8,
          }}
        >
          <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#FF5F57" }} />
          <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#FEBC2E" }} />
          <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#28C840" }} />
          <div
            style={{
              marginLeft: 20,
              flex: 1,
              height: 28,
              backgroundColor: "rgba(255,255,255,0.06)",
              borderRadius: 6,
              display: "flex",
              alignItems: "center",
              paddingLeft: 14,
            }}
          >
            <span
              style={{
                fontFamily: "General Sans",
                fontSize: 13,
                color: BRAND.warm,
              }}
            >
              n8n workflow — audit-analysis
            </span>
          </div>
        </div>

        {/* Video content */}
        <div style={{ position: "relative" }}>
          <Video
            src={staticFile("n8n-workflow.mp4")}
            style={{
              width: "100%",
              display: "block",
            }}
            muted
          />
        </div>
      </div>

      {/* Callout labels */}
      {CALLOUTS.map((callout, i) => {
        const startFrame = Math.round(callout.startSec * fps);
        const nextStart =
          i < CALLOUTS.length - 1
            ? Math.round(CALLOUTS[i + 1].startSec * fps)
            : Math.round(13.5 * fps); // end of video
        const duration = nextStart - startFrame;

        return (
          <Sequence
            key={i}
            from={startFrame}
            durationInFrames={duration}
            premountFor={Math.round(0.5 * fps)}
            layout="none"
          >
            <div
              style={{
                position: "absolute",
                bottom: callout.y,
                left: callout.x,
              }}
            >
              <CalloutLabel text={callout.text} durationFrames={duration} />
            </div>
          </Sequence>
        );
      })}

      {/* "Live" indicator */}
      <div
        style={{
          position: "absolute",
          top: 50,
          right: 80,
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <div
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            backgroundColor: BRAND.accent,
          }}
        />
        <span
          style={{
            fontFamily: "General Sans",
            fontSize: 14,
            color: BRAND.warm,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
          }}
        >
          Live Workflow
        </span>
      </div>
    </AbsoluteFill>
  );
};
