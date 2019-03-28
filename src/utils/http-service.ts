

export class HttpService {

    private _url:string;
    set url(value:string) {
        this._url = value;
    }
    get url():string {
        return this._url;
    }

    _params:HttpParams;
    get params():HttpParams {
        if(this._params == null) {
            return {} as HttpParams;
        }
        return this._params;
    }

    constructor() {
        this.url = window.location.href;
        this._params = this._getParams(this.url);
    }

    private _getParams(url:string):HttpParams {
        const params:HttpParams = {};
        const parser = document.createElement('a');
        parser.href = url;
        const query = parser.search.substring(1);
        const vars = query.split('&');
        for(let i = 0; i < vars.length; i++) {
            const pair = vars[i].split('=');
            params[pair[0]] = decodeURIComponent(pair[1]);
        }
        return params;
    }

}

export interface HttpParams {
    [name:string]:string
}