export interface User {
    user_id: string;
    email: string;
    password?: string;
    birthday: string;
    gender: string;
    role: string;
    status: string;
}
export interface Signup {
    email: string;
    password: string;
    birthday:string;
    gender:string;
}

