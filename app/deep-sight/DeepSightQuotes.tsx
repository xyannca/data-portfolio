import { useState, useEffect } from "react";

const quotes = [
  "All things follow a law; thus, all things are gateways to the Truth.",
  "Beneath the intricate surface lies a lucid essence.",
  "Emotion is a mist that obscures reality, yet it remains the portal to awakening.",
  "True healing stems from the essence, not from mind.",
  "To perceive is to attain, for it is seen with the heart.",
  "This world is a dreamscape. To reach the source, one must transcendthe illusion of the forms.",
   "What you deeply obsess over harbors a longing you have yet to realize.",
];

export default function DeepSightQuotes() {
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<"rising" | "visible" | "fading">("rising");

  useEffect(() => {
    let t1: ReturnType<typeof setTimeout>;
    let t2: ReturnType<typeof setTimeout>;
    let t3: ReturnType<typeof setTimeout>;

    const IN_TIME = 1000;   // rising time
    const STAY_TIME = 6000; // staying time
    const OUT_TIME = 2000;  // out time

    t1 = setTimeout(() => setPhase("visible"), IN_TIME);
    t2 = setTimeout(() => setPhase("fading"), IN_TIME + STAY_TIME);
    t3 = setTimeout(() => {
    setIndex((prev) => (prev + 1) % quotes.length);
    setPhase("rising");
    }, IN_TIME + STAY_TIME + OUT_TIME);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [index]);

  const getStyle = () => {
    if (phase === "rising") {
      return {
        opacity: 0,
        transform: "translateY(24px)",
        filter: "blur(4px)",
      };
    }
    if (phase === "visible") {
      return {
        opacity: 1,
        transform: "translateY(0px)",
        filter: "blur(0px)",
      };
    }
    // fading
    return {
      opacity: 0,
      transform: "translateY(-8px)",
      filter: "blur(2px)",
    };
  };

  return (
    <div
      style={{
        minHeight: "150px",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        padding: "2rem",
        background: "transparent",
      }}
    >
      <p
        style={{
          fontSize: "clamp(1.0rem, 1.5vw, 0.8rem)",
          fontStyle: "italic",
          color: "#14b8a6",
          maxWidth: "600px",
          textAlign: "center",
          lineHeight: "2",
          letterSpacing: "0.02em",
          userSelect: "none",
          transition:
            phase === "rising"
              ? "opacity 2.5s ease-out, transform 2.5s ease-out, filter 2.5s ease-out"
              : "opacity 2s ease-in, transform 2s ease-in, filter 2s ease-in",
          ...getStyle(),
        }}
      >
        {quotes[index]}
      </p>
    </div>
  );
}
