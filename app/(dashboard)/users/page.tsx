"use client"

import { useState } from "react"
import { useDebounce } from "use-debounce"
import {
  Plus,
  Search,
  UserCog,
} from "lucide-react"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { useUsers, useCreateUser, useUpdateUser, useDeleteUser } from "@/hooks/use-users"
import { User } from "@/lib/types/user"

const ROLE_COLORS: Record<string, { bg: string; text: string }> = {
  superadmin: { bg: "bg-red-100", text: "text-red-700" },
  admin: { bg: "bg-purple-100", text: "text-purple-700" },
  counsellor: { bg: "bg-blue-100", text: "text-blue-700" },
}

export default function UsersPage() {
  const [searchInput, setSearchInput] = useState("")
  const [debouncedSearch] = useDebounce(searchInput, 300)
  const { data: users, isLoading } = useUsers(debouncedSearch)

  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [editUser, setEditUser] = useState<User | null>(null)

  // Create form
  const [createForm, setCreateForm] = useState({
    email: "",
    first_name: "",
    last_name: "",
    role: "counsellor" as "admin" | "counsellor",
    password: "",
  })
  const createUserMutation = useCreateUser()
  const updateUserMutation = useUpdateUser()
  const deleteUserMutation = useDeleteUser()

  // Edit form
  const [editForm, setEditForm] = useState<Record<string, string>>({})

  function openEditDialog(user: User) {
    setEditUser(user)
    setEditForm({
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      role: user.role,
    })
  }

  function handleCreate() {
    createUserMutation.mutate(createForm, {
      onSuccess: () => {
        setShowCreateDialog(false)
        setCreateForm({
          email: "",
          first_name: "",
          last_name: "",
          role: "counsellor",
          password: "",
        })
      },
    })
  }

  function handleUpdate() {
    if (!editUser) return
    updateUserMutation.mutate(
      { id: editUser.id, data: editForm },
      { onSuccess: () => setEditUser(null) }
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Users</h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage admins and counsellors
          </p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus size={16} className="mr-2" />
          Create User
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
        <Input
          placeholder="Search users..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Users Table */}
      {isLoading ? (
        <Skeleton className="h-64 w-full rounded-2xl" />
      ) : !users?.results || users.results.length === 0 ? (
        <Card className="flex flex-col items-center rounded-2xl px-6 py-20 text-center">
          <UserCog size={32} className="text-slate-400" />
          <h3 className="mt-4 text-lg font-semibold">No users found</h3>
        </Card>
      ) : (
        <div className="overflow-hidden rounded-2xl border bg-white">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.results.map((user) => {
                const rc = ROLE_COLORS[user.role] ?? { bg: "bg-slate-100", text: "text-slate-700" }
                return (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">
                      <button className="hover:underline" onClick={() => openEditDialog(user)}>
                        {user.first_name} {user.last_name}
                      </button>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={`${rc.bg} ${rc.text} border-0 capitalize`}>
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.is_active ? "secondary" : "destructive"}>
                        {user.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {user.date_joined
                        ? new Date(user.date_joined).toLocaleDateString()
                        : "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => openEditDialog(user)}>
                          Edit
                        </Button>
                        {user.is_active && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:bg-red-50"
                            onClick={() => deleteUserMutation.mutate(user.id)}
                          >
                            Deactivate
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Create User Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create User</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label>First Name</Label>
                <Input
                  value={createForm.first_name}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, first_name: e.target.value })
                  }
                />
              </div>
              <div>
                <Label>Last Name</Label>
                <Input
                  value={createForm.last_name}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, last_name: e.target.value })
                  }
                />
              </div>
            </div>
            <div>
              <Label>Email</Label>
              <Input
                type="email"
                value={createForm.email}
                onChange={(e) =>
                  setCreateForm({ ...createForm, email: e.target.value })
                }
              />
            </div>
            <div>
              <Label>Role</Label>
              <Select
                value={createForm.role}
                onValueChange={(v) =>
                  setCreateForm({ ...createForm, role: v as "admin" | "counsellor" })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="counsellor">Counsellor</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Password</Label>
              <Input
                type="password"
                value={createForm.password}
                onChange={(e) =>
                  setCreateForm({ ...createForm, password: e.target.value })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={handleCreate}
              disabled={
                createUserMutation.isPending ||
                !createForm.email ||
                !createForm.password ||
                !createForm.first_name
              }
            >
              {createUserMutation.isPending ? "Creating..." : "Create User"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={!!editUser} onOpenChange={(open) => !open && setEditUser(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label>First Name</Label>
                <Input
                  value={editForm.first_name || ""}
                  onChange={(e) =>
                    setEditForm({ ...editForm, first_name: e.target.value })
                  }
                />
              </div>
              <div>
                <Label>Last Name</Label>
                <Input
                  value={editForm.last_name || ""}
                  onChange={(e) =>
                    setEditForm({ ...editForm, last_name: e.target.value })
                  }
                />
              </div>
            </div>
            <div>
              <Label>Email</Label>
              <Input
                value={editForm.email || ""}
                onChange={(e) =>
                  setEditForm({ ...editForm, email: e.target.value })
                }
              />
            </div>
            <div>
              <Label>Role</Label>
              <Select
                value={editForm.role || "counsellor"}
                onValueChange={(v) => setEditForm({ ...editForm, role: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="superadmin">Super Admin</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="counsellor">Counsellor</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleUpdate} disabled={updateUserMutation.isPending}>
              {updateUserMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
