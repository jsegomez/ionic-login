export interface Datalogin {
    user:  User;
    token: string;
}

export interface User {
    name: string;
    avatar: string;
    email:  string;
    uid:    string;
}
