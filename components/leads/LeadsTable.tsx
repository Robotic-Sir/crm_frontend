"use client"

import Link from "next/link"

import { Inbox } from "lucide-react"

import { Lead } from "@/lib/types/lead"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface LeadsTableProps {
  leads: Lead[]
}

export default function LeadsTable({
  leads,
}: LeadsTableProps) {
  /*
  |--------------------------------------------------------------------------
  | EMPTY STATE
  |--------------------------------------------------------------------------
  */

  if (leads.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border bg-white px-6 py-20 text-center">
        <div className="rounded-full bg-slate-100 p-4">
          <Inbox
            size={28}
            className="text-slate-500"
          />
        </div>

        <h3 className="mt-4 text-lg font-semibold">
          No leads found
        </h3>

        <p className="mt-2 max-w-sm text-sm text-slate-500">
          Leads will appear here once they
          are added or imported into the
          CRM.
        </p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-2xl border bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              Name
            </TableHead>

            <TableHead>
              Phone
            </TableHead>

            <TableHead>
              Course
            </TableHead>

            <TableHead>
              City
            </TableHead>

            <TableHead>
              Status
            </TableHead>

            <TableHead>
              Created
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {leads.map((lead) => (
            <TableRow
              key={lead.id}
            >
              <TableCell className="font-medium">
                <Link
                  href={`/leads/${lead.id}`}
                  className="hover:underline"
                >
                  {lead.name}
                </Link>
              </TableCell>

              <TableCell>
                {lead.phone}
              </TableCell>

              <TableCell>
                {lead.course || "-"}
              </TableCell>

              <TableCell>
                {lead.city || "-"}
              </TableCell>

              <TableCell className="capitalize">
                {lead.status}
              </TableCell>

              <TableCell>
                {new Date(
                  lead.created_at
                ).toLocaleDateString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}