'use client'; 

import React, { useState, useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { 
    Eye, ShieldAlert, Sprout, 
    X, ChevronRight, Loader2,
    Wind as BreathIcon,
    MessageCircle, Send
} from 'lucide-react';
import { initializeApp, getApps } from 'firebase/app';
import { getAuth, onAuthStateChanged, signInAnonymously, signInWithPopup, GoogleAuthProvider, User } from 'firebase/auth';
import { getFirestore, collection, onSnapshot, addDoc, query, orderBy, serverTimestamp, doc, getDoc, setDoc, increment } from 'firebase/firestore';

// --- STYLES (Keep your existing styles here) ---
const STYLES = `
  button, .ds-no-btn { background: none !important; border: none !important; outline: none !important; box-shadow: none !important; padding: 0; cursor: pointer; font-family: inherit; }
  .ds-root { background-color: #fafaf9; min-height: 100vh; padding: 0 1rem; display: flex; flex-direction: column; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: #44403c; }
  .ds-portal-overlay { position: fixed !important; inset: 0 !important; background: #fafaf9 !important; z-index: 999999 !important; display: flex; flex-direction: column; overflow: hidden; }
  .ds-nav { height: 80px; padding: 0 40px; display: flex; align-items: center; justify-content: space-between; position: relative; z-index: 1000; }
.ds-nav-center { position: absolute; left: 50%; transform: translateX(-50%); display: flex; gap: 3rem; }
  .ds-nav-btn { font-size: 15px !important; font-weight: 600; font-family: "Georgia", "Times New Roman";text-transform: uppercase; letter-spacing: 0.01em; opacity: 0.3; transition: 0.5s; border-bottom: 2px solid transparent; }
  .ds-nav-btn:hover { opacity: 0.9; color: #14b8a6; }
  .ds-nav-btn-active { opacity: 1; color: #14b8a6; border-bottom: 2.5px solid #14b8a6; background: none}
  .ds-main-viewport { max-width: 72rem; width: 100%; margin: 0 auto; padding: 0 2rem; position: relative; z-index: 10; }
  .ds-home-title { font-size: clamp(2.5rem, 10vw, 6rem) !important; font-weight: 900; letter-spacing: -0.06em; line-height: 1; margin-bottom: 4rem; color: #1c1917; }
  .ds-input-clean { background: rgba(255, 255, 255, 0.4); border: 1.2px solid rgba(20, 184, 166, 0.15); border-radius: 3rem; padding: 1.5rem 2.5rem; transition: all 0.4s; width: 80%; margin-bottom: 3rem; min-height: 60px; display: flex; flex-direction: column; resize: none; overflow-y: auto; line-height: 1.6;}
  .ds-input-clean:focus-within { border-color: #14b8a6; background: #fff; box-shadow: 0 15px 40px -15px rgba(20, 184, 166, 0.08); }
  .ds-home-card { background: #ffffff; border: 1px solid rgba(20, 184, 166, 0.1); border-radius: 4rem; padding: 6rem 8rem; display: flex; align-items: center; gap: 5rem; cursor: pointer; transition: all 0.8s cubic-bezier(0.15, 1, 0.3, 1); position: relative; overflow: hidden; margin-top: 8rem !important; max-width: 90%; }
  .ds-home-card:hover { transform: translateY(-15px); box-shadow: 0 60px 120px -30px rgba(20, 184, 166, 0.12); }
  .ds-custom-scroll::-webkit-scrollbar { width: 0; background: transparent; }
  .ds-custom-scroll::-webkit-scrollbar-thumb { background: rgba(20, 184, 166, 0.05); border-radius: 10px; }
  .ds-breath-text { font-size: 3rem; /* Adjust this value (e.g., 3rem or 40px) to make it larger */ font-weight: 500; letter-spacing: 0.2em; text-transform: uppercase;}
  .animate-reveal { animation: reveal 1s ease-out forwards; }
  @keyframes reveal { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  @media (max-width: 768px) {
    .ds-root { padding: 0 !important; }
    .ds-nav { height: auto !important; min-height: 60px !important; padding: 12px 16px !important; flex-wrap: wrap !important; gap: 8px !important; }
    .ds-nav-center { position: static !important; transform: none !important; left: auto !important; gap: 1rem !important; width: 100% !important; justify-content: center !important; }
    .ds-nav-btn { font-size: 11px !important; letter-spacing: 0.05em !important; }
    .ds-home-card { padding: 3rem 2rem !important; flex-direction: column !important; gap: 2rem !important; border-radius: 2rem !important; margin-top: 3rem !important; }
    .ds-input-clean { padding: 1rem 1.2rem !important; }
  }
  `;

type ViewMode = 'home' | 'inquiry' | 'dashboard';

// --- CONFIG ---

// page.tsx
const fbConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY, 
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};


