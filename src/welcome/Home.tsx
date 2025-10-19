import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Signin from "./Auth/Signin";

const Landing = () => {
  const [showSignin, setShowSignin] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Hero Section */}
      <section
        id="hero"
        className="relative bg-primary/5 dark:bg-background py-24 px-6 sm:px-10 md:px-16 lg:px-20 w-full overflow-hidden flex-grow"
      >
        <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left side: Hero Text */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight text-primary">
              CIV-CON{" "}
              <span className="text-yellow-400 dark:text-gradient">Empowers</span>{" "}
              Ugandan Voices
            </h1>
            <p className="text-base sm:text-lg md:text-xl mb-8 leading-relaxed text-yellow-500 max-w-2xl mx-auto lg:mx-0">
              Connect with leaders, journalists, and citizens to shape Uganda’s future.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <a
                href="#signup"
                className="inline-block bg-yellow-500 text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:bg-yellow-400 transition"
              >
                Get Started
              </a>

              {/* Mobile-only Signin Button */}
              <button
                onClick={() => setShowSignin(true)}
                className="inline-block lg:hidden border border-yellow-500 text-yellow-400 px-6 py-3 rounded-lg font-semibold hover:bg-yellow-500 hover:text-primary-foreground transition"
              >
                Sign In
              </button>
            </div>
          </motion.div>

          {/* Desktop / Tablet: Signin visible in hero */}
          <motion.div
            id="signin"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="relative hidden lg:flex justify-center items-center"
          >
            {/* Background glow effects */}
            <div className="absolute -bottom-20 left-1/2 transform -translate-x-1/2 w-60 h-60 bg-primary rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse-soft"></div>
            <div className="absolute -top-20 right-1/4 w-40 h-40 bg-accent rounded-full mix-blend-multiply filter blur-2xl opacity-25 animate-pulse-soft"></div>

            {/* Signin Form */}
            <div className="relative z-10 w-full max-w-md bg-card/90 backdrop-blur-sm rounded-xl shadow-xl p-6 sm:p-8">
              <Signin />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="bg-background text-center py-6 border-t border-muted">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} CIV-CON. All rights reserved.
        </p>
      </footer>

      {/* ------------------ Modal ------------------ */}
      <AnimatePresence>
        {showSignin && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Modal card animation */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative w-full max-w-md bg-card/95 rounded-xl shadow-2xl p-6 sm:p-8"
            >
              {/* Close Button */}
              <button
                onClick={() => setShowSignin(false)}
                className="absolute top-3 right-3 text-muted-foreground hover:text-primary transition"
              >
                ✕
              </button>
              <Signin />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Landing;
