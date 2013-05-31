function getFileSystem(){    
  //  alert("getfilesystem---");
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, onGetFileSystemSuccess, onGetFileSystemFail); 
}

function onGetFileSystemSuccess(fileSystem){
    root = fileSystem.root;  
}

function onGetFileSystemFail(evt){
         // console.log(evt.target.error.code);
}   


function getMyFiles(e){ 
  //  alert("getMyFiles");
  //  alert("getMyfiles, activeItem="+activeItem);
    clickItemAction();
    $('#backBtn').hide();
    $('#pasteBtn').removeAttr("onclick");
    //in case directory "dir" is passed in, list the dir 
   // if(activeItem ==null)
  //  alert("getMyfiles: e.view="+ e.view);
  //  alert("getMyfiles: e.view.params =" + e.view.params);
  //  alert("getMyfiles: e.view.params.dir="+ e.view.params.dir);
   //   if(e.view.params.dir == null)
    {
      //  alert("listing root " + root.name );
        listDirectory(root);
        }
   /* else if(activeItem != null && activeItem == 'd')
    {
        alert("listing dir: "+ dir);
      //  alert("listing activeItem.name " + activeItem.name);
       // listDirectory(activeItem);
        listDirectory(e.view.params.dir);
        }*/
}


function listDirectory(directoryEntry){      
  //  alert("listDirectory");
  //  alert("listDirectory: directoryentry.fullPath="+directoryEntry.fullPath);
    
    $('#fileField').html(directoryEntry.fullPath); 
    
 //   alert("listDirectory of " + directoryEntry.name);
    if(!directoryEntry.isDirectory)
        console.log("listDirectory incorrect type");
    
    currentDir = directoryEntry;
  //  alert("currentdir="+ currentDir.name);
    directoryEntry.getParent(function(par){
        parentDir = par;
    //   alert("parentDir.name="+parentDir.name);
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
       
        for(var i=0; i<entries.length; i++){            
            var entry = entries[i];       
            if(entry.isDirectory && entry.name[0]!='.') {
                dirArr.push(entry);
            }
            else if(entry.isFile && entry.name[0]!='.') {
                fileArr.push(entry);
            }
         }          
        
        var sortedArr = dirArr.concat(fileArr);
        var uiBlock = ['a','b','c','d'];
        
        for(var i=0;i<sortedArr.length;i++){
            var item = sortedArr[i];
            var letter = uiBlock[i%4];
            if(item.isDirectory)
                dirContent.append('<div class="ui-block-'+letter+'"><div class="folder"><p>'+item.name + '</p></div></div>');                
            else
               dirContent.append('<div class="ui-block-'+letter+'"><div class="file"><p>'+item.name + '</p></div></div>');               
            }
         });    
}

function clickItemAction(){    
// alert("clickItemAction");    
    var folders = $('.folder');
    var files = $('.file');
    var backBtn = $('#backBtn');
    
    folders.live('click', function(){       
        var name = $(this).text();
        openMenuOptions(); 
        getActiveItem(name,'d');      
    });   


    files.live('click', function(){
      //  alert("file clicked");
        var name = $(this).text();
        openMenuOptions();
        getActiveItem(name, 'f');      
    });
    
    backBtn.live('click', function(){    
      //  alert("backBtn clicked");
      // alert("backBtn clicked: parentDir="+ parentDir.name);
        
        if(parentDir != null){     
      //      alert("listing parendir" + parentDir.name);
            listDirectory(parentDir);
        } 
    });
}

