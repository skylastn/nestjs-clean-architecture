import { AxiosResponse } from "axios";

export class ResponseModel {
    status?: boolean;
    message?: string;
    total?: number;
    perPage?: number;
    currentPage?: number;
    data?: any;

    static from(res: AxiosResponse<any, any>): ResponseModel {
        return {
            status: res.data.status ?? res.status === 200,
            message: res.data.message ?? res.statusText ?? "Success",
            total: res.data.total,
            perPage: res.data.perPage,
            currentPage: res.data.currentPage,
            data: res.data.data
        };
    }
}
