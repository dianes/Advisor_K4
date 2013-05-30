/*global variables*/
var g_hhAcctListGrpFooter;
var LOCAL = false;
var instId=6083;
var bId=10408149;
var modId = 120;
var SERVER="10.253.2.198";
var SERVER2="10.253.2.115";
var data = [];
var root = null;
var currentDir = null;
var parentDir = null;
var activeItem = null;
var activeItemType = null;
var clipboardItem = null;
var clipboardItemAction = null;
var fileText = null;
var currentInvId = null;


window.addEventListener('load', function(){
    document.addEventListener('deviceready', onDeviceReady, false);}, false);

function onDeviceReady(){
    alert("ondeviceready");   
    getFileSystem();
}


function ajaxCall(url, param, onSuccess, data, args){
    app.showLoading();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: url,
        data: param,
        datatype: "json",
        success: function(dat){
            data = JSON.parse(dat.d);
            app.hideLoading();
            onSuccess(data, args)
        }, 
        error: function(data){
            alert('failure:' + data.status + ':' + data.responseText);
            }        
    });
}



/************************************START NOT USED*************************************************/

function getHHSnapshot(e){   
    var hhId = e.view.params.hhId;
    getHHMembers(hhId);
    getHHAccountList(hhId);  
}


function getHHMembers(hhId){    
    var url = "http://" + SERVER + "/ContactService/Service1.asmx/GetHHMembers";
    var param = '{InstID:' + instId + ', BrokerID:' + bId + ', ModuleID:' + modId + ', HHID:' + hhId + '}';  
    ajaxCall(url, param, onGetHHMembersSuccess, data);
}

function onGetHHMembersSuccess(data){
    $("#hhListGrid").empty().kendoGrid({
         dataSource: data.List,
         selectable: "multiple cell",                       
            sortable: true,                 
         columns: [
         {
             field: "name",
             title: "Name"                         
         },
         {    
             field: "type",
             title: "Household Relationship"                         
         }
     ]
   });  
    
    var output = "";
    $.each(data.List, function(key, val){
        var name = val.name;
        var type = val.type;
        output+='<li>' + name + "    " + type + "</li>";
       // alert("output="+output);                
     });
    
    $('#hhlist').empty().append(output);  
        
    }
    
 function getHHAccountList(hhId){
   //  var hhId=6829146;
    var instId=6083;
    var bId=10408149;
    var modId = 120;
    var param = '{InstID:' + instId + ', BrokerID:' + bId + ', ModuleID:' + modId + ', HHID:' + hhId + '}';  
     
     $.ajax({ 
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: "http://" + SERVER + "/ContactService/Service1.asmx/GetHHAccountList",
       // data: "{'InstID': 6083, 'BrokerID': 10408149, 'ModuleID': 120, 'HHID': 6829146}",
        data: param,
        dataType: "json",
        success: function(dat){ 
           // alert("getHHAccountList success");
            var data= JSON.parse(dat.d);
            
            //create datasource
          // var dataSource = new kendo.data.DataSource({data: data.BusinessObjects});
            
         // debugger;  
          //  var raw = dataSource.data();
            var length = data.BusinessObjects.length;
            var intDataSource = [];
            var extDataSource = [];
            var item, i;
            var intIndex = 0;
            var extIndex = 0;
            for(i=0;i<length;i++){
                item = data.BusinessObjects[i];
                if(item.InternalValue == true){
                    intDataSource[intIndex] = item;
                    intIndex++;
                    }
                else{
                    extDataSource[extIndex] = item;
                    extIndex++;
                }
                    
            }
            
          
             $("#intAcctGrid").empty().kendoGrid({
                     dataSource: intDataSource,
                     selectable: "multiple cell",                       
                        sortable: true,                 
                     columns: [
                     {
                         field: "Account_number",
                         title: "Acct.#"                         
                     },
                     {    
                         field: "Owner_name",
                         title: "Owner Name"                         
                     },
                     {
                         field: "Nature_of_acct",
                         title: "Acct.Type"                         
                     }
                 ]
            
                 });
            
            $("#extAcctGrid").empty().kendoGrid({
                     dataSource: extDataSource,
                     selectable: "multiple cell",                       
                        sortable: true,                 
                     columns: [
                     {
                         field: "Account_number",
                         title: "Acct.#"                         
                     },
                     {    
                         field: "Owner_name",
                         title: "Owner Name"                         
                     },
                     {
                         field: "Nature_of_acct",
                         title: "Acct.Type"
                         
                     }
                 ]
            
                 });
        },
        error: function(data){
            alert('getHHAccountList failure:' + data.status + ':' + data.responseText);
            }
        });
 }

function contactnameclick(hhid){
  //  alert("contactnameclick=" + hhid);
    //document.location.href="#hhSnapshotView?hhId=" + hhid;
    
    //document.location.href="views/hhProfileView.html?hhId=" + hhid;
    document.location.href="#hhProfileView?hhId=" + hhid;
    return true;
}

function contactdetailclick(hhid){
 //   alert("contactdetailclick=" + hhid);
    document.location.href="#hhProfileView?hhId=" + hhid;
    return true;
}










    





function showchartsWithStaticData(){
    var portfolioGrowthObj=xml2json.parser(PORTFOLIOGROWTH_XML);
  //  alert("portfolioGrowthObj="+portfolioGrowthObj);
        
    $('#portfolioGrowthChart').kendoChart({
        dataSource: {data: portfolioGrowthObj.performance_history.performance},
        title: {text: "Portfolio Growth"},
        legend:{ position: "bottom"},
        chartArea:{background: ""},                                     
                   
        seriesDefaults: {type: "line"},
        series: [{field: "value"}],
        valueAxis: {labels:{format:"{0:c}"},
                    line:{visible:true},
                    majorUnit: 5000
                    },
       /* categoryAxis:{field:"date",
                      majorGridLines:{visible:false}}    */
        categoryAxis:
            {
                field: "date",
                majorGridLines:{visible:false},
                labels: { template: "#= getYearLabel(value) #" ,
                          rotation: -45
                        }
            
            },
        tooltip:{visible: true, background:"orange"}                
    });
    
    var bestWorstAvgRtnObj = xml2json.parser(BESTWORSTAVGRTN_XML);
    alert("bestWorstAvgRtnObj="+ bestWorstAvgRtnObj);
    $('#bestWorstAvgRtnChart').kendoChart({
        dataSource: { data: bestWorstAvgRtnObj.bestworstaveragereturns.period },
        title:{text: "Holding Periods Volatility"},
        legend:{positon: "bottom"},
       // dateField: "YearLength",
        series:[{
            type: "column",
            highField: "BestRet",
            lowField: "WorstRet",
            openField: "AvgRet"            
        }],
        categoryAxis: {
                            field: "YearLength",
                            labels: {template: "#:YearLength# Year"
                               // rotation: -90
                            },
                          /*  majorGridLines: {
                                visible: false
                            }*/
                        },
        
    });
}


/********************************************END NOT USED*************************************************/







    






     
