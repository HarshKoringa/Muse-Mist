"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag } from "lucide-react";

type Props = {
  visible: boolean;
  productName: string;
};

export default function AddedToast({ visible, productName }: Props) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.95 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#1A237E] text-white px-5 py-3 rounded-2xl shadow-lg flex items-center gap-3 whitespace-nowrap"
        >
          <ShoppingBag size={18} />
          <span className="text-base font-medium">
            {productName} added to cart
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
