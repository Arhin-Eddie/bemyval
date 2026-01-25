import { ImageResponse } from "next/og"

export const runtime = "edge"
export const alt = "Valentine - Mischievous Invitations"
export const size = {
    width: 1200,
    height: 630,
}
export const contentType = "image/png"

export default async function Image() {
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
                        border: "10px solid #db2777",
                        boxShadow: "0 30px 60px rgba(0,0,0,0.12)",
                        maxWidth: "90%",
                        position: "relative",
                        zIndex: 10,
                    }}
                >
                    <div style={{ fontSize: "120px", marginBottom: "30px", filter: "drop-shadow(0 10px 10px rgba(0,0,0,0.1))" }}>🏹</div>

                    <div
                        style={{
                            fontSize: "60px",
                            fontWeight: "bold",
                            color: "#db2777",
                            textAlign: "center",
                            marginBottom: "10px",
                            fontFamily: "Inter, sans-serif",
                            textTransform: "uppercase",
                            letterSpacing: "4px",
                        }}
                    >
                        Valentine
                    </div>

                    <div
                        style={{
                            fontSize: "80px",
                            fontWeight: "900",
                            color: "#4a044e",
                            textAlign: "center",
                            fontFamily: "Outfit, sans-serif",
                            letterSpacing: "-2px",
                            lineHeight: 1.1,
                        }}
                    >
                        Mischievous <br /> Invitations
                    </div>

                    <div
                        style={{
                            marginTop: "40px",
                            padding: "15px 40px",
                            backgroundColor: "#db2777",
                            borderRadius: "100px",
                            color: "white",
                            fontSize: "25px",
                            fontWeight: "bold",
                            fontFamily: "Inter, sans-serif",
                        }}
                    >
                        bemyval-theta.vercel.app
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
