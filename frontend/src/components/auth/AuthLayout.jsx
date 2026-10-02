import { motion } from "framer-motion";
import {
  FileText,
  Brain,
  Target,
  MessageSquare,
  ShieldCheck,
  BarChart3,
  FileDown,
  Sparkles,
  ArrowRight,
  ChevronDown,
} from "lucide-react";

const capabilities = [
  {
    title: "Resume Intelligence",
    description: "AI-powered resume analysis",
    icon: FileText,
    side: "left",
    top: "12%",
    delay: 0.2,
    alternating: true,
  },
  {
    title: "AI Interviews",
    description: "Practice role-based interviews",
    icon: MessageSquare,
    side: "right",
    top: "12%",
    delay: 0.3,
    alternating: true,
  },
  {
    title: "ATS Analysis",
    description: "Check resume compatibility",
    icon: Target,
    side: "left",
    top: "32%",
    delay: 0.4,
    alternating: true,
  },
  {
    title: "Answer Evaluation",
    description: "Get intelligent feedback",
    icon: Sparkles,
    side: "right",
    top: "32%",
    delay: 0.5,
    alternating: true,
  },
  {
    title: "Role Prediction",
    description: "Discover suitable job roles",
    icon: Brain,
    side: "left",
    top: "52%",
    delay: 0.6,
    alternating: true,
  },
  {
    title: "AI Proctoring",
    description: "Monitor interview integrity",
    icon: ShieldCheck,
    side: "right",
    top: "52%",
    delay: 0.7,
    alternating: true,
  },
  {
    title: "Performance Analytics",
    description: "Understand your progress",
    icon: BarChart3,
    side: "left",
    top: "72%",
    delay: 0.8,
    alternating: true,
  },
  {
    title: "PDF Reports",
    description: "Get detailed interview reports",
    icon: FileDown,
    side: "right",
    top: "72%",
    delay: 0.9,
    alternating: true,
  },
];

function CapabilityCard({ capability }) {
  const Icon = capability.icon;

  return (
    <motion.div
      initial={{
        opacity: 0,
        x: capability.side === "left" ? -25 : 25,
        scale: 0.95,
      }}
      animate={
        capability.alternating
          ? {
              opacity: [0.3, 1, 0.3],
              x: 0,
              scale: [0.97, 1, 0.97],
            }
          : {
              opacity: 1,
              x: 0,
              scale: 1,
            }
      }
      transition={
        capability.alternating
          ? {
              duration: 3.2,
              repeat: Infinity,
              repeatDelay: 1.2,
              delay: capability.delay,
              ease: "easeInOut",
            }
          : {
              duration: 0.6,
              delay: capability.delay,
              ease: "easeOut",
            }
      }
      style={{
        top: capability.top,
      }}
      className={`
        absolute
        hidden
        w-[220px]
        rounded-2xl
        border
        border-indigo-100
        bg-white/90
        px-4
        py-4
        shadow-lg
        backdrop-blur-md
        md:flex
        ${
          capability.side === "left"
            ? "left-[7%]"
            : "right-[7%]"
        }
      `}
    >
      <div className="
        flex
        w-full
        items-start
        gap-3
      ">
        <div className="
          flex
          h-10
          w-10
          shrink-0
          items-center
          justify-center
          rounded-xl
          bg-indigo-50
          text-indigo-600
        ">
          <Icon size={20} />
        </div>

        <div className="min-w-0 flex-1">

          <h3 className="
            whitespace-nowrap
            text-sm
            font-semibold
            text-gray-800
          ">
            {capability.title}
          </h3>

          <p className="
            mt-1
            text-xs
            leading-relaxed
            text-gray-500
          ">
            {capability.description}
          </p>

        </div>
      </div>
    </motion.div>
  );
}

