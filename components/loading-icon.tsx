"use client";
import React from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export default function LoadingIcon() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black">
      <h1 className="text-white text-2xl font-bold tracking-widest mb-0">Loading</h1>

      <div style={{ marginTop: 4 }}> {/* tiny gap */}
        <DotLottieReact
          src="https://lottie.host/8216147a-cd2c-4536-8359-8c0809372a72/iLYXAh11jZ.lottie"
          loop
          autoplay
          style={{
            width: 400,
            height: 200,
            display: "block",
            transform: "translateY(-50px)"         // remove any line-height gaps
          }}
        />
      </div>
    </div>
  );

}

