"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { User } from "@/types";
import { cn } from "@/lib/utils";

const pillInput =
  "h-12 rounded-full border-0 bg-[#f2f2f7] px-5 text-base text-[#1c1c1e] shadow-none placeholder:text-[#aeaeb2] focus-visible:ring-2 focus-visible:ring-[color-mix(in_oklab,#ff9b71_40%,transparent)]";

const pillTextarea =
  "min-h-[7rem] rounded-2xl border-0 bg-[#f2f2f7] px-5 py-4 text-base text-[#1c1c1e] placeholder:text-[#aeaeb2] focus-visible:ring-2 focus-visible:ring-[color-mix(in_oklab,#ff9b71_40%,transparent)]";

interface ProfileEditFormProps {
  profile: User;
  onSave: (updates: Partial<User>) => Promise<void>;
  onCancel: () => void;
}

export function ProfileEditForm({ profile, onSave, onCancel }: ProfileEditFormProps) {
  const isBlogger = profile.user_type === "blogger";
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [fullName, setFullName] = useState(
    profile.full_name || [profile.first_name, profile.last_name].filter(Boolean).join(" ") || ""
  );
  const [bio, setBio] = useState(profile.bio || "");
  const [companyName, setCompanyName] = useState(profile.company_name || "");
  const [companyCategory, setCompanyCategory] = useState(profile.company_category || "");
  const [companyDescription, setCompanyDescription] = useState(profile.company_description || "");
  const [consent, setConsent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!isBlogger && !consent) {
      setError("Нужно согласие с политикой обработки данных.");
      return;
    }
    setSaving(true);
    try {
      if (isBlogger) {
        await onSave({ full_name: fullName.trim() || null, bio: bio.trim() || null });
      } else {
        await onSave({
          company_name: companyName.trim() || null,
          company_category: companyCategory.trim() || null,
          company_description: companyDescription.trim() || null,
        });
      }
      onCancel();
    } catch {
      setError("Не удалось сохранить. Попробуйте ещё раз.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 pb-4">
      <div className="flex items-center justify-between gap-3 border-b border-[#e5e5ea]/80 pb-3">
        <button
          type="button"
          onClick={onCancel}
          className="text-sm font-semibold text-[#ff9b71] transition-opacity active:opacity-70"
        >
          Отмена
        </button>
        <span className="text-sm font-semibold text-[#636366]">{isBlogger ? "Основное" : "Компания"}</span>
        <span className="w-14 text-right text-sm tabular-nums text-[#aeaeb2]" aria-hidden>
          {/* место под % прогресса анкеты при появлении шагов */}
        </span>
      </div>

      {!isBlogger ? (
        <div
          className="rounded-2xl border border-[color-mix(in_oklab,#ff9b71_35%,transparent)] bg-[color-mix(in_oklab,#ff9b71_12%,#ffffff)] px-4 py-3.5 text-[0.8125rem] leading-relaxed text-[#5c4033]"
          role="note"
        >
          Сейчас регистрация брендов доступна по приглашению. Заполните данные — вы в листе ожидания, мы
          свяжемся, когда подойдёт очередь.
        </div>
      ) : null}

      {isBlogger ? (
        <>
          <div className="flex flex-col gap-2">
            <Label htmlFor="pe-full-name" className="app-form-label">
              Имя *
            </Label>
            <Input
              id="pe-full-name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Как к вам обращаться"
              className={pillInput}
              required
              autoComplete="name"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="pe-bio" className="app-form-label">
              О себе
            </Label>
            <Textarea
              id="pe-bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Коротко: ниша, форматы, география…"
              className={pillTextarea}
              rows={4}
            />
          </div>
        </>
      ) : (
        <>
          <div className="flex flex-col gap-2">
            <Label htmlFor="pe-company" className="app-form-label">
              Название компании *
            </Label>
            <Input
              id="pe-company"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Название бренда"
              className={pillInput}
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="pe-cat" className="app-form-label">
              Категория *
            </Label>
            <Input
              id="pe-cat"
              value={companyCategory}
              onChange={(e) => setCompanyCategory(e.target.value)}
              placeholder="Например: FMCG, красота"
              className={pillInput}
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="pe-desc" className="app-form-label">
              Описание
            </Label>
            <Textarea
              id="pe-desc"
              value={companyDescription}
              onChange={(e) => setCompanyDescription(e.target.value)}
              placeholder="Чем занимается компания, какие продукты или услуги…"
              className={pillTextarea}
              rows={5}
            />
          </div>
        </>
      )}

      {!isBlogger ? (
        <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-[#ececec] bg-[#fafafa] px-4 py-3.5 touch-manipulation">
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            className="mt-1 size-4 shrink-0 rounded border-[#c7c7cc] text-[#e753a0] focus:ring-[#ff9b71]"
          />
          <span className="text-[0.8125rem] leading-snug text-[#636366]">
            Я соглашаюсь с{" "}
            <span className="font-semibold text-[#e753a0] underline underline-offset-2">Политикой обработки персональных данных</span>
          </span>
        </label>
      ) : null}

      {error ? <p className="text-center text-sm font-medium text-red-600">{error}</p> : null}

      <div className="flex flex-col gap-3 pt-2 sm:flex-row">
        <button
          type="button"
          onClick={onCancel}
          className={cn(
            "h-12 flex-1 rounded-full border-2 border-[#e5e5ea] bg-white text-base font-semibold text-[#1c1c1e]",
            "touch-manipulation transition-transform active:scale-[0.98]"
          )}
        >
          Назад
        </button>
        <button
          type="submit"
          disabled={saving}
          className={cn(
            "app-btn-primary-gradient h-12 min-h-12 flex-1 rounded-full border-0 text-base font-semibold",
            "touch-manipulation transition-transform active:scale-[0.98] disabled:opacity-60"
          )}
        >
          {saving ? "Сохранение…" : "Сохранить"}
        </button>
      </div>
    </form>
  );
}
