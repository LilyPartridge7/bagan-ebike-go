import React, { useState, useRef, useEffect } from 'react';

interface BaganParallaxBackgroundProps {
  isDaylightMode?: boolean; // smooth fadeout when ride is active to conserve phone battery
}

export const BaganParallaxBackground: React.FC<BaganParallaxBackgroundProps> = ({ isDaylightMode = false }) => {
  const [videoError, setVideoError] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Attempt playback if ready
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // autoplay may need muted
        if (videoRef.current) {
          videoRef.current.muted = true;
          videoRef.current.play().catch(() => {});
        }
      });
    }
  }, []);

  return (
    <div
      className={`fixed inset-0 pointer-events-none transition-all duration-1000 -z-10 overflow-hidden ${
        isDaylightMode ? 'opacity-0 bg-stone-950' : 'opacity-100'
      }`}
    >
      {/* 1. Looping Sunrise Hot-Air Balloon Video Background */}
      {!videoError && (
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          src="/bagan-sunrise.mp4"
          onLoadedData={() => setVideoLoaded(true)}
          onPlaying={() => setVideoLoaded(true)}
          onError={() => setVideoError(true)}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
            videoLoaded ? 'opacity-90' : 'opacity-0'
          }`}
        />
      )}

      {/* 2. Built-in Animated SVG Fallback (rendered underneath & visible if video is loading or errors) */}
      <div className={`absolute inset-0 transition-opacity duration-700 ${videoLoaded && !videoError ? 'opacity-25' : 'opacity-100'}`}>
        {/* Deep Sky & Sunrise Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#2a1306] via-[#4d220a] to-[#120c08]" />

        {/* Golden Sun & Radiating Sun Rays */}
        <div className="absolute top-[12%] left-1/2 -translate-x-1/2 w-[700px] h-[700px] pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-500 blur-2xl opacity-70" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 rounded-full bg-amber-100/90 shadow-[0_0_80px_rgba(245,158,11,0.8)]" />

          {/* Rotating Sun Rays */}
          <svg
            className="absolute inset-0 w-full h-full opacity-20 animate-sun-rays"
            viewBox="0 0 500 500"
            fill="none"
          >
            <g stroke="url(#sunRayGrad)" strokeWidth="1.5">
              {[...Array(24)].map((_, i) => (
                <line
                  key={i}
                  x1="250"
                  y1="250"
                  x2={250 + 240 * Math.cos((i * Math.PI) / 12)}
                  y2={250 + 240 * Math.sin((i * Math.PI) / 12)}
                />
              ))}
            </g>
            <defs>
              <radialGradient id="sunRayGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#fef08a" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#d97706" stopOpacity="0" />
              </radialGradient>
            </defs>
          </svg>
        </div>

        {/* Bagan Hot Air Balloons */}
        <div className="absolute inset-0 max-w-5xl mx-auto overflow-hidden">
          {/* Balloon 1: Foreground Left */}
          <div className="absolute top-[18%] left-[12%] animate-balloon-slow">
            <svg className="w-16 h-20 drop-shadow-lg" viewBox="0 0 60 75" fill="none">
              <path
                d="M30 0 C12 0 2 15 5 32 C7 43 20 54 28 62 L32 62 C40 54 53 43 55 32 C58 15 48 0 30 0 Z"
                fill="url(#balloonGrad1)"
              />
              <path d="M22 2 C16 12 16 38 23 60 M38 2 C44 12 44 38 37 60" stroke="#fef08a" strokeWidth="0.8" opacity="0.6" />
              <line x1="28" y1="62" x2="27" y2="69" stroke="#78350f" strokeWidth="1" />
              <line x1="32" y1="62" x2="33" y2="69" stroke="#78350f" strokeWidth="1" />
              <rect x="26" y="69" width="8" height="6" rx="1" fill="#451a03" />
              <defs>
                <linearGradient id="balloonGrad1" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#f59e0b" />
                  <stop offset="50%" stopColor="#dc2626" />
                  <stop offset="100%" stopColor="#78350f" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Balloon 2: High Center Right */}
          <div className="absolute top-[12%] right-[22%] animate-balloon-delayed">
            <svg className="w-11 h-14 opacity-85" viewBox="0 0 60 75" fill="none">
              <path
                d="M30 0 C12 0 2 15 5 32 C7 43 20 54 28 62 L32 62 C40 54 53 43 55 32 C58 15 48 0 30 0 Z"
                fill="url(#balloonGrad2)"
              />
              <rect x="27" y="68" width="6" height="5" rx="1" fill="#451a03" />
              <defs>
                <linearGradient id="balloonGrad2" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#fde047" />
                  <stop offset="60%" stopColor="#ea580c" />
                  <stop offset="100%" stopColor="#831843" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Balloon 3: Distant Small Horizon */}
          <div className="absolute top-[28%] right-[10%] animate-balloon-distant">
            <svg className="w-6 h-8 opacity-60" viewBox="0 0 60 75" fill="#b45309">
              <path d="M30 0 C12 0 2 15 5 32 C7 43 20 54 28 62 L32 62 C40 54 53 43 55 32 C58 15 48 0 30 0 Z" />
              <rect x="27" y="68" width="6" height="5" rx="1" fill="#78350f" />
            </svg>
          </div>
        </div>

        {/* Pagoda Silhouettes Landscape */}
        <div className="absolute bottom-0 inset-x-0 w-full h-[360px] pointer-events-none">
          <svg
            className="absolute bottom-0 w-full h-[260px] opacity-85"
            preserveAspectRatio="none"
            viewBox="0 0 1200 260"
            fill="none"
          >
            {/* Ananda Temple / Stupa profile */}
            <path
              d="M 60 260 L 60 210 L 90 210 L 100 180 L 115 180 L 120 150 L 130 150 L 140 100 L 145 50 L 150 100 L 160 150 L 170 150 L 175 180 L 190 180 L 200 210 L 230 210 L 230 260 Z"
              fill="#3e1a06"
            />
            {/* Dhammayangyi massive pyramidal terraces */}
            <path
              d="M 450 260 L 480 190 L 520 190 L 530 150 L 560 150 L 570 115 L 600 115 L 610 80 L 615 65 L 620 80 L 630 115 L 660 115 L 670 150 L 700 150 L 710 190 L 750 190 L 780 260 Z"
              fill="#2c1204"
            />
            {/* Sulamani spire */}
            <path
              d="M 920 260 L 940 195 L 960 195 L 970 160 L 985 160 L 995 120 L 1005 120 L 1015 70 L 1020 40 L 1025 70 L 1035 120 L 1045 120 L 1055 160 L 1070 160 L 1080 195 L 1100 195 L 1120 260 Z"
              fill="#240e03"
            />
            {/* Ground line */}
            <path
              d="M0 260 L0 235 Q100 240 250 230 Q400 225 550 235 Q700 242 850 232 Q1050 228 1200 235 L1200 260 Z"
              fill="#1c0b02"
            />
          </svg>
          <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-stone-950 via-stone-950/80 to-transparent" />
        </div>
      </div>

      {/* 3. Dark Amber Scrim Gradient (high outdoor contrast scrim) */}
      <div className="absolute inset-0 bg-gradient-to-b from-amber-950/45 via-stone-900/55 to-stone-950/85" />
    </div>
  );
};
