import { HttpService, HttpParams } from './utils/http-service';
import { coerceNumberProperty } from './utils/number-property';
import * as Highcharts from 'highcharts';
const jQuery = require('jquery');

const COOKIE_NAME = 'hc_urls';
const CHART_ID = 'vs-chart';

export class AppModule {

    jq:any;
    http:HttpService;
    params:HttpParams
    form:any;
    currentUrl:string;
    urls:string[];

    // QUERY PARAMS
    firstName:string;
    lastName:string;
    bold:number;
    creative:number;
    collaborative:number;
    tactical:number;
    isParamsSet = false;

    highcharts:typeof Highcharts = Highcharts;
    forceUpdate = false;
    chartOptions:Highcharts.Options = {
        chart: {
            polar: true,
            type: 'line'
        },
        credits: {
            enabled: false
        },
        title: {
            text: '',
            x: -80
        },

        pane: {
            size: '80%',
            startAngle: -45
        },

        xAxis: {
            categories: ['Bold', 'Creative', 'Collaborative', 'Tactical'],
            tickmarkPlacement: 'on',
            lineWidth: 0
        },

        yAxis: {
            gridLineInterpolation: 'polygon',
            lineWidth: 0,
            min: 0
        } as Highcharts.YAxisOptions,

        tooltip: {
            shared: true,
            pointFormat: '<span style="color:{series.color}">{series.name}: <b>{point.y:,.0f}</b><br/>'
        },

        legend: {
            align: 'right',
            verticalAlign: 'middle',
            y: 70,
            layout: 'vertical'
        },

        series: [{
            name: 'Score',
            data: [],
            pointPlacement: 'on'
        }] as any
    };

    constructor() {
        this.http = new HttpService();
        this.params = this.http.params;
        this.jq = jQuery;
        this.currentUrl = window.location.hostname + window.location.pathname;

        this._handleFormSubmit();
        this.onInit();
    }

    onInit() {
        const cookieExists = this._cookieExists(COOKIE_NAME);
        if (cookieExists) {
            const cookie = this._getCookie(COOKIE_NAME);
            this.urls = JSON.parse(cookie);

            for(let i = 0; i < this.urls.length; i++) {
                const hostPath = this.urls[i].split('//')[1];

                // if the current URL doesn't have a matching hostname + path, we skip to next iteration
                if (this.currentUrl.indexOf(hostPath) < 0) continue;

                this.setQueryParams();
                break;
            }

            if (this.isParamsSet) {
                this.buildChart();
            } else {

                throw new Error(`No params set, cannot render chart.`);
            }
                
        }
    }

    private buildChart() {
        // BUILD CHART AND PUT ON DOM
    }
    private updateChartData() {
        (<any>this.chartOptions.series[0]).data.push(this.bold);
        (<any>this.chartOptions.series[0]).data.push(this.creative);
        (<any>this.chartOptions.series[0]).data.push(this.collaborative);
        (<any>this.chartOptions.series[0]).data.push(this.tactical);
        this.forceUpdate = true;
    }

    private setQueryParams() {
        const params = new URLSearchParams(window.location.search);

        this.firstName = params.get('f');
        this.lastName = params.get('l');
        this.bold = coerceNumberProperty(params.get('b'));
        this.creative = coerceNumberProperty(params.get('cr'));
        this.collaborative = coerceNumberProperty(params.get('co'));
        this.tactical = coerceNumberProperty(params.get('t'));
        this.isParamsSet = true;
    }

    private _cookieExists(cookieName:string):boolean {
        if(this._getCookie(cookieName).length) {
            return true;
        }
        return false;
    }

    private _getCookie(cookieName:string):string {
        const name = cookieName + '=';
        const decodedCookie = decodeURIComponent(document.cookie);
        const ca = decodedCookie.split(';');

        for(let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while(c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if(c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return '';
    }

    private _handleFormSubmit() {
        this.form = this.jq('form#vs_custom_form');

        let request:any;
        const $ = this.jq;
        const currentUrl = location.host + location.pathname;

        this.form.on('submit', function(event) {
            event.preventDefault();

            if (request)
                request.abort();

            const $frm = $(this);
            const $inputs = $frm.find('input');
            const serialized = $frm.serialize();

            $inputs.prop('disabled', true);

            request = $.ajax({
                url: `${currentUrl}`,
                type: 'POST',
                data: serialized
            });

            request.done(function(resp, textStatus, jqXHR) {
                console.log(`It worked!`);
                console.dir(resp);
            });

            request.fail(function(jqXHR, textStatus, errorThrown) {
                console.error(`
                    The following error occurred: ${textStatus}, ${errorThrown}
                `);
            });

            request.always(function() {
                $inputs.prop('disabled', false);
            });
        });
    }

    // private getInnovationStyle():string {
    //     const values = [this.bold, this.creative, this.collaborative, this.tactical];
    //     const highValue = Math.max.apply(null, values) as number;

    //     for(const p in this.contact) {
    //         if(this.contact[p] == highValue) {
    //             if (p == 'boldScore')
    //                 return 'Bold';

    //             if (p == 'creativeScore')
    //                 return 'Creative';

    //             if (p == 'collaborativeScore')
    //                 return 'Collaborative';

    //             if (p == 'tacticalScore')
    //                 return 'Tactical';
    //         }
    //     }
    // }

}

