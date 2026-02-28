"use client";

import { useState } from "react";
import { Button, Input, Form } from "antd";
import type { SocialFormData } from "@/hooks/useCreateSocial";

interface SocialFormProps {
  onSubmit: (data: SocialFormData) => Promise<void>;
  loading?: boolean;
  error?: string | null;
}

const PLATFORMS = ["Telegram", "YouTube", "VK", "Дзен", "Instagram", "TikTok", "Другое"];

export function SocialForm({ onSubmit, loading, error }: SocialFormProps) {
  const [form] = Form.useForm();
  const [platform, setPlatform] = useState("");

  const handleSubmit = async (values: {
    profile_url: string;
    followers: number;
    niche: string;
  }) => {
    await onSubmit({
      platform: platform || "Другое",
      profile_url: values.profile_url,
      followers: Number(values.followers) || 0,
      niche: values.niche ?? "",
    });
  };

  return (
    <Form form={form} layout="vertical" onFinish={handleSubmit}>
      <Form.Item label="Платформа">
        <div className="flex flex-wrap gap-2">
          {PLATFORMS.map((p) => (
            <Button
              key={p}
              type={platform === p ? "primary" : "default"}
              onClick={() => setPlatform(p)}
            >
              {p}
            </Button>
          ))}
        </div>
      </Form.Item>
      <Form.Item
        name="profile_url"
        label="Ссылка на профиль"
        rules={[{ required: true, message: "Введите ссылку" }]}
      >
        <Input placeholder="https://t.me/..." type="url" size="large" />
      </Form.Item>
      <Form.Item name="followers" label="Подписчики" initialValue={0}>
        <Input type="number" placeholder="0" min={0} size="large" />
      </Form.Item>
      <Form.Item
        name="niche"
        label="Ниша"
        rules={[{ required: true, message: "Введите нишу" }]}
      >
        <Input placeholder="Красота, техника, еда..." size="large" />
      </Form.Item>
      {error && (
        <p className="text-sm text-red-500 mb-2">{error}</p>
      )}
      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          size="large"
          block
          loading={loading}
          disabled={loading}
        >
          Добавить соцсеть
        </Button>
      </Form.Item>
    </Form>
  );
}
