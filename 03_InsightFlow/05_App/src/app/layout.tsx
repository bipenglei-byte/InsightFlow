import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "InsightFlow",
  description: "AI 用户研究与产品洞察助手",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
