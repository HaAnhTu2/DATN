export interface User {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    password?: string;
    address:string;
    phone_number:string;
    role:string;
    userimage_url:File;
}
