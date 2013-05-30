function getHHProfile(e){
    var hhId = e.view.params.hhId;
    getAccountsInfo(hhId);
    getContactsInfo(hhId);
    
}


function getContactsInfo(hhId){     
  //  alert("getContactsInfo");
    $("#hhProfileListGrid").empty();
     
    var param = '{InstID:' + instId + ', BrokerID:' + bId + ', propId: 0, partyId:' + hhId + '}';  
    var url = "http://" + SERVER + "/ContactService/Service1.asmx/GetContactDetails";   
    if(LOCAL){        
        data = JSON.parse(CONTACTDETAIL_DATA);
        OnGetContactsInfoSuccess(data);
    }else{        
        ajaxCall(url, param, OnGetContactsInfoSuccess, data);
    }
}

function OnGetContactsInfoSuccess(data){
    var scriptTemplate = kendo.template($("#newcontactDetailTemplate").html());               
    $("#hhProfileListGrid").html(scriptTemplate(data.List[0])); 
    currentInvId = data.List[0].inv_id;    
}

function getAccountsInfo(hhId){
    $("#hhAccountInfo").empty();
    var param = '{planId: 0, householdId:' + hhId + ',instId:' + instId + ', brokerId:' + bId + '}'; 
    var url = "http://" + SERVER + "/ContactService/Service1.asmx/GetAccountHHSnapshot";    
    var args = [];
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

function gotoAccountDetal(acctNum, hhId){
 //   alert("gotoAccountDetal");
    document.location.href="#accountDetailView?acctId=" + acctNum + "&householdId=" + hhId;
}
