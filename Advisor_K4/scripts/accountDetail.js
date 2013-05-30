function initScrollView(e) { 
        e.view.element.find("#scrollView").kendoMobileScrollView(); 
}

function getAcctDetail(e)
{
    var acctId = e.view.params.acctId;
    var hhId = e.view.params.householdId;
  
 //  alert("getAccountDetail");
    
    $("#accountDetailInfo").empty();
    $("#holdingsInfo").empty();
    $("#chart").empty();
    $("#assetsTable").empty();    
    $('#archivedRpts').empty();
    
    var morechartHref = '#views/morechartsView.html?householdId='+hhId+'&accountId='+acctId+'&investorId='+currentInvId;
    
    $("#morechart").attr('href', morechartHref);
 
    var param = '{instId:' + instId + ', brokerId:' + bId + ', acctId:"' + acctId + '", householdId:' + hhId + ', planId: 0, partyId:0, partyType: "Household", acViewId: -1}';    
    var url = "http://" + SERVER + "/ContactService/Service1.asmx/GetAccountSnapshot";
    if(LOCAL){        
        data = JSON.parse(ACCOUNTSNAPSHOT_DATA);
        onGetAcctDetailSuccess(data);
    }else{
        ajaxCall(url, param, onGetAcctDetailSuccess, data);
    }
    
    getArchivedReports(hhId, acctId);
}

function getArchivedReports(hhId, acctId){
    var url = "http://" + SERVER + "/ContactService/Service1.asmx/GetArchiveReports";
    var param = '{acctId:"' + acctId + '", householdId:' + hhId + ',instId:' + instId + ',brokerId:' + bId + '}';
    if(LOCAL){        
        data = JSON.parse(ARCHIVEDREPORT_DATA);
        onGetArchivedReportsSuccess(data);
    }else{
        ajaxCall(url, param, onGetArchivedReportsSuccess, data);
    }
}

function onGetArchivedReportsSuccess(data){
    for(var i=0;i<data.BusinessObjects.length;i++){
      //  alert("Report_filename="+data.BusinessObjects[i].Report_filename);
        data.BusinessObjects[i].Report_filename = data.BusinessObjects[i].Report_filename.replace(/\\/g, "/");
      //  alert("after replace data.BusinessObjects[i].Report_filename="+ data.BusinessObjects[i].Report_filename);
    }
    
    $("#archivedRpts").kendoGrid({
             dataSource: {data: data.BusinessObjects                              
            },                                
            columns: [                       
                {
                    field: "Report_name",
                    title: "Report Name"   ,
                    template: "<a onclick='javascript:downloadFile(\"${Report_location}\",\"#:Report_filename#\");'>#:Report_name#<img src='images/file-download.png' style='text-decoration:none' /></a>",
                  
                    width: "80%"
                  //  template: "<div title='#=Sec_name#' style='color:\\#7AADDE'>#:Sec_symbol#</div>"              
                                      
                },
               /* {field: "Report_filename", title: "name"}*/

              {
                    field: "Last_modified",
                    title: "Last Modified",
                  
                }
               /* {
                    field: "Report_location",
                    template: "<img src='../images/filedownload.png' />"
                }*/
                
            ],
        });
}

function downloadFile(location,filename){ 
    var url = "http://" + SERVER + "" + location + "/" + name; 
    var name = filename.substring(filename.lastIndexOf("/") + 1);
 
    var fileTransfer = new FileTransfer();
 //   var filePath = root.fullPath + "/Downloads/" + name;
    var filePath = root.fullPath + "/Clients/Angela Smith/" + name;
    
  //  alert("dest path" + filePath);

    fileTransfer.download(
    url,
    filePath,
    function(entry) {
        alert("download completed");
        currentDir = root;
      //  alert("currentDir="+currentDir);
     //  getActiveItem("Downloads", "d");
        getActiveItem("Angela Smith", "d");
     //   alert("download: activeItem="+activeItem);
      //  alert("download: activeItem.name="+activeItem.name);
       document.location.href="#views/fileView1.html";
      //  document.location.href="#views/fileView1.html?dir="+activeItem;
     //   alert("downloadFile: document.location.href="+document.location.href);
        console.log("download complete: " + entry.fullPath);
    },
    function(error) {
        alert("download error source " + error.source);
        alert("download error target " + error.target);
        alert("download error code" + error.code);
        console.log("download error source " + error.source);
        console.log("download error target " + error.target);
        console.log("download error code" + error.code);
    });
    
    
}

