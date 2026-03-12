import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { BRAND } from "../theme";
import "../fonts";

export const ValueScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Animated counter: 0 → 2
  const counterValue = interpolate(frame, [0, 1.2 * fps], [0, 2], {
    extrapolateRight: "clamp",
  });

  // "hours" label
  const labelOpacity = interpolate(frame, [0.5 * fps, 1.0 * fps], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Main text line
  const textOpacity = interpolate(frame, [1.5 * fps, 2.2 * fps], [0, 1], {
    extrapolateRight: "clamp",
  });
  const textY = interpolate(frame, [1.5 * fps, 2.2 * fps], [30, 0], {
    extrapolateRight: "clamp",
  });

  // Sub text
  const subOpacity = interpolate(frame, [2.5 * fps, 3.2 * fps], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: BRAND.navy,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Large counter */}
      <div style={{ display: "flex", alignItems: "baseline", gap: 16 }}>
        <span
          style={{
            fontFamily: "Clash Display",
            fontWeight: 700,
            fontSize: 180,
            color: BRAND.accent,
            lineHeight: 1,
          }}
        >
          {Math.round(counterValue)}
        </span>
        <span
          style={{
            fontFamily: "Clash Display",
            fontWeight: 600,
            fontSize: 72,
            color: BRAND.cream,
            opacity: labelOpacity,
          }}
        >
          hours
        </span>
      </div>

      {/* Saved text */}
      <div
        style={{
          opacity: textOpacity,
          transform: `translateY(${textY}px)`,
          marginTop: 20,
        }}
      >
        <span
          style={{
            fontFamily: "Clash Display",
            fontWeight: 600,
            fontSize: 48,
            color: BRAND.cream,
          }}
        >
          saved every single run
        </span>
      </div>

      {/* Sub message */}
      <div
        style={{
          opacity: subOpacity,
          marginTop: 32,
        }}
      >
        <span
          style={{
            fontFamily: "General Sans",
            fontWeight: 400,
            fontSize: 28,
            color: BRAND.warm,
          }}
        >
          This workflow runs while you sleep.
        </span>
      </div>
    </AbsoluteFill>
  );
};
