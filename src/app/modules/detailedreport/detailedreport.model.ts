export interface FileProcessRecord {
    id?: number;
    file_display_name?: string;
    file_name?: string;
    original_file_size?: string;
    score?: number;
    tidy_up?: boolean;
    ml_consolidation?: boolean;
    ai_enrich?: boolean;
    process_state?: number;
    process_state_name?: string;
    uploaded_on?: any;
    process_output_file?: string;
}

export interface IProcess {
    id?: number;
    data_file_id?: number;
    process_state?: number;
    process_state_name?: string;
    process_output_file?: string;
    supporting_output_file?: string;
    ml_training_file?: any;
    ml_settings_file?: any;
    executed_by?: number;
    executed_on?: any;
}

export interface FileProcessDetails {
    Health_Check?: IProcess;
    Tidy_Up?: IProcess;
    ML_Consolidation?: IProcess;
    AI_Enrich?: IProcess;
}

export interface IFileDetails {
    file_process_record: FileProcessRecord;
    file_process_details: FileProcessDetails;
}

export interface ITab{
    isOriginal?: boolean;
    isTidyUp?: boolean;
    isMLConsolidation?: boolean;
    isAIEnrich?: boolean;
}

export interface IProcess{
    original?: boolean;
    tidyUp?: boolean;
    mlConsolidation?: IMLConsolidationType;
    aiEnrich?: boolean;
}

export interface IMLConsolidationType{
    isMLConsolidation?: boolean;
    isSettings?: boolean;
}

export interface RecordPair {
    Company?: string;
    FirstName?: string;
    LastName?: string;
    FullName?: string;
    Address?: any;
    Zip?: any;
    Phone?: any;
}

export interface ITraining {
    record_pair?: RecordPair[];
    matching_type?: string;
}

export interface IRecordTrack{
    indexCount?: number;
    yesCount?: number;
    noCount?: number;
    maybeCount?: number;
    enableFinishCount?: number;
}