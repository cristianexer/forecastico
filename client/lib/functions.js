/*****************************************************************************/
/* my Global Functions */
/*****************************************************************************/


Meteor.myFunctions = {

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
    highCallIEX: async function(SYMBOL, Handler) {

        var final = 'https://api.iextrading.com/1.0/stock/market/batch?symbols='+SYMBOL+'&types=timeseries&range=1y';

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
    getMinMaxOfDataArr: function (data,k) {
        var min = data[0][k],
            max = data[0][k];

        data.map(function (result, key) {
            if (result[k] < min)
                min = result[k];
            if (result[k] > max)
                max = result[k];
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
                open: obj.open,
                close: obj.close,
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
            change: obj.change,
            open:obj.open,
            close: obj.close,
        };
    },
    normalizeObject: function (obj, data) {//key for normalize minMax of features
        let minMaxClose = Meteor.myFunctions.getMinMaxOfDataArr(data,"close");
        let minMaxOpen = Meteor.myFunctions.getMinMaxOfDataArr(data, "open");
        let minMaxChange = Meteor.myFunctions.getMinMaxOfDataArr(data, "change");
        obj.change = obj.change < 0 ? (obj.change * -1) : obj.change;

        return{
            change: (obj.change - minMaxChange.min) / (minMaxChange.max - minMaxChange.min),
            open: (obj.open - minMaxOpen.min) / (minMaxOpen.max - minMaxOpen.min),
            close: (obj.close - minMaxClose.min) / (minMaxClose.max - minMaxClose.min),
        }
    },
    iexDataHandler:function(data){

        var trainingData = [];

        for (let i = 1; i < data.length - 2; i++) {
            trainingData.push(
                Meteor.myFunctions.iexDataFormat(
                    Meteor.myFunctions.normalizeObject(data[i],data),
                     data[i+1].close)
                    );
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


    },
    cleanNotification:function(){
        $('#notification').removeClass("active error change");
        $('#notification .content').removeClass('active');
        $('#notification .content').text("");
        $('#notification .link').removeClass('active');
        $('#notification .link a').attr('href','#');
        $('#notification .link a').text("");
    },
    notification: async function (type, content, hyperLink, linkName){
        let time = 10000;
        Meteor.myFunctions.cleanNotification();
        
        if (content != null && content != '' && typeof content !== "undefined"){
            $('#notification .content').addClass('active');
            $('#notification .content').text(content);
        }
        if (linkName != null && linkName != '' && typeof linkName !== "undefined"){
            $('#notification .link').addClass('active');
            $('#notification .link a').attr('href', hyperLink);
            $('#notification .link a').text(linkName);
        }
        if (type != null && type != '' && typeof type !== "undefined")
            $('#notification').addClass(`active ${type}`);
        else 
            $('#notification').addClass('active');

        Meteor.setTimeout(function() { 
                Meteor.myFunctions.cleanNotification();
        }, time);

        $('#notification .closeNotif').click( () => Meteor.myFunctions.cleanNotification() );
    },
    legendItem:function(location,item){
        $(`#${location}`).append(`<div class="col-xs-4 col-md-12 legendItem"><span style="background-color: ${item.color} ;" ></span><div class="legendName">${item.name}</div></div>`);
    },




}