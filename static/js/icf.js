$(window).bind("pageshow",function(){var form=$('form');form[0].reset()});
var icfData=[];var flag=0;
$('input[type = "radio"]').change(function(){if(this.value=='Yes'){flag++}else if(this.value=='No'){flag--}
if(flag==10){$('#sub_icf').show()}else{$('#sub_icf').hide()}});
function sendICF(){var icf={};var ele=document.getElementsByTagName('input');
for(i=0;i<ele.length;i++){if(ele[i].type="radio"){if(ele[i].checked)icf[ele[i].name]=ele[i].value}}
icfData.push(icf);console.log("JSONify "+JSON.stringify(icfData));
$.ajax({url:"/insert_icf",data:JSON.stringify(icfData),type:'POST',contentType:'application/json;charset=UTF-8',dataType:'jsonp',async:!1,cache:!1,headers:{'cache-control':'no-cache',"Access-Control-Allow-Origin":"*"},success:function(response){var dbData=response.result;console.log("Success"+dbData)},error:function(error){console.log(error)}})}