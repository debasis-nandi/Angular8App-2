
export enum GlobalConst {
    growlLife = 3000,
    maxTextAreaLength = 1000,
    maxUploadedFileSize = 10485760
}

export enum Action {
    delete = "Delete",
    download = "Download",
    share = "Share",
    copy = "Copy",
    edit = "Edit",
    search = "Search",
    downloadTemplate = "DownloadTemplate",
    add = "Add",
    view = "View",
    disable = "Disable",
    enable = "Enable",
    preview = "Preview"
}

export enum DocType{
    doc = "doc",
    docx = "docx",
    pdf = "pdf",
    csv = "csv",
    xls = "xls",
    xlsx = "xlsx",
    ppt = "ppt",
    pptx = "pptx",
    png = "png",
    jpg = "jpg",
    jpeg = "jpeg",
    gif = "gif",
    txt = "txt"
}

export enum TableName {
    usermanagement = 'usermanagement',
    uploadedfiles = 'uploadedfiles',
    originalPreview = 'OriginalPreview',
    tidyUpPreview = 'TidyUpPreview',
    mlConsolidationPreview = 'MLConsolidationPreview',
    aiEnrichPreview = 'AIEnrichPreview'
}

export enum validatorPattern{
    pattern1 = "^(?=.*[a-zA-Z])[a-zA-Z0-9 ]+$", // Allow letters and numbers only
    pattern2 = "^[0-9]*$", // Allow numbers only
    pattern3 = "^(?=.*[a-zA-Z])[A-Za-z0-9 !@#$%&*,._();-]+$", 
    pattern4 = "/[^<>]+/g", //match everything but '<' and '>'
    pattern5 = "/[^<>,\s]+/g", //match anything but '<', '>', ',' and '\s' (\s=any whitespace)
    pattern6 = "^[A-Za-z_-][A-Za-z0-9_-]*$"
}

export enum Role{
    admin = "admin",
    user = "user"
}

export enum TabName{
    original = "Original",
    tidyUp = "TidyUp",
    mlConsolidation = "MLConsolidation",
    aiEnrich = "AIEnrich"
}

export enum DbName{
    mySql="MySql",
    sqlServer="SqlServer",
    oracle="Oracle"
}

export enum Environment {
    Prod = 'prod',
    Stage = 'stage',
    Uat = 'uat',
    Dev = 'dev'
}

export enum ProcessStatus {
    PENDING = 'PENDING',
    FINISHED = 'FINISHED',
    TIMEOUT = 'TIMEOUT',
    ERROR = 'ERROR'
}

export enum ProcessState{
    HealthCheck = 'Health_Check',
    TidyUp = 'Tidy_Up',
    MLConsolidation = 'ML_Consolidation',
    AIEnrich = 'AI_Enrich'
}