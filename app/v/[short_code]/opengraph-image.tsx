import { ImageResponse } from "next/og"
import { createClient } from "@/lib/supabase/server"

export const runtime = "edge"
export const alt = "Valentine Invitation"
export const size = {
    width: 1200,
    height: 630,
}
export const contentType = "image/png"

export default async function Image({ params }: { params: { short_code: string } }) {
    const { short_code } = params
    const supabase = await createClient()

    const { data: invite } = await supabase
        .from("invites")
        .select("recipient_name, message")
        .eq("short_code", short_code)
        .single()

    const recipientName = invite?.recipient_name || "Someone Special"

    return new ImageResponse(
        (
            <div
                style={{
                    height: "100%",
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#fff1f2", // Light pink background
                    position: "relative",
                    overflow: "hidden",
                }}
            >
                {/* Decorative background elements */}
                <div style={{ position: "absolute", top: -50, left: -50, fontSize: "100px", opacity: 0.1 }}>💖</div>
                <div style={{ position: "absolute", bottom: -50, right: -50, fontSize: "100px", opacity: 0.1 }}>💖</div>
                <div style={{ position: "absolute", top: 100, right: 100, fontSize: "60px", opacity: 0.1, transform: "rotate(15deg)" }}>✨</div>
                <div style={{ position: "absolute", bottom: 100, left: 100, fontSize: "60px", opacity: 0.1, transform: "rotate(-15deg)" }}>✨</div>

                {/* Outer Glow */}
                <div style={{
                    position: "absolute",
                    width: "800px",
                    height: "800px",
                    backgroundColor: "rgba(255, 77, 77, 0.05)",
                    borderRadius: "50%",
                    filter: "blur(40px)",
                }} />

                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "rgba(255, 255, 255, 0.85)",
                        padding: "80px",
                        borderRadius: "50px",
                        border: "10px solid #ff4d4d",
                        boxShadow: "0 30px 60px rgba(0,0,0,0.12)",
                        maxWidth: "90%",
                        position: "relative",
                        zIndex: 10,
                    }}
                >
                    <div style={{ fontSize: "120px", marginBottom: "30px", filter: "drop-shadow(0 10px 10px rgba(0,0,0,0.1))" }}>💌</div>

                    <div
                        style={{
                            fontSize: "50px",
                            fontWeight: "bold",
                            color: "#ff4d4d",
                            textAlign: "center",
                            marginBottom: "15px",
                            fontFamily: "Inter, sans-serif",
                            letterSpacing: "4px",
                            textTransform: "uppercase",
                        }}
                    >
                        Private Invitation
                    </div>

                    <div
                        style={{
                            fontSize: "90px",
                            fontWeight: "900",
                            color: "#1a1a1a",
                            textAlign: "center",
                            fontFamily: "Outfit, sans-serif",
                            letterSpacing: "-3px",
                            lineHeight: 1.1,
                        }}
                    >
                        For {recipientName}
                    </div>

                    <div
                        style={{
                            marginTop: "40px",
                            padding: "15px 40px",
                            backgroundColor: "#ff4d4d",
                            borderRadius: "100px",
                            color: "white",
                            fontSize: "30px",
                            fontWeight: "bold",
                            fontFamily: "Inter, sans-serif",
                        }}
                    >
                        Open your message
                    </div>
                </div>

                {/* Floating Hearts */}
                <div style={{ position: "absolute", top: "10%", left: "15%", fontSize: "40px", opacity: 0.4 }}>❤️</div>
                <div style={{ position: "absolute", top: "70%", left: "5%", fontSize: "50px", opacity: 0.4 }}>💖</div>
                <div style={{ position: "absolute", top: "20%", left: "85%", fontSize: "45px", opacity: 0.4 }}>💝</div>
                <div style={{ position: "absolute", top: "80%", left: "80%", fontSize: "35px", opacity: 0.4 }}>❤️</div>
            </div>
        ),
        {
            ...size,
        }
    )
}
