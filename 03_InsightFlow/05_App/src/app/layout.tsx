import type { Metadata } from "next";
import "./globals.css";
export const metadata:Metadata={title:"InsightFlow",description:"AI User Research & Product Insights Agent"};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
