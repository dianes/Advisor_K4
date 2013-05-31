function getContactList(){
    getPhotoImages();
    
    var url = "http://" + SERVER + "/ContactService/Service1.asmx/GetRecentContacts";
    var param = '{InstID:' + instId + ', BrokerID:' + bId + '}'; 
    if(LOCAL){        
        data = JSON.parse(RECENTCONTACT_DATA);
        onGetContactListSuccess(data);
    }
    else{    
        ajaxCall(url, param, onGetContactListSuccess, data);  
    } 
}

function onGetContactListSuccess(data){
  //  alert("onGetContactListSuccess");
    addPhotoToContactList(data);
    $("#contactlist").kendoMobileListView({
			dataSource: data.List,
			template: $("#recentcontact-listview-template").html(),
            style: "inset" 
    });          
}

function addPhotoToContactList(data){
    if(photos!=null){
        var item;
        $.each(data.List, function(index, value){
            item = value.inv_id + ".jpg";            
            //alert("photos.indexOf("+item+")="+photos.indexOf(item));
             if(photos.indexOf(item) > -1){                
                data.List[index].photoUrl = "http://" + SERVER2 + "/TestFileUpload/uploads/" + item;
                // alert("found, data.List[" + index + "].photoUrl="+data.List[index].photoUrl);
                 }
            else{
                data.List[index].photoUrl="";
                //alert("not found, data.List[" + index + "].photoUrl="+data.List[index].photoUrl);
            }            
        });
    }
}

function getPhotoImages(){
    var url = "http://" + SERVER2 + "/ServiceImages/Service1.asmx/GetPhotoUrls";   
    var param = null;
    if(LOCAL){        
        data = JSON.parse(PHOTOIMAGE_DATA);
        onGetPhotoImagesSuccess(data);
    }
    else{    
        ajaxCall(url, param, onGetPhotoImagesSuccess, data);  
    }
}

function onGetPhotoImagesSuccess(data){    
  //  alert("onGetPhotoImagesSuccess");    
    $.each(data, function(index, value) {
      photos[index] = value.substr(value.lastIndexOf('\\')+1);
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
                    url = "http://" + SERVER + "/ContactService/Service1.asmx/SearchByDemographic"; 
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
      url = "http://" + SERVER + "/ContactService/Service1.asmx/SearchByDemographic"; 
     
      if(LOCAL){          
          data = JSON.parse(CONTACTSEARCH_SMITH_DATA);
          onContactSearchSuccess(data);
      }
      else{
          ajaxCall(url, param, onContactSearchSuccess, data);
      }
}

function onContactSearchSuccess(data){
  //  alert("onContactSearchSuccess");
 
    $("#tblDiv .k-grid-header").remove(); 
    addPhotoToContactList(data);
    $("#contactsearchlist").kendoMobileListView({
			dataSource: data.List,
			template: $("#recentcontact-listview-template").html(),
            style: "inset" 
		}).show();          
}
 


function takePicture(invId){
    alert("taking a photo");    
    currentInvId = invId;
 //   navigator.camera.getPicture(onPhotoURISuccess, onPhotoURIFail, {quality:20, destinationtype:navigator.camera.DestinationType.FILE_URI});

    navigator.camera.getPicture(
             function(imageURI){
               onPhotoURISuccess(imageURI, invId);
            },
            onPhotoURIFail,
            {quality:20, destinationtype:navigator.camera.DestinationType.FILE_URI});

}

function onPhotoURISuccess(imageURI, invId){
  //  alert("onPhotoURIsuccess");
    var image = document.getElementById(invId); 
    image.src = imageURI;
 //   alert("image.src = "+ image.src);
   uploadImage(imageURI, invId);
}

function uploadImage(imageURI, invId){
    alert("uploading image uri="+imageURI);
    var options = new FileUploadOptions();
    options.fileKey = "my_image";
  //  options.fileName = imageURI.substr(imageURI.lastIndexOf('/')+1);
    options.fileName = invId + ".jpg";
        
    //tested with both mineTypes, all worked.
    options.mineType = "text/plain";
  //  options.mineType="image/jpeg";
    var params = {
        val1: "some value",
        val2: "other value"
        };
    options.params = params;
    options.chunkedMode = false;
    
    var ft = new FileTransfer();
    ft.upload(imageURI, encodeURI('http://' + SERVER2 + '/TestFileUpload/upload.php'), onUploadSuccess, onUploadFail, options);
}

function onPhotoURIFail(error){
    alert("An error occurred: code= "+ error.code);
}

function onUploadSuccess(response){
    alert("Upload complete");
}

function onUploadFail(error){
    alert("An error occurred: code = "+ error.code);
}



       