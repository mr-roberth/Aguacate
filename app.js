// Pegue aquí la URL /exec de su Web App de Google Apps Script.
const API_URL = localStorage.getItem('aguacate_api_url') || 'https://script.google.com/macros/s/AKfycbyRooL7xdmVZ2pI2QFHw8yuAE50WmAyZbNrbPWnE8Qb39NtZKq2Vea0hhEtohHFpnsB/exec';
const QKEY='aguacate_offline_queue', USERKEY='aguacate_capturo';
const $=id=>document.getElementById(id);
let PROVIDERS=[];let DATA=[];
function lotCode(){const p=PROVIDERS.find(x=>x.proveedor===$('proveedor').value);if(!p||!$('fecha').value)return;const [y,m,d]=$('fecha').value.split('-');$('lote').value='A'+p.codigo+'-'+d+m+y.slice(-2)}
async function loadRemote(){try{const r=await fetch(API_URL+'?action=bootstrap');const j=await r.json();PROVIDERS=j.providers||[];DATA=j.data||[];$('proveedor').innerHTML='<option value="">Seleccione…</option>'+PROVIDERS.filter(x=>x.activo!=='NO').map(x=>'<option>'+x.proveedor+'</option>').join('');renderDash()}catch(e){console.warn(e)}}
function renderDash(){ $('kRecep').textContent=DATA.length;$('kKg').textContent=DATA.reduce((s,x)=>s+(+x.pesoOficial||0),0).toLocaleString('es-MX');const g={};DATA.forEach(x=>{if(x.proveedor)g[x.proveedor]=(g[x.proveedor]||0)+(+x.pesoOficial||0)});$('kProv').textContent=Object.keys(g).length;const mx=Math.max(1,...Object.values(g));$('bars').innerHTML=Object.entries(g).sort((a,b)=>b[1]-a[1]).slice(0,8).map(([n,v])=>'<div class="barRow"><span>'+n+'</span><div class="barTrack"><div class="barFill" style="width:'+v/mx*100+'%"></div></div><b>'+Math.round(v).toLocaleString('es-MX')+' kg</b></div>').join('')}
function downloadCSV(){const h=['Fecha','Hora','Folio','Lote','Peso bruto','Tara','Peso báscula','Peso proveedor','Peso oficial','Criterio','Operador','Proveedor','Capturó','Observaciones'];const rows=DATA.map(x=>[x.fecha,x.hora,x.folio,x.lote,x.pesoBruto,x.pesoTara,x.pesoBascula,x.pesoProveedor,x.pesoOficial,x.criterio,x.operador,x.proveedor,x.capturo,x.observaciones]);const esc=x=>'"'+String(x??'').replaceAll('"','""')+'"';const blob=new Blob([[h,...rows].map(r=>r.map(esc).join(',')).join('\n')],{type:'text/csv;charset=utf-8'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='Recepciones_Aguacate_Oleolab.csv';a.click();URL.revokeObjectURL(a.href)}
function nowDefaults(){const d=new Date();$('fecha').value=d.toISOString().slice(0,10);$('hora').value=d.toTimeString().slice(0,5);$('capturo').value=localStorage.getItem(USERKEY)||''}
function calc(){
 const bruto=+$('bruto').value||0,tara=+$('tara').value||0,pp=+$('proveedorPeso').value||0;
 const pb=bruto-tara, pct=pp?Math.abs(pb-pp)/pp:0, ok=pp&&pct<=.01, oficial=pp?(ok?pp:pb):pb;
 $('pesoBascula').textContent=pb.toLocaleString('es-MX',{minimumFractionDigits:2})+' kg';
 $('diferencia').textContent=(pct*100).toFixed(2)+'%';
 $('pesoOficial').textContent=oficial.toLocaleString('es-MX',{minimumFractionDigits:2})+' kg';
 $('criterio').textContent=pp?(ok?'Proveedor (±1%)':'Báscula Oleolab'):'Sin peso proveedor';
 $('criterio').style.color=ok?'#1f5a44':'#a15c00';
 return {pesoBascula:pb,diferenciaPct:pct,pesoOficial:oficial,criterio:pp?(ok?'PROVEEDOR ±1%':'BÁSCULA OLEOLAB'):'SIN PESO PROVEEDOR'};
}
$('proveedor').addEventListener('change',lotCode);$('fecha').addEventListener('change',lotCode);$('csvBtn').onclick=downloadCSV;
['bruto','tara','proveedorPeso'].forEach(x=>$(x).addEventListener('input',calc));
function queue(){return JSON.parse(localStorage.getItem(QKEY)||'[]')}function saveQueue(q){localStorage.setItem(QKEY,JSON.stringify(q));status()}
function status(){const n=queue().length;$('syncText').textContent=n? n+' registro(s) pendiente(s) de sincronizar.':'Sin registros pendientes.';$('net').textContent=navigator.onLine?'En línea':'Sin conexión';}
function toast(t){$('toast').textContent=t;$('toast').style.display='block';setTimeout(()=>$('toast').style.display='none',2600)}
function payload(){
 const c=calc(); return {id:crypto.randomUUID(),fecha:$('fecha').value,hora:$('hora').value,folio:$('folio').value.trim(),lote:$('lote').value.trim(),
 pesoBruto:+$('bruto').value,pesoTara:+$('tara').value,pesoBascula:c.pesoBascula,pesoProveedor:+$('proveedorPeso').value,diferenciaPct:c.diferenciaPct,pesoOficial:c.pesoOficial,
 criterio:c.criterio,operador:$('operador').value.trim(),proveedor:$('proveedor').value.trim(),recibe1:$('recibe1').value.trim(),recibe2:$('recibe2').value.trim(),
 capturo:$('capturo').value.trim(),fechaCaptura:new Date().toISOString(),observaciones:$('obs').value.trim()};}
async function send(r){
 if(!API_URL) throw new Error('Falta configurar API_URL');
 await fetch(API_URL,{method:'POST',mode:'no-cors',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify(r)});
}
async function sync(){
 if(!navigator.onLine)return status(); let q=queue(); if(!q.length)return status();
 if(!API_URL){toast('Configura primero la URL de Apps Script en app.js');return}
 const pending=[]; for(const r of q){try{await send(r)}catch(e){pending.push(r)}} saveQueue(pending); toast(pending.length?'Quedaron registros pendientes':'Sincronización enviada');
}
$('form').addEventListener('submit',async e=>{e.preventDefault();const r=payload();localStorage.setItem(USERKEY,r.capturo);const q=queue();q.push(r);saveQueue(q);toast('Registro guardado'+(navigator.onLine?' y listo para sincronizar':' sin conexión'));e.target.reset();nowDefaults();calc();if(navigator.onLine)await sync()});
$('syncBtn').onclick=sync;window.addEventListener('online',sync);window.addEventListener('online',status);window.addEventListener('offline',status);
if('serviceWorker'in navigator)navigator.serviceWorker.register('sw.js');nowDefaults();calc();status();loadRemote();