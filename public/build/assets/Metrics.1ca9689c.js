import{r as i}from"./vendor.497bb12a.js";import{u as h,d as p,n as g,P as m,o as x,T as f}from"./App.c0da60f3.js";import{a as t,j as e}from"./index.09f79288.js";const b=function(s){return t("text",{x:s.x,y:s.y,stroke:s.fill,children:[s.name," ( ",s.value,"% )"]})},j=()=>{const{authToken:s}=h(),[o,d]=i.exports.useState({boys:50,girls:50}),[l,c]=i.exports.useState("");return i.exports.useEffect(()=>{const u=localStorage.getItem("classRefId")||"";p.get(`/api/grade/gender-distribution/${u}`,{headers:{Authorization:`Bearer ${s}`}}).then(({data:r})=>{if(r){const a=r,n=a.boys+a.girls;d({boys:+(a.boys/n*100).toFixed(0),girls:+(a.girls/n*100).toFixed(0)});return}throw new Error("Unexpected error")}).catch(r=>{c(r.message)})},[]),t("div",{className:"row",children:[l?e("div",{className:"row",children:e("div",{className:"col s10 push-s1",children:t("div",{className:"sub-modal-texts",style:{borderLeft:"2px solid red",paddingLeft:"5px",paddingRight:"5px",borderRadius:"3px",lineHeight:"4em",backgroundColor:"rgba(255,0,0, 0.1)",display:"flex",flexDirection:"row",alignItems:"center"},children:[e("i",{className:"material-icons left",children:"error_outline"}),e("p",{children:l})]})})}):null,e("div",{className:"col s12",style:{height:"400px"},children:e(g,{width:"100%",height:"100%",children:t(m,{children:[e(x,{dataKey:"value",data:[{name:"Boys",value:o.boys,fill:"rgba(255, 99, 132, 1)"},{name:"Girls",value:o.girls,fill:"rgba(54, 162, 235, 1)"}],innerRadius:70,outerRadius:140,fill:"#82ca9d",label:b}),e(f,{})]})})})]})};export{j as default};
