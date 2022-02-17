import{C as P,a as A,L,B as D,p as R,b as j,c as k,G as B,u as _,d as m,M as E,D as I,S as N,e as z}from"./App.1a86b389.js";import{r}from"./vendor.fd4def91.js";import{a as t,j as e,F}from"./index.a128bd10.js";P.register(A,L,D,R,j,k);const O=(c,n)=>({indexAxis:n?"y":"x",responsive:!0,maintainAspectRatio:!1,redraw:!0,plugins:{legend:{position:"top"},title:{display:!0,text:c},barValueSpacing:40,tooltips:{displayColors:!0,callbacks:{mode:"x"}},datalabels:{display:b=>!1},scales:{xAxes:[{gridLines:{display:!0,drawBorder:!1}}],yAxes:[{gridLines:{display:!1,drawBorder:!0}}]}}}),q=({subject:c})=>{const{authToken:n}=r.exports.useContext(B),b=_(),[y,S]=r.exports.useState([]),[h,f]=r.exports.useState([]),[i,$]=r.exports.useState(""),[o,w]=r.exports.useState({firstname:"",lastname:"",profilePic:""}),[d,x]=r.exports.useState({isSpecial:!1,label:"",value:""}),[p,g]=r.exports.useState([]),[u,v]=r.exports.useState({pass:[],fail:[]}),C=!1;return r.exports.useEffect(()=>{const a=localStorage.getItem("classRefId")||"";m.get(`/api/grade/learners/${a}`,{headers:{Authorization:`Bearer ${n}`}}).then(({data:s})=>{if(s){S(s.learners.map(l=>({label:`${l.firstname} ${l.lastname}`,value:l._id})));return}}),E.Tabs.init(document.querySelector(".sub-tabs"),{swipeable:!0})},[]),r.exports.useEffect(()=>{d&&d.value&&m.get(`/api/analytics/learner/${i}/${d.value}${d.isSpecial?"/special":""}`,{headers:{Authorization:`Bearer ${n}`}}).then(({data:a})=>{if(a){let s=a.plottable;v({pass:s.map(l=>l.score.passed),fail:s.map(l=>l.score.total-l.score.passed)}),g(s);return}})},[d]),r.exports.useEffect(()=>{if(i){f([]),x(null),v({fail:[],pass:[]}),g([]);const a=localStorage.getItem("classId")||"";m.get(`/api/analytics/subject/${a}/${i}/${c}`,{headers:{Authorization:`Bearer ${n}`}}).then(({data:s})=>{if(s){w(s.student),f(s.papersDone.map(l=>({label:`${c} ( ${l.subject} )`,value:l.paperID,isSpecial:l.isSpecial})));return}})}},[i]),t("div",{className:"row",children:[o.firstname?e("div",{className:"col s12 center",children:t("div",{style:{margin:"auto"},children:[e("img",{style:{height:"100px",width:"100px",objectFit:"contain",border:"1px solid #d3d3d3",borderRadius:"50%"},src:o.profilePic?o.profilePic:I}),e("br",{}),e("span",{className:"sub-modal-texts",style:{letterSpacing:"1px"},children:t("b",{children:[o.firstname," ",o.lastname]})}),h.length?null:t(F,{children:[" ",e("span",{className:"sub-modal-texts",style:{border:"1px solid red",padding:"1px 10px",borderRadius:"20px"},children:e("b",{children:"has not attempted any paper(s)"})})]})]})}):null,e("div",{className:"col s12",children:t("ul",{className:"sub-tabs tabs tabs-fixed-width",style:{overflowX:"hidden"},children:[e("li",{className:"tab col s6",children:e("a",{href:"#analytics",className:"active",children:"Analytics"})}),e("li",{className:`tab col s6 ${p.length?"":"disabled"}`,children:t("a",{href:"#lastDonePapers",children:["Last (",p.length,") Paper(s)"]})})]})}),t("div",{id:"analytics",children:[e("div",{className:"col s12 m12 l4",children:e("div",{className:"card z-depth-0",style:{border:"1px solid #dcdee2"},children:t("div",{className:"card-content",children:[t("div",{className:"row",children:[t("div",{className:"col s12 m12",children:[e("label",{children:"Learner"}),e(N,{hideSelectedOptions:!0,onChange:a=>{$((a==null?void 0:a.value)||"")},options:y,placeholder:"select learner..."})]}),t("div",{className:"col s12 m12",children:[e("label",{children:"Paper"}),e(N,{hideSelectedOptions:!0,isDisabled:!i||!h.length,options:h,value:d,onChange:a=>{x(a||{})},placeholder:"select paper..."})]})]}),e("div",{className:"row",id:"performanceReportButton",hidden:!0,children:e("div",{className:"col s12 m12",children:t("button",{onClick:()=>{},"data-position":"bottom","data-tooltip":"Scroll down to view or download the report",className:"btn-small sub-modal-texts tooltipped white black-text waves-effect waves-black z-depth-1",style:{width:"100%",fontWeight:"bold"},children:["PERFORMANCE REPORT",e("i",{className:"material-icons right",children:"assessment"})]})})})]})})}),e("div",{className:"col s12 m12 l8",children:e("div",{className:"card z-depth-0",style:{border:"1px solid #dcdee2"},children:e("div",{className:"card-content",children:e("div",{className:"row",id:"insertChart",children:e(z,{options:O("Performance Analysis",C),style:{height:"300px"},data:{labels:u.pass.map((a,s)=>`Attempt ${s+1}`),datasets:[{label:"Pass",data:u.pass,backgroundColor:"#00c853"},{label:"Fail",data:u.fail,backgroundColor:"#f44336"}]}})})})})})]}),e("div",{id:"lastDonePapers",children:p.length?e("div",{className:"col s12 m12",children:e("div",{className:"section",children:p.map((a,s)=>e("div",{className:"col s6 m2 l2",children:e("div",{className:"hoverable",onClick:l=>b(a.isSpecial?`/library-paper/special/${i}/${a.grade}/${a.paperID}/${a._id}`:`/library-paper/${i}/${a._id}`),style:{backgroundColor:"#fffde7",marginBottom:"5px",cursor:"pointer",border:"1px solid #d3d3d3",borderRadius:"2px",padding:"4px"},children:t("div",{className:"center",children:[e("span",{className:"sub-names truncate",children:e("b",{children:a.subject})}),e("br",{}),e("span",{className:"sub-modal-texts teal-text truncate",style:{backgroundColor:"#fff",border:"1px solid #d3d3d3",padding:"4px",borderRadius:"2px"},children:t("b",{children:[a.subject.split(" ")[0].toLocaleLowerCase().includes("kiwahili")?"ALAMA":"SCORE","(",a.score.passed,"/",a.score.total,")"]})})]})})},s))})}):null})]})};export{q as default,O as options};
