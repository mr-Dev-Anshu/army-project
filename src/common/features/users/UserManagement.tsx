"use client";

import { useState } from "react";
import {
    Users,
    Plus,
    Search,
    Filter,
    MoreVertical,
    ChevronLeft,
    ChevronRight,
    Download,
    FileText,
} from "lucide-react";
import { useUsers } from "./hooks/useUser";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserDialog } from "./components/UserDialog";
import { DeleteUserDialog } from "./components/DeleteUserDialog";

export default function UserManagement() {
    const { data: users, isLoading } = useUsers();
    const [searchTerm, setSearchTerm] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<any>(null);

    const filteredUsers = users?.filter((user: any) =>
        user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.armyNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.unit?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleCreate = () => {
        setSelectedUser(null);
        setIsDialogOpen(true);
    };

    const handleEdit = (user: any) => {
        setSelectedUser(user);
        setIsDialogOpen(true);
    };

    const handleDelete = (user: any) => {
        setSelectedUser(user);
        setIsDeleteDialogOpen(true);
    };

    const getRoleBadgeStyle = (role: string) => {
        const base = "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ";
        switch (role?.toLowerCase()) {
            case 'superadmin':
            case 'super admin': return base + "bg-indigo-100 text-indigo-600";
            case 'admin': return base + "bg-blue-100 text-blue-600";
            default: return base + "bg-green-100 text-green-600";
        }
    };

    return (
        <div className="flex min-h-screen bg-[#F8FAFC]">
            {/* Main Content */}
            <main className="flex-1 p-8">
                {/* Breadcrumbs & Report Button */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                        <FileText className="h-4 w-4" />
                        <span>Administration</span>
                        <span className="mx-1">/</span>
                        <span className="text-gray-900 font-medium">User Management</span>
                    </div>
                    {/* <Button variant="outline" className="bg-[#1e293b] text-white hover:bg-[#334155] border-none gap-2 rounded-lg">
                        <Download className="h-4 w-4" />
                        Download & Print Report
                    </Button> */}
                </div>

                {/* Directory Title */}
                <div className="flex justify-between items-end mb-6">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <Users className="h-6 w-6 text-gray-700" />
                            <h1 className="text-xl font-bold text-gray-900">User Management Directory</h1>
                        </div>
                        <p className="text-gray-400 text-sm">Directory of all active military personnel and administrators.</p>
                    </div>
                    <div className="text-gray-400 text-sm font-semibold tracking-tighter">
                        <span className="mr-2">{users?.length || 0} ACTIVE USERS</span>
                    </div>
                </div>

                {/* Toolbar */}
                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex gap-3 mb-6">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            placeholder="Search by Name, Army Number, or Email..."
                            className="pl-10 h-11 bg-gray-50/50 border-gray-200 focus-visible:ring-blue-500 rounded-lg"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    {/* <Button variant="outline" className="h-11 px-6 border-gray-200 text-gray-600 gap-2">
                        <Filter className="h-4 w-4" />
                        Filter
                    </Button> */}
                    <Button className="h-11 px-6 bg-[#0070f3] hover:bg-blue-700 text-white gap-2 rounded-lg" onClick={handleCreate}>
                        <Plus className="h-5 w-5" />
                        Add New User
                    </Button>
                </div>

                {/* Table Container */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-[#F8FAFC] border-b border-gray-100">
                            <tr className="text-left">
                                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">S.NO</th>
                                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">User Profile</th>
                                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Army Number</th>
                                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Rank</th>
                                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Unit</th>
                                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Role</th>
                                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {isLoading ? (
                                <tr><td colSpan={7} className="text-center py-10 text-gray-400">Loading...</td></tr>
                            ) : filteredUsers?.map((user: any, index: number) => (
                                <tr key={user._id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="px-6 py-5 text-gray-400 font-medium">
                                        {(index + 1).toString().padStart(2, '0')}
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold border border-blue-200">
                                                {user.username ? user.username.charAt(0).toUpperCase() : 'U'}
                                            </div>
                                            <div>
                                                <div className="font-bold text-gray-900 text-sm">{user.username}</div>
                                                <div className="text-xs text-gray-400">{user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-gray-600 text-sm font-medium">{user.armyNo}</td>
                                    <td className="px-6 py-5 text-gray-600 text-sm">{user.rank}</td>
                                    <td className="px-6 py-5 text-gray-600 text-sm">{user.unit}</td>
                                    <td className="px-6 py-5">
                                        <span className={getRoleBadgeStyle(user.role)}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-300 group-hover:text-gray-600">
                                                    <MoreVertical className="h-5 w-5" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-40">
                                                <DropdownMenuItem onClick={() => handleEdit(user)}>Edit Profile</DropdownMenuItem>
                                                <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(user)}>Delete User</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Pagination */}
                    <div className="px-6 py-5 flex items-center justify-between border-t border-gray-100">
                        <span className="text-sm text-gray-400">
                            Showing {filteredUsers?.length > 0 ? 1 : 0} to {filteredUsers?.length || 0} of {users?.length || 0} entries
                        </span>
                        <div className="flex items-center gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-300"><ChevronLeft className="h-4 w-4" /></Button>
                            <Button className="h-8 w-8 bg-blue-600 text-white rounded-md text-xs">1</Button>
                            <Button variant="ghost" className="h-8 w-8 text-gray-600 text-xs">2</Button>
                            <Button variant="ghost" className="h-8 w-8 text-gray-600 text-xs">3</Button>
                            <span className="px-2 text-gray-300">...</span>
                            <Button variant="ghost" className="h-8 w-8 text-gray-600 text-xs">9</Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-600"><ChevronRight className="h-4 w-4" /></Button>
                        </div>
                    </div>
                </div>
            </main>

            <UserDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} user={selectedUser} />
            <DeleteUserDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen} user={selectedUser} />
        </div>
    );
}
