import { ImageResponse } from "next/og";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

const size = { width: 1200, height: 630 };

async function getCount(): Promise<number> {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) return 0;
    const sb = createClient(url, key);
    const { data } = await sb.from("signature_count").select("total").maybeSingle();
    return data?.total ?? 0;
  } catch {
    return 0;
  }
}

export async function GET() {
  const count = await getCount();
  const formatted = new Intl.NumberFormat("en-US").format(count);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "#f7f4ee",
          color: "#1a1a1a",
          padding: "80px",
          fontFamily: "Georgia, serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "14px",
            fontSize: "22px",
            letterSpacing: "4px",
            textTransform: "uppercase",
            color: "#8b1818",
          }}
        >
          <div style={{ width: "12px", height: "12px", borderRadius: "9999px", background: "#8b1818" }} />
          Remake Penn Dining
        </div>
        <div
          style={{
            display: "flex",
            fontSize: "128px",
            lineHeight: 1.02,
            marginTop: "40px",
            letterSpacing: "-0.03em",
            fontWeight: 400,
          }}
        >
          We deserve better
        </div>
        <div
          style={{
            display: "flex",
            fontSize: "128px",
            lineHeight: 1.02,
            letterSpacing: "-0.03em",
            fontStyle: "italic",
            color: "#8b1818",
            fontWeight: 400,
          }}
        >
          than this.
        </div>
        <div
          style={{
            marginTop: "auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            borderTop: "1px solid #d6cfbe",
            paddingTop: "24px",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <div style={{ fontSize: "22px", color: "#5a5a5a", fontFamily: "system-ui" }}>
              Signatures
            </div>
            <div style={{ fontSize: "56px", fontWeight: 500, fontVariantNumeric: "tabular-nums" }}>
              {formatted}
            </div>
          </div>
          <div style={{ fontSize: "22px", color: "#5a5a5a", fontFamily: "system-ui" }}>
            remakepenndining.org
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
