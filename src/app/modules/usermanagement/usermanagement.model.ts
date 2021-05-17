export interface IUserPostModel{
    email?: string;
    first_name?: string;
    last_name?: string;
    is_active?: boolean;
    role_id?: any;
    modified_by?: any;
}

export interface IUser{
    id?: any;
    firstName?: string;
    lastName?: string;
    userName?: string;
    emailId?: string;
    assessLevel?: any;
    status?: any;
    updatedBy?: any;
    updatedOn?: any;
    action?: any[];
}