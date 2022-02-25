import{a as t}from"./vendor.0b632b43.js";import{G as u,d as x,R as p,P as g,i as m,T as b}from"./App.d010edc5.js";import{a as i,j as e}from"./index.0d31a39b.js";let f=function(s){return i("text",{x:s.x,y:s.y,stroke:s.fill,children:[s.name," ( ",s.value,"% )"]})};const j=()=>{const{authToken:s}=t.exports.useContext(u),[l,n]=t.exports.useState({boys:50,girls:50}),[o,c]=t.exports.useState("");return t.exports.useEffect(()=>{const h=localStorage.getItem("classRefId")||"";x.get(`/api/grade/gender-distribution/${h}`,{headers:{Authorization:`Bearer ${s}`}}).then(({data:r})=>{if(r){let a=r,d=a.boys+a.girls;n({boys:+(a.boys/d*100).toFixed(0),girls:+(a.girls/d*100).toFixed(0)});return}throw new Error("Unexpected error")}).catch(r=>{c(r.message)})},[]),i("div",{className:"row",children:[o?e("div",{className:"row",children:e("div",{className:"col s10 push-s1",children:i("div",{className:"sub-modal-texts",style:{borderLeft:"2px solid red",paddingLeft:"5px",paddingRight:"5px",borderRadius:"3px",lineHeight:"4em",backgroundColor:"rgba(255,0,0, 0.1)",display:"flex",flexDirection:"row",alignItems:"center"},children:[e("i",{className:"material-icons left",children:"error_outline"}),e("p",{children:o})]})})}):null,e("div",{className:"col s12",style:{height:"400px"},children:e(p,{width:"100%",height:"100%",children:i(g,{children:[e(m,{dataKey:"value",data:[{name:"Boys",value:l.boys,fill:"rgba(255, 99, 132, 1)"},{name:"Girls",value:l.girls,fill:"rgba(54, 162, 235, 1)"}],innerRadius:70,outerRadius:140,fill:"#82ca9d",label:f}),e(b,{})]})})})]})};export{j as default};
