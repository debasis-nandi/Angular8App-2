export interface IUploadedFiles{
    id?: any;
    score?: number;
    originalFile?: string;
    processedFile?: string;
    uploadedDate?: any;
    tidyUpData?: boolean;
    mlConsolidation?: boolean;
    aiEnrich?: boolean;
    action?: any[]
}

export interface ITab{
    isOriginal?: boolean;
    isTidyUp?: boolean;
    isMLConsolidation?: boolean;
    isAIEnrich?: boolean;
}

export interface IDatabaseParameters{
    username?: string;
    password?: string;
    host?: string;
    port?:number;
    database?:string;
    query?:string;
}