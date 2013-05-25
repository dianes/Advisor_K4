var g_hhAcctListGrpFooter;
var LOCAL = false;
var instId=6083;
var bId=10408149;
var modId = 120;
var args = [];
var data = [];

/* file system*/
var root = null;
var currentDir = null;
var parentDir = null;
var activeItem = null;
var activeItemType = null;
var clipboardItem = null;
var clipboardItemAction = null;
var fileText = null;


window.addEventListener('load', function(){
    document.addEventListener('deviceready', onDeviceReady, false);}, false);


function ajaxCall(url, param, onSuccess, data, args){
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: url,
        data: param,
        datatype: "json",
        success: function(dat){
            data = JSON.parse(dat.d);
            onSuccess(data, args)
        }, 
        error: function(data){
            alert('failure:' + data.status + ':' + data.responseText);
            }        
    });
}


function getContactList(){
    var url = "http://10.253.2.198/ContactService/Service1.asmx/GetRecentContacts";
    var param = '{InstID:' + instId + ', BrokerID:' + bId + '}'; 
    if(LOCAL){        
        data = JSON.parse(RECENTCONTACT_DATA);
        onGetContactListSuccess(data, args);
    }
    else{    
        ajaxCall(url, param, onGetContactListSuccess, data, args);  
    }
}

function onGetContactListSuccess(data, args){
  //  alert("onGetContactListSuccess");
    $("#contactlist").kendoMobileListView({
			dataSource: data.List,
			template: $("#recentcontact-listview-template").html(),
            style: "inset"            
             
    });          
}


function getHHSnapshot(e){
   // alert("getHHSnapshot");
    var hhId = e.view.params.hhId;
    getHHMembers(hhId);
    getHHAccountList(hhId);  
}


