"use client";

import { useState } from "react";
import { Button, Input } from "@telegram-apps/telegram-ui";
import type { SocialFormData } from "@/hooks/useCreateSocial";

interface SocialFormProps {
  onSubmit: (data: SocialFormData) => Promise<void>;
  loading?: boolean;
  error?: string | null;
}

const PLATFORMS = ["Telegram", "YouTube", "VK", "Дзен", "Instagram", "TikTok", "Другое"];

export function SocialForm({ onSubmit, loading, error }: SocialFormProps) {
  const [platform, setPlatform] = useState("");
  const [profileUrl, setProfileUrl] = useState("");
  const [followers, setFollowers] = useState("");
  const [niche, setNiche] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({
      platform: platform || "Другое",
      profile_url: profileUrl,
      followers: Number(followers) || 0,
      niche,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          className="block text-sm mb-1"
          style={{ color: "var(--tg-theme-hint-color)" }}
        >
          Платформа
        </label>
        <div className="flex flex-wrap gap-2">
          {PLATFORMS.map((p) => (
            <Button
              key={p}
              mode={platform === p ? "filled" : "bezeled"}
              size="s"
              onClick={() => setPlatform(p)}
            >
              {p}
            </Button>
          ))}
        </div>
      </div>
      <Input
        header="Ссылка на профиль"
        placeholder="https://t.me/..."
        type="url"
        value={profileUrl}
        onChange={(e) => setProfileUrl(e.target.value)}
        required
      />
      <Input
        header="Подписчики"
        type="number"
        placeholder="0"
        value={followers}
        onChange={(e) => setFollowers(e.target.value)}
        min={0}
      />
      <Input
        header="Ниша"
        placeholder="Красота, техника, еда..."
        value={niche}
        onChange={(e) => setNiche(e.target.value)}
        required
      />
      {error && (
        <p className="text-sm" style={{ color: "#e53935" }}>
          {error}
        </p>
      )}
      <Button
        type="submit"
        mode="filled"
        size="l"
        stretched
        disabled={loading}
        loading={loading}
      >
        Добавить соцсеть
      </Button>
    </form>
  );
}
