"use client";

import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ConfigProvider } from "antd";
import ruRU from "antd/locale/ru_RU";

export function AntdProvider({ children }: { children: React.ReactNode }) {
  return (
    <AntdRegistry>
      <ConfigProvider locale={ruRU}>{children}</ConfigProvider>
    </AntdRegistry>
  );
}