function getActiveItem(name, type){
 //   alert("getactiveItem, name=" + name + " type=" +type + ",currentDir.name=" + currentDir.name);   
    if(type=='d' && currentDir != null){
        currentDir.getDirectory(name, {create:false},
            function(dir){
              //  alert("getactiveItem success, dir.name="+ dir.name);
                activeItem = dir;
                activeItemType = type;                    
            },
            function(error){
                alert("getactiveItem error" + error.code);
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
 //   alert("openItem, type="+ type);
    if(type=='d')
    { //alert("openItem:listDirectory "+ activeItem.name);
        listDirectory(activeItem);
    }
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
        if (device.platform === 'Android') {           
		    var path = this.getWorkingFolder().replace('http://', 'file://') + fileEntry.name;
		  //  fileDiv.innerText = path;
		    window.plugins.childBrowser.openExternal(path);
         }
         else{ 
                var url="file://" + fileEntry.fullPath;
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

function backBtnClicked(){
    $('#dirContent').empty();
      //  alert("backBtn clicked");
     //  alert("backBtn clicked: parentDir="+ parentDir.name);
        
        if(parentDir != null){
            listDirectory(parentDir);           
        } 
    $('#addFolderDialog').hide();
    
}

function openBtnClicked(){   
    openItem(activeItemType);   
    closeMenuOptions();
}


function deleteBtnClicked(){
   // alert("deleteBtnClicked");
    var msg = "Are you sure you want to remove " + activeItem.name + "?";   
    $('#confirmDeleteMsg').text(msg);
    var confirmdelete = $('#deleteModal').data("kendoMobileModalView");   
    closeMenuOptions();
    confirmdelete.open();
}



function copyBtnCLicked(){
    getClipboardItem('c');	
    closeMenuOptions();		
    $('#pasteBtn').attr("onclick", "javascript:pasteBtnCLicked();");
}

function moveBtnCLicked(){
    getClipboardItem('m');
    closeMenuOptions();
    $('#pasteBtn').attr("onclick", "javascript:pasteBtnCLicked();");    
}

function pasteBtnCLicked(){
  //  alert("pasteBtnclicked"); 
    if( clipboardItem != null && clipboardAction != null ){
		if(clipboardAction == 'c'){ 
            alert('copy: '+clipboardItem.name + ' to: '+activeItem.name);
			console.log('copy: '+clipboardItem.name + ' to: '+activeItem.name);
			clipboardItem.copyTo(activeItem,clipboardItem.name,
				function(fileCopy){
					console.log('copy success! '+fileCopy.name);					
                    $('#pasteBtn').removeAttr("onclick");                    
                    openBtnClicked();
				}, function(error){
					console.log('copy error: '+error.code);
				}
			);
		} else if(clipboardAction == 'm'){
            alert('move: '+clipboardItem.name + ' to: '+activeItem.name);
			console.log('move: '+clipboardItem.name + ' to: '+activeItem.name);
			clipboardItem.moveTo(activeItem,clipboardItem.name,
				function(fileCopy){
					console.log('move success! '+fileCopy.name);					
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
            listDirectory(currentDir);
        },
        function(error){
            console.log("remove recursively with error: "+ error.code);
        });
      }else if(activeItemType == 'f'){
          activeItem.remove(function(){
              console.log("removed file with success");
              listDirectory(currentDir);
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
    $('#createBtn').click(function(){
        var filename = $('#newFolderName').val();
        var isDir = document.getElementById("radio_d").checked;      
        if(isDir){
            createDirectory(filename);  
            }
        else{
            fileText = $('#filetext').val();          
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
        if(isDir){
            createDirectory(filename);  
            }
        else{
            fileText = $('#filetext').val();         
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
    $('#filetext').hide();
    currentDir.getDirectory(name, {create: true, exclusive: false}, createDirectirtSuccess, createDirectoryFail);
    
}

function createDirectirtSuccess(parent) {
  //  alert("createDirectorySuccess, parent.name="+parent.name);
    console.log("Parent Name: " + parent.name);
    listDirectory(currentDir);
}

function createDirectoryFail(error) {    
    alert("Unable to create new directory: " + error.code);
}

function createFile(name){
  //  alert("createfile");    
    resetAddFolderDialog();
   
   $('#filetext').hide();
    if(name.indexOf(".txt")==-1)
        name=name+".txt";
    
    currentDir.getFile(name, {create: true, exclusive: false}, createFileSuccess, createFilefail);
}

function createFileSuccess(parent){
  //  alert("file created");
    console.log("Parent Name: " + parent.name);
    parent.createWriter(gotFileWriter, writeFilefail);
    listDirectory(currentDir);
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



