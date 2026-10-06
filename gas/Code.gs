const SHEET_NAME='BD_Recepciones';
function doPost(e){
  const lock=LockService.getScriptLock(); lock.waitLock(10000);
  try{
    const d=JSON.parse(e.postData.contents||'{}');
    const sh=SpreadsheetApp.getActive().getSheetByName(SHEET_NAME);
    if(!sh) throw new Error('No existe '+SHEET_NAME);
    const ids=sh.getLastRow()>1?sh.getRange(2,1,sh.getLastRow()-1,1).getDisplayValues().flat():[];
    if(ids.includes(d.id)) return out({ok:true,duplicate:true,id:d.id});
    sh.appendRow([d.id,d.fecha,d.hora,d.folio,d.lote,d.pesoBruto,d.pesoTara,d.pesoBascula,d.pesoProveedor,d.pesoBascula-d.pesoProveedor,d.diferenciaPct,d.pesoOficial,d.criterio,d.operador,d.proveedor,d.recibe1,d.recibe2,d.capturo,d.fechaCaptura,d.observaciones]);
    return out({ok:true,id:d.id});
  }catch(err){return out({ok:false,error:String(err)})}finally{lock.releaseLock()}
}
function doGet(){return out({ok:true,service:'Aguacate Oleolab',ts:new Date().toISOString()})}
function out(o){return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON)}