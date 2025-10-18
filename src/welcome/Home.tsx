import { motion } from "framer-motion";
import Signin from "./Auth/Signin";

const Landing = () => {
  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
      {/* Hero Section */}
      <section
        id="hero"
        className="relative bg-primary dark:bg-inherit py-32 px-6 w-full overflow-hidden"
      >
        <div className="container mx-auto grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side: Hero Text */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight text-primary-foreground">
              CIV-CON{" "}
              <span className="text-yellow-400 dark:text-gradient">Empowers</span>{" "}
              Ugandan Voices
            </h1>
            <p className="text-lg md:text-xl mb-8 leading-relaxed text-yellow-500">
              Connect with leaders, journalists, and citizens to shape Uganda’s
              future.
            </p>
          </motion.div>

          {/* Right side: Sign-in Form inside hero */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div className="relative flex justify-center items-center">
              {/* Background glow effects */}
              <div className="absolute -bottom-20 left-1/2 transform -translate-x-1/2 w-60 h-60 bg-primary rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse-soft"></div>
              <div className="absolute -top-20 right-1/4 w-30 h-30 bg-accent rounded-full mix-blend-multiply filter blur-2xl opacity-25 animate-pulse-soft"></div>

              {/* Signin Form */}
              <div className="relative z-10 w-full max-w-md bg-card/95 rounded-xl shadow-lg p-6">
                <Signin />
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
