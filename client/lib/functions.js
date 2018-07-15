/*****************************************************************************/
/* my Global Functions */
/*****************************************************************************/


Meteor.myFunctions = {

    requestAPI: async function (SYMBOL,option, Handler) {
        let source = 'https://api.iextrading.com/1.0/stock/market/batch?symbols=';
        let options = {
            newsQuote : `&types=news,quote&range=1m&last=1`,
            oneYear: `&types=timeseries&range=1y&last=1`,
            timeseries:`&types=quote,news,timeseries&range=1m&last=1`,
            fullCall: `&types=quote,news,timeseries&range=1m&last=18`,

        };
        let req = `${source}${SYMBOL}${options[option]}`;
        await HTTP.get(req, {}, (error, response) =>{
            if (error) {
                console.log(error);
            } else {
                Handler(response);
            }
        });

    },
    selectedRequest: async function(SYMBOL,range, Handler) {

        var final = `https://api.iextrading.com/1.0/stock/market/batch?symbols=${SYMBOL}&types=timeseries&range=${range}`;

        await HTTP.get(final, {}, function (error, response) {
            if (error) {
                console.log(error);
            } else {
                //return response
                Handler(response);
            }
        });

    },
    getMinMaxOfDataArr: function (data,k) {
        let min = data[0][k],
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

        let trainingData = [];

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
        return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
    },
    formatDataForChart: function (data) {
        let dates = [];
        let closeds = [];

        data.map(function (res, key) {
            closeds.push(res.close);
            dates.push(res.date);
        });
        return {
            dates: dates,
            closeds: closeds
        };
    },
    formatDataForVolumeChart: function (data) {
        let dates = [];
        let volume = [];

        data.map(function (res, key) {
            volume.push(res.volume);
            dates.push(res.date);
        });
        return {
            dates: dates,
            volume: volume
        };
    },
    stringifyComps: function (arr) {
        let str = "";
        arr.map(function (res, key) {
            str = str + res.symbol + ",";
        });
        str[str.length - 1] = "";
        return str;
    },

    placeIndicators: function (id, arr) {
        let indicatorAdjClose = arr[0] > arr[1] ? "up" : "down";
        let value = arr[0];
        let element = $(`#${id} .indicator`);
        element.append(`<i class="fa fa-arrow-circle-${indicatorAdjClose}"></i>`);
        element.addClass(indicatorAdjClose);
        $(`#${id} .amount`).text(value);


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