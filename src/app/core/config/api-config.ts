
export class ApiConfig{

    //authentication api
    public static userInfoApi: string = '/users/auth/userinfo';

    //user management api
    public static getUserListApi: string = '/users/list';
    public static addUserApi: string = '/users/add';
    public static updateUserApi: string = '/users/edit/{userId}';
    public static deleteUserApi: string = '/users/delete/{userId}';
    public static getUserApi: string = '/users/details/{userId}';
    public static getRolesApi: string = '/users/roles';
    //public static exportUserApi: string = '/users/list/export';
    public static exportUserApi: string = '/users/list/export?timezone={timezone}';

    //home page
    public static healthCheckApi: string = '/healthcheck/upload-input-file';
    public static healthCheckFileDetailsApi: string = '/healthcheck/file-process-details/{data_file_id}';
    public static getUploadedFilesApi: string = '/healthcheck/file-process-list?first={first}&rows={rows}&globalFilter={filter}&sortField={sortfield}&sortOrder={sortorder}';
    public static getUploadedFilesApi2: string = '/healthcheck/file-process-list?sortField={sortfield}&sortOrder={sortorder}';
    public static previewOriginalApi: string = '/healthcheck/original-file-data/{file-id}';
    public static previewTidyupApi: string = '/tidyup/tidy-file-data/{file-id}';
    public static previewMLconsolApi: string = '/mlconsol/mlconsol-file-data/{file-id}';
    public static previewAIenrichApi: string = '/aienrich/ai-enrich-file-data/{file-id}';
    public static signInApi: string = '/healthcheck/CheckConnection/';
    public static previewDataSourceApi: string = '/healthcheck/PreviewDatasource';
    public static generateDataSourceApi: string = '/healthcheck/GenrateDatasourceFile/';
    
    //health check process
    public static downloadApi: string = '/healthcheck/download-data-file/{filename}';
    public static getScoreApi: string = '/healthcheck/run-healthcheck-process/{data_file_id}';
    public static runTidyUpApi: string = '/tidyup/run-tidyup-process/{data_file_id}';
    public static aiEnrichApi: string = '/aienrich/run-ai-enrich-process/{data_file_id}';
    public static mlConsolidationApi: string = '/mlconsol/run-ml-consolidation/{data_file_id}';
    public static mlConsolidationTrainingApi: string = '/mlconsol/training-records/{data_file_id}';
    public static deleteProcessApi: string = '/healthcheck/delete-file-records/{data_file_id}';
    
    
    //process status check
    public static processStatusApi: string = '/healthcheck/get-process-status/{data_file_id}';

}