"use client";

import { cn } from "@/lib/utils";
import { emojiForSocialPlatform } from "@/config/card-display.config";

const ROW_PLATFORMS = ["Instagram", "Telegram", "TikTok", "YouTube"] as const;

function brandShell(platform: string, active: boolean) {
  const p = platform.toLowerCase();
  if (p.includes("instagram"))
    return active
      ? "bg-gradient-to-br from-[#f09433] via-[#e6683c] to-[#bc1888] text-white"
      : "bg-[#f2f2f7] text-[#c7c7cc]";
  if (p.includes("telegram"))
    return active ? "bg-[#229ED9] text-white" : "bg-[#f2f2f7] text-[#c7c7cc]";
  if (p.includes("tiktok"))
    return active ? "bg-[#010101] text-white" : "bg-[#f2f2f7] text-[#c7c7cc]";
  if (p.includes("youtube"))
    return active ? "bg-[#FF0000] text-white" : "bg-[#f2f2f7] text-[#c7c7cc]";
  if (p.includes("vk"))
    return active ? "bg-[#0077FF] text-white" : "bg-[#f2f2f7] text-[#c7c7cc]";
  return active ? "bg-[#636366] text-white" : "bg-[#f2f2f7] text-[#c7c7cc]";
}

/** Ряд круглых «брендовых» иконок как в INSTADIUM; активна та платформа, что у аккаунта. */
export function PlatformBrandRow({ activePlatform }: { activePlatform: string }) {
  const activeLower = activePlatform.toLowerCase();

  return (
    <div className="flex items-center gap-1.5 pt-1">
      {ROW_PLATFORMS.map((name) => {
        const isActive =
          activeLower.includes(name.toLowerCase()) ||
          (name === "Instagram" && activeLower.includes("insta")) ||
          (name === "YouTube" && activeLower.includes("youtu"));
        const emoji = emojiForSocialPlatform(name);
        return (
          <span
            key={name}
            className={cn(
              "flex size-[1.625rem] items-center justify-center rounded-full text-[0.65rem] shadow-[0_1px_3px_rgba(0,0,0,0.12)] ring-2 ring-white transition-[transform,opacity,filter] duration-300 ease-out",
              brandShell(name, isActive),
              !isActive && "opacity-55 grayscale-[0.35]"
            )}
            aria-hidden
          >
            {emoji}
          </span>
        );
      })}
    </div>
  );
}