function onGetAcctDetailSuccess(data)
{
    var scriptTemplate = kendo.template($("#accountDetailInfoTemplate").html());
    $("#accountDetailInfo").html(scriptTemplate(data.AcctPositionMemento));
            
    bindHoldingsInfo(data.AcctPositionMemento);            
    createChart(data.SecClassificationCollection.List);
    assetsTable(data.SecClassificationCollection.List);
}


function createChart(list){
 //   alert("createChart");

    var dataArray = [];
    var colorArray=[];
   
    for(var i=0; i<list.length; i++){
        dataArray[i]=list[i].secACList[0];      
        colorArray[i]="rgb(" + list[i].secACList[0].red + "," + list[i].secACList[0].green + "," + list[i].secACList[0].blue + ")";       
    }
    
   // alert("dataArray=" + dataArray); 
    $("#chart").kendoChart({
        dataSource: {data: dataArray},
        /*title: {
                    position:"bottom",
                    text: "Assets Allocation"
            },*/
        legend: {
                    visible: false
        },
        chartArea: {
            background: ""
        },
        seriesDefaults: {
          /*  labels: {
                visible: true,
                background: "transparent",
                template: "${category}(${value}%)"
            }*/
        },
        series:[{
                type: "pie",
                startAngle: 150,
                field: "pct",
                categoryField: "name"                
            
        }],
        seriesColors: colorArray,
        tooltip: {
            visible: true,
            format: "{0}%"
        }
    });
}


function assetsTable(list)
{
  //  alert("assetsTable");
    var dataArray = [];
    for(var i=0; i<list.length; i++){
        dataArray[i] = list[i].secACList[0];
        dataArray[i].color = "rgb(" + list[i].secACList[0].red + "," + list[i].secACList[0].green + "," + list[i].secACList[0].blue + ")";
    }
  
    $("#assetsTable").kendoGrid({
                dataSource: dataArray,
                rowTemplate: kendo.template($("#assetsTemplate").html()),      
            
               columns: [
              { field: "color",
                title: " ",
                width: "10%",                        
                attributes:{
                    style: "background-color:#:color#;width:5%"
                } 
              },
             {
                 field: "name",
                 title: "Asset",
                 headerAttributes:{
                     style: "text-align:left"
                 },
                 width: "70%"
             },
             {    
                 field: "pct",
                 title: "%",
                 headerAttributes:{
                     style: "text-align:right"
                 }
             }
         ],

      //  editable:true,
                
            });


}

function bindHoldingsInfo(data)
{   
   // alert("getHoldingsInfo");
    var dataArray = [];
    
    for(var i=0; i<data.BusinessObjects.length; i++)
    {
        dataArray[i] = data.BusinessObjects[i].Security_Detail;
        dataArray[i].Qty = data.BusinessObjects[i].Qty;
        dataArray[i].Current_price = data.BusinessObjects[i].Current_price;
        dataArray[i].Market_value = data.BusinessObjects[i].Market_value;      
    }
    
    $("#holdingsInfo").kendoGrid({
                    dataSource: {data: dataArray                               
        },                                
        columns: [
           /* {
                field: "Sec_name",
                title: "Name (Symbol)",   
                template:"<div style='color:\\#003F6B'>#:Sec_name# (#:Sec_symbol#)</div>",
                width: "350px"
                
            }, */  
            {
                field: "Sec_symbol",
                title: "Symbol"   ,                
                template: "<div title='#=Sec_name#' style='color:\\#7AADDE'>#:Sec_symbol#</div>" 
            },
           {    
                field: "Current_price",
                title: "Current Price",
                template: "<div style='font-weight:normal'>#=kendo.toString(Current_price,'c')#</div>"                
            },         
            {
                field:"Sec_type",
                title: "Sec Type",
                template: "<div style='font-weight:normal'>#:Sec_type#</div>"
            },
            {
                field: "Qty",
                title: "Quantity",
                template: "<div style='font-weight:normal'>#:Qty#</div>"
            },
            {
                field: "Market_value",
                title: "Market Value",
             //   format: "{0:c}",
                template: "<div style='font-weight:normal'>#=kendo.toString(Market_value,'c')#</div>"
            }
        ],
       // height:200
    });
}

