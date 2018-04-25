// フォームが投稿時に呼ばれて、メール送信
function onFormSubmit(e){
  Logger.log( e.response );
  var formResponses = e.response.getItemResponses();
  var formData = makeFormDataHash(formResponses);
  Logger.log( formData );

  var sendToAddr = formData["rep_email"];
  var sendSubject = formData["rep_name"] + '様　ありがとうございます';
  var sendBody = makeMailBody(formData);
  Logger.log( sendBody );
  var fromName = 'a2c';

  send_email(sendToAddr, sendSubject, sendBody, fromName)
  
}

// フォーム入力の項目を整形する
function makeFormDataHash(formResponses) {
  // Formの項目とhash keyの対応hash
  var title_hash = {
    "Email":"email",
    "お名前" : "rep_name",
    "rep_input_date":"rep_input_date",
    "お腹のすき具合":"rep_hungry_level",
     "rep_tkg_cnt":"rep_tkg_cnt"
    };
    
  // result用のhash
  var res_hash = {
    "rep_email":"",
    "rep_name":"",
    "rep_input_date":getCurrentTime(),
    "rep_hungry_level":"",
    "rep_tkg_cnt":""
    };
  
  // フォームの内容を取得
  
  for (var i = 0; i < formResponses.length; i++) {
    var formResponse = formResponses[i];
    var item_key = formResponse.getItem().getTitle();
    res_hash[title_hash[item_key]] = formResponse.getResponse(); 
    };
  
  // ハラヘリ具合からTKGを算出
  res_hash["rep_tkg_cnt"] = calcTKG( res_hash["rep_hungry_level"] );
  // ハラヘリ具合をラベル表記
  res_hash['rep_hungry_level'] = calcHungry( res_hash['rep_hungry_level'] );
  
  Logger.log( res_hash );
  return res_hash
  
}


// メール本文を生成する
function makeMailBody(form_data) {
  var docTest=DocumentApp.openById("1zcuOCOc_do-yUzKBtBWj5Zmh7FJn_1-k-XWLVMFbTB0"); //ドキュメントをIDで取得
  var strDoc=docTest.getBody().getText(); //ドキュメントの内容を取得
  
  /* メール表題、fromアドレス、差出人名を準備 */
  var strSubject_org="ここはメールタイトル";
  var strFrom="from@emailAddress.com"; //From
  var strSender="差出人 名称"; //差出人  
  
  // formのデータを抜粋
  var rep_name = form_data["rep_name"];
  var rep_input_date = getCurrentTime();
  var rep_hungry_level = form_data["rep_hungry_level"];
  var rep_tkg_cnt = form_data["rep_tkg_cnt"];
  
  var strBody=strDoc.replace(/%name%/,rep_name).replace(/%input_date%/,rep_input_date).replace(/%hungry_level%/,rep_hungry_level).replace(/%tkg_cnt%/,rep_tkg_cnt);
  Logger.log(strBody + "========\n" ); //ドキュメントの内容をログに表示
  return strBody
}



/* メールを送信 */
function send_email(sendToAddr, sendSubject, sendBody, fromName){
  var aliases = GmailApp.getAliases();
  GmailApp.sendEmail(
    sendToAddr, //toアドレス
    sendSubject,  //表題
    sendBody,　//本文
    {
    name: fromName,　//差出人
    bcc: "name@yourdomain.com",
    'from': aliases[0]
    }
  );
}

function calcTKG(input_hungry){
  var tkg_factor = 2.0;
  return input_hungry * tkg_factor;
}

function calcHungry(hung_lvl){
  var h_level_label = {'1':'満腹',
                       '2':'やや満腹',
                       '3':'普通',
                       '4':'はらへり',
                       '5':'ゲキはらへり'};
  return h_level_label[hung_lvl]
}


function getCurrentTime(){
  var cur_time = new Date();
  Logger.log( cur_time );
  return cur_time
}