function AuthLayout({ children, title, subtitle }) {
  return (
    <div className="
      min-h-screen
      bg-gradient-to-br
      from-slate-50
      via-indigo-50
      to-white
      text-gray-900
    ">

      {/* =====================================================
          SECTION 1
          ===================================================== */}

      <section className="
        relative
        min-h-screen
        overflow-hidden
        px-6
        pt-16
        pb-28
      ">

        {/* Background glow */}
        <div className="
          pointer-events-none
          absolute
          left-1/2
          top-1/2
          h-[500px]
          w-[500px]
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          bg-indigo-300/20
          blur-3xl
        " />

        {/* =================================================
            LEFT + RIGHT CAPABILITIES
            ================================================= */}

        {capabilities.map((capability) => (
          <CapabilityCard
            key={capability.title}
            capability={capability}
          />
        ))}

        {/* =================================================
            CENTER
            ================================================= */}

        <div className="
          relative
          z-10
          flex
          min-h-[calc(100vh-7rem)]
          items-center
          justify-center
        ">

          <motion.div
            initial={{
              opacity: 0,
              scale: 0.9,
              y: 20,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            transition={{
              duration: 0.8,
              ease: "easeOut",
            }}
            className="
              flex
              max-w-xl
              flex-col
              items-center
              text-center
            "
          >

            {/* Product Icon */}
            <motion.div
              animate={{
                boxShadow: [
                  "0 0 0 0 rgba(99,102,241,0.15)",
                  "0 0 0 18px rgba(99,102,241,0)",
                  "0 0 0 0 rgba(99,102,241,0)",
                ],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
              }}
              className="
                mb-7
                flex
                h-20
                w-20
                items-center
                justify-center
                rounded-3xl
                bg-indigo-600
                text-white
                shadow-xl
              "
            >
              <Brain size={38} />
            </motion.div>

            {/* MAIN HEADING */}
            <motion.h1
              initial={{
                opacity: 0,
                y: 10,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.3,
                duration: 0.7,
              }}
              style={{
                fontFamily:
                  '"SF Pro Rounded", "Arial Rounded MT Bold", ui-rounded, system-ui, sans-serif',
              }}
              className="
                text-4xl font-black whitespace-nowrap tracking-tight
                text-slate-900
                sm:text-5xl md:text-6xl
              "
            >
              INTERVIEWIQ
              <span className="text-indigo-600">
                {" "}AI
              </span>
            </motion.h1>

            {/* PRODUCT POINTS */}
            <div className="
              mt-7
              flex
              flex-col
              gap-3
              text-left
            ">

              {[
                "Understand your resume with AI",
                "Practice intelligent role-based interviews",
                "Evaluate and improve your answers",
                "Track your interview performance",
              ].map((point, index) => (
                <motion.div
                  key={point}
                  initial={{
                    opacity: 0,
                    x: -12,
                  }}
                  animate={{
                    opacity: 1,
                    x: 0,
                  }}
                  transition={{
                    delay: 0.9 + index * 0.15,
                    duration: 0.5,
                  }}
                  className="
                    flex
                    items-center
                    gap-3
                    text-sm
                    text-slate-600
                    sm:text-base
                  "
                >
                  <ArrowRight
                    size={17}
                    className="
                      shrink-0
                      text-indigo-600
                    "
                  />

                  <span>{point}</span>
                </motion.div>
              ))}

            </div>

            {/* TAGLINE */}
            <motion.div
              initial={{
                opacity: 0,
                y: 10,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 1.6,
                duration: 0.6,
              }}
              className="
                mt-7
                flex
                items-center
                gap-2
                rounded-full
                border
                border-indigo-100
                bg-white/80
                px-5
                py-2.5
                text-sm
                font-medium
                text-indigo-600
                shadow-sm
                backdrop-blur
              "
            >
              <Sparkles size={16} />

              <span>
                Intelligent preparation. Real interview practice.
              </span>
            </motion.div>

          </motion.div>

        </div>

        {/* =================================================
            MOBILE CAPABILITIES
            ===================================================== */}

        <div className="
          absolute
          bottom-24
          left-0
          flex
          w-full
          gap-3
          overflow-x-auto
          px-6
          pb-2
          md:hidden
        ">

          {capabilities.slice(0, 6).map((capability) => {
            const Icon = capability.icon;

            return (
              <div
                key={capability.title}
                className="
                  flex
                  min-w-[190px]
                  items-center
                  gap-3
                  rounded-2xl
                  border
                  border-indigo-100
                  bg-white/90
                  p-3
                  shadow-md
                  backdrop-blur
                "
              >

                <div className="
                  flex
                  h-9
                  w-9
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  bg-indigo-50
                  text-indigo-600
                ">
                  <Icon size={18} />
                </div>

                <div>
                  <p className="
                    text-xs
                    font-semibold
                    text-gray-800
                  ">
                    {capability.title}
                  </p>

                  <p className="
                    mt-0.5
                    text-[11px]
                    text-gray-500
                  ">
                    {capability.description}
                  </p>
                </div>

              </div>
            );
          })}

        </div>

        {/* =================================================
            SCROLL AREA
            ================================================= */}

        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            delay: 2,
            duration: 0.8,
          }}
          className="
            absolute
            bottom-5
            left-1/2
            z-20
            flex
            -translate-x-1/2
            flex-col
            items-center
          "
        >

          {/* Only the text moves upward */}
          <span className="
            relative
            -top-2
            mb-1
            text-xs
            font-semibold
            uppercase
            tracking-[0.2em]
            text-indigo-600
          ">
            Scroll to continue
          </span>

          {/* Arrow stays in its original position */}
          <motion.div
            animate={{
              y: [0, 6, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-full
              bg-indigo-600
              text-white
              shadow-lg
            "
          >
            <ChevronDown size={19} />
          </motion.div>

        </motion.div>

      </section>


      {/* =====================================================
          SECTION 2 — EXISTING AUTH FORM
          ===================================================== */}

      <section className="
        relative
        flex
        min-h-screen
        items-center
        justify-center
        bg-gradient-to-br
        from-slate-100
        via-indigo-50
        to-white
        px-6
        py-20
      ">

        <motion.div
          initial={{
            opacity: 0,
            y: 40,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.2,
          }}
          transition={{
            duration: 0.7,
          }}
          className="
            w-full
            max-w-lg
            rounded-3xl
            bg-white/95
            p-10
            shadow-2xl
            backdrop-blur
          "
        >

          <h2 className="
            text-center
            text-3xl
            font-bold
            text-gray-800
          ">
            {title}
          </h2>

          <p className="
            mt-2
            mb-8
            text-center
            text-gray-500
          ">
            {subtitle}
          </p>

          {children}

        </motion.div>

      </section>

    </div>
  );
}

export default AuthLayout;