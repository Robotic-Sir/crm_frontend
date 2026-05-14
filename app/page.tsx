import Link from "next/link"

import {
  ArrowRight,
  MessageSquare,
  Users,
  Send,
} from "lucide-react"

import { Button } from "@/components/ui/button"

import { Card } from "@/components/ui/card"

const features = [
  {
    title: "Lead Management",
    description:
      "Track, organize, and manage CRM leads efficiently.",

    icon: Users,
  },

  {
    title: "WhatsApp Campaigns",
    description:
      "Send bulk WhatsApp campaigns using approved templates.",

    icon: Send,
  },

  {
    title: "Message Tracking",
    description:
      "Monitor delivery, read receipts, and engagement status.",

    icon: MessageSquare,
  },
]

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-100">
      <section className="mx-auto flex max-w-7xl flex-col px-6 py-24">
        <div className="max-w-3xl">
          <div className="inline-flex items-center rounded-full border bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm">
            CRM + WhatsApp Automation
          </div>

          <h1 className="mt-6 text-5xl font-bold tracking-tight text-slate-900">
            Manage leads and WhatsApp
            campaigns from one dashboard.
          </h1>

          <p className="mt-6 text-lg leading-8 text-slate-600">
            Internal CRM platform for
            managing leads, campaign
            broadcasts, delivery tracking,
            and WhatsApp automation
            workflows.
          </p>

          <div className="mt-10 flex items-center gap-4">
            <Link href="/login">
              <Button
                size="lg"
                className="gap-2"
              >
                Login

                <ArrowRight size={18} />
              </Button>
            </Link>
          </div>
        </div>

        <div className="mt-20 grid gap-6 md:grid-cols-3">
          {features.map((feature) => {
            const Icon =
              feature.icon

            return (
              <Card
                key={feature.title}
                className="rounded-2xl p-6"
              >
                <div className="rounded-xl bg-slate-100 p-3 w-fit">
                  <Icon
                    size={22}
                    className="text-slate-700"
                  />
                </div>

                <h2 className="mt-5 text-xl font-semibold">
                  {feature.title}
                </h2>

                <p className="mt-3 text-sm leading-6 text-slate-500">
                  {
                    feature.description
                  }
                </p>
              </Card>
            )
          })}
        </div>
      </section>
    </main>
  )
}