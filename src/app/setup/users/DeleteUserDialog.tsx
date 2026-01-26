"use client";

import { Loader2, AlertTriangle } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useDeleteUser } from "@/hooks/useUser";

interface DeleteUserDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    user: any;
}

export function DeleteUserDialog({ open, onOpenChange, user }: DeleteUserDialogProps) {
    const { mutate: deleteUser, isPending } = useDeleteUser();

    const handleDelete = () => {
        if (!user) return;
        deleteUser(user._id, {
            onSuccess: () => {
                onOpenChange(false);
            }
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <div className="flex flex-col items-center gap-2">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                        <AlertTriangle className="h-6 w-6 text-red-600" />
                    </div>
                    <DialogHeader>
                        <DialogTitle className="text-center text-xl">Confirm User Deletion</DialogTitle>
                        <DialogDescription className="text-center">
                            Are you sure you want to delete this user? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                </div>

                <div className="my-4 rounded-lg bg-gray-50 p-4 text-sm">
                    <div className="flex justify-between py-1">
                        <span className="text-gray-500 font-medium">USER NAME</span>
                        <span className="font-semibold">{user?.username}</span>
                    </div>
                    <div className="flex justify-between py-1 border-t border-gray-200 mt-1 pt-1">
                        <span className="text-gray-500 font-medium">ARMY NUMBER</span>
                        <span className="font-semibold uppercase tracking-wider">{user?.armyNo}</span>
                    </div>
                </div>

                <div className="rounded-md bg-red-50 p-3 mb-4">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <AlertTriangle className="h-5 w-5 text-red-400" aria-hidden="true" />
                        </div>
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-red-800">All associated records will be archived for 30 days.</h3>
                        </div>
                    </div>
                </div>

                <DialogFooter className="sm:justify-center gap-2 w-full">
                    <Button variant="outline" onClick={() => onOpenChange(false)} className="w-full sm:w-auto">Cancel</Button>
                    <Button
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={isPending}
                        className="w-full sm:w-auto bg-red-600 hover:bg-red-700"
                    >
                        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Delete Permanently
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