const appId = 'deep-sight-sanctuary';

const DeepSightLogo = ({ size = 50 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
    <circle cx="50" cy="50" r="48" stroke="#14b8a6" strokeWidth="0.5" opacity="0.5" />
    <circle cx="50" cy="50" r="30" stroke="#14b8a6" strokeWidth="1" opacity="0.6" />
    <circle cx="50" cy="50" r="5" fill="#14b8a6" />
  </svg>
);

const DeepSightBackground = () => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const requestRef = useRef<number | null>(null);
    const isHomeRef = useRef(true);
    useEffect(() => {
        if (!containerRef.current) return;
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 2000);
        camera.position.set(0, 14, 100); camera.lookAt(0, 6, 0); 
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        containerRef.current.innerHTML = '';
        containerRef.current.appendChild(renderer.domElement);
        const geometry = new THREE.PlaneGeometry(800, 800, 128, 128);
        const material = new THREE.MeshPhongMaterial({ 
          color: 0x14b8a6, transparent: true, opacity: 0.1, shininess: 150, side: THREE.DoubleSide
        });
        const surface = new THREE.Mesh(geometry, material); surface.rotation.x = -Math.PI / 2; scene.add(surface);

        // --- line 108 sun ---
        const sun = new THREE.Mesh(
          new THREE.SphereGeometry(10, 64, 64), 
          new THREE.MeshStandardMaterial({ 
            color: 0xfffde7,          // A very refined, "Lemon Chiffon" white-yellow
            emissive: 0xfff59d,       // A slightly deeper yellow for the glow core
            emissiveIntensity: 1.2,   // High intensity creates that "sharp" light effect
            transparent: true,
            opacity: 0.9,             // Slight transparency prevents it from feeling "heavy"
            roughness: 0,             // Makes the surface perfectly smooth for a "sharp" look
            metalness: 0

          })
        );
        // --- sun position ---
        sun.position.set(0, 55, -250); 
        scene.add(sun);

        scene.add(new THREE.AmbientLight(0xffffff, 2.2)); 
        const light = new THREE.PointLight(0x14b8a6, 4, 3000); light.position.set(0, 150, 100); scene.add(light);
        const animate = (time: number) => {
            if (!sun || !scene || !camera) return; // Safety check
            const t = time * 0.001; 
            const breathCycle = (t % 10);
            
            // Smooth breathing logic
            let breathScale = (breathCycle < 4) 
              ? 1.0 + (breathCycle / 4) * 0.3
              : 1.3 - ((breathCycle - 4) / 6) * 0.3;

            // Surface wave logic
            const pos = geometry.attributes.position;
            for (let i = 0; i < pos.count; i++) {
                const x = pos.getX(i);
                const y = pos.getY(i);
                pos.setZ(i, Math.sin(Math.sqrt(x * x + y * y) * 0.5 - t * 1.2) * 0.5);
            }
            pos.needsUpdate = true;

            // Apply scaling
            // Remove the isHomeRef check and just use the breathScale
            const finalS = 1.3 * breathScale; 
            sun.scale.set(finalS, finalS, finalS);

            renderer.render(scene, camera);
            requestRef.current = requestAnimationFrame(animate);
        };
        requestRef.current = requestAnimationFrame(animate);
        const handleResize = () => { camera.aspect = window.innerWidth / window.innerHeight; camera.updateProjectionMatrix(); renderer.setSize(window.innerWidth, window.innerHeight); };
        window.addEventListener('resize', handleResize);
        return () => { window.removeEventListener('resize', handleResize); 
          if (requestRef.current !== null) {
              cancelAnimationFrame(requestRef.current);
            }
          renderer.dispose();

          if(containerRef.current) containerRef.current.innerHTML = ''; };
    }, []);
    return <div ref={containerRef} style={{position:'fixed', inset:0, pointerEvents:'none', opacity:0.9}} />;
};

