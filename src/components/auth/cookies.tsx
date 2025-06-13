"use client";

import { useLocalStorage } from "@/hooks/use-local-storage";
import { motion } from "motion/react";
import dynamic from "next/dynamic";
import { Button } from "../ui/button";

const CookieConsent = () => {
  const [accepted, setAccepted] = useLocalStorage("accept-cookies", false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      transition={{
        duration: 0.25,
        delay: 0.5,
        ease: "backOut",
      }}
      className="fixed bottom-4 right-4 p-4 rounded-lg bg-muted text-popover-foreground border border-border shadow-xl shadow-secondary/10 hover:shadow-lg hover:shadow-secondary/50 transition-shadow duration-500 z-50"
    >
      {accepted ? (
        <div className="space-y-4 text-center text-sm">
          <p>Cookie consent accepted</p>
          <Button onClick={() => setAccepted(false)}>Reject</Button>
        </div>
      ) : (
        <div className="space-y-4 text-center text-sm">
          <p>Cookie consent not accepted</p>
          <Button onClick={() => setAccepted(true)}>Accept</Button>
        </div>
      )}
    </motion.div>
  );
};

export default dynamic(() => Promise.resolve(CookieConsent), { ssr: false });
