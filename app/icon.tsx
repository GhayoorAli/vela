import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#F3EEE6",
          color: "#0C0B0A",
          fontSize: 22,
          fontFamily: "Georgia, serif",
        }}
      >
        V
      </div>
    ),
    size,
  );
}
