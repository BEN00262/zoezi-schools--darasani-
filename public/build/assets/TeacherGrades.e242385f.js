var m=Object.defineProperty;var t=Object.getOwnPropertySymbols;var p=Object.prototype.hasOwnProperty,h=Object.prototype.propertyIsEnumerable;var i=(a,e,s)=>e in a?m(a,e,{enumerable:!0,configurable:!0,writable:!0,value:s}):a[e]=s,l=(a,e)=>{for(var s in e||(e={}))p.call(e,s)&&i(a,s,e[s]);if(t)for(var s of t(e))h.call(e,s)&&i(a,s,e[s]);return a};import{h as x,E as u}from"./App.d253462d.js";import{j as r,a as d}from"./index.f5dae826.js";import"./vendor.497bb12a.js";const g=({_id:a,name:e,year:s,stream:o,classRef:n})=>{const c=x();return r("div",{className:"col s12 m4",children:r("div",{onClick:b=>c(`/grades/${a}`),className:"hoverable z-depth-0",style:{cursor:"pointer",border:"1px solid #d3d3d3",marginBottom:"10px",borderRadius:"2px",padding:"5px"},children:d("div",{style:{display:"flex",flexDirection:"row",alignItems:"center"},children:[r("img",{style:{height:"100px",width:"100px",objectFit:"contain",border:"1px solid #d3d3d3",borderRadius:"50%"},src:`https://www.zoezi-education.com/img/${u(e)}`}),d("ul",{style:{paddingLeft:"20px"},children:[d("li",{className:"sub-modal-texts",children:["Stream: ",o]}),d("li",{className:"sub-modal-texts",children:["Year: ",s]}),d("li",{className:"sub-modal-texts",children:[n.students.length," learners"]})]})]})})})},w=({grades:a})=>r("div",{className:"row",children:a.map((e,s)=>r(g,l({},e),s))});export{w as default};
