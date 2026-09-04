import type { Metadata } from "next"
import "./globals.css"

import QueryProvider from "@/providers/QueryProvider"
import ToasterProvider from "@/providers/ToasterProvider"

export const metadata: Metadata = {
  title: "Robotic Sir CRM",
  description: "Robotic Sir customer relationship management workspace",
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    shortcut: "/icon.svg",
  },
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
