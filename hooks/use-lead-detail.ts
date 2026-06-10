"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast"

import {
  getLeadDetail,
  updateLead,
  addNote,
  deleteNote,
  addReminder,
  updateReminder,
} from "@/lib/api/leads"

export function useLeadDetail(id: number) {
  return useQuery({
    queryKey: ["lead", id],
    queryFn: () => getLeadDetail(id),
    enabled: !!id,
  })
}

export function useUpdateLead(id: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: Record<string, unknown>) => updateLead(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lead", id] })
      queryClient.invalidateQueries({ queryKey: ["leads"] })
      toast.success("Lead updated")
    },
    onError: () => toast.error("Failed to update lead"),
  })
}

export function useAddNote(leadId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (text: string) => addNote(leadId, text),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lead", leadId] })
      toast.success("Note added")
    },
    onError: () => toast.error("Failed to add note"),
  })
}

export function useDeleteNote(leadId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (noteId: number) => deleteNote(leadId, noteId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lead", leadId] })
      toast.success("Note deleted")
    },
    onError: () => toast.error("Failed to delete note"),
  })
}

export function useAddReminder(leadId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: { note: string; reminder_at: string; assigned_to?: number }) =>
      addReminder(leadId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lead", leadId] })
      toast.success("Reminder added")
    },
    onError: () => toast.error("Failed to add reminder"),
  })
}

export function useUpdateReminder(leadId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      reminderId,
      data,
    }: {
      reminderId: number
      data: Record<string, unknown>
    }) => updateReminder(leadId, reminderId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lead", leadId] })
      toast.success("Reminder updated")
    },
    onError: () => toast.error("Failed to update reminder"),
  })
}
