function getProposalList(){
   // alert("getProposalList");
    var url = "http://" + SERVER + "/ContactService/Service1.asmx/GetRecentProposals";
    var param = '{instId:' + instId + ', brokerId:' + bId + '}'; 
    if(LOCAL){        
        data = JSON.parse(RECENTCONTACT_DATA);
        onGetProposalListSuccess(data);
    }
    else{    
        ajaxCall(url, param, onGetProposalListSuccess, data);  
    }
}

function onGetProposalListSuccess(data){
 //   alert("onGetProposalListSuccess");
    $("#proposallist").kendoMobileListView({
			dataSource: data.List,
			template: $("#recentproposal-listview-template").html(),
            style: "inset"            
             
    });          
}


function getProposalSummary(e){
  //  alert("getProposalsummary");
    var partyId = e.view.params.partyId;
    var partyType = e.view.params.partyType;
    var propId = e.view.params.propId;
   // alert("partyId="+partyId+", partyType=" + partyType + ", propId="+ propId);
    
    resetComparisonChart();
    resetPortfolioCompGrid()
    
    var url = "http://" + SERVER + "/ContactService/Service1.asmx/GetProposalSummary";
    var param = '{instId:' + instId + ', brokerId:' + bId + ',groupId:' + instId + ',householdId:"' + partyId +
                '", propId: ' + propId + ',partyId:"' + partyId + '", partyType: "Proposal"}';
   // alert("param="+param);
    if(LOCAL){        
        data = JSON.parse(RECENTCONTACT_DATA);
        onGetProposalListSuccess(data);
    }
    else{    
        ajaxCall(url, param, onGetProposalSummarySuccess, data);
    }
}

function onGetProposalSummarySuccess(data){
  //  alert("onGetProposalSummarySuccess");  
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
    var colorArray=[];   
    for(var i=0; i<list.Count; i++){      
        colorArray[i]="rgb(" + list.List[i].Red + "," + list.List[i].Green + "," + list.List[i].Blue + ")";
    }
    
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
        }
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
        }
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
        }  
    });
}


function createPortfolioCompGrid(list){
   //  alert("createComparisonTable");
    var dataArray = [];
    for(var i=0; i<list.Count; i++){
        dataArray[i] = list.List[i];
        dataArray[i].color = "rgb(" + list.List[i].Red + "," + list.List[i].Green + "," + list.List[i].Blue + ")";
    }

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