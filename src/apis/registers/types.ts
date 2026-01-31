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
        initialsOfMPCRNCO?: boolean;
        initialsOfSMSJCO?: boolean;
        initialsOf2IC?: boolean;
    };
    remark?: string;
    status?: string;
    createdAt?: string;
    updatedAt?: string;
}

export type CreateRegisterEntryData = Partial<RegisterEntry>;
