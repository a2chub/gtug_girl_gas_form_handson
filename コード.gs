function onFormSubmit(e) {
  // Formの項目とhash keyの対応hash
  var title_hash = {
    "お名前" : "rep_name",
    "rep_input_date":"rep_input_date",
    "お腹のすき具合":"rep_hungry_level",
     "rep_tkg_cnt":"rep_tkg_cnt"
    };
    
  // result用のhash
  var res_hash = {
    "rep_name":"",
    "rep_input_date":getCurrentTime(),
    "rep_hungry_level":"",
    "rep_tkg_cnt":""
    };
  
  // フォームの内容を取得
  var formResponses = e.response.getItemResponses();
  
  for (var i = 0; i < formResponses.length; i++) {
    var formResponse = formResponses[i];
    var item_key = formResponse.getItem().getTitle();
    res_hash[title_hash[item_key]] = formResponse.getResponse(); 
    };
  
  // ハラヘリ具合からTKGを算出
  res_hash["rep_tkg_cnt"] = calcTKG( res_hash["rep_hungry_level"] );
  
  Logger.log( res_hash );
  
}

function calcTKG(input_hungry){
  var tkg_factor = 2.0;
  return input_hungry * tkg_factor;
}


function getCurrentTime(){
  var cur_time = new Date();
  Logger.log( cur_time );
  return cur_time
}