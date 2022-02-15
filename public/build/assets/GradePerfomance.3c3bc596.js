import{C as I,a as E,L as P,B as j,p as k,b as R,c as T,G as z,d as h,S,e as G}from"./App.d458439c.js";import{r as s}from"./vendor.fd4def91.js";import{j as a,a as c}from"./index.afabf514.js";I.register(E,P,j,k,R,T);const L=(u,f)=>({indexAxis:f?"y":"x",responsive:!0,maintainAspectRatio:!1,redraw:!0,plugins:{legend:{position:"top",display:!1},title:{display:!0,text:u},barValueSpacing:40,tooltips:{displayColors:!0,callbacks:{mode:"x"}},datalabels:{display:d=>!1},scales:{xAxes:[{gridLines:{display:!0,drawBorder:!1}}],yAxes:[{gridLines:{display:!1,drawBorder:!0}}]}}}),U=({setClassMeanScore:u})=>{const f=!1,{authToken:d}=s.exports.useContext(z),[$,N]=s.exports.useState([]),[_,A]=s.exports.useState([]),[C,x]=s.exports.useState([]),[l,w]=s.exports.useState({}),[i,v]=s.exports.useState({}),[m,y]=s.exports.useState(""),p="/api/analytics",[n,b]=s.exports.useState([]),B=(e,t,r)=>{const o=localStorage.getItem("classId")||"";h.get(`${p}/${o}/special-paper-analytics/${e}/${t}/${r}`,{headers:{Authorization:`Bearer ${d}`}}).then(({data:g})=>b(g||[]))};return s.exports.useEffect(()=>{const e=localStorage.getItem("classId")||"";h.get(`${p}/grade/${e}/special_paper_stats`,{headers:{Authorization:`Bearer ${d}`}}).then(({data:t})=>{N(t.map(({grade:r,is_special:o,_id:g})=>({label:`${r}${o?" | special":""}`,value:`${r}${o?"_special":""}`,is_special:o,_id:g})))})},[]),s.exports.useEffect(()=>{n.length&&u(n.reduce((e,t)=>e+t.performance,0)/n.length)},[n]),s.exports.useEffect(()=>{const e=localStorage.getItem("classId")||"";if(!(Object.keys(l).length<1)){if(b([]),l.is_special){h.get(`${p}/${e}/special_paper_stats/${l._id||l.value}`,{headers:{Authorization:`Bearer ${d}`}}).then(({data:t})=>{A(t.map(({subType:r,_id:o})=>({value:r,_id:o,label:`${r}s`})))});return}h.get(`${p}/${e}/report_analytics/${l.value}`,{headers:{Authorization:`Bearer ${d}`}}).then(({data:t})=>{if(t){b(t||[]);return}})}},[l]),s.exports.useEffect(()=>{if(Object.keys(i).length>0){const e=localStorage.getItem("classId")||"";x([]),h.get(`${p}/${e}/special_paper_stats/${l._id||l.value}/${i._id}`,{headers:{Authorization:`Bearer ${d}`}}).then(({data:t})=>{x(t.map(({subsubType:r,_id:o})=>({value:r,label:r,_id:o})))})}},[i]),s.exports.useEffect(()=>{m&&B(l.value,i.value,m)},[m]),a("div",{children:c("div",{className:"row",children:[a("div",{className:"col s12 m12 l4",children:a("div",{className:"card z-depth-0",style:{border:"1px solid #dcdee2"},children:c("div",{className:"card-content",children:[a("span",{className:"card-title center",children:a("b",{children:a("small",{children:"PERFORMANCE ANALYSIS"})})}),c("div",{className:"row",children:[c("div",{className:"col s12 m12",children:[a("label",{children:"Select Subscribed Grade"}),a(S,{onChange:e=>{v({}),y(""),w(e||{})},options:$,placeholder:"choose grade..."})]}),c("div",{className:"col s12 m12",hidden:!(l&&l.is_special),children:[a("label",{children:"Select Type"}),a(S,{options:_,onChange:e=>{v(e||{})},placeholder:"choose type..."})]}),c("div",{className:"col s12 m12",hidden:!(i&&i.value),children:[a("label",{children:"Select Paper"}),a(S,{onChange:e=>{y((e==null?void 0:e.value)||"")},options:C,placeholder:"choose paper..."})]})]}),a("div",{className:"row",id:"performanceReportButton",hidden:!0,children:a("div",{className:"col s12 m12",children:c("button",{onClick:()=>{},"data-position":"bottom","data-tooltip":"Scroll down to view or download the report",className:"btn-small sub-modal-texts tooltipped white black-text waves-effect waves-black z-depth-1",style:{width:"100%",fontWeight:"bold"},children:["PERFORMANCE REPORT",a("i",{className:"material-icons right",children:"assessment"})]})})})]})})}),a("div",{className:"col s12 m12 l8",children:a("div",{className:"card z-depth-0",style:{border:"1px solid #dcdee2"},children:a("div",{className:"card-content",children:a("div",{className:"row",id:"insertChart",children:a(G,{options:L("Subject Mean Score",f),style:{height:"300px"},data:{labels:n.map(e=>e.subject),datasets:[{label:"Subject Mean Score",data:n.map(e=>e.performance),backgroundColor:["#ff1744","#2196f3","#81d4fa","#00897b","#64ffda","#d4e157","#ff9800","#bcaaa4"],hoverBackgroundColor:["#ff1744","#2196f3","#81d4fa","#00897b","#64ffda","#d4e157","#ff9800","#bcaaa4"]}]}})})})})})]})})};export{U as default,L as options};
