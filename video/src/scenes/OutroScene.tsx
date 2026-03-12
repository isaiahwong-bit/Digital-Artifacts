import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { BRAND } from "../theme";
import "../fonts";

export const OutroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // CTA text
  const ctaOpacity = interpolate(frame, [0, 0.5 * fps], [0, 1], {
    extrapolateRight: "clamp",
  });
  const ctaY = interpolate(frame, [0, 0.5 * fps], [30, 0], {
    extrapolateRight: "clamp",
  });

  // URL
  const urlOpacity = interpolate(frame, [0.5 * fps, 1.0 * fps], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Green accent line
  const lineWidth = interpolate(frame, [0.3 * fps, 1.2 * fps], [0, 300], {
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
      {/* CTA */}
      <div
        style={{
          opacity: ctaOpacity,
          transform: `translateY(${ctaY}px)`,
        }}
      >
        <span
          style={{
            fontFamily: "Clash Display",
            fontWeight: 600,
            fontSize: 52,
            color: BRAND.cream,
            textAlign: "center",
            display: "block",
          }}
        >
          See how we can automate
          <br />
          your business
        </span>
      </div>

      {/* Green line */}
      <div
        style={{
          width: lineWidth,
          height: 3,
          backgroundColor: BRAND.accent,
          marginTop: 32,
          marginBottom: 32,
          borderRadius: 2,
        }}
      />

      {/* URL */}
      <div style={{ opacity: urlOpacity }}>
        <span
          style={{
            fontFamily: "General Sans",
            fontWeight: 500,
            fontSize: 26,
            color: BRAND.accent,
            letterSpacing: "0.02em",
          }}
        >
          digitalartifacts.com.au
        </span>
      </div>

      {/* Small logo */}
      <div
        style={{
          position: "absolute",
          bottom: 60,
          opacity: urlOpacity,
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            border: `2px solid ${BRAND.accent}`,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <span
            style={{
              fontFamily: "Clash Display",
              fontWeight: 700,
              fontSize: 18,
              color: BRAND.cream,
            }}
          >
            D
          </span>
        </div>
        <span
          style={{
            fontFamily: "General Sans",
            fontSize: 16,
            color: BRAND.warm,
          }}
        >
          Digital Artifacts
        </span>
      </div>
    </AbsoluteFill>
  );
};
