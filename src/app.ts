import { HttpService, HttpParams } from './utils/http-service';
import { coerceNumberProperty } from './utils/number-property';
import * as Highcharts from 'highcharts';
(<any>require('highcharts-more'))(Highcharts);
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
    courageous:number;
    creative:number;
    collaborative:number;
    contemplative:number;
    date:any;
    isParamsSet = false;
    months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    highcharts:typeof Highcharts = Highcharts;
    forceUpdate = false;
    chartOptions:Highcharts.Options = {
        chart: {
            polar: true,
            type: 'line',
            margin: [0, 0, 0, 0],
            spacing: [0, 0, 0, 0]
        },
        plotOptions: {
            line: {
                color: '#000',
                lineWidth: 2
            }
        },
        credits: {
            enabled: false
        },
        title: {
            text: '',
            x: -80
        },

        pane: {
            size: '100%',
            startAngle: -45
        },

        xAxis: {
            categories: ['Courageous', 'Creative', 'Collaborative', 'Tactical'],
            labels: {
                align: 'center',
                reserveSpace: false,
                // distance: -5,
                style: {
                    color: '#FFF',
                    fontSize: '16px',
                    fontWeight: '600',
                    // padding: '0'
                }
            },
            gridLineWidth: 1
        },

        yAxis: {
            gridLineInterpolation: 'polygon',
            minorTickWidth: 0,
            min: 0,
            labels: {
                enabled: false
            }
        } as Highcharts.YAxisOptions,

        tooltip: {
            shared: true,
            pointFormat: '<span style="color:{series.color}">{series.name}: <b>{point.y:,.0f}</b><br/>'
        },

        legend: {
            enabled: false
        },

        series: [{
            name: 'Score',
            data: [],
            pointPlacement: 'on'
        }] as any,

        responsive: {
            rules: [{
                condition: {
                    maxWidth: 550
                },
            }]
        }
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
                let hostPath = this.urls[i].split('//')[1];

                if (hostPath.indexOf(':') > -1) {
                    hostPath = hostPath.split(':')[0];
                }

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
        // temporary for testing... 
        // let imageToRemove = this.jq('.fl-photo-img.wp-image-953');
        // let container = imageToRemove.parent();
        // let col = container.closest('.fl-col').next();
        // col.empty();
        // col.width('400px');
        // col.height('400px');

        let col = this.jq('#vs-chart');

        this.updateChartData();

        Highcharts.chart(col[0], this.chartOptions, 
            (<Highcharts.ChartCallbackFunction>(<unknown>this.renderTheme)));

        this.jq('#vs-chart-hero-name').text(`${this.firstName} ${this.lastName}`);
        this.jq('#vs-chart-hero-date').text(`on ${this.date}`);
        this.jq('#vs-chart-intro-first-name').text(`Dear ${this.firstName}:`);
        this.jq('#vs-chart-legend-courageous').text(`${this.courageous}`);
        this.jq('#vs-chart-legend-creative').text(`${this.creative}`);
        this.jq('#vs-chart-legend-contemplative').text(`${this.contemplative}`);
        this.jq('#vs-chart-legend-collaborative').text(`${this.collaborative}`);
        this.jq('#vs-chart-your-style-name').text(`${this.firstName} ${this.lastName}`);
    }

    private renderTheme = (chart:Highcharts.Chart) => {
        const containerLeft = chart.plotLeft;
        const containerTop = chart.plotTop;
        const containerWidth = chart.plotWidth;
        const containerHeight = chart.plotHeight;

        const adjWidth = containerWidth * 0.10;
        const adjHeight = containerHeight * 0.10;
        const q1Left = (containerLeft + adjWidth) - 5;
        const q1Top = (containerTop + adjHeight) - 5;
        const q1Width = (containerWidth - (adjWidth * 2)) / 2;
        const q1Height = (containerHeight - (adjHeight * 2)) / 2;

        (<Highcharts.SVGElement>chart.renderer.rect(q1Left, q1Top, q1Width, q1Height)
            .attr({
                fill: '#e18f00',
                zIndex: 0
            }))
            .add();

        const q2Left = ((containerLeft + adjWidth) + q1Width) + 5;
        const q2Top = (containerTop + adjHeight) - 5;

        (<Highcharts.SVGElement>chart.renderer.rect(q2Left, q2Top, q1Width, q1Height)
            .attr({
                fill: '#744391',
                zIndex: 0
            }))
            .add();

        const q3Left = (containerLeft + adjWidth) - 5;
        const q3Top = ((containerTop + adjHeight) + q1Height) + 5;

        (<Highcharts.SVGElement>chart.renderer.rect(q3Left, q3Top, q1Width, q1Height)
            .attr({
                fill: '#c51735',
                zIndex: 0
            }))
            .add();

        const q4Left = ((containerLeft + adjWidth) + q1Width) + 5;
        const q4Top = ((containerTop + adjHeight) + q1Height) + 5;

        (<Highcharts.SVGElement>chart.renderer.rect(q4Left, q4Top, q1Width, q1Height)
            .attr({
                fill: '#1a764e',
                zIndex: 0
            }))
            .add();
    }

    private updateChartData() {
        (<any>this.chartOptions.series[0]).data.push(this.courageous);
        (<any>this.chartOptions.series[0]).data.push(this.creative);
        (<any>this.chartOptions.series[0]).data.push(this.collaborative);
        (<any>this.chartOptions.series[0]).data.push(this.contemplative);
        this.forceUpdate = true;
    }

    private setQueryParams() {
        const params = new URLSearchParams(window.location.search);

        if (!this.checkParams(params)) {
            return;
        }

        this.firstName = params.get('f');
        this.lastName = params.get('l');
        this.courageous = coerceNumberProperty(params.get('b'));
        this.creative = coerceNumberProperty(params.get('cr'));
        this.collaborative = coerceNumberProperty(params.get('co'));
        this.contemplative = coerceNumberProperty(params.get('t'));
        let date = params.get('d');
        
        this.date = date == null ? new Date() : new Date(Date.parse(date));
        this.date = this.months[this.date.getMonth()] + ' ' + this.date.getDate() + ', ' + this.date.getFullYear();
    }

    private checkParams(params:URLSearchParams):boolean {
        if (!params.has('f') || !params.has('l') || !params.has('b') || !params.has('cr') || !params.has('co')
            || !params.has('t') || !params.has('d')) {
            
            this.isParamsSet = false;
        } else {
            this.isParamsSet = true;
        }
        return this.isParamsSet;
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