function getHHMembers(hhId){    
    var url = "http://10.253.2.198/ContactService/Service1.asmx/GetHHMembers";
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
        url: "http://10.253.2.198/ContactService/Service1.asmx/GetHHAccountList",
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

//contact search
function searchContactold(){    
    var instId=6083;
    var bId=10408149;
    var searchFor;
    var searchBy;
    var action;
    var url, param;
    var queryStr = "";
    var cInputs = $("input:checked");
    var txtLname = document.getElementById("txtLname").value;
    var txtFname = document.getElementById("txtFname").value;
    var txtCity = document.getElementById("txtCity").value;
    var txtState = document.getElementById("txtState").value;
    var txtZip = document.getElementById("txtCity").value;
     
    $("#contactSearchResultGrid").empty();
    if(cInputs != null){
        for(var pvt=0;pvt<cInputs.length;pvt++){
            if(cInputs[pvt].name=="srchFor"){
                searchFor = cInputs[pvt].value;                
            }
            else if(cInputs[pvt].name =="srchBy"){
                action = cInputs[pvt].value;
                if(action == "srchByDemo"){
                    queryStr = "<firstname>" + txtFname + "</firstname>";
                    queryStr += "<lastname>" + txtLname + "</lastname>";
                    queryStr += "<city>" + txtCity + "</city>";
                    queryStr += "<state>" + txtState + "</state>";
                    queryStr += "<zip>" + txtZip + "</zip>";

                    param = '{InstID:' + instId + ', BrokerID:' + bId + ', SearchFor:"' + searchFor + 
                        '", SearchQRY:"' + queryStr + '", page: 1, itemCount: 25, sortColumn: "Name", isAscending: true' +  '}'; 
                    url = "http://10.253.2.198/ContactService/Service1.asmx/SearchByDemographic"; 
                }
                else if(action == "srchByAcctno"){                    
                }
                
                
            }
        }
        
        $.ajax({ 
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: url,       
        data: param,
        dataType: "json",
        success: function(dat){
            $("#tblDiv .k-grid-header").remove();         
            var data= JSON.parse(dat.d);
        
            $("#contactSearchResultGrid").kendoGrid({
                        dataSource: data.List,
                       // pageable: true,
                        selectable: "multiple cell",
                        sortable: true,
                        columns: [
                     {
                         field: "lname",
                         title: "Name"                         
                     },
                     {    
                         field: "type",
                         title: "Type"                         
                     },
                     {
                         field: "acct_no",
                         title: "Acct.#"                         
                     },
                      {
                         field: "phone",
                         title: "Phone"                         
                     },
                     {
                         field: "city",
                         title: "City"                         
                     },
                    {
                         field: "state",
                         title: "State"                         
                     },
                     {
                         field: "zip",
                         title: "Zip"                         
                     }, 
                    {
                         
                         title: "Action"                         
                     },
                 ],
                        rowTemplate: kendo.template($("#contactSearchResultRowTemplate").html()),
                        
                        
                    }).show();
          
            },
        error: function(data){
            alert('searchResult failure:' + data.status + ':' + data.responseText);
            }
        });     
    } 
}

function initContactSearch(){
    var lastnameDataSource = ["Sm",
                        "Sma",
                        "Smith",
                        "Smoke",
                        "Smz",
                        "A",
                        "AD",
                        "ADV",
                        "Ad",
                        "ad",
                        "ada",
                        "Adv"
    ];
    
    $("#txtLname").kendoAutoComplete({
        dataSource: lastnameDataSource,
        filter: "startswith",
        placeholder: "Last Name",
        width: "80%",
        select: function(e){
            var item = e.item;
            var text = item.text();           
            searchContactByText(text);
        }
       
    }).css("width","").removeClass("k-input").parent().removeClass();
}

function autocompleteKeypressed(e){    
    if(e.keyCode == 13)
        searchContact();
}

function clearText(e){
   // alert("e.value="+e.value);
    e.value = "";
}

function searchContact(){
  //  alert("searchContact");
    var txtLname= document.getElementById("txtLname").value;   
    searchContactByText(txtLname);
}

function searchContactByText(txtLname){
  // alert("searchContactByText");
    var searchFor="client"   
    var url, param;
    var queryStr = "";   
   
    $("#contactSearchResultGrid").empty();
    
      queryStr="<firstname></firstname><lastname>" + txtLname + "</lastname><city></city><state></state><zip></zip>";  
      param = '{InstID:' + instId + ', BrokerID:' + bId + ', SearchFor:"' + searchFor + 
                        '", SearchQRY:"' + queryStr + '", page: 1, itemCount: 25, sortColumn: "Name", isAscending: true' +  '}'; 
      url = "http://10.253.2.198/ContactService/Service1.asmx/SearchByDemographic"; 
     
      if(LOCAL){          
          data = JSON.parse(CONTACTSEARCH_SMITH_DATA);
          onContactSearchSuccess(data, args);
      }
      else{
          ajaxCall(url, param, onContactSearchSuccess, data, args);
      }
}

function onContactSearchSuccess(data, args){
  //  alert("onContactSearchSuccess");
 
    $("#tblDiv .k-grid-header").remove(); 
    $("#contactsearchlist").kendoMobileListView({
			dataSource: data.List,
			template: $("#contactsearch-listview-template").html(),
            style: "inset" 
		}).show();          
}
        

function getHHProfile(e){
    var hhId = e.view.params.hhId;
    getAccountsInfo(hhId);
    getContactsInfo(hhId);
    
}


function getContactsInfo(hhId){     
  //  alert("getContactsInfo");
    $("#hhProfileListGrid").empty();
     
    var param = '{InstID:' + instId + ', BrokerID:' + bId + ', propId: 0, partyId:' + hhId + '}';  
    var url = "http://10.253.2.198/ContactService/Service1.asmx/GetContactDetails";   
    if(LOCAL){        
        data = JSON.parse(CONTACTDETAIL_DATA);
        OnGetContactsInfoSuccess(data, args);
    }else{        
        ajaxCall(url, param, OnGetContactsInfoSuccess, data, args);
    }
}

function OnGetContactsInfoSuccess(data, args){
    var scriptTemplate = kendo.template($("#newcontactDetailTemplate").html());               
    $("#hhProfileListGrid").html(scriptTemplate(data.List[0]));            
}
        



function getAccountsInfo(hhId){
    $("#hhAccountInfo").empty();
    var param = '{planId: 0, householdId:' + hhId + '}'; 
    var url = "http://10.253.2.198/ContactService/Service1.asmx/GetAccountHHSnapshot";    
    args[0] = hhId;
    if(LOCAL){
        data = JSON.parse(ACCOUNTHHSNAPHOT_DATA);
        onGetAccountsInfoSuccess(data, args);
    }else{
        ajaxCall(url, param, onGetAccountsInfoSuccess, data, args);
    }
 }

function onGetAccountsInfoSuccess(data, args)
{
  //  alert("onGetAccountsInfoSuccess");
    
    
    var hhId = args[0];
  //  alert("hhId="+ hhId);
    $("#hhAccountInfo").kendoGrid({
                    dataSource: {data: data.HHAcctInfoList.List,
                         group: {
                             field:"InternalValue", 
                             dir:"desc",
                             aggregates:[
                                     { field:"MarketValue",aggregate:"sum"}
                             ]
                         }
                    },                                
                    columns: [
                        {
                            field: "AccountNumber",
                            title: "ACCT.#",                         
                           // template: "<a href='\#accountDetailView?acctId=${AccountNumber}&householdId=" + hhId + "'>${AccountNumber}</a>"
                           // template: "<a href='javascript:gotoAccountDetal(\"${AccountId}\"," + hhId + ")'>${AccountNumber}</a>"
                            template: "<div style='color:\\#7AADDE;font-weight:bold'><a href='javascript:gotoAccountDetal(\"${AccountId}\"," + hhId + ")' style='text-decoration:none'>${AccountNumber}</a></div>"
                        },
                      /*  {
                            field: "AccountName",
                            title: "ACCOUNT NAME"
                        },*/
                      /*  {
                            field: "OwnerName",
                            title: "Owner"
                        },*/
                        {
                            field: "NatureOfAccount",
                            title: "ACCT. TYPE",
                            template: "<div style='font-weight:normal'>#:NatureOfAccount#</div>",
                            groupFooterTemplate:"#= g_hhAcctListGrpFooter #",
                            footerTemplate: "Total Value:"
                        },
                       /* {
                            field: "DiscretionaryType", values: [{text: "Non-Discretionary", value: "n"},
                                                                 {text: "Discretionary", value:"y"}],
                            title: "Discretion"                           
                        },*/
                       /* {
                            field: "ProgramName",
                            title: "Product Class",
                            groupFooterTemplate:"#= g_hhAcctListGrpFooter #",
                            footerTemplate: "Total Value:"
                        },*/
                        {
                            field: "MarketValue",
                            title: "MV*",
                            template: "<div style='font-weight:normal'>#=kendo.toString(MarketValue, 'c') #</div>",
                            groupFooterTemplate: "<div style='font-size:1.3em;color:blue'>#= kendo.toString(sum,'c') #</div>",
                            footerTemplate:"<div style='font-size:1.8em;color:green'>#= getTotal() # </div>",
                            format: "{0:c}"
                        },
                       /* {
                            field: "RebalanceStatus",
                            title: "Rebal Status"
                        }, 
                        {
                            title: "Actions"
                        },*/
                        {
                            hidden: true, 
                            field: "InternalValue",
                            groupHeaderTemplate: "#= getGroupHeader(value) #"                          
                        }                   
                    ],
                });
}

function getGroupHeader(value){ 
    /*******************************************************************************************
      groupFooterTemplate doesn't contain info about "group by" field and value. 
      As a workaround, suggested by Telerik team, retrieve this info through groupHeaderTemplate
      (groupHeaderTemplate is executed before groupFooterTemplate).  
      Note here g_hhAcctListGrpFooter is a global variable 
    ********************************************************************************************/
    if(value=="Y"){
        g_hhAcctListGrpFooter = "Internal Total:";
        return "Internal Accounts";        
    }
    else{
        g_hhAcctListGrpFooter = "External Total:";
        return "External Accounts";
    }
}



function getTotal(){    
    var dataSource = $("#hhAccountInfo").data("kendoGrid").dataSource;
    var result = 0;

    //loops through dataSource view
    $(dataSource.view()).each(function(index,element){
        result += element.aggregates.MarketValue.sum;
    });
    return kendo.toString(result, 'C');
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

function gotoAccountDetal(acctNum, hhId){
 //   alert("gotoAccountDetal");
    document.location.href="#accountDetailView?acctId=" + acctNum + "&householdId=" + hhId;
}

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
 
    var param = '{acctId:"' + acctId + '", householdId:' + hhId + ', planId: 0, partyId:0, partyType: "Household", acViewId: -1}';    
    var url = "http://10.253.2.198/ContactService/Service1.asmx/GetAccountSnapshot";
    if(LOCAL){        
        data = JSON.parse(ACCOUNTSNAPSHOT_DATA);
        onGetAcctDetailSuccess(data, args);
    }else{
        ajaxCall(url, param, onGetAcctDetailSuccess, data, args);}
    }
    

function onGetAcctDetailSuccess(data, args)
{
    var scriptTemplate = kendo.template($("#accountDetailInfoTemplate").html());
    $("#accountDetailInfo").html(scriptTemplate(data.AcctPositionMemento));
            
    bindHoldingsInfo(data.AcctPositionMemento);
            
    createChart(data.SecClassificationCollection.List);
    assetsTable(data.SecClassificationCollection.List);
}

/*var data = [
                    {
                        "source": "Hydro",
                        "percentage": 22,
                        "explode": true
                    },
                    {
                        "source": "Solar",
                        "percentage": 2
                    },
                    {
                        "source": "Nuclear",
                        "percentage": 49
                    },
                    {
                        "source": "Wind",
                        "percentage": 27
                    }
                ];

                function createChartsample(list) {
                    
                    alert("sample chart");
                    $("#chart").kendoChart({
                        title: {
                            text: "Break-up of Spain Electricity Production for 2008"
                        },
                        legend: {
                            position: "bottom"
                        },
                        dataSource: {
                            data: data
                        },
                        series: [{
                            type: "pie",
                            field: "percentage",
                            categoryField: "source",
                            explodeField: "explode"
                        }],
                        seriesColors: ["#42a7ff", "#666666", "#999999", "#cccccc"],
                        tooltip: {
                            visible: true,
                            template: "${ category } - ${ value }%"
                        }
                    });
                }
*/

function createChart(list){
 //   alert("createChart");

    var dataArray = [];
    var colorArray=[];
   
    for(var i=0; i<list.length; i++){
        dataArray[i]=list[i].secACList[0];      
        colorArray[i]="rgb(" + list[i].secACList[0].red + "," + list[i].secACList[0].green + "," + list[i].secACList[0].blue + ")";
       // alert("colorArray="+ colorArray[i]);
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
        },
        drag: onDrag,
        zoom: onZoom,
        plotAreaClick: onPlotAreaClick,
       // seriesClick: onSeriesClick,
       // seriesHover: onSeriesHover
        
    });
}

