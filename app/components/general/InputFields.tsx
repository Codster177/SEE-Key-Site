"use client";

import { motion } from "motion/react";
import React, { useRef } from "react";
import { useState } from "react";

const InputFields = () => {
  const [publicKey, setPublicKey] = useState("");
  const [teamName, setTeamName] = useState("");

  var disableButton = false;

  const handleSubmit = async () => {
    if (publicKey == "") {
      alert("Please enter a public key!");
      return;
    }

    disableButton = true;

    await fetch("/api/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        publicKey,
        teamName,
      }),
    });

    alert("Submitted!");
  };

  return (
    <div
      className="flex-col align-middle items-center bg-[var(--color5)] text-[var(--background)] rounded-2xl p-3"
      style={{ boxShadow: "var(--background) 0px 2px 12px" }}
    >
      <div className="flex align-middle items-center justify-evenly mb-7">
        <h1 className="text-2xl">Wireguard Public Key:</h1>
        <motion.input
          initial={{ background: "#E1E1E1" }}
          whileHover={{ background: "#BDBDBD" }}
          className="border-2 rounded-2xl text-2xl mx-5 p-2"
          type="text"
          placeholder="fg7E9hFLhTs1cy4B1QUL+u38b4qQ20ow3pH2MuKhgis="
          value={publicKey}
          onChange={(e) => setPublicKey(e.target.value)}
        ></motion.input>
      </div>
      <div className="flex align-middle items-center justify-evenly">
        <h1 className="text-2xl">Team Name (Optional):</h1>
        <motion.input
          initial={{ background: "#E1E1E1" }}
          whileHover={{ background: "#BDBDBD" }}
          className="border-2 rounded-2xl text-2xl mx-5 p-2"
          type="text"
          placeholder="UCF Base Architecture"
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
        ></motion.input>
      </div>
      <div className="flex align-middle items-center justify-evenly">
        <motion.button
          disabled={disableButton}
          onClick={handleSubmit}
          className="flex text-2xl text-[var(--foreground)] mt-5 mb-3 py-3 px-6 bg-[var(--color3)] rounded-2xl hover:cursor-pointer"
          style={{ boxShadow: "inset var(--color2) 0px 0px 10px" }}
          initial={{
            scale: 1,
            boxShadow:
              "var(--color2) 0px 0px 0px, inset var(--color2) 0px 0px 10px",
          }}
          whileHover={{
            scale: 1.1,
            boxShadow: "#6DC4EC 0px 0px 20px, inset var(--color2) 0px 0px 10px",
          }}
          whileTap={{ scale: 0.9 }}
          transition={{
            duration: 0.8,
            boxShadow: { duration: 0.8 },
            scale: { duration: 0.5, type: "spring" },
          }}
        >
          Submit
        </motion.button>
      </div>
    </div>
  );
};

export default InputFields;
