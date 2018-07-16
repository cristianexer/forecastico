/*****************************************************************************/
/* my Global Functions */
/*****************************************************************************/


Meteor.myFunctions = {
    //request catre api cu optiuni
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
    //request catre api cu range
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
    //returneaza un obiect cu minimul si maximul din setul de date cu specificatia unui obiect
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
    //formatam setul de date pentru brain.js
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
    //formatam obiectul pentru testare
    iexIdentifierObject:function(obj){
        return{
            change: obj.change,
            open:obj.open,
            close: obj.close,
        };
    },
    //normalizam un obiect in functie de setul de date
    normalizeObject: function (obj, data) {
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
    //imbinam functiile de formatare si normalizare
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
    //generam o culoare random
    getRandomHexColor: function () {
        return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
    },
    //formatam setul de date pentru graficul al pretului de inchidere
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
    //formatam setul de date pentru graficul de volum
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
    //concatenam un array cu numele companiilor pentru un request mai mare
    stringifyComps: function (arr) {
        let str = "";
        arr.map(function (res, key) {
            str +=`${res.symbol},`;
        });
        str[str.length - 1] = "";
        return str;
    },
    //plasam indicatorii in pagina companiilor
    placeIndicators: function (id, arr) {
        let indicatorAdjClose = arr[0] > arr[1] ? "up" : "down";
        let value = arr[0];
        let element = $(`#${id} .indicator`);
        element.append(`<i class="fa fa-arrow-circle-${indicatorAdjClose}"></i>`);
        element.addClass(indicatorAdjClose);
        $(`#${id} .amount`).text(value);


    },
    //curatam containerul de notificare
    cleanNotification:function(){
        $('#notification').removeClass("active error change");
        $('#notification .content').removeClass('active');
        $('#notification .content').text("");
        $('#notification .link').removeClass('active');
        $('#notification .link a').attr('href','#');
        $('#notification .link a').text("");
    },
    //cream o notificare
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
    //adaugam un element legenda in pagina home
    legendItem:function(location,item){
        $(`#${location}`).append(`<div class="col-xs-4 col-md-12 legendItem"><span style="background-color: ${item.color} ;" ></span><div class="legendName">${item.name}</div></div>`);
    },




}