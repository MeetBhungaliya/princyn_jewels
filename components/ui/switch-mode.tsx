"use client";

import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { type FC } from "react";
import {
  IoMoon,
  IoMoonOutline,
  IoSunny,
  IoSunnyOutline,
} from "react-icons/io5";

/* --- Props --- */
interface SwitchModeProps {
  width?: number;
  height?: number;
  darkColor?: string;
  lightColor?: string;
  knobDarkColor?: string;
  knobLightColor?: string;
  borderDarkColor?: string;
  borderLightColor?: string;
}

export const SwitchMode: FC<SwitchModeProps> = ({
  width = 144,
  height = 72,
  darkColor = "var(--color-surface-secondary)",
  lightColor = "var(--color-surface)",
  knobDarkColor = "var(--color-primary)",
  knobLightColor = "var(--color-surface)",
  borderDarkColor = "var(--color-border)",
  borderLightColor = "var(--color-border)",
}) => {
  const { resolvedTheme, setTheme } = useTheme();

  const isDark = resolvedTheme === "dark";
  const iconSize = height * 0.45;
  const trackBackground = isDark ? darkColor : lightColor;
  const knobBackground = isDark ? knobDarkColor : knobLightColor;
  const borderColor = isDark ? borderDarkColor : borderLightColor;
  const iconColor = isDark
    ? "var(--color-foreground-secondary)"
    : "var(--color-primary)";
  const moonColor = isDark
    ? "var(--color-surface)"
    : "var(--color-foreground-secondary)";

  if (!resolvedTheme) {
    return (
      <div
        style={{ width, height }}
        className="rounded-full border-2 border-transparent"
      />
    );
  }

  return (
    <motion.button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative flex items-center rounded-full border-2 transition-colors"
      style={{
        width,
        height,
        borderColor,
      }}
    >
      {/* TRACK */}
      <motion.div
        className="absolute inset-0 rounded-full"
        animate={{ backgroundColor: trackBackground }}
        transition={{ duration: 0.4 }}
      />

      {/* SLIDING KNOB */}
      <motion.div
        layout
        layoutId="switch-knob"
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="absolute rounded-full border-2 z-30"
        style={{
          width: height,
          height,
          right: isDark ? -2 : undefined,
          left: isDark ? undefined : -2,
          backgroundColor: knobBackground,
          borderColor,
        }}
      />

      {/* SUN */}
      <motion.div
        className="relative z-30 flex items-center justify-center"
        style={{ width: height, height }}
        animate={{ rotate: isDark ? 45 : 0 }}
        transition={{ stiffness: 20 }}
      >
        {isDark ? (
          <IoSunnyOutline
            color={iconColor}
            fill={iconColor}
            stroke={iconColor}
            style={{ width: iconSize, height: iconSize }}
            className="transition-colors duration-200"
          />
        ) : (
          <IoSunny
            color={iconColor}
            fill={iconColor}
            style={{ width: iconSize, height: iconSize }}
            className="transition-colors duration-200"
          />
        )}
      </motion.div>

      {/* MOON */}
      <motion.div
        className="relative z-30 flex items-center justify-center"
        style={{ width: height, height }}
        animate={{ rotate: isDark ? 0 : 15 }}
        transition={{ stiffness: 20, damping: 14 }}
      >
        {isDark ? (
          <IoMoon
            color={moonColor}
            fill={moonColor}
            style={{ width: iconSize, height: iconSize }}
            className="transition-colors duration-200"
          />
        ) : (
          <IoMoonOutline
            color={moonColor}
            fill={moonColor}
            stroke={moonColor}
            style={{ width: iconSize, height: iconSize }}
            className="transition-colors duration-200"
          />
        )}
      </motion.div>
    </motion.button>
  );
};
