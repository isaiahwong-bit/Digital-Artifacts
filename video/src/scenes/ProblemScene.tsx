import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { BRAND } from "../theme";
import "../fonts";

const LINES = [
  "Still reviewing reports manually?",
  "Sorting through audit data by hand?",
  "Spending hours on tasks a workflow could do in minutes?",
];

export const ProblemScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Headline
  const headlineOpacity = interpolate(frame, [0, 0.5 * fps], [0, 1], {
    extrapolateRight: "clamp",
  });
  const headlineY = interpolate(frame, [0, 0.5 * fps], [40, 0], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: BRAND.navy,
        justifyContent: "center",
        alignItems: "center",
        padding: 120,
      }}
    >
      {/* Main headline */}
      <div
        style={{
          opacity: headlineOpacity,
          transform: `translateY(${headlineY}px)`,
          marginBottom: 60,
        }}
      >
        <span
          style={{
            fontFamily: "Clash Display",
            fontWeight: 600,
            fontSize: 56,
            color: BRAND.cream,
            textAlign: "center",
            display: "block",
          }}
        >
          Sound familiar?
        </span>
      </div>

      {/* Pain point lines */}
      <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
        {LINES.map((line, i) => {
          const startFrame = 0.6 * fps + i * 0.7 * fps;
          const opacity = interpolate(
            frame,
            [startFrame, startFrame + 0.4 * fps],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );
          const y = interpolate(
            frame,
            [startFrame, startFrame + 0.4 * fps],
            [25, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );

          return (
            <div
              key={i}
              style={{
                opacity,
                transform: `translateY(${y}px)`,
                display: "flex",
                alignItems: "center",
                gap: 16,
              }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  backgroundColor: BRAND.accent,
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  fontFamily: "General Sans",
                  fontWeight: 400,
                  fontSize: 32,
                  color: BRAND.warm,
                }}
              >
                {line}
              </span>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
