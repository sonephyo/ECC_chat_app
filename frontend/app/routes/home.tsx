import { motion } from "framer-motion";
import { Link } from "react-router";
import type { Route } from "../+types/root";
import { Button } from "~/components/ui/button";
import {
  ArrowRight,
  Lock,
  MessageSquare,
  Users,
  Zap,
  Code,
} from "lucide-react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "ECC Chat App" },
    { name: "ECC Chat App", content: "A secure messaging application" },
  ];
}

export default function Home() {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const features = [
    {
      icon: <Lock className="h-10 w-10 text-emerald-400" />,
      title: "End-to-End Encryption",
      description:
        "Messages are encrypted using a custom ECC implementation for maximum security.",
    },
    {
      icon: <MessageSquare className="h-10 w-10 text-emerald-400" />,
      title: "Real-Time Chat",
      description:
        "Built with Flask-SocketIO and React for instant messaging experience.",
    },
    {
      icon: <Users className="h-10 w-10 text-emerald-400" />,
      title: "Private Rooms",
      description:
        "Create and join private chat rooms for secure group conversations.",
    },
    {
      icon: <Zap className="h-10 w-10 text-emerald-400" />,
      title: "Modern Frontend",
      description:
        "Built with React, TypeScript, TailwindCSS, and Shadcn components.",
    },
    {
      icon: <Code className="h-10 w-10 text-emerald-400" />,
      title: "Python Backend",
      description:
        "Flask API with flask-socketio for reliable real-time communication.",
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-900/20 to-transparent pointer-events-none" />

        <div className="container mx-auto px-4 py-24 md:py-32">
          <motion.div
            className="max-w-3xl mx-auto text-center"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            <motion.h1
              className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-200"
              variants={fadeIn}
            >
              Secure. Private. Encrypted.
            </motion.h1>

            <motion.p
              className="text-xl md:text-2xl mb-8 text-gray-300"
              variants={fadeIn}
            >
              A real-time, end-to-end encrypted chat application built with
              modern technologies.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              variants={fadeIn}
            >
              <Link to="/chat">
                <Button
                  size="lg"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  Start Chatting <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to={"https://github.com/sonephyo/ECC_chat_app"} target="_blank">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-emerald-600 text-emerald-400 hover:bg-emerald-950"
                >
                  Github
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Animated encryption pattern */}
        <motion.div
          className="absolute inset-0 pointer-events-none opacity-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.2 }}
          transition={{ duration: 2 }}
        >
          <div className="absolute inset-0 overflow-hidden">
            {Array.from({ length: 20 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-emerald-500 font-mono text-sm"
                initial={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  opacity: 0,
                }}
                animate={{
                  opacity: [0, 1, 0],
                  y: [0, -20],
                }}
                transition={{
                  repeat: Number.POSITIVE_INFINITY,
                  duration: 3 + Math.random() * 5,
                  delay: Math.random() * 5,
                }}
              >
                {Math.random() > 0.5 ? "0" : "1"}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-950">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Key Features
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Our chat application combines security with modern user experience
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="bg-gray-900 p-6 rounded-lg border border-gray-800 hover:border-emerald-800 transition-colors"
                variants={fadeIn}
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            className="max-w-4xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                How ECC Encryption Works
              </h2>
              <p className="text-gray-400">
                Our application uses Elliptic Curve Cryptography for secure,
                end-to-end encrypted messaging
              </p>
            </div>

            <motion.div
              className="bg-gray-900 p-8 rounded-lg border border-gray-800"
              variants={fadeIn}
            >
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-4 text-emerald-400">
                    End-to-End Encryption
                  </h3>
                  <p className="text-gray-300 mb-4">
                    When you send a message, it's encrypted on your device
                    before it leaves. Only the intended recipient can decrypt
                    it.
                  </p>
                  <p className="text-gray-300 mb-4">
                    Our custom ECC implementation ensures that even we cannot
                    read your messages.
                  </p>
                  <p className="text-gray-400 text-sm">
                    The encryption happens in real-time, with no noticeable
                    delay in your messaging experience.
                  </p>
                </div>
                <div className="flex-1">
                  <motion.div
                    className="relative h-64 w-full rounded-lg bg-black overflow-hidden border border-emerald-900"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                  >
                    {/* Animated encryption visualization */}
                    <motion.div
                      className="absolute inset-0 flex items-center justify-center"
                      animate={{
                        background: [
                          "radial-gradient(circle, rgba(16,185,129,0.1) 0%, rgba(0,0,0,0) 70%)",
                          "radial-gradient(circle, rgba(16,185,129,0.2) 0%, rgba(0,0,0,0) 70%)",
                          "radial-gradient(circle, rgba(16,185,129,0.1) 0%, rgba(0,0,0,0) 70%)",
                        ],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Number.POSITIVE_INFINITY,
                      }}
                    >
                      <Lock className="h-16 w-16 text-emerald-500" />
                    </motion.div>

                    {/* Animated dots representing data */}
                    {Array.from({ length: 20 }).map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute h-1 w-1 rounded-full bg-emerald-500"
                        initial={{
                          x: 0,
                          y: Math.random() * 256,
                          opacity: 0,
                        }}
                        animate={{
                          x: 300,
                          opacity: [0, 1, 0],
                        }}
                        transition={{
                          repeat: Number.POSITIVE_INFINITY,
                          duration: 2 + Math.random() * 3,
                          delay: Math.random() * 2,
                        }}
                      />
                    ))}
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-b from-black to-emerald-950">
        <div className="container mx-auto px-4">
          <motion.div
            className="max-w-3xl mx-auto text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to start secure messaging?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join our community of privacy-conscious users today.
            </p>
            <Link to="/chat">
              <Button
                size="lg"
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-8"
              >
                Start Chatting Now <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-black border-t border-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center text-gray-500 text-sm">
            <p>
              © {new Date().getFullYear()} ECC Chat App. All rights reserved.
            </p>
            <p className="mt-2">Secure. Private. Encrypted.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
