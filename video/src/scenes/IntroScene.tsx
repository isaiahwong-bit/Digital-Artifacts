import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { BRAND } from "../theme";
import "../fonts";

export const IntroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Logo "D" circle
  const logoScale = interpolate(frame, [0, 0.8 * fps], [0.5, 1], {
    extrapolateRight: "clamp",
  });
  const logoOpacity = interpolate(frame, [0, 0.5 * fps], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Brand name
  const nameOpacity = interpolate(frame, [0.4 * fps, 0.9 * fps], [0, 1], {
    extrapolateRight: "clamp",
  });
  const nameY = interpolate(frame, [0.4 * fps, 0.9 * fps], [30, 0], {
    extrapolateRight: "clamp",
  });

  // Tagline
  const taglineOpacity = interpolate(frame, [1.0 * fps, 1.5 * fps], [0, 1], {
    extrapolateRight: "clamp",
  });
  const taglineY = interpolate(frame, [1.0 * fps, 1.5 * fps], [20, 0], {
    extrapolateRight: "clamp",
  });

  // Green accent line
  const lineWidth = interpolate(frame, [1.3 * fps, 2.2 * fps], [0, 200], {
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
      {/* Logo circle with "D" */}
      <div
        style={{
          width: 100,
          height: 100,
          borderRadius: "50%",
          border: `3px solid ${BRAND.accent}`,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          opacity: logoOpacity,
          transform: `scale(${logoScale})`,
          marginBottom: 32,
        }}
      >
        <span
          style={{
            fontFamily: "Clash Display",
            fontWeight: 700,
            fontSize: 48,
            color: BRAND.cream,
          }}
        >
          D
        </span>
      </div>

      {/* Brand name */}
      <div
        style={{
          opacity: nameOpacity,
          transform: `translateY(${nameY}px)`,
        }}
      >
        <span
          style={{
            fontFamily: "Clash Display",
            fontWeight: 600,
            fontSize: 64,
            color: BRAND.cream,
            letterSpacing: "-0.02em",
          }}
        >
          Digital Artifacts
        </span>
      </div>

      {/* Green accent line */}
      <div
        style={{
          width: lineWidth,
          height: 3,
          backgroundColor: BRAND.accent,
          marginTop: 20,
          marginBottom: 20,
          borderRadius: 2,
        }}
      />

      {/* Tagline */}
      <div
        style={{
          opacity: taglineOpacity,
          transform: `translateY(${taglineY}px)`,
        }}
      >
        <span
          style={{
            fontFamily: "General Sans",
            fontWeight: 400,
            fontSize: 28,
            color: BRAND.warm,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          Automation Studio
        </span>
      </div>
    </AbsoluteFill>
  );
};
