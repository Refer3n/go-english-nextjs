"use client";

import { useLoading } from "@/context/LoadingContext";
import { motion } from "framer-motion";

const Loader = () => {
  const { isLoading } = useLoading();

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm z-50">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        className="w-16 h-16 border-4 border-white border-t-transparent rounded-full"
      />
    </div>
  );
};

export default Loader;