const DeepSightPortal = ({ setView, view, onClose }: { setView: React.Dispatch<React.SetStateAction<ViewMode>>, view: ViewMode, onClose?: () => void }) => {
  const [user, setUser] = useState<User | null>(null);
  const [db, setDb] = useState<any>(null);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [chatHistory, setChatHistory] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [breathLabel, setBreathLabel] = useState('Inhale');
  const [isDissolved, setIsDissolved] = useState(false);
  const [synthesis, setSynthesis] = useState<any>(null);
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // GAD/PHQ State
  const [activeQuestionnaire, setActiveQuestionnaire] = useState<string | null>(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [responses, setResponses] = useState({ anxiety: null, depression: null });

  const QUESTIONS: any = {
    anxiety: ["Feeling nervous, anxious, or on edge?", "Not being able to stop or control worrying?", "Worrying too much about different things?", "Trouble relaxing?", "Being so restless that it's hard to sit still?", "Becoming easily annoyed or irritable?", "Feeling afraid as if something awful might happen?"],
    depression: ["Little interest or pleasure in doing things?", "Feeling down, depressed, or hopeless?", "Trouble falling or staying asleep?", "Feeling tired or having little energy?", "Poor appetite or overeating?", "Feeling bad about yourself?", "Trouble concentrating?", "Moving or speaking slowly?", "Thoughts that you would be better off dead?"]
  };

  // 1. useEffect
  useEffect(() => {
    if (!fbConfig.projectId || fbConfig.projectId === "none") return;

    const app = !getApps().length ? initializeApp(fbConfig) : getApps()[0];
    const auth = getAuth(app);
    
    
    // async function to handle anonymous sign-in and auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        try {
          await signInAnonymously(auth); // Firebase Console open Anonymous
        } catch (err) {
          console.error("Anonymous sign-in failed:", err);
        }
      } else {
        setUser(currentUser);
        console.log("Current UID:", currentUser.uid); // Google UID
      }
    });

    return () => unsubscribe();
  }, []);

  // 2. Admin Login (for testing purposes, can be removed in production)
  const handleAdminLogin = async () => {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    try {
      // This will open a popup for Google Sign-In. Ensure that the Google provider is set up in your Firebase Console.
      const result = await signInWithPopup(auth, provider);
      console.log("Admin logged in. UID:", result.user.uid);
    } catch (err) {
      console.error("Login failed:", err);
    }
  };


  useEffect(() => {
    if (!db || !user) return;
    const q = query(collection(db, 'artifacts', appId, 'users', user.uid, 'clinical_inquiries'), orderBy('timestamp', 'asc'));
    return onSnapshot(q, (snap) => setHistory(snap.docs.map(doc => ({ id: doc.id, ...doc.data() }))));
  }, [db, user]);

  useEffect(() => {
    const cycle = setInterval(() => { setBreathLabel(performance.now() * 0.001 % 10 < 4 ? 'Inhale' : 'Exhale'); }, 200);
    return () => clearInterval(cycle);
  }, []);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [chatHistory]);


  const runStrike = async () => {

    console.log("runStrike triggered", input);
    console.log("Passed initial checks");
    console.log(">>> Enter runStrike"); 
    console.log(">>> status check:", { 
      inputText: !!input.trim(), 
      isProcessing, 
      hasDb: !!db, 
      hasUser: !!user 
    });

    if (!input.trim() || isProcessing) return;

    const message = input; 
    setInput(''); 
    setIsProcessing(true); 

    try {
      // 1. Align mode logic with your route.ts 'inquiry' vs 'dashboard'
      const currentMode = view === 'dashboard' ? 'dashboard' : 'inquiry';
      
      // 2. Security: Get the Auth Token (Never pass UID in body)
      const token = user ? await user.getIdToken() : "";

      const response = await fetch("/api/deepsight", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json", 
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ 
          message, 
          chatHistory: chatHistory.slice(-6),
          mode: currentMode 
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "API Failure");
      }

      // 3. Parse clean JSON directly from your new route.ts
      const data = await response.json();

      if (currentMode === 'inquiry') {
        // Update chat for the Inquiry view
        setChatHistory(prev => [
          ...prev, 
          { role: 'user', text: message }, 
          { role: 'master', text: data.analysis, guidance: data.guidance }
        ]);
      } else {
        // Update synthesis for the Dashboard view
        setSynthesis({
          synthesis: data.synthesis,
          verdict: data.verdict
        });
      }

      // Note: Firestore persistence is now handled by the Backend route
      // so you can remove addDoc from here to prevent duplicate entries.

    } catch (e: any) {
      console.error("Inquiry Error:", e.message);
      setChatHistory(prev => [
        ...prev, 
        { role: 'user', text: message }, 
        { role: 'master', text: "Today's AI quota has been reached. Please try again later." }
      ]);
    } finally { 
      setIsProcessing(false); 
    }
  };

  const synthesizeJourney = async () => {
    if (!user) return;
    setIsSynthesizing(true);
    try {
      const token = await user.getIdToken();
      const response = await fetch('/api/deepsight', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json', 
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ 
          message: "Synthesize journey.", 
          chatHistory, 
          mode: 'dashboard',
          clinicalScores: {
            ...(responses.anxiety !== null && { 
              anxiety: { score: responses.anxiety, tool: 'GAD-7', severity: responses.anxiety >= 15 ? 'severe' : responses.anxiety >= 10 ? 'moderate' : responses.anxiety >= 5 ? 'mild' : 'minimal' }
            }),
            ...(responses.depression !== null && { 
              depression: { score: responses.depression, tool: 'PHQ-9', severity: responses.depression >= 20 ? 'severe' : responses.depression >= 15 ? 'moderately severe' : responses.depression >= 10 ? 'moderate' : responses.depression >= 5 ? 'mild' : 'minimal' }
            })
          }
        })
      });

      if (!response.ok) throw new Error("Synthesis failed");

      const data = await response.json();
      setSynthesis({ 
        synthesis: data.synthesis, 
        verdict: data.verdict 
      });
    } catch (e) { 
      const hasScores = responses.anxiety !== null || responses.depression !== null;
      const hasChatHistory = chatHistory.length > 0;
      
      setSynthesis({ 
        synthesis: !hasChatHistory && !hasScores 
          ? "No inquiry or clinical assessment was provided for synthesis." 
          : !hasChatHistory 
          ? "Clinical assessment recorded. Begin an inquiry to deepen the synthesis."
          : "Resonance recorded.",
        verdict: "Presence is enough." 
      }); 
    
    } finally { 
      setIsSynthesizing(false); 
    }
  };
    
  return (
    <div className="ds-portal-overlay ds-root">
      <DeepSightBackground />
      {isDissolved && <div onClick={() => setIsDissolved(false)} className="fixed inset-0 z-[99999] cursor-pointer bg-black/5" />}
      
      <nav className={`ds-nav transition-opacity duration-1000 ${isDissolved ? 'opacity-0' : 'opacity-100'}`}>
  
        {/* Close button — far left */}
        <button
          onClick={onClose}
          className="ds-no-btn flex items-center gap-2 text-stone-400 hover:text-stone-900 transition-all uppercase text-[10px] font-black tracking-widest"
        >
          <X size={14} /> <span className="hidden sm:inline">Close</span>
        </button>


        {/* Nav links — center */}
        <div className="ds-nav-center">
          {[ 'Inquiry', 'Dashboard'].map(v => (
            <button key={v} onClick={() => setView(v.toLowerCase() as ViewMode)} className={`ds-no-btn ds-nav-btn ${view === v.toLowerCase() ? 'ds-nav-btn-active' : ''}`}>{v}</button>
          ))}
        </div>

      </nav>

      <main className="flex-1 overflow-y-auto ds-custom-scroll pt-12">
        {view === 'home' && (
          <div className="min-h-[65vh] flex flex-col items-center justify-center text-center px-4 animate-reveal">
               <h1 className="text-[clamp(2rem,8vw,4rem)] font-bold text-stone-900 tracking-[-0.04em] leading-[0.85] antialiased">Deep Sight</h1>
               <p className="text-stone-400 text-2xl font-light italic max-w-2xl opacity-70">Dissolving the figures of the loop to reveal the silence of the source.</p>
               <button onClick={() => setView('inquiry')} className="mt-24 text-[18px] text-[#14b8a6] font-bold font-bold tracking-[0.3em] uppercase transition-all hover:scale-105 hover:text-teal-500"
                  >Initiate Inquiry</button>
          </div>
        )}

        {view === 'inquiry' && (
          <div className="ds-main-viewport py-12 flex flex-col items-center" onClick={() => isDissolved && setIsDissolved(false)} >
            <div className={`w-full transition-all duration-[1500ms] ${isDissolved ? 'opacity-0' : 'opacity-100'}`}>
               <div className="flex items-center justify-between pb-10 mb-16 px-4 mt-[15vh]">
                 <div className="flex items-center gap-4 text-teal-600">
                    <BreathIcon size={16} className="animate-pulse" />
                    <span className="text-[12px] font-black uppercase tracking-widest">{breathLabel}</span>
                 </div>
                 <button onClick={() => setIsDissolved(true)} className="text-stone-300 hover:text-teal-600 transition-all text-[12px] uppercase font-black tracking-widest">Dissolve Experience</button>
               </div>
               
               <div className="space-y-12 max-h-[440px] min-h-[300px] overflow-y-auto pr-10 py-2 ds-custom-scroll w-full">
                  {chatHistory.map((msg, i) => (
                    <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-center text-center'} w-full animate-reveal`}>
                       {msg.role === 'user' ? ( <div className="max-w-[80%] px-4 py-2 text-stone-600 text-lg italic opacity-90">{msg.text}</div> ) : (
                         <div className="py-8 w-full px-4 sm:px-24 text-center">
                            <p className="text-xl md:text-3xl font-light text-stone-500 leading-loose text-center max-w-4xl mx-auto italic">{msg.text}</p>
                            {msg.guidance && <p className="text-lg text-stone-400 font-light italic opacity-60 px-12">{msg.guidance}</p>}
                         </div>
                       )}
                    </div>
                  ))}
                  <div ref={chatEndRef} />
               </div>

               <div className="pt-2 mt-10 mb-10 px-4 w-full max-w-sm mx-auto flex justify-center">
                 <div className="ds-input-clean relative flex shadow-sm">
                     <textarea rows={3} className="flex-1 bg-transparent border-none outline-none text-2xl text-stone-700 placeholder:text-stone-300 italic resize-none relative z-[999] overflow-y-auto " 
                     placeholder="..." value={input} onChange={(e) => setInput(e.target.value)} 
                     onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); runStrike(); } }} />
                     {isProcessing && <Loader2 size={26} className="animate-spin text-teal-600 ml-4 mb-2" />}
                 </div>
               </div>
            </div>
          </div>
        )}

        {view === 'dashboard' && (
          <div className="relative z-50 min-h-screen pt-[30vh] pb-60 px-10 flex flex-col items-center animate-reveal">
            <section className="flex flex-row justify-around w-full gap-8 sm:gap-24 max-w-4xl mb-24 items-center">
              {['anxiety', 'depression'].map((type) => (
                <div key={type} onClick={() => setActiveQuestionnaire(type)} className="cursor-pointer text-center group flex-1">
                  <p className="text-[11px] font-black uppercase tracking-[0.8em] text-stone-400 group-hover:text-teal-600 transition-colors italic mb-4">
                    {type}</p>
                  <p className="text-[10px] text-[#14b8a6] font-thin italic text-stone-900">{responses[type as 'anxiety'|'depression'] || (type === 'anxiety' ? 'GAD-7' : 'PHQ-9')}</p>
                </div>
              ))}
            </section>
            <div className="h-[20vh] w-full invisible pointer-events-none" />
            <section className="w-full max-w-3xl pt-16 flex flex-col items-center relative">
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#14b8a6]/40 to-transparent animate-pulse" />
              <button onClick={synthesizeJourney} className="text-[15px] text-[#14b8a6] font-black uppercase tracking-widest text-teal-600/60 hover:text-teal-600 mb-20"> {isSynthesizing ? "Resonating..." : "Regenerate Verdict"} </button>
              <div className="min-h-[250px] text-center px-8">
                {synthesis ? (
                  <div className="space-y-12 animate-reveal">
                    <p className="text-stone-400 italic font-light tracking-normal  text-[12px]">{synthesis.synthesis}</p>
                    <p className="text-stone-400 italic font-light tracking-normal  text-[12px]">{synthesis.verdict}</p>

                  </div>
                ) : ( <p className="text-stone-300 italic font-light tracking-[0.5em] uppercase text-[12px]">Awaiting Somatic Presence...</p> )}
              </div>
            </section>

            
        {activeQuestionnaire && (
          <div className="fixed inset-0 z-[100000] flex items-center justify-center bg-black/40 backdrop-blur-md">
            
            <div className="bg-[#ffffff] shadow-[0_40px_120px_-20px_rgba(0,0,0,0.2)]
              w-[600px] mx-auto flex-shrink-0
              h-auto min-h-[400px] max-h-[85vh]
              rounded-[3rem] 
              p-12 sm:p-20

              flex flex-col relative animate-reveal
              overflow-y-auto ds-custom-scroll
              "> 
              
              
              <div className="flex justify-between items-start mb-10 max-w-2xl mx-auto">
                <div>
                  <h3 className="text-3xl font-black uppercase tracking-[0.3em] text-stone-800">
                    {activeQuestionnaire === 'anxiety' ? 'GAD-7' : 'PHQ-9'}
                  </h3>
                  <p className="text-teal-600 font-bold uppercase tracking-[0.4em] text-[10px] mt-2 px-8">
                    STEP {questionIndex + 1} OF {QUESTIONS[activeQuestionnaire].length}
                  </p>
                </div>
                <button 
                  onClick={() => { setActiveQuestionnaire(null); setQuestionIndex(0); setAnswers([]); }}
                  className="hover:bg-stone-50 rounded-full transition-colors"
                >
                  <X size={20} className="text-stone-300 hover:text-stone-900" />
                </button>
              </div>

              {/* middle: questionnaire */}
              <div className="mb-14 flex justify-center px-8">
                <p className="text-2xl text-stone-600 italic max-w-2xl text-center leading-relaxed">
                  "{QUESTIONS[activeQuestionnaire][questionIndex]}"
                </p>
              </div>

              {/* bottom: options */}
              <div className="flex flex-col gap-3 px-12">
                {[
                  { label: "Not at all", val: 0 },
                  { label: "Several days", val: 1 },
                  { label: "More than half the days", val: 2 },
                  { label: "Nearly every day", val: 3 }
                ].map((opt) => (
                  <button 
                    key={opt.val}
                    onClick={() => {
                      const newAnswers = [...answers, opt.val];
                      if (questionIndex + 1 < QUESTIONS[activeQuestionnaire].length) {
                        setAnswers(newAnswers);
                        setQuestionIndex(questionIndex + 1);
                      } else {
                        const total = newAnswers.reduce((a, b) => a + b, 0); 
                        setResponses(prev => ({ ...prev, [activeQuestionnaire]: total }));
                        setActiveQuestionnaire(null);
                        setQuestionIndex(0);
                        setAnswers([]);
                      }
                    }}
                    className="
                    w-full
                    px-6 py-5
                    rounded-2xl
                    border border-stone-200
                    text-center
                    items-center
                    transition-all
                    hover:bg-teal-50
                    hover:text-teal-600
                    group"
                  >
                    <span>{opt.label}</span>
                    <ChevronRight size={18} className="opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-2 text-teal-600" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

          </div>
        )}
      </main> 
    </div>
  );
};

const App = () => {
  const [activeProject, setActiveProject] = useState<string | null>(null);
  const [view, setView] = useState<ViewMode>('inquiry');

  return (
    <div className="ds-root min-h-screen flex flex-col">
      <style>{STYLES}</style>
      
      {!activeProject && (
        <div className="max-w-7xl mx-auto px-4 sm:px-12 animate-reveal flex-1 flex flex-col">
          {/* Main Project Card */}
          <div 
            onClick={() => setActiveProject('deep-sight')} 
            className="ds-home-card group mt-20"
          >
              <DeepSightLogo size={120} />
              <div className="flex flex-col items-start text-left">
                <h2 className="text-[clamp(2rem,6vw,4rem)] font-black mb-6 tracking-tighter text-stone-900 leading-none">Deep Sight</h2>
                <p className="text-1xl text-stone-300 italic max-w-xl">
                   An inner inquiry engine leveraging LLM semantics to reflect recursive mental patterns.
                </p>
                <div className="flex items-center gap-10 text-[#14b8a6] font-black text-[16px] tracking-[0.8em] uppercase group-hover:text-teal-500 transition-colors">
                  Launch Experience <ChevronRight size={26} />
                </div>
              </div>
          </div>

          {/* Simple, Static Footer Disclaimer */}
          <div className="mt-auto py-12 text-center">
            <p className="text-[12px] text-stone-400 font-serif italic max-w-3xl mx-auto opacity-80">
              Deep Sight is a space for recursive inquiry and self-reflection. It is not a clinical substitute for professional medical advice.
            </p>
          </div>
        </div>
      )}

      {activeProject === 'deep-sight' && (
        <div className="ds-portal-overlay">
          <DeepSightPortal setView={setView} view={view} onClose={() => { setActiveProject(null); setView('home'); }} />
        </div>
      )}
    </div>
  );
};

export default App;
