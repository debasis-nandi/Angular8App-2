export interface IAuthentication {
    email?: string;
    password?: string;
}

export interface IToken {
    token?: any;
    refreshtoken?: any;
}

export interface IUserInformation{
    user_id?: number;
    username?: string;
    exp?: number;
    email?: string;
    rolename?: string;
    roletype?: string;
    roletypeId?: number;
    clientname?: string;
    clientid?: number;
    accountname?: string;
    accountid?: number;
    user?: string;
    admin?: boolean;
}