function onDrag(e)
{
 //alert("onDrag");
}

function onZoom(e)
{
    //alert("onZoom");
}

function onPlotAreaClick(e)
{
    //alert("onPlotAreaClick");
}

function onSeriesClick(e)
{
   // alert("onSeriesClick, clicked value:"+ e.value);
}

function onSeriesHover(e)
{
    //alert("onSeriesHover");
}

function assetsTable(list)
{
  //  alert("assetsTable");
    var dataArray = [];
    for(var i=0; i<list.length; i++){
        dataArray[i] = list[i].secACList[0];
        dataArray[i].color = "rgb(" + list[i].secACList[0].red + "," + list[i].secACList[0].green + "," + list[i].secACList[0].blue + ")";
    }
   // debugger;
    
     
    
    $("#assetsTable").kendoGrid({
                        dataSource: dataArray,
                        rowTemplate: kendo.template($("#assetsTemplate").html()),      
                    
                       columns: [
                      { field: "color",
                        title: " ",
                        width: "10%",                        
                        attributes:{
                            style: "background-color:#:color#;width:5%",
                       // template: " "
                            
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
        
                editable:true,
                        
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
    
    //alert("bindHoldingsInfo dataArray="+ dataArray);
    
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
                });
}

/*
function showMap() { 
    navigator.geolocation.getCurrentPosition(
    onSuccessShowMap,
    onErrorShowMap
    );
 
}

function onSuccessShowMap(position) { 
    var latlng = new google.maps.LatLng(
    position.coords.latitude,
    position.coords.longitude);
     
    var mapOptions = {
     
    sensor: true,
    center: latlng,
    panControl: false,
    zoomControl: true,
    zoom: 16,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    streetViewControl: false,
    mapTypeControl: true,
     
    };
     
    var map = new google.maps.Map(      
    document.getElementById('map_canvas'),
    mapOptions
    );
     
    var marker = new google.maps.Marker({
    position: latlng,
    map: map
    });
    console.log(marker);
    console.log("map rendering");
}

function onErrorShowMap(error) { 
    alert("error");
}
*/
function onDeviceReady(){
   // debugger;
   // alert("onDeviceReady");
    
    clickItemAction();
    
  
}


function getFileSystem(){
    
  //  alert("getfilesystem---");    
    $('#backBtn').hide();
    $('#pasteBtn').removeAttr("onclick");
  //  $('#pasteBtn').contents().unwrap();
    
  //  $('#addFolderDialog').show();
    
   // openMenuOptions();
          
  
   // $('#menuOptions').hide();
   // $('#addFolderDialog').hide();
  
   
  window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, onGetFileSystemSuccess, onGetFileSystemFail); 
}

function onGetFileSystemSuccess(fileSystem){
    root = fileSystem.root;
    listDir(root);
}

function onGetFileSystemFail(evt){
          //  console.log(evt.target.error.code);
}    

function listDir(directoryEntry){  
    alert("listdir");
    alert("directoryentry.fullPath="+directoryEntry.fullPath);
    var ff=$('#filefield'); alert("ff="+ff);
    $('#fileField').html(directoryEntry.fullPath);
   // var fileDiv = document.getElementById("fileField")
   // alert("fileDiv="+fileDiv);
  //  fileDiv.innerText = directoryEntry.fullPath;
    
 //   alert("listdir of " + directoryEntry.name);
    if(!directoryEntry.isDirectory)
        console.log("listdir incorrect type");
    
    currentDir = directoryEntry;
 //   alert("currentdir="+ currentDir.name);
    directoryEntry.getParent(function(par){
        parentDir = par;
  //      alert("parentDir.name="+parentDir.name);
        if((parentDir.name == 'sdcard' && currentDir.name != 'sdcard' ) || parentDir.name != 'sdcard')
            $('#backBtn').show();
        }, 
        function(error){
            console.log('Get parent error: '+error.code);
        
    });
    
    var directoryReader = directoryEntry.createReader();
    directoryReader.readEntries(function(entries){
        var dirContent = $('#dirContent');
        dirContent.empty();
        
        var dirArr = new Array();
        var fileArr = new Array();
       // alert("length="+ entries.length);
        for(var i=0; i<entries.length; i++){
            
            var entry = entries[i];
        //    alert("entry="+ entries[i].name + "isDirectory="+ entries[i].isDirectory);
        //  alert("entry.name="+ entry.name);
        //    alert(" entry.isDirectory=" + entry.isDirectory);
            if(entry.isDirectory && entry.name[0]!='.') {
                dirArr.push(entry);
            }
            else if(entry.isFile && entry.name[0]!='.') {
                fileArr.push(entry);
            }
         }  
        
        var output="";
        var sortedArr = dirArr.concat(fileArr);
        var uiBlock = ['a','b','c','d'];
        
        for(var i=0;i<sortedArr.length;i++){
            var item = sortedArr[i];
            var letter = uiBlock[i%4];
            if(item.isDirectory)
                dirContent.append('<div class="ui-block-'+letter+'"><div class="folder"><p>'+item.name + '</p></div></div>');
                //dirContent.append('<div class="ui-block-'+letter+'"><a class="delete-link" href="\#"></a><div class="folder"><p>'+item.name + '</p></div></div>');
            else
               dirContent.append('<div class="ui-block-'+letter+'"><div class="file"><p>'+item.name + '</p></div></div>');
               //dirContent.append('<div class="ui-block-'+letter+'"><a class="delete-link" href="\#" name="hello"></a><div class="file"><p>'+item.name + '</p></div></div>');
            }
        
        
     //   alert("dirContent="+dirContent);
        
        
       /* for(var j=0;j<sortedArr.length; j++){
            if(sortedArr[j].isDirectory && entry.name[0]!='.'){
                output+="<div class='k-sprite folder'>" + sortedArr[j].name + "</div>";               
                alert("directory output: " + output);
             }
            else if(sortedArr[j].isFile && entry.name[0]!='.'){
                output+="<div class='k-sprite'>" + sortedArr[j].name + "</div>";               
                alert("file output: " + output);
            }
        }*/
        
      //  $("#fileContent").append(output);
        
        
        
        /*var output = "<ul id='treeView'>";        
        
        for(var j=0;j<dirArr.length; j++){
        alert("dirArr="+ dirArr[j].name);
            output += "<li data-expanded='true'><span class='k-sprite folder'></span>" + dirArr[j].name + "<ul>";
            listDir(dirArr[j]);
            output += "</ul>";
        }
   
        for(var k=0;k<fileArr.length;k++){            
            output += "<li><span class='k-sprite'></span>" + fileArr[k].name + "</li>";
        }
        
        alert("output="+ output);*/
        
        
     });
    
    }
    
function clickItemAction(){
    
// alert("clickItemAction");
    
    var folders = $('.folder');
    var files = $('.file');
    var backBtn = $('#backBtn');
    var deletelnk = $('.delete-link');
   // var homeBtn = $('#homeBtn');
  //  var menuDialog = $('#menuOptions');
    /*var openBtn = $('openBtn');
    var copyBtn = $('#copyBtn');
	var moveBtn = $('#moveBtn');*/
	var pasteBtn = $('#pasteBtn');
    
    folders.live('click', function(){
       // alert("folder clicked");
        var name = $(this).text();
        openMenuOptions();
     //   $('#menuOptions').show();
       
        
        getActiveItem(name,'d');
      //  $('#menu').trigger('click');
     //   alert("activeItemType="+activeItemType);
     //   openItem(activeItemType);
    });
    
/*    $('.folder').click(function(){
        alert("folder clicked");
        var name = $(this).text();
        getActiveItem(name,'d');
        openItem(activeItemType);
    });*/
    
    files.live('click', function(){
      //  alert("file clicked");
        var name = $(this).text();
        openMenuOptions();
       //$('#dirContent').hide();
      //  $('#menuOptions').show();
       
        getActiveItem(name, 'f');
      //  openItem(activeItemType);
    });
    
    backBtn.live('click', function(){
        $('#dirContent').empty();
      //  alert("backBtn clicked");
      //  alert("backBtn clicked: parentDir="+ parentDir);
        
        if(parentDir != null){            
            listDir(parentDir);
        } 
      //  $('#menuOptions').hide();
        $('#addFolderDialog').hide();
    });
    
   /* openBtn.live('click', function(){
        alert("openBtn clicked");
		openItem(activeItemType);		
	});*/
    
    deletelnk.live('click', function(){
        alert("hello");
      //  var nameval= $(this).getAttribute("name");
        alert("nameval=");
       // alert("activeItem.name="+activeItem.name);
        alert("deletelnk clicked");
       // alert("activeItem.name="+activeItem.name);
        var removeconfirm = confirm("Are you sure you want to remove directory "+ activeItem.name + " recursively?");
       // alert("removeconfirm = "+ removeconfirm);       
    });
}
    
    
function getActiveItem(name, type){
  //  alert("getactiveItem, name=" + name + " type=" +type);   
    if(type=='d' && currentDir != null){
        currentDir.getDirectory(name, {create:false},
            function(dir){
                activeItem = dir;
                activeItemType = type;                    
            },
            function(error){
                console.log("unable to find directory: " + error.code);
            });
    }else if(type=='f' && currentDir != null){
        currentDir.getFile(name, {create:false},
            function(file){
                activeItem = file;
                activeItemType = type;
            },
            function(error){
                console.log("unable to find file: " + error.code);
            });
    }
}

function openItem(type){
    //alert("openItem, type="+ type);
    if(type=='d')
        listDir(activeItem);
    else if(type == 'f'){
        readFile(activeItem);
    }
}

function readFile(fileEntry){
   // alert("readFile");
    if(!fileEntry.isFile) {
        console.log("readFile incorrect type");
        //alert("readfile incorrect type");
     }
    fileEntry.file(function(file){
       // alert("fileEntry.file before getting filereader");
        var reader = new FileReader();
        
        reader.onloadend = function(evt){
          //  alert("reader.onloaded");
            console.log("read as data url");
            console.log("evt.target.result");
            };
        
        reader.readAsDataURL(file);
        
        
        //var fileDiv = document.getElementById("fileField");
        
        if (device.platform === 'Android') {
           // alert("readFile, android, fileEntry.name="+ fileEntry.name);
		    var path = this.getWorkingFolder().replace('http://', 'file://') + fileEntry.name;
		  //  fileDiv.innerText = path;
		    window.plugins.childBrowser.openExternal(path);
         }
         else{
           //  alert("readFile, non-android, fileEntry.name="+ fileEntry.name);
           //  alert("window.location.href="+window.location.href);
          //   alert("fileEntry.fullPath="+ fileEntry.fullPath);
           // var url = window.location.href.replace('index.html', fileEntry.name);
          //  var url = window.location.href.replace("\index.html#views/fileView.html", fileEntry.name);
           
            var url="file://" + fileEntry.fullPath;
             
           /*google viewer*/
             
    		//fileDiv.innerText = url;
          //   alert("url="+url);
                        
            /*with childbroswer*/
    		//window.plugins.childBrowser.showWebPage(url);
             
                       
             /*inAppbrowser*/
             var ref = window.open(encodeURI(url), '_blank', 'location=yes');
         }
        
    });
    
}

        
function getWorkingFolder() {
	var path = window.location.href.replace('index.html', '');
	return path;
}  

function openBtnClicked(){
   // alert("openBtn clicked");
    
 //   alert("activeItem.name="+ activeItem.name);
  //  alert("activeItemType="+activeItemType);
    
    openItem(activeItemType);
   // $('#menuOptions').hide();
    closeMenuOptions();
}


function deleteBtnClicked(){
   // alert("deleteBtnClicked");
    var msg = "Are you sure you want to remove " + activeItem.name + "?";
   // alert("msg="+msg);
    $('#confirmDeleteMsg').text(msg);
    var confirmdelete = $('#deleteModal').data("kendoMobileModalView");
   // alert("confirmdelete="+confirmdelete);
    closeMenuOptions();
    confirmdelete.open();
}

function deleteBtnClickedOld(){
  //  alert("activeItemType="+activeItemType);
    var removeconfirm = confirm("Are you sure you want to remove "+ activeItem.name + "?");   
     
        if(activeItem != null && activeItemType != null && removeconfirm == true){
            if(activeItemType == 'd'){               
                activeItem.removeRecursively(function(){
                    console.log("removed recursively with success");
                    listDir(currentDir);
                },
                function(error){
                    console.log("remove recursively with error: "+ error.code);
                });
              }else if(activeItemType == 'f'){
                  activeItem.remove(function(){
                      console.log("removed file with success");
                      listDir(currentDir);
                  },
                  function(error){
                      console.log("removed file error: " + error.code);
                  });
              }
        }
        else{
            listDir(currentDir);            
        }
   // $('#menuOptions').hide();
    closeMenuOptions();
}

function copyBtnCLicked(){
        getClipboardItem('c');
	//	$('#menuOptions').hide();
    closeMenuOptions();
		//$('#pasteBtn').removeAttr('disabled');
   // $('#pasteBtn').show();
		//$('#pasteBtn').button('refresh');
    $('#pasteBtn').attr("onclick", "javascript:pasteBtnCLicked();");
}

function moveBtnCLicked(){
        getClipboardItem('m');
	//	$('#menuOptions').hide();
    closeMenuOptions();
	//	$('#pasteBtn').removeAttr('disabled');
    //$('#pasteBtn').show();
		//$('#pasteBtn').button('refresh');
    $('#pasteBtn').attr("onclick", "javascript:pasteBtnCLicked();");
    
}

function pasteBtnCLicked(){
  //  alert("pasteBtnclicked");
  //  alert("clipboardItem="+ clipboardItem + ", clipboardAction=" +clipboardAction );
    
    if( clipboardItem != null && clipboardAction != null ){
			if(clipboardAction == 'c'){ // copy item
                alert('copy: '+clipboardItem.name + ' to: '+activeItem.name);
				console.log('copy: '+clipboardItem.name + ' to: '+activeItem.name);
				clipboardItem.copyTo(activeItem,clipboardItem.name,
					function(fileCopy){
						console.log('copy success! '+fileCopy.name);
						//openBtn.trigger('click');
                      //  $('#pasteBtn').attr('disabled','disabled');
                       // $('#pasteBtn').hide();
                      //  $('#pasteBtn').contents().unwrap();
                        $('#pasteBtn').removeAttr("onclick");
                        
                        openBtnClicked();
					}, function(error){
						console.log('copy error: '+error.code);
					}
				);
			} else if(clipboardAction == 'm'){ // move item
                alert('move: '+clipboardItem.name + ' to: '+activeItem.name);
				console.log('move: '+clipboardItem.name + ' to: '+activeItem.name);
				clipboardItem.moveTo(activeItem,clipboardItem.name,
					function(fileCopy){
						console.log('move success! '+fileCopy.name);
						//openBtn.trigger('click');
                      // $('#pasteBtn').attr('disabled','disabled');
                     //   $('#pasteBtn').hide();
                     //   $('#pasteBtn').contents().unwrap();
                        $('#pasteBtn').removeAttr("onclick");
                        openBtnClicked();
					}, function(error){
						console.log('move error: '+error.code);
					}
				);
			}
		}
}



function cancelDeleteBtnClicked(){
 //   alert("cancelDeleteBtnClicked");
    closeDeleteConfirmModal();
}

function closeDeleteConfirmModal(){
    $('#deleteModal').data("kendoMobileModalView").close();
}

function okDeleteBtnClicked(){
   // alert("okDeleteBtnClicked");
    if(activeItemType == 'd'){               
                activeItem.removeRecursively(function(){
                    console.log("removed recursively with success");
                    listDir(currentDir);
                },
                function(error){
                    console.log("remove recursively with error: "+ error.code);
                });
              }else if(activeItemType == 'f'){
                  activeItem.remove(function(){
                      console.log("removed file with success");
                      listDir(currentDir);
                  },
                  function(error){
                      console.log("removed file error: " + error.code);
                  });
              }
    closeDeleteConfirmModal();
}

function getClipboardItem(action){
	if( activeItem != null) {
		clipboardItem = activeItem;
		clipboardAction = action;
	}
}

function addBtnClicked(){   
    alert("addBtnClicked");
    
    $('#addFolderDialog').show();
   // $('#menuOptions').hide();
    $('#createBtn').click(function(){
        var filename = $('#newFolderName').val();
        var isDir = document.getElementById("radio_d").checked;
      //  alert("dirname="+filename);
     // alert("isDir="+isDir);
        
        if(isDir){
            createDirectory(filename);  
            }
        else{
            fileText = $('#filetext').val();
          //  alert("filetext="+fileText);
            createFile(filename);
        }
            
        
    });
 }

function directorySelected(){
    $('#filetext').hide(); 
}


function createBtnClicked(){
  //  alert("createBtnClicked");
    var filename = $('#newName').val();
        var isDir = document.getElementById("radio_d").checked;
      //  alert("dirname="+filename);
     // alert("isDir="+isDir);
        
        if(isDir){
            createDirectory(filename);  
            }
        else{
            fileText = $('#filetext').val();
          //  alert("filetext="+fileText);
            createFile(filename);
        }
  closeAddFolderDiaog();

}

function closeAddFolderDiaog(){    
    var dialog=$('#addFolderDialog').data("kendoMobileModalView");
  //  alert("dialog="+dialog);
    dialog.close();
}

   

function createDirectory(name){
  //  alert("createDirectory");  
    
    resetAddFolderDialog();
  //  $('#addFolderDialog').hide();    
    $('#filetext').hide();   
  
    currentDir.getDirectory(name, {create: true, exclusive: false}, createDirectirtSuccess, createDirectoryFail);
    
}

function createDirectirtSuccess(parent) {
  //  alert("createDirectorySuccess, parent.name="+parent.name);
    console.log("Parent Name: " + parent.name);
    listDir(currentDir);
}

function createDirectoryFail(error) {    
    alert("Unable to create new directory: " + error.code);
}

function createFile(name){
  //  alert("createfile");
    
    resetAddFolderDialog();
   // $('#addFolderDialog').hide();
   $('#filetext').hide();
    if(name.indexOf(".txt")==-1)
        name=name+".txt";
    //alert("file name="+name);
    currentDir.getFile(name, {create: true, exclusive: false}, createFileSuccess, createFilefail);
}

function createFileSuccess(parent){
  //  alert("file created");
    console.log("Parent Name: " + parent.name);
    parent.createWriter(gotFileWriter, writeFilefail);
    listDir(currentDir);
}

function createFilefail(error){
    alert("Failed to retrieve file: " + error.code);
}

function showTextarea(){
    $('#filetext').show();    
}

function gotFileWriter(writer) {
   // alert("gotfileWriter"); 
        writer.write(fileText);
    }


function writeFilefail(error) {
    
    alert("writefilefail:" + error.code);
        console.log(error.code);
    }


function openMenuOptionsBlockui(){
    alert("blockui");
    $.blockUI({ message: $('#menuOptions')} ); 
}

function closeMenuOptionsBlockui(){
    alert("blockui closeMenuOptions");
    $.unblockUI(); 
   return false; 
}

function openMenuOptions(){    
  //  alert("openMenuOptions");
    var win = $('#menuOptions').data("kendoMobileModalView");
  //  alert("win="+win);
    win.open();   
}

function closeMenuOptions(){
    
    $('#menuOptions').data("kendoMobileModalView").close();
}

function openMenuOptionsPopover(){
    alert("openMenuOptions");
    debugger;
    var pop = $('#menuOptions').data("kendoMobilePopOver");
    alert("pop="+pop);
    pop.open();
    alert("app="+app);
    
}

function closeMenuOptionsPopover(){
    $('#menuOptions').data("kendoMobilePopOver").close();
}

function resetAddFolderDialog(){
    $('#newName').val('');
    $('#radio_d').attr("checked", true);
    $('#radio_f').attr("checked", false);
    $('#filetext').val('');
}



function showchartsWithStaticData(){
    var portfolioGrowthObj=xml2json.parser(PORTFOLIOGROWTH_XML);
   // debugger;
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
    
    debugger;
    var bestWorstAvgRtnObj = xml2json.parser(BESTWORSTAVGRTN_XML);
    alert("bestWorstAvgRtnObj="+ bestWorstAvgRtnObj);
    $('#bestWorstAvgRtnChart').kendoChart({
        dataSource: { data: bestWorstAvgRtnObj.bestworstaveragereturns.period },
        title:{text: "Holding Periods Volatility"},
        legend:{positon: "bottom"},
        dateField: "YearLength",
        series:[{
            type: "column",
            highField: "BestRet",
            lowField: "WorstRet",
            openField: "AvgRet"            
        }],
        
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
    var url = "http://10.253.2.198/ContactService/Service1.asmx/GetPortfolioGrowth";
    var param = '{func:"portAnalysis", reportId:1, accountId:"' + acctId + '", householdId:' + householdId + ', investorId:' + investorId + '}'; 
    alert("param="+param);
    if(LOCAL){ 
        var portfolioGrowthObj=xml2json.parser(PORTFOLIOGROWTH_XML);
        //data = JSON.parse(RECENTCONTACT_DATA);
        data = portfolioGrowthObj
        onGetPortfolioDataSuccess(data, args);
    }
    else{    
        ajaxCall(url, param, onGetPortfolioDataSuccess, data, args);  
    }
}

function onGetPortfolioDataSuccess(data, args){
    debugger;
    alert("onGetPortfolioDataSuccess");
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
        dateField: "Year",
        series:[ {stack:true, type:"column",
                    field: "WorstRet"},
            { type: "column",
                field: "BestRet"           
            },           
            { type:"line", field: "AvgRet"}
            ],
        
    });
}

function registerTab(){
    alert("registertab");
    /*$('#tabstrip').kendoTabStrip({
        animation: {
                    open:{effects:"fadeIn"}
        }
    });*/
    $('div[data-role="navbar"] a').live('click', function () {
    $(this).addClass('ui-btn-active');
    $('div.content_div').hide();
    $('div#' + $(this).attr('data-href')).show();
    });
}


//proposals

function getProposalList(){
    alert("getProposalList");
    var url = "http://10.253.2.198/ContactService/Service1.asmx/GetRecentProposals";
    var param = '{instId:' + instId + ', brokerId:' + bId + '}'; 
    if(LOCAL){        
        data = JSON.parse(RECENTCONTACT_DATA);
        onGetProposalListSuccess(data, args);
    }
    else{    
        ajaxCall(url, param, onGetProposalListSuccess, data, args);  
    }
}

function onGetProposalListSuccess(data, args){
    alert("onGetProposalListSuccess");
    $("#proposallist").kendoMobileListView({
			dataSource: data.List,
			template: $("#recentproposal-listview-template").html(),
            style: "inset"            
             
    });          
}


function getProposalSummary(e){
    alert("getProposalsummary");
    var partyId = e.view.params.partyId;
    var partyType = e.view.params.partyType;
    var propId = e.view.params.propId;
    alert("partyId="+partyId+", partyType=" + partyType + ", propId="+ propId);
    
    resetComparisonChart();
    resetPortfolioCompGrid()
    
    var url = "http://10.253.2.198/ContactService/Service1.asmx/GetProposalSummary";
    var param = '{instId:' + instId + ', brokerId:' + bId + ',groupId:' + instId + ',householdId:"' + partyId +
                '", propId: ' + propId + ',partyId:"' + partyId + '", partyType: "Proposal"}';
    alert("param="+param);
    if(LOCAL){        
        data = JSON.parse(RECENTCONTACT_DATA);
        onGetProposalListSuccess(data, args);
    }
    else{    
        ajaxCall(url, param, onGetProposalSummarySuccess, data, args);
    }
}

function onGetProposalSummarySuccess(data, args){
    alert("onGetProposalSummarySuccess");
    debugger;
    createComparisonChart(data.Worksheet.ACList);
    createPortfolioCompGrid(data.Worksheet.ACList);
    
}

function resetComparisonChart(){
    $("#initportChart").empty();
    $("#modelportChart").empty();
    $("#recportChart").empty();
}

function resetPortfolioCompGrid(){
    $('#portfolioCompGrid').empty();
}

function createComparisonChart(list){
    
    var dataArray = [];
    var colorArray=[];
   
    for(var i=0; i<list.Count; i++){
      //  dataArray[i]=list[i].InitialPCT;      
        colorArray[i]="rgb(" + list.List[i].Red + "," + list.List[i].Green + "," + list.List[i].Blue + ")";
       // alert("colorArray="+ colorArray[i]);
    }
    
   // alert("dataArray=" + dataArray);    
   
    
    $("#initportChart").kendoChart({
        dataSource: {data: list.List},
        title: {
                    position:"bottom",
                    text: "Current"
            },
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
                field: "InitialPCT",
                categoryField: "Name"                
            
        }],
        seriesColors: colorArray,
        tooltip: {
            visible: true,
            format: "{0}%"
        },
        drag: onDrag,
        zoom: onZoom,
        plotAreaClick: onPlotAreaClick,
       // seriesClick: onSeriesClick,
       // seriesHover: onSeriesHover        
    });
    
    
    $("#modelportChart").kendoChart({
        dataSource: {data: list.List},
        title: {
                    position:"bottom",
                    text: "Model"
            },
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
                field: "ModelPCT",
                categoryField: "Name"                
            
        }],
        seriesColors: colorArray,
        tooltip: {
            visible: true,
            format: "{0}%"
        },
        drag: onDrag,
        zoom: onZoom,
        plotAreaClick: onPlotAreaClick,
       // seriesClick: onSeriesClick,
       // seriesHover: onSeriesHover        
    });
    
    $("#recportChart").kendoChart({
        dataSource: {data: list.List},
        title: {
                    position:"bottom",
                    text: "Recommended"
            },
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
                field: "TargetPCT",
                categoryField: "Name"                
            
        }],
        seriesColors: colorArray,
        tooltip: {
            visible: true,
            format: "{0}%"
        },
        drag: onDrag,
        zoom: onZoom,
        plotAreaClick: onPlotAreaClick,
       // seriesClick: onSeriesClick,
       // seriesHover: onSeriesHover        
    });
}


