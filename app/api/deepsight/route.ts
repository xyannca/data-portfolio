import { NextResponse } from "next/server";
import { getAuth } from "firebase-admin/auth";
import * as admin from "firebase-admin";
import { GoogleGenAI } from "@google/genai";

export const runtime = 'nodejs';

const APP_ID = "deep-sight-sanctuary";

// ===== 1. Firebase Admin 
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

const adminDb = admin.firestore();

export async function POST(req: Request) {
  try {
    // ===== 2. test Firebase Token =====
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.replace("Bearer ", "");
    const decoded = await getAuth().verifyIdToken(token);


    // --- test token decoding ---
    if (!decoded || !decoded.uid) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const uid = decoded.uid;

    // Add this line to see the incoming UID in your terminal
    console.log("API request uid:", uid);

    const body = await req.json(); // 1. body
    const { message, chatHistory, mode, clinicalScores } = body; // 2. 

    // 3. 
    console.log("Current message length:", message.length);
    if (message && message.length > 8000) {
      return NextResponse.json(
        { error: "The thoughts are too vast. Please keep under 2000 characters." }, 
        { status: 400 }
      );
    }
 
        

    // --- 2.5 limit to 10 requests per minute per user (except owner) ---
    const minuteKey = new Date().toISOString().slice(0, 16); 
    const rateRef = adminDb.collection("artifacts").doc(APP_ID).collection("users").doc(uid).collection("meta").doc("rate");
    const rateSnap = await rateRef.get();
    const rateData = rateSnap.data() as { minute?: string; count?: number } | undefined;

    const lastMinute = rateData?.minute ?? "";
    const lastCount = rateData?.count ?? 0;

    // 6. Owner Exemption
    const isOwner = uid === process.env.OWNER_UID;

    // 
    if (lastMinute === minuteKey && lastCount >= 10 && !isOwner) {
      return NextResponse.json({ error: "Slow down. Too many requests in a minute." }, { status: 429 });
    }

    await rateRef.set({
      minute: minuteKey,
      count: lastMinute === minuteKey
        ? admin.firestore.FieldValue.increment(1)
        : 1
    }, { merge: true });


    // ===== 3. limit 30 ===== 
    const today = new Date().toISOString().split("T")[0];
    const usageRef = adminDb.collection("artifacts").doc(APP_ID).collection("users").doc(uid).collection("meta").doc("usage");
    const usageSnap = await usageRef.get();
    
    const currentCount = (usageSnap.exists && usageSnap.data()?.date === today) ? (usageSnap.data()?.count || 0) : 0;
    if (!isOwner && currentCount >= 30) {
      return NextResponse.json({ error: "Daily limit reached" }, { status: 429 });
    }

    // ===== 4. Prompt Design =====
    let systemPrompt = "";

    const languageInstruction = `
    Respond strictly in the SAME LANGUAGE as the user's input.
    Do not translate unless explicitly asked.
    Maintain natural fluency in that language.
    `;

    if (mode === "inquiry") {
      systemPrompt = `Identity: Deep Sight. 
      Core Function:
      - Detect the underlying emotional driver beneath surface language.
      - Clinical precision, psychological insight, and archetypal metaphor specific to the user's unique situation.

   

      STRICT RULES:
      - You MUST reference the user's actual content.
      - Do NOT give generic spiritual phrases.
      - Analyze the specific emotional pattern present in the text.
    

      Language Rule:
      Respond strictly in the SAME LANGUAGE as the user's input.
      Do not translate unless explicitly requested.

      ${languageInstruction}
      Output strictly JSON: {
        "analysis": "deep somatic-zen reflection on THIS specific inquiry.",
        "guidance": "clinical precision, psychological insight specific to THIS case.",
        "figure": "Archetypal metaphor emerging from THIS situation."
      }`;

    } else {
      systemPrompt = `Identity: Deep Sight. Style: Zen, Minimal, First-principles thinking. 
      ${languageInstruction}
      Output strictly JSON: {"synthesis": "", "verdict": ""}`;
    }

    // ===== 5. Gemini SDK API Key Check =====
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return NextResponse.json({ error: "Missing API key" }, { status: 500 });

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY!,
    });

    // ===== 6. Prepare Input Text =====

    const clinicalContext = clinicalScores && Object.keys(clinicalScores).length > 0
      ? `\nClinical Scores:\n${clinicalScores.anxiety ? `- GAD-7 Anxiety: ${clinicalScores.anxiety.score}/21 (${clinicalScores.anxiety.severity})` : ''}${clinicalScores.depression ? `\n- PHQ-9 Depression: ${clinicalScores.depression.score}/27 (${clinicalScores.depression.severity})` : ''}`
      : '';

    const chatContext = (chatHistory || []).map((m: any) => `${m.role}: ${m.text}`).join("\n");

    const inputText = mode === "dashboard"
      ? !chatContext && !clinicalContext
        ? `No data provided. Return exactly: {"synthesis": "No chat history or test result was provided", "verdict": "Input is required"}`
        : `SYNTHESIZE:\nChat:\n${chatContext}${clinicalContext}`
      : message;
  
    // ===== 7. Execute Generation (with fallback) =====
    let responseText = "";

    try {
      const result = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: inputText,
        config: {
          systemInstruction: systemPrompt,
          responseMimeType: "application/json",
        },
      });

      responseText = typeof result.text === "string" ? result.text : "";

    } catch (err: any) {
      console.error("Gemini fatal error:", err);
      return NextResponse.json({ error: "AI request failed" }, { status: 500 });
    }

    // ===== 8. Parse Response =====
    let parsed;
    try {
      parsed = JSON.parse(responseText);
    } catch (err) {
      console.error("AI Parse error:", responseText);
      return NextResponse.json({ error: "Invalid AI response" }, { status: 500 });
    }

    // ===== 9. Update Usage Count =====
    await usageRef.set(
      { date: today, count: admin.firestore.FieldValue.increment(1) },
      { merge: true }
    );

    return NextResponse.json(parsed);

  } catch (error: any) {
    console.error("DeepSight route error:", error);
    if (["auth/id-token-expired", "auth/argument-error", "auth/id-token-revoked"].includes(error?.code)) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}