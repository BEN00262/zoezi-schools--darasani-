import{C as E,a as P,L as j,B as k,p as R,b as T,c as z,G,d as h,S as g,e as L}from"./App.6553f51d.js";import{r as t}from"./vendor.fd4def91.js";import{j as a,a as o}from"./index.ca9b2a12.js";E.register(P,j,k,R,T,z);const M=(u,f)=>({indexAxis:f?"y":"x",responsive:!0,maintainAspectRatio:!1,redraw:!0,plugins:{legend:{position:"top",display:!1},title:{display:!0,text:u},barValueSpacing:40,tooltips:{displayColors:!0,callbacks:{mode:"x"}},datalabels:{display:c=>!1},scales:{xAxes:[{gridLines:{display:!0,drawBorder:!1}}],yAxes:[{gridLines:{display:!1,drawBorder:!0}}]}}}),U=({setClassMeanScore:u})=>{const f=!1,{authToken:c}=t.exports.useContext(G),[$,N]=t.exports.useState([]),[_,A]=t.exports.useState([]),[C,S]=t.exports.useState([]),[l,w]=t.exports.useState({}),[d,v]=t.exports.useState({}),[m,y]=t.exports.useState(""),n=localStorage.getItem("classId")||"",p="/api/analytics",[i,b]=t.exports.useState([]),B=(e,s,r)=>{h.get(`${p}/${n}/special-paper-analytics/${e}/${s}/${r}`,{headers:{Authorization:`Bearer ${c}`}}).then(({data:x})=>b(x||[]))};return t.exports.useEffect(()=>{h.get(`${p}/grade/${n}/special_paper_stats`,{headers:{Authorization:`Bearer ${c}`}}).then(({data:e})=>{N(e.map(({grade:s,is_special:r,_id:x})=>({label:`${s}${r?" | special":""}`,value:`${s}${r?"_special":""}`,is_special:r,_id:x})))})},[]),t.exports.useEffect(()=>{i.length&&u(i.reduce((e,s)=>e+s.performance,0)/i.length)},[i]),t.exports.useEffect(()=>{if(!(Object.keys(l).length<1)){if(b([]),l.is_special){h.get(`${p}/${n}/special_paper_stats/${l._id||l.value}`,{headers:{Authorization:`Bearer ${c}`}}).then(({data:e})=>{A(e.map(({subType:s,_id:r})=>({value:s,_id:r,label:`${s}s`})))});return}h.get(`${p}/${n}/report_analytics/${l.value}`,{headers:{Authorization:`Bearer ${c}`}}).then(({data:e})=>{if(e){b(e||[]);return}})}},[l]),t.exports.useEffect(()=>{Object.keys(d).length>0&&(S([]),h.get(`${p}/${n}/special_paper_stats/${l._id||l.value}/${d._id}`,{headers:{Authorization:`Bearer ${c}`}}).then(({data:e})=>{S(e.map(({subsubType:s,_id:r})=>({value:s,label:s,_id:r})))}))},[d]),t.exports.useEffect(()=>{m&&B(l.value,d.value,m)},[m]),a("div",{children:o("div",{className:"row",children:[a("div",{className:"col s12 m12 l4",children:a("div",{className:"card z-depth-0",style:{border:"1px solid #dcdee2"},children:o("div",{className:"card-content",children:[a("span",{className:"card-title center",children:a("b",{children:a("small",{children:"PERFORMANCE ANALYSIS"})})}),o("div",{className:"row",children:[o("div",{className:"col s12 m12",children:[a("label",{children:"Select Subscribed Grade"}),a(g,{onChange:e=>{v({}),y(""),w(e||{})},options:$,placeholder:"choose grade..."})]}),o("div",{className:"col s12 m12",hidden:!(l&&l.is_special),children:[a("label",{children:"Select Type"}),a(g,{options:_,onChange:e=>{v(e||{})},placeholder:"choose type..."})]}),o("div",{className:"col s12 m12",hidden:!(d&&d.value),children:[a("label",{children:"Select Paper"}),a(g,{onChange:e=>{y((e==null?void 0:e.value)||"")},options:C,placeholder:"choose paper..."})]})]}),a("div",{className:"row",id:"performanceReportButton",hidden:!0,children:a("div",{className:"col s12 m12",children:o("button",{onClick:()=>{},"data-position":"bottom","data-tooltip":"Scroll down to view or download the report",className:"btn-small sub-modal-texts tooltipped white black-text waves-effect waves-black z-depth-1",style:{width:"100%",fontWeight:"bold"},children:["PERFORMANCE REPORT",a("i",{className:"material-icons right",children:"assessment"})]})})})]})})}),a("div",{className:"col s12 m12 l8",children:a("div",{className:"card z-depth-0",style:{border:"1px solid #dcdee2"},children:a("div",{className:"card-content",children:a("div",{className:"row",id:"insertChart",children:a(L,{options:M("Subject Mean Score",f),style:{height:"300px"},data:{labels:i.map(e=>e.subject),datasets:[{label:"Subject Mean Score",data:i.map(e=>e.performance),backgroundColor:["#ff1744","#2196f3","#81d4fa","#00897b","#64ffda","#d4e157","#ff9800","#bcaaa4"],hoverBackgroundColor:["#ff1744","#2196f3","#81d4fa","#00897b","#64ffda","#d4e157","#ff9800","#bcaaa4"]}]}})})})})})]})})};export{U as default,M as options};
