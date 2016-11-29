import PolyWrap from './lib/Polywrap';

var poly = new PolyWrap(null, 'en-US');

console.log('Hello, world');



poly.translate('list.title').then((val)=> {console.log(val);});

function chgla(lan){
  poly.setLang(lan);
  poly.translate('list.title').then((val)=> {console.log(val); console.log(poly.translate('list.title')  + "");});
}

window.onload = function() {
     document.getElementById('chgEn').onclick=()=> {chgla('en-US')};
     document.getElementById('chgIt').onclick=()=> {chgla('it-IT')};
     document.getElementById('chgEs').onclick=()=> {chgla('es-ES')};
     document.getElementById('chgPt').onclick=()=> {chgla('pt-PT')};
     document.getElementById('chgPt').onclick=()=> {chgla('nonesiste')};
}
