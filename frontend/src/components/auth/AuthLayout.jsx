import { motion } from "framer-motion";

function AuthLayout({ children, title, subtitle }) {
  return (
    <div className="min-h-screen flex bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-500">

      {/* Left Branding Section */}
      <div className="
        hidden
        lg:flex
        w-1/2
        flex-col
        justify-center
        px-16
        text-white
      ">

        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
        >

          <h1 className="text-5xl font-bold mb-6">
            InterviewIQ AI 🤖
          </h1>

          <p className="text-xl text-indigo-100 leading-relaxed">
            Practice smarter. Improve faster.
            <br />
            Crack your next interview with AI-powered preparation.
          </p>

          <div className="mt-10 space-y-3 text-indigo-100">
            <p>✓ AI Generated Interview Questions</p>
            <p>✓ Real-time Performance Analysis</p>
            <p>✓ Personalized Feedback</p>
          </div>

        </motion.div>

      </div>


      {/* Right Form Section */}
      <div className="
        flex
        flex-1
        items-center
        justify-center
        p-6
      ">

        <motion.div
          initial={{ opacity:0, y:40 }}
          animate={{ opacity:1, y:0 }}
          transition={{ duration:0.6 }}
          className="
            w-full
            max-w-md
            rounded-3xl
            bg-white/95
            backdrop-blur
            shadow-2xl
            p-8
          "
        >

          <h2 className="
            text-3xl
            font-bold
            text-gray-800
            text-center
          ">
            {title}
          </h2>


          <p className="
            text-gray-500
            text-center
            mt-2
            mb-8
          ">
            {subtitle}
          </p>


          {children}

        </motion.div>

      </div>

    </div>
  );
}

export default AuthLayout;