// enum 키워드를 통해서 타입을 작성하는 방법이 2년 전까지는 통용되었음
// 이렇게 만든 GenderType은 객체도 되고, 타입도 되었음
// 객체(값)으로 사용할 때에는 GenderType.MALE
// 타입으로 사용할 때는 GenderType
// enum GenderType = {
//      MALE = "MALE",
//      FEMALE = "FEMALE",
// }

export const Gender = {
    MALE: "MALE",
    FEMALE: "FEMALE",
}

export type GenderType = typeof Gender[keyof typeof Gender];
// typeof 키워드 : 해당 변수의 타입을 반환
// keyof 키워드 : 해당 객체의 키를 반환

export const Role = {
    USER: "USER",
    ADMIN: "ADMIN",
}

export type RoleType = typeof Role[keyof typeof Role];

// 백엔드에서는 prisma가 대신 해준것이고, 프론트엔드에서는 타입을 직접 만들어줘야 한다.
export interface User {
    id: number;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    username: string;
    name: string;
    nickname: string;
    email: string;
    phoneNumber: string | null;
    birthdate: string | null;
    gender: GenderType;
    role: RoleType;
}