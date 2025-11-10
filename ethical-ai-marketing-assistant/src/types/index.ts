export interface RequestData {
    input: string;
    parameters: Record<string, any>;
}

export interface ResponseData {
    output: string;
    success: boolean;
    error?: string;
}