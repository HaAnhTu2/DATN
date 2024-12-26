export interface User {
    _id: string;
    first_name: string;
    last_name: string;
    email: string;
    password?: string;
    address: string;
    phone_number: string;
    role: string;
    userimage_url: File;
}
export interface Signup {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    phone_number: string;
}

