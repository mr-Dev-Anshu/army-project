"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Eye, EyeOff, X } from "lucide-react";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetFooter,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useCreateUser, useUpdateUser } from "@/hooks/useUser";

const baseSchema = z.object({
    username: z.string().min(2, "Full Name is required"),
    armyNo: z.string().optional().or(z.literal("")),
    rank: z.string().optional().or(z.literal("")),
    unit: z.string().optional().or(z.literal("")),
    email: z.union([z.string().email("Invalid email address"), z.literal("")]).optional(),
    role: z.string().optional().or(z.literal("")),
});

// Schema for Creating a User (Password Required)
const createUserSchema = baseSchema.extend({
    password: z.string().min(6, "Password is required (min 6 chars)"),
});

// Schema for Editing a User (Password Optional)
const editUserSchema = baseSchema.extend({
    password: z.string().min(6, "Password must be at least 6 characters").optional().or(z.literal("")),
});

type UserFormValues = z.infer<typeof createUserSchema>;

interface UserDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    user?: any;
}

export function UserDialog({ open, onOpenChange, user }: UserDialogProps) {
    const [showPassword, setShowPassword] = useState(false);
    const { mutate: createUser, isPending: isCreating } = useCreateUser();
    const { mutate: updateUser, isPending: isUpdating } = useUpdateUser();

    // Select the correct schema based on whether we are editing or creating
    const schema = user ? editUserSchema : createUserSchema;

    const form = useForm<UserFormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            username: "",
            armyNo: "",
            rank: "",
            unit: "",
            email: "",
            role: "Standard User",
            password: "",
        },
    });

    const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = form;

    useEffect(() => {
        if (user) {
            // Reverse map backend role to display role
            const displayRoleMap: Record<string, string> = {
                "user": "Standard User",
                "admin": "Admin",
                "superadmin": "Super Admin"
            };

            reset({
                username: user.username,
                armyNo: user.armyNo || "",
                rank: user.rank || "",
                unit: user.unit || "",
                email: user.email || "",
                role: displayRoleMap[user.role] || user.role, // Default to raw if not found
                password: "",
            });
        } else {
            reset({
                username: "",
                armyNo: "",
                rank: "",
                unit: "",
                email: "",
                role: "Standard User",
                password: "",
            });
        }
    }, [user, reset, open]);

    const onSubmit = (data: UserFormValues) => {
        // Map display roles to backend values
        const roleMap: Record<string, string> = {
            "Standard User": "user",
            "Admin": "admin",
            "Super Admin": "superadmin"
        };

        const finalData = {
            ...data,
            role: (data.role && roleMap[data.role]) ? roleMap[data.role] : (data.role || "user").toLowerCase().replace(" ", "")
        };

        if (user) {
            const updateData = { ...finalData };
            if (!updateData.password) {
                // @ts-ignore
                delete updateData.password;
            }
            updateUser({ id: user._id, data: updateData }, {
                onSuccess: () => onOpenChange(false)
            });
        } else {
            createUser(finalData, {
                onSuccess: () => onOpenChange(false)
            });
        }
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            {/* side="right" ensures the pop-up comes from the right side */}
            <SheetContent side="right" className="sm:max-w-[450px] p-0 flex flex-col gap-0 border-l border-gray-100">

                {/* Custom Header matching the screenshot */}
                <div className="p-6 border-b border-gray-100 flex justify-between items-start">
                    <SheetHeader className="text-left space-y-1">
                        <SheetTitle className="text-xl font-bold text-gray-900">
                            {user ? "Edit User Profile" : "Create New User"}
                        </SheetTitle>
                        <p className="text-sm text-gray-500">
                            Fill in the details to register a new military administrator.
                        </p>
                    </SheetHeader>
                </div>

                {/* Form Body - Scrollable */}
                <form onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-y-auto p-6 space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="username" className="text-sm font-semibold text-gray-700">Full Name</Label>
                        <Input id="username" placeholder="Enter full name" className="h-11 bg-gray-50/30" {...register("username")} />
                        {errors.username && <p className="text-red-500 text-xs">{errors.username.message}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="armyNo" className="text-sm font-semibold text-gray-700">Army Number</Label>
                            <Input id="armyNo" placeholder="e.g. IC-12345" className="h-11 bg-gray-50/30" {...register("armyNo")} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="rank" className="text-sm font-semibold text-gray-700">Rank</Label>
                            <Select onValueChange={(val) => setValue("rank", val)} value={watch("rank")}>
                                <SelectTrigger className="h-11 bg-gray-50/30">
                                    <SelectValue placeholder="Select Rank" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Lieutenant">Lieutenant</SelectItem>
                                    <SelectItem value="Captain">Captain</SelectItem>
                                    <SelectItem value="Major">Major</SelectItem>
                                    <SelectItem value="Colonel">Colonel</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="unit" className="text-sm font-semibold text-gray-700">Unit / Department</Label>
                        <Input id="unit" placeholder="e.g. 15 Rajput" className="h-11 bg-gray-50/30" {...register("unit")} />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-semibold text-gray-700">Official Email</Label>
                        <Input id="email" type="email" placeholder="example@army.nic.in" className="h-11 bg-gray-50/30" {...register("email")} />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="role" className="text-sm font-semibold text-gray-700">System Role</Label>
                        <Select onValueChange={(val: any) => setValue("role", val)} value={watch("role")}>
                            <SelectTrigger className="h-11 bg-gray-50/30">
                                <SelectValue placeholder="Select Role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Standard User">Standard User</SelectItem>
                                <SelectItem value="Admin">Admin</SelectItem>
                                <SelectItem value="Super Admin">Super Admin</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password" className="text-sm font-semibold text-gray-700">
                            {user ? "New Password (Optional)" : "Temporary Password"}
                        </Label>
                        <div className="relative">
                            <Input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                className="h-11 bg-gray-50/30 pr-10"
                                placeholder="********"
                                {...register("password")}
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-3 text-gray-400"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                        </div>
                        <p className="text-[11px] text-gray-400 italic">
                            The user will be prompted to change this upon first login.
                        </p>
                    </div>
                </form>

                {/* Footer fixed at the bottom with specific colors from image */}
                <div className="p-6 bg-gray-50/50 border-t border-gray-100 flex gap-4">
                    <Button
                        variant="outline"
                        type="button"
                        onClick={() => onOpenChange(false)}
                        className="flex-1 h-12 bg-white font-semibold text-gray-700 border-gray-200"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        onClick={handleSubmit(onSubmit)}
                        disabled={isCreating || isUpdating}
                        className="flex-1 h-12 bg-blue-600 hover:bg-blue-700 font-semibold"
                    >
                        {(isCreating || isUpdating) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {user ? "Update User" : "Save User"}
                    </Button>
                </div>

            </SheetContent>
        </Sheet>
    );
}