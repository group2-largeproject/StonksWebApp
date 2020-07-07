import * as iex from "./types";
export default class IEXRequest {
    fetchFunc: typeof fetch;
    publishable: string;
    sandbox: boolean;
    version: iex.Version;
    stockSymbol: string;
    stockSymbols: string[];
    datatype: string;
    cryptoCurrency: string;
    constructor(fetchFunc: typeof fetch | any, { publishable, sandbox, version }: iex.Configuration);
    private setToken;
    params: (params?: string) => string;
    batchParams: (...types: string[]) => string;
    request: (params: string) => Promise<any>;
    response: (req: any, params: any, range?: any) => Promise<any>;
}
