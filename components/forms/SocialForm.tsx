"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { SocialFormData } from "@/hooks/useCreateSocial";

interface SocialFormProps {
  onSubmit: (data: SocialFormData) => Promise<void>;
  loading?: boolean;
  error?: string | null;
}

const PLATFORMS = ["Telegram", "YouTube", "VK", "Дзен", "Instagram", "TikTok", "Другое"];

type FormValues = {
  profile_url: string;
  followers: string;
  niche: string;
};

export function SocialForm({ onSubmit, loading, error }: SocialFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    defaultValues: { profile_url: "", followers: "0", niche: "" },
  });
  const [platform, setPlatform] = useState("");

  const onFormSubmit = async (values: FormValues) => {
    await onSubmit({
      platform: platform || "Другое",
      profile_url: values.profile_url,
      followers: Number(values.followers) || 0,
      niche: values.niche ?? "",
    });
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label>Платформа</Label>
        <div className="flex flex-wrap gap-2">
          {PLATFORMS.map((p) => (
            <Button
              key={p}
              type="button"
              variant={platform === p ? "default" : "outline"}
              size="sm"
              onClick={() => setPlatform(p)}
            >
              {p}
            </Button>
          ))}
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="social-profile">Ссылка на профиль</Label>
        <Input
          id="social-profile"
          placeholder="https://t.me/..."
          type="url"
          className="min-h-11"
          {...register("profile_url", { required: "Введите ссылку" })}
        />
        {errors.profile_url && (
          <p className="text-sm text-destructive">{errors.profile_url.message}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="social-followers">Подписчики</Label>
        <Input
          id="social-followers"
          type="number"
          placeholder="0"
          min={0}
          className="min-h-11"
          {...register("followers")}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="social-niche">Ниша</Label>
        <Input
          id="social-niche"
          placeholder="Красота, техника, еда..."
          className="min-h-11"
          {...register("niche", { required: "Введите нишу" })}
        />
        {errors.niche && (
          <p className="text-sm text-destructive">{errors.niche.message}</p>
        )}
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <Button type="submit" size="lg" className="w-full min-h-11" disabled={loading}>
        {loading ? "Добавление…" : "Добавить соцсеть"}
      </Button>
    </form>
  );
}
