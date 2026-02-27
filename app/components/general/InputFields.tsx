"use client";

import { motion } from "motion/react";
import React, { useRef } from "react";
import { useState } from "react";

const InputFields = () => {
  const [publicKey, setPublicKey] = useState("");
  const [teamName, setTeamName] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [assignedIp, setAssignedIp] = useState(0);

  var disableButton = false;

  const configText = [
    `Address = 10.0.0.${assignedIp}/32`,
    `DNS = 1.1.1.1`,
    ``,
    `[Peer]`,
    `PublicKey = 1CIc2tMX3ULSXSSOm92KfPd31rL51sQvicCVp6mITyY=`,
    `AllowedIPs = 0.0.0.0/0`,
    `Endpoint = 18.221.62.217:51820`,
  ].join("\n");

  const handleSubmit = async () => {
    if (publicKey == "") {
      alert("Please enter a public key!");
      return;
    }

    disableButton = true;

    const res = await fetch("/api/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        publicKey,
        teamName,
      }),
    });

    const data = await res.json();

    if (data.success) {
      setAssignedIp(data.ipIncrement);
      setShowModal(true);
    } else if (data.duplicate) {
      alert("This public key has already been submitted.");
    } else {
      alert("Submission failed. Please try again.");
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(configText);
  };

  const handleDownload = () => {
    const blob = new Blob([configText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "wireguard-peer.conf";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <motion.div
            className="bg-[var(--color5)] text-[var(--background)] rounded-2xl p-6 max-w-2xl w-full mx-4"
            style={{ boxShadow: "var(--background) 0px 2px 12px" }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 280, damping: 22 }}
          >
            <p className="text-lg mb-4">
              In your WireGuard tunnel, paste the following underneath the two
              lines:
            </p>
            <pre className="bg-black/20 rounded-xl p-4 text-sm font-mono whitespace-pre mb-2 opacity-60 select-none">
              {`[Interface]
PrivateKey = [Your private key]
                
(Paste the following below these lines)`}
            </pre>
            <pre className="bg-black/20 rounded-xl p-4 text-sm font-mono whitespace-pre mb-4">
              {configText}
            </pre>
            <div className="flex gap-3 justify-end">
              <motion.button
                onClick={handleCopy}
                className="py-2 px-4 bg-[var(--color3)] text-[var(--foreground)] rounded-xl hover:cursor-pointer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Copy
              </motion.button>
              <motion.button
                onClick={handleDownload}
                className="py-2 px-4 bg-[var(--color3)] text-[var(--foreground)] rounded-xl hover:cursor-pointer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Download
              </motion.button>
              <motion.button
                onClick={() => setShowModal(false)}
                className="py-2 px-4 bg-[var(--color3)] text-[var(--foreground)] rounded-xl hover:cursor-pointer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Close
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
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
              boxShadow:
                "#6DC4EC 0px 0px 20px, inset var(--color2) 0px 0px 10px",
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
    </>
  );
};

export default InputFields;
