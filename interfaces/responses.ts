export type ResponseData<T> = {
    status: "success"
    resData: T
}

export type ErrorResponse = {
    status: "error"
    message: string
}

export type APIResponseData<T> = ResponseData<T> | ErrorResponse;