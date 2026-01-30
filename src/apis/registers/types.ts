export interface RegisterEntry {
    _id?: string;
    type: string;
    date: string;
    outTime?: string;
    inTime?: string;
    duty?: any;
    details?: any;
    outSignature?: any;
    inSignature?: any;
    authentication?: {
        initialsMPCPNCO?: string;
        initialsQMSJCO?: string;
        initials2IC?: string;
    };
    remark?: string;
    status?: string;
    createdAt?: string;
    updatedAt?: string;
}

export type CreateRegisterEntryData = Partial<RegisterEntry>;
