import{G as n,M as l,d as c}from"./App.742d430c.js";import{r}from"./vendor.69103231.js";import{a as t,j as e}from"./index.c02837b5.js";const u=()=>{const{authToken:o}=r.exports.useContext(n),[a,d]=r.exports.useState([]);return r.exports.useEffect(()=>{l.Collapsible.init(document.querySelectorAll(".collapsible"));const s=localStorage.getItem("classId")||"";c.get(`/api/grade/subscriptions/${s}`,{headers:{Authorization:`Bearer ${o}`}}).then(({data:i})=>{if(i){d(i.subscriptions);return}})},[]),t("div",{className:"section",children:[a.length?null:e("div",{className:"row",children:e("div",{className:"col s12 center",children:e("h6",{className:"sub-names",children:"The grade does not have any active subscriptions"})})}),a.map((s,i)=>e("div",{className:"col s12 m6",children:t("div",{className:"hoverable",style:{border:"1px solid #d3d3d3",marginBottom:"5px",padding:"5px",borderRadius:"2px"},children:[e("span",{className:"sub-modal-texts",style:{backgroundColor:s.isExpired?"rgba(255,0,0,0.3)":"rgba(0,255,0,0.3)",border:`1px solid ${s.isExpired?"red":"green"}`,borderRadius:"10px",paddingLeft:"10px",paddingRight:"10px"},children:s.isExpired?"Expired":"Active"}),e("br",{}),e("div",{style:{display:"flex",flexDirection:"row",justifyContent:"center",alignItems:"center"},children:e("img",{className:"img-box-responsive",style:{height:"80px"},src:"https://www.zoezi-education.com/img/two.png"})}),e("br",{}),t("span",{className:"sub-modal-texts",children:[s.isExpired?"Expired ":"Expires in "," ",s.daysRemaining]})]})},`subscription_${i}`))]})};export{u as default};
