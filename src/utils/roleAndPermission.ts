

export const Roles = {
    AdminId: "693cffd277dcb901a58d53ea",
    ManagerId: "693cffe077dcb901a58d53ec",
    DataEntryId: "693d005b77dcb901a58d53ee",
    Admin: "Admin",
    Manager: "Manager",
    DataEntry: "Data Entry",
} as const;

export const roleList = [Roles.Admin, Roles.Manager, Roles.DataEntry];
export const roleListForOption = [
    { value: Roles.ManagerId, label: Roles.Manager },
    { value: Roles.DataEntryId, label: Roles.DataEntry },

];

export const getRoleByIdAndName = (key: string, trim: boolean = false): string => {
    const roleList: Record<string, string> = {
        [Roles.Admin]: Roles.ManagerId,
        [Roles.Manager]: Roles.ManagerId,
        [Roles.DataEntry]: Roles.DataEntryId,
        [Roles.AdminId]: Roles.Admin,
        [Roles.ManagerId]: Roles.Manager,
        [Roles.DataEntryId]: Roles.DataEntry,
    };

    let value = roleList[key];
    if (!value) return "";

    if (trim) {
        value = value.trim().replace(/\s+/g, "");
    }

    return value;
};


export const getRolePermission = (roleId: string, action: string) => {
    if (!roleId || !action) return false;

    const roleList: Record<string, boolean> = {

        "view-projects": ([Roles.AdminId, Roles.ManagerId, Roles.DataEntryId] as string[]).includes(roleId),
        "add-project": ([Roles.AdminId, Roles.ManagerId] as string[]).includes(roleId),
        "edit-project": ([Roles.AdminId, Roles.ManagerId] as string[]).includes(roleId),
        "delete-project": ([Roles.AdminId, Roles.ManagerId] as string[]).includes(roleId),

        "view-users": ([Roles.AdminId, Roles.ManagerId] as string[]).includes(roleId),
        "add-user": ([Roles.AdminId, Roles.ManagerId] as string[]).includes(roleId),
        "edit-user": ([Roles.AdminId, Roles.ManagerId] as string[]).includes(roleId),
        "delete-user": ([Roles.AdminId, Roles.ManagerId] as string[]).includes(roleId),
        "view-audit-trail": ([Roles.AdminId, Roles.ManagerId] as string[]).includes(roleId),

        "view-settings": ([Roles.AdminId] as string[]).includes(roleId),
        "generate-report": ([Roles.AdminId, Roles.ManagerId] as string[]).includes(roleId),

    };

    return roleList[action] || false;
};
