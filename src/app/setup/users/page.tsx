"use client";

import UserManagement from "@/common/features/users/UserManagement";
import { withAdminAuth } from "@/hoc/withSuperAdmin";

function UserManagementPage() {
    return <UserManagement />;
}

export default withAdminAuth(UserManagementPage);