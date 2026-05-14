import type { Metadata } from "next"
import "./globals.css"

import QueryProvider from "@/providers/QueryProvider"
import ToasterProvider from "@/providers/ToasterProvider"

export const metadata: Metadata = {
  title: "CRM Frontend",
  description: "RoboticSir CRM",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>
          <ToasterProvider />
          {children}
        </QueryProvider>
      </body>
    </html>
  )
}