function createPortfolioCompGrid(list){
    
    alert("createComparisonTable");
    var dataArray = [];
    for(var i=0; i<list.Count; i++){
        dataArray[i] = list.List[i];
        dataArray[i].color = "rgb(" + list.List[i].Red + "," + list.List[i].Green + "," + list.List[i].Blue + ")";
    }
   // debugger;
    
     
    
    $("#portfolioCompGrid").kendoGrid({
                        dataSource: dataArray,
                        rowTemplate: kendo.template($("#portfolioCompTemplate").html()),      
                    
                       columns: [
                      { field: "color",
                        title: " ",
                        width: "10%",                        
                        attributes:{
                            style: "background-color:#:color#;width:5%",
                        
                            
                        } 
                      },
                     {
                         field: "Name",
                         title: "Asset Class",
                         headerAttributes:{
                             style: "text-align:left"
                         },
                         width: "50%"
                     },
                     {    
                         field: "InitialPCT",
                         title: "CURR",
                         headerAttributes:{
                             style: "text-align:right"
                         },
                     
                       },
                         
                       {    
                         field: "ModelPCT",
                         title: "MODEL",
                         headerAttributes:{
                             style: "text-align:right"
                         },
                       
                     },
        
                       {    
                         field: "TargetPCT",
                         title: "REC.",
                         headerAttributes:{
                             style: "text-align:right"
                         }
                     }
                    
                 ],
        
                editable:true,
                        
                    });
    
    

    
}

    






     
