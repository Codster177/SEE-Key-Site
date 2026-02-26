"use client";
import { motion, scale } from "motion/react";
import React from "react";
import InputFields from "./InputFields";

const MainCard = () => {
  var linkToInstructions = (
    <a
      className="text-[var(--color4)] underline"
      href={
        "https://docs.google.com/document/d/1Am6y9t0juq5GxyVMUJn6ef7ds-3ldGiAjIqQtAun1wc/edit?tab=t.0#heading=h.qe3yyhf0so91"
      }
      target="_blank"
      rel="noopener noreferrer"
    >
      Instructions Here
    </a>
  );

  return (
    <motion.div
      className="flex fixed flex-col h-auto w-auto align-middle justify-center items-center bg-[var(--color2)] p-[5%] rounded-2xl"
      style={{ boxShadow: "var(--color5) 0px 2px 10px" }}
      initial={{ scale: 1 }}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.9, type: "spring" }}
    >
      <h1 className="text-5xl text-center my-3">Welcome to SEE 2025!</h1>
      <h1 className="text-2xl text-center my-1">
        Please enter your Wireguard Public Key and your team name in the
        respective fields below.
      </h1>
      <h1 className="text-2xl text-center mb-[7%]">
        If you need help with the VPN process, follow these instructions:{" "}
        {linkToInstructions}
      </h1>
      <InputFields />
    </motion.div>
  );
};

export default MainCard;
