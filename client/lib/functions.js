/*****************************************************************************/
/* my Global Functions */
/*****************************************************************************/


Meteor.myFunctions = {
    callQuandl: async function (SYMBOL, Handler) {

        var final = 'https://www.quandl.com/api/v3/datasets/WIKI/' + SYMBOL + '/data.json?start_date=2016-01-01&column_index=11&order=asc&api_key=FHgZKM4zrgcJkQs5TiHv';

        await HTTP.get(final, {}, function (error, response) {
            if (error) {
                console.log(error);
            } else {

                Handler(response.data.dataset_data.data);
            }
        });

    },
    callIEX: async function (SYMBOL, Handler) {

        var final = 'https://api.iextrading.com/1.0/stock/market/batch?symbols=' + SYMBOL + '&types=news,quote&range=1m&last=1';

        await HTTP.get(final, {}, function (error, response) {
            if (error) {
                console.log(error);
            } else {

                Handler(response);
            }
        });

    },
    oneYearTimeseriesIEX: async function (SYMBOL, Handler) {

        var final = 'https://api.iextrading.com/1.0/stock/market/batch?symbols=' + SYMBOL + '&types=timeseries&range=1y&last=1';

        await HTTP.get(final, {}, function (error, response) {
            if (error) {
                console.log(error);
            } else {
                //return response
                Handler(response);
            }
        });

    },
    timeseriesIEX: async function (SYMBOL, Handler) {

        var final = 'https://api.iextrading.com/1.0/stock/market/batch?symbols=' + SYMBOL + '&types=quote,news,timeseries&range=1m&last=1';

        await HTTP.get(final, {}, function (error, response) {
            if (error) {
                console.log(error);
            } else {
                //return response
                Handler(response);
            }
        });

    },
    fullCallIEX: async function (SYMBOL, Handler) {

        var final = 'https://api.iextrading.com/1.0/stock/market/batch?symbols=' + SYMBOL + '&types=quote,news,timeseries&range=1m&last=18';

        await HTTP.get(final, {}, function (error, response) {
            if (error) {
                console.log(error);
            } else {
                //return response
                Handler(response);
            }
        });

    },
    getDateNow: function () {
        return new Date(); //return timestamp
    },
    formatDate: function (date) {
        return date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate();
    },
    toTimestamp: function (strDate) {
        return parseInt((new Date(strDate).getTime() / 1000).toFixed(0));
    },
    dateOperation: function(date,day){
        return date.getFullYear() + '-' + date.getMonth() + '-' + (date.getDate()+ (day));
    },
    toDate: function (UNIX_Timestamp){
        return new Date(UNIX_Timestamp * 1000);
    },
    getMinMaxOfDataArr: function (data) {
        var min = data[0].close,
            max = data[0].close;

        data.map(function (result, key) {
            if (result.close < min)
                min = result.close;
            if (result.close > max)
                max = result.close;
        });
        return {
            max: max,
            min: min
        };
    },
    iexDataFormat : function(obj,output){
        //change
        //changeOverTime
        //changePercent
        //close
        //date
        //high
        //label
        //low
        //open
        //unadjustedVolume
        //volume
        //vwap
        let dataform = {
            input: {
                change: obj.change,
                changePercent: obj.changePercent,
                open: obj.open,
                low: obj.low,
                close: obj.close,
            },
            output: {}
        };
        dataform.output[output] = 1;

        return dataform;
    },
    dataFormat: function (value,change, output) {
        let dataform = {
            input: {
                changePercent:change,
                value: value,
            },
            output: {}
        };
        dataform.output[output] = 1;

        return dataform;
    },
    changingPercent: function(two, one) {
        let change = ((one - two) / one) * 10;
        change = change > 0 ? change * 1 : change * -1;
        return change;
    },
    normalize: function (data) {
        var minMax = Meteor.myFunctions.getMinMaxOfDataArr(data);

        data.map((res, key) => {
            res.close = (res.close - minMax.min) / (minMax.max - minMax.min);
        });
        return data;
    },
    iexIdentifierObject:function(obj){
        return{
            date:obj.date,
            change: obj.change,
            changePercent: obj.changePercent,
            high: obj.high,
            low: obj.low,
            close: obj.close,
        };
    },
    iexDataHandler:function(data){

        var trainingData = [];

        for (let i = 1; i < data.length - 2; i++) {
            trainingData.push(Meteor.myFunctions.iexDataFormat(data[i], data[i+1].close));
        }



        return trainingData;
    },
    dataHandler: function (data) {
        var trainingData = [];

        for (let i = 1; i < data.length - 2; i++) {
            trainingData.push(Meteor.myFunctions.dataFormat(data[i][1], Meteor.myFunctions.changingPercent(data[i-1][1],data[i][1]), data[i + 1][1]));
        }

     

        return trainingData;
    },
    getRandomHexColor: function () {
        return '#' + Math.floor(Math.random() * 16777215).toString(16);
    },
    formatDataForChart: function (data) {
        var dates = [];
        var closeds = [];

        data.map(function (res, key) {
            closeds.push(res.close);
            dates.push(res.date);
        });
        return {
            dates: dates,
            closeds: closeds
        };
    },
    stringifyComps: function (arr) {
        var str = "";
        arr.map(function (res, key) {
            str = str + res.symbol + ",";
        });
        str[str.length - 1] = "";
        return str;
    },

    placeIndicators: function (id, arr) {
        var indicatorAdjClose = arr[0] > arr[1] ? "up" : "down";
        var value = arr[0];
        var element = $('#' + id + " .indicator");
        element.append('<i class="fa fa-arrow-circle-' + indicatorAdjClose + '"></i>');
        element.addClass(indicatorAdjClose);
        $('#' + id + " .amount").text(value);


    }


}