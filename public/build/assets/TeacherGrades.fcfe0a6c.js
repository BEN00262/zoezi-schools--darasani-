var m=Object.defineProperty;var d=Object.getOwnPropertySymbols;var p=Object.prototype.hasOwnProperty,h=Object.prototype.propertyIsEnumerable;var l=(a,e,s)=>e in a?m(a,e,{enumerable:!0,configurable:!0,writable:!0,value:s}):a[e]=s,i=(a,e)=>{for(var s in e||(e={}))p.call(e,s)&&l(a,s,e[s]);if(d)for(var s of d(e))h.call(e,s)&&l(a,s,e[s]);return a};import{j as r,a as t}from"./index.d3bdb59a.js";import{f as x}from"./App.fdb277d2.js";import"./vendor.497bb12a.js";const g=({_id:a,name:e,year:s,stream:o,classRef:c})=>{const n=x();return r("div",{className:"col s12 m4",children:r("div",{onClick:b=>{localStorage.setItem("classId",a),localStorage.setItem("gradeName",e),n(`/grades/${a}`)},className:"hoverable z-depth-0",style:{cursor:"pointer",border:"1px solid #d3d3d3",marginBottom:"10px",borderRadius:"2px",padding:"5px"},children:t("div",{style:{display:"flex",flexDirection:"row",alignItems:"center"},children:[r("img",{style:{height:"100px",width:"100px",objectFit:"contain",border:"1px solid #d3d3d3",borderRadius:"50%"},src:`https://www.zoezi-education.com/img/${e.toLowerCase()}.png`}),t("ul",{style:{paddingLeft:"20px"},children:[t("li",{className:"sub-modal-texts",children:["Stream: ",o]}),t("li",{className:"sub-modal-texts",children:["Year: ",s]}),t("li",{className:"sub-modal-texts",children:[c.students.length," learners"]})]})]})})})},j=({grades:a})=>r("div",{className:"row",children:a.map((e,s)=>r(g,i({},e),s))});export{j as default};
