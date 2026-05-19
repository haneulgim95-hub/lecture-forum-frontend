export const CategoryStatus = {
    ACTIVE: "ACTIVE",
    INACTIVE: "INACTIVE",
}

export type CategoryStatusType = typeof CategoryStatus[keyof typeof CategoryStatus];

export interface Category {
    id: number;
    createAt: Date;
    updatedAt: Date;
    name: string;
    status: CategoryStatusType;
}