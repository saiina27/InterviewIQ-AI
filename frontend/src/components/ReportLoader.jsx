import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

const MESSAGES = [
    "Preheating the AI oven...",
    "Scoring each of your answers...",
    "Mixing in skill insights...",
    "Checking the integrity log...",
    "Plating your report...",
];

const STEAM = [
    { x: 92, delay: 0 },
    { x: 120, delay: 0.7 },
    { x: 148, delay: 1.4 },
];

function Oven({ still }) {
    const loop = (extra = {}) =>
        still ? {} : { repeat: Infinity, ease: "easeInOut", ...extra };

    return (
        <svg viewBox="0 0 240 230" className="mx-auto h-48 w-48 sm:h-56 sm:w-56" role="img" aria-label="A report baking in an oven">
            {/* steam */}
            {STEAM.map((puff) => (
                <motion.path
                    key={puff.x}
                    d={`M ${puff.x} 62 c -7 -8 7 -14 0 -22 c -7 -8 7 -14 0 -22`}
                    fill="none"
                    stroke="#A5B4FC"
                    strokeWidth="4"
                    strokeLinecap="round"
                    initial={{ opacity: 0, y: 6 }}
                    animate={still ? { opacity: 0.6, y: 0 } : { opacity: [0, 0.9, 0], y: [8, -10, -22] }}
                    transition={loop({ duration: 2.4, delay: puff.delay })}
                />
            ))}

            {/* feet */}
            <rect x="48" y="212" width="22" height="10" rx="4" fill="#312E81" />
            <rect x="170" y="212" width="22" height="10" rx="4" fill="#312E81" />

            {/* body */}
            <rect x="26" y="66" width="188" height="148" rx="20" fill="#1E1B4B" />
            <rect x="26" y="66" width="188" height="38" rx="20" fill="#312E81" />
            <rect x="26" y="90" width="188" height="14" fill="#312E81" />

            {/* knobs + timer */}
            <circle cx="52" cy="85" r="7" fill="#818CF8" />
            <circle cx="76" cy="85" r="7" fill="#818CF8" />
            <motion.line
                x1="52" y1="85" x2="52" y2="79"
                stroke="#1E1B4B" strokeWidth="2.5" strokeLinecap="round"
                style={{ originX: 0.5, originY: 1 }}
                animate={still ? {} : { rotate: 360 }}
                transition={still ? {} : { repeat: Infinity, ease: "linear", duration: 6 }}
            />
            <rect x="140" y="77" width="54" height="16" rx="6" fill="#0F172A" />
            <motion.circle
                cx="152" cy="85" r="3" fill="#FB923C"
                animate={still ? {} : { opacity: [1, 0.2, 1] }}
                transition={loop({ duration: 1 })}
            />
            <rect x="160" y="83" width="26" height="4" rx="2" fill="#475569" />

            {/* window */}
            <rect x="44" y="114" width="152" height="84" rx="12" fill="#0F172A" />
            <motion.rect
                x="48" y="118" width="144" height="76" rx="9" fill="#FB923C"
                animate={still ? { opacity: 0.35 } : { opacity: [0.28, 0.5, 0.28] }}
                transition={loop({ duration: 2 })}
            />
            {/* heating element */}
            <motion.line
                x1="58" y1="126" x2="182" y2="126"
                stroke="#FDBA74" strokeWidth="3" strokeLinecap="round" strokeDasharray="10 6"
                animate={still ? {} : { opacity: [0.5, 1, 0.5] }}
                transition={loop({ duration: 1.2 })}
            />
            {/* rack */}
            <line x1="52" y1="184" x2="188" y2="184" stroke="#7C2D12" strokeWidth="3" strokeLinecap="round" />

            {/* the report, rising like dough */}
            <motion.g
                animate={still ? {} : { y: [0, -5, 0], scale: [1, 1.04, 1] }}
                transition={loop({ duration: 2.4 })}
                style={{ originX: 0.5, originY: 1 }}
            >
                <rect x="94" y="140" width="52" height="44" rx="5" fill="#FFFFFF" />
                <rect x="94" y="140" width="52" height="9" rx="5" fill="#C7D2FE" />
                {[156, 164, 172].map((y, i) => (
                    <motion.line
                        key={y}
                        x1="101" y1={y} x2={i === 2 ? 125 : 139} y2={y}
                        stroke="#6366F1" strokeWidth="3" strokeLinecap="round"
                        initial={{ pathLength: 0 }}
                        animate={still ? { pathLength: 1 } : { pathLength: [0, 1, 1, 0] }}
                        transition={loop({ duration: 3.2, delay: i * 0.35, times: [0, 0.4, 0.85, 1] })}
                    />
                ))}
            </motion.g>

            {/* glass shine */}
            <path d="M 54 122 L 84 122 L 62 190 L 54 190 Z" fill="#FFFFFF" opacity="0.08" />
        </svg>
    );
}

export default function ReportLoader() {
    const reduceMotion = useReducedMotion();
    const [step, setStep] = useState(0);
    const [slow, setSlow] = useState(false);

    useEffect(() => {
        const rotate = setInterval(() => setStep((s) => (s + 1) % MESSAGES.length), 2200);
        const slowTimer = setTimeout(() => setSlow(true), 12000);
        return () => {
            clearInterval(rotate);
            clearTimeout(slowTimer);
        };
    }, []);

    return (
        <div className="flex min-h-dvh items-center justify-center bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 px-5">
            <div className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-xl sm:p-10">
                <Oven still={reduceMotion} />

                <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900">
                    Your report is in the oven
                </h1>

                <div className="mt-2 h-6" aria-live="polite">
                    <AnimatePresence mode="wait">
                        <motion.p
                            key={step}
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -6 }}
                            transition={{ duration: 0.25 }}
                            className="text-slate-500"
                        >
                            {MESSAGES[step]}
                        </motion.p>
                    </AnimatePresence>
                </div>

                <div className="mx-auto mt-6 h-1.5 w-48 overflow-hidden rounded-full bg-indigo-100">
                    <motion.div
                        className="h-full w-1/3 rounded-full bg-indigo-600"
                        animate={reduceMotion ? { x: "100%" } : { x: ["-100%", "300%"] }}
                        transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
                    />
                </div>

                <p className="mt-5 text-xs text-slate-400">
                    {slow
                        ? "Taking a little longer than usual. The AI is still working on it."
                        : "This usually takes a few seconds."}
                </p>
            </div>
        </div>
    );
}
