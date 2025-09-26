export interface ExceptionResponse {
  error: {
    code: number;
    message: string;
    details: string;
};
status: number;
timestamp: string;
}
