var T=Object.defineProperty;var u=Object.getOwnPropertySymbols;var I=Object.prototype.hasOwnProperty,R=Object.prototype.propertyIsEnumerable;var g=(e,a,s)=>a in e?T(e,a,{enumerable:!0,configurable:!0,writable:!0,value:s}):e[a]=s,x=(e,a)=>{for(var s in a||(a={}))I.call(a,s)&&g(e,s,a[s]);if(u)for(var s of u(a))R.call(a,s)&&g(e,s,a[s]);return e};import{G as O,u as f,f as S,g as j,d as b,h as k,t as h,i as F}from"./App.73a128b6.js";import{r as m}from"./vendor.5c57f7a1.js";import{j as r,a as i,F as z}from"./index.cc430573.js";const $=e=>h.success(e,{position:h.POSITION.TOP_RIGHT,autoClose:2e3,className:"sub-modal-texts"}),A=e=>h.error(e,{position:h.POSITION.TOP_RIGHT,autoClose:2e3,className:"sub-modal-texts"}),E=({_id:e,firstname:a,lastname:s,gender:c,profilePic:n})=>{const o=f();return r("div",{className:"col s6 m4",children:r("div",{onClick:p=>o(`/learner/${e}`),className:"hoverable z-depth-0 hoverable sub-modal-texts",style:{cursor:"pointer",border:"1px solid #d3d3d3",borderRadius:"2px",padding:"5px",marginBottom:"5px"},children:i("div",{style:{display:"flex",flexDirection:"row",alignItems:"center"},children:[r("img",{style:{height:"100px",width:"100px",objectFit:"contain",border:"1px solid #d3d3d3",borderRadius:"50%"},src:n||F(c)}),r("ul",{style:{paddingLeft:"20px"},children:r("li",{style:{letterSpacing:"1px"},children:i("b",{children:[a," ",s]})})})]})})})},J=({classRefId:e})=>{const{authToken:a,isTeacher:s}=m.exports.useContext(O),c=f(),[n,o]=m.exports.useState([]),[p,v]=m.exports.useState([]),{isError:N,error:w,isLoading:_,isSuccess:y,isIdle:C}=S(["in_app_grade_learners",e],()=>b.get(`/api/grade/learners/${e}`,{headers:{Authorization:`Bearer ${a}`}}).then(({data:l})=>{if(l){let t=l.learners;o(t),v(t);return}throw new Error("Failed to fetch learners")}),{enabled:!!a&&!!e});if(_||C)return r(j,{});const L=l=>{let t=(l.target.value||"").toLowerCase();if(!t){o(p);return}o(p.filter(d=>d.firstname.toLowerCase().indexOf(t)>-1||d.lastname.toLowerCase().indexOf(t)>-1))};return i(z,{children:[i("div",{className:"row",children:[i("div",{className:"col s12 m8 left-align",children:[i("button",{disabled:s,className:"waves-effect waves-light btn-flat",style:{marginRight:"5px"},onClick:l=>c("/learner/import"),children:[r("i",{className:"material-icons right",children:"cloud_upload"}),"Import Learners"]}),i("button",{style:{marginRight:"5px"},disabled:s,className:"waves-effect waves-light btn-flat",onClick:l=>c("/learner/new"),children:[r("i",{className:"material-icons right",children:"person_add"}),"Add Learner"]}),i("button",{disabled:!n.length,className:"waves-effect waves-light btn-flat",onClick:l=>{const t=localStorage.getItem("classRefId")||"";b.get(`/api/grade/learners/credentials/${t}`,{headers:{Authorization:`Bearer ${a}`}}).then(async({data:d})=>{if(d){if(await k(d,"credentials.xlsx")){$("Exported leaners credentials successfully!");return}A("Failed to export learners credentials. Please contact zoezi team")}})},children:[r("i",{className:"material-icons right",children:"cloud_download"}),"Export Credentials"]})]}),r("div",{className:"col s12 m4 right-align",children:r("input",{type:"search",className:"browser-default",onChange:L,style:{border:"1px solid #d3d3d3",borderRadius:"20px",lineHeight:"1px",padding:"5px 10px"},placeholder:"search learner..."})})]}),N?r("div",{className:"row",children:r("div",{className:"col s12",children:i("div",{className:"sub-modal-texts",style:{borderLeft:"2px solid red",paddingLeft:"5px",paddingRight:"5px",borderRadius:"3px",lineHeight:"4em",backgroundColor:"rgba(255,0,0, 0.1)",display:"flex",flexDirection:"row",alignItems:"center"},children:[r("i",{className:"material-icons left",children:"error_outline"}),r("p",{children:w})]})})}):null,r("div",{className:"row",children:y&&n.map((l,t)=>r(E,x({},l),t))})]})};export{J as default};
