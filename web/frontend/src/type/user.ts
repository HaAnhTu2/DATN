export interface User {
    _id: string;
    firstname: string;
    lastname: string;
    email: string;
    password?: string;
    address:string;
    phone_number:string;
    role:string;
    userimage_url:File;
}
