/**
 * Getting random quotes from Quotable
 * ref: https://github.com/lukePeavey/quotable
 */
import axios, {AxiosResponse} from "axios";

type QuotableAPIRequest = {
    maxLength?: number;
    minLength?: number;
    tags?: string;
};

type QuotableAPIResponse = {
    _id: string;
    content: string;
    author: string;
    length: number;
    tags: string[];
};

const uri = "http://api.quotable.io/random";

export const getQuotableAPIData = (request?: QuotableAPIRequest) => axios.get(uri, {params: request}).then((response: AxiosResponse<QuotableAPIResponse>) => response.data.content.split(" "));