function getYearLabel(value){
  //  alert("value="+value);
    value = value.toString();
    return value.substring(0,4);
}

function showcharts(){    
    var acctId = "T-15719185";
    var householdId = 6829146;
    var investorId=12147476;
    var url = "http://" + SERVER + "/ContactService/Service1.asmx/GetPortfolioGrowth";
    var param = '{func:"portAnalysis", reportId:1, accountId:"' + acctId + '", householdId:' + householdId + ', investorId:' + investorId + '}'; 
    alert("param="+param);
    if(LOCAL){ 
        var portfolioGrowthObj=xml2json.parser(PORTFOLIOGROWTH_XML);
        //data = JSON.parse(RECENTCONTACT_DATA);
        data = portfolioGrowthObj;
        onGetPortfolioDataSuccess(data);
    }
    else{    
        ajaxCall(url, param, onGetPortfolioDataSuccess, data);  
    }
}

function onGetPortfolioDataSuccess(data){
 //   debugger;
  //  alert("onGetPortfolioDataSuccess");
    $('#portfolioGrowthChart').kendoChart({
        dataSource: {data: data.Portfolio.MarketValues_.MarketValues_},
        title: {text: "Portfolio Growth"},
        legend:{ position: "bottom"},
        chartArea:{background: ""},                                     
                   
        seriesDefaults: {type: "line"},
        series: [{field: "Val"}],
        valueAxis: {labels:{format:"{0:c}"},
                    line:{visible:true},
                    majorUnit: 5000
                    },
       /* categoryAxis:{field:"date",
                      majorGridLines:{visible:false}}    */
        categoryAxis:
            {
                field: "Date",
                majorGridLines:{visible:false},
                labels: { template: "#= getYearLabel(value) #" ,
                          rotation: -45,
                         step: 12
                        },
                           
            },
        tooltip:{visible: true, background:"orange", format: "{0:C}"}                
    });
    
    $('#bestWorstAvgRtnChart').kendoChart({
        dataSource: { data: data.Portfolio.BestWorstAverageReturns_._BestWorstAverageReturns },
        title:{text: "Holding Periods Volatility"},
        legend:{positon: "bottom"},
    //    dateField: "Year",
        series:[ {stack:true, type:"column",
                    field: "WorstRet"},
            { type: "column",
                field: "BestRet"           
            },           
            { type:"line", field: "AvgRet"}
            ],
        categoryAxis:
            {
                field: "Year",
                majorGridLines:{visible:false},
                labels: { template: "#:value #-Year "  },                     
                title: { text: "Holding Period" },
            },
        valueAxes: [{
             title: { text: "Range of Returns" }   }]
        
    });
}


function showMorecharts(e){
    
    var acctId = "T-15719185";
    var householdId = 6829146;
    var investorId=12147476;
    
   /* var acctId = e.view.params.accountId;
    var householdId = e.view.params.householdId;
    var investorId = e.view.params.investorId;*/
    var url = "http://" + SERVER + "/ContactService/Service1.asmx/GetPortfolioGrowth";
    var param = '{func:"portAnalysis", reportId:1, accountId:"' + acctId + '", householdId:' + householdId + ', investorId:' + investorId + '}'; 
  //  alert("param="+param);
    if(LOCAL){ 
        var portfolioGrowthObj=xml2json.parser(PORTFOLIOGROWTH_XML);
        //data = JSON.parse(RECENTCONTACT_DATA);
        data = portfolioGrowthObj;
        onGetPortfolioDataSuccess(data);
    }
    else{    
        ajaxCall(url, param, onGetPortfolioDataSuccess, data);  
    }
    
}

