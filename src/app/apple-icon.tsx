import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180,
};
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#131313",
          fontFamily: "Georgia, serif",
        }}
      >
        <span
          style={{
            fontSize: 120,
            fontWeight: 700,
            color: "#f2ca50",
            lineHeight: 1,
          }}
        >
          N
        </span>
      </div>
    ),
    { ...size }
  );
}
