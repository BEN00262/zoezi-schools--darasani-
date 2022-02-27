var W=Object.defineProperty,X=Object.defineProperties;var J=Object.getOwnPropertyDescriptors;var j=Object.getOwnPropertySymbols;var U=Object.prototype.hasOwnProperty,Y=Object.prototype.propertyIsEnumerable;var I=(l,s,t)=>s in l?W(l,s,{enumerable:!0,configurable:!0,writable:!0,value:t}):l[s]=t,L=(l,s)=>{for(var t in s||(s={}))U.call(s,t)&&I(l,t,s[t]);if(j)for(var t of j(s))Y.call(s,t)&&I(l,t,s[t]);return l},q=(l,s)=>X(l,J(s));import{m as E,n as M,o as Z,l as ee,q as se,r as te,s as ae,R as z,v as le,w as re,x as ne,C as ie,a as oe,L as ce,B as de,p as pe,b as ue,c as me,y as Q,G as he,u as be,d as $,M as ge,h as xe,S as B,e as fe}from"./App.cb328c24.js";import{R as O,a}from"./vendor.0b632b43.js";import{c as _e}from"./millisecondsToTime.6095074a.js";import{_ as F,j as e,L as G,F as k,a as n}from"./index.244e1172.js";const ye=O.lazy(()=>F(()=>import("./question_comp.a5c791d1.js"),["assets/question_comp.a5c791d1.js","assets/App.cb328c24.js","assets/App.bede793c.css","assets/vendor.0b632b43.js","assets/index.244e1172.js","assets/index.5cc787a4.css","assets/old_version_question.e16ada70.js"])),Se=({tree:l})=>(console.log(l),e(a.exports.Suspense,{fallback:e(G,{}),children:l&&e(ye,{paper:l})})),ve=O.lazy(()=>F(()=>import("./question_comp.a1ba7c94.js"),["assets/question_comp.a1ba7c94.js","assets/vendor.0b632b43.js","assets/App.cb328c24.js","assets/App.bede793c.css","assets/index.244e1172.js","assets/index.5cc787a4.css","assets/TimerComp.ebee3a34.js","assets/millisecondsToTime.6095074a.js"]));function Ne({wasTimed:l}){const s=E(P),t=E(V),{subject:m,currentPage:c,compSubQuestionPage:p,updateNoQuesPerPage:g,questions:x,paperMap:u}=a.exports.useContext(M),[C,h]=a.exports.useState([]),[v,T]=a.exports.useState(0),[f,_]=a.exports.useState(-1),S=a.exports.useMemo(()=>m.split(" ")[0].toLowerCase()==="kiswahili",[m]);return a.exports.useEffect(()=>{T(Z(x,u,c));let y=u.pages[c];g(y.endIndex-y.startIndex),h(x.slice(y.startIndex,y.endIndex)),_(Math.random()),s(c)},[c]),a.exports.useEffect(()=>{t(p)},[p]),e(k,{children:e(a.exports.Suspense,{fallback:e(ee.Container,{children:S?"Karatasi inatayarishwa ...":"Preparing paper ..."}),children:e(ve,{questions:C,alreadyDone:v,isKiswahili:S,wasTimed:l})},f)})}const Ce=({gradeName:l,prePaper:s,prePrevState:t})=>{const m=z(P),c=z(V),{updateQuestions:p,setSubjectName:g}=a.exports.useContext(M),[x,u]=a.exports.useState(),[C,h]=a.exports.useState(!1),[v,T]=a.exports.useState(-1);return a.exports.useEffect(()=>{var D,R,w,N,A;u(s),g((s==null?void 0:s.subject)||"");const f=le((s==null?void 0:s.questions)||[]),_=re((s==null?void 0:s.questions)||[]);let S=m>-1?m:t.currentPage||0,y=c>-1?c:t.compSubQuestionPage||0;p({questions:(s==null?void 0:s.questions)||[],paperMap:f,gradeName:l,paperID:"paperid_something",isLibraryPaper:!0,paperHistoryID:t._id||"",currentPage:S,compSubQuestionPage:y,isMarked:t.isMarked||!1,isTimed:t.isTimed||(x==null?void 0:x.isTimed)||!1,remainingTime:t.remainingTime||1e4,numOfQuestions:_,totalPages:Object.keys(f.pages).length,attemptTree:{subject:(s==null?void 0:s.subject)||"",score:{passed:((R=(D=t==null?void 0:t.attemptTree)==null?void 0:D.score)==null?void 0:R.passed)||0,total:((N=(w=t==null?void 0:t.attemptTree)==null?void 0:w.score)==null?void 0:N.total)||_},pages:((A=t==null?void 0:t.attemptTree)==null?void 0:A.pages)||ne(f,(s==null?void 0:s.questions)||[])}}),h(!0),T(Math.random())},[t]),x?C?e(Ne,{wasTimed:!1},v):null:e(G,{})},Te=l=>e(se,{children:e(te,{children:e(ae,{children:e(Ce,L({},l))})})});ie.register(oe,ce,de,pe,ue,me);const Re=(l,s)=>({indexAxis:s?"y":"x",responsive:!0,maintainAspectRatio:!1,redraw:!0,plugins:{legend:{position:"top"},title:{display:!0,text:l},barValueSpacing:40,tooltips:{displayColors:!0,callbacks:{mode:"x"}},datalabels:{display:t=>!1},scales:{xAxes:[{gridLines:{display:!0,drawBorder:!1}}],yAxes:[{gridLines:{display:!1,drawBorder:!0}}]}}}),De=l=>{if(l.length<=1)return"First attempt";let t=l.reduce((c,p)=>[...c,p.pass-p.fail],[]),m=(t.length>2?t.slice(Math.max(t.length-2,1)):t).reduce((c,p)=>p-c,0);return m===0?"No change":m<0?"Declining":"Improving"},P=Q({key:"currentlySavedPageNumberId",default:-1}),V=Q({key:"currentlySavedSubPageNumberId",default:-1}),Ie=({subject:l})=>{const{authToken:s}=a.exports.useContext(he);be();const[t,m]=a.exports.useState([]),[c,p]=a.exports.useState([]),[g,x]=a.exports.useState(""),[u,C]=a.exports.useState({firstname:"",lastname:"",profilePic:"",gender:null}),[h,v]=a.exports.useState({isSpecial:!1,label:"",value:""}),[T,f]=a.exports.useState([]),[_,S]=a.exports.useState({pass:[],fail:[]}),[y,D]=a.exports.useState("First attempt"),[R,w]=a.exports.useState(0),[N,A]=a.exports.useState(0),[o,H]=a.exports.useState({isSpecial:!1,paper:{},trees:[],prevStates:[]}),K=!1;return a.exports.useEffect(()=>{const r=localStorage.getItem("classRefId")||"";$.get(`/api/grade/learners/${r}`,{headers:{Authorization:`Bearer ${s}`}}).then(({data:i})=>{if(i){m(i.learners.map(d=>({label:`${d.firstname} ${d.lastname}`,value:d._id})));return}}),ge.Tabs.init(document.querySelector(".sub-tabs"),{})},[]),a.exports.useEffect(()=>{h&&h.value&&$.get(`/api/analytics/learner/${g}/${h.value}${h.isSpecial?"/special":""}`,{headers:{Authorization:`Bearer ${s}`}}).then(({data:r})=>{if(r){let i=[...r.plottable||[]].reverse();S({pass:i.map(b=>b.score.passed),fail:i.map(b=>b.score.total-b.score.passed)}),w(r.time_per_question),D(De(i.map(b=>({pass:b.score.passed,fail:b.score.total-b.score.passed}))));let d=r.attempt_trees;H(q(L({},d),{trees:[...d.trees].reverse(),prevStates:[...d.prevStates].reverse()})),f(i);return}})},[h]),a.exports.useEffect(()=>{if(g){p([]),v(null),S({fail:[],pass:[]}),f([]);const r=localStorage.getItem("classId")||"";$.get(`/api/analytics/subject/${r}/${g}/${l}`,{headers:{Authorization:`Bearer ${s}`}}).then(({data:i})=>{if(i){C(i.student),p(i.papersDone.map(d=>({label:`${l} ( ${d.subject} )`,value:d.paperID,isSpecial:d.isSpecial})));return}})}},[g]),n("div",{className:"row",children:[u.firstname?e("div",{className:"col s12 center",children:n("div",{style:{margin:"auto"},children:[e("img",{style:{height:"100px",width:"100px",objectFit:"contain",border:"1px solid #d3d3d3",borderRadius:"50%"},src:u.profilePic?u.profilePic:xe(u.gender)}),e("br",{}),e("span",{className:"sub-modal-texts",style:{letterSpacing:"1px"},children:n("b",{children:[u.firstname," ",u.lastname]})}),c.length?null:n(k,{children:[" ",e("span",{className:"sub-modal-texts",style:{border:"1px solid red",padding:"1px 10px",borderRadius:"20px"},children:e("b",{children:"has not attempted any paper(s)"})})]})]})}):null,e("div",{className:"col s12",children:n("ul",{className:"sub-tabs tabs tabs-fixed-width",style:{overflowX:"hidden"},children:[e("li",{className:"tab col s6",children:e("a",{href:"#analytics",className:"active",children:"Analytics"})}),e("li",{className:`tab col s6 ${o.trees.length||o.prevStates.length?"":"disabled"}`,children:n("a",{href:"#lastDonePapers",children:["Last (",o.trees.length||o.prevStates.length,") Paper(s)"]})})]})}),n("div",{id:"analytics",children:[e("div",{className:"col s12 m12 l4",children:e("div",{className:"card z-depth-0",style:{border:"1px solid #dcdee2"},children:n("div",{className:"card-content",children:[n("div",{className:"row",children:[n("div",{className:"col s12 m12",children:[e("label",{children:"Learner"}),e(B,{hideSelectedOptions:!0,onChange:r=>{x((r==null?void 0:r.value)||"")},options:t,placeholder:"select learner..."})]}),n("div",{className:"col s12 m12",children:[e("label",{children:"Paper"}),e(B,{hideSelectedOptions:!0,isDisabled:!g||!c.length,options:c,value:h,onChange:r=>{v(r||{})},placeholder:"select paper..."})]})]}),e("div",{className:"row",id:"performanceReportButton",hidden:!0,children:e("div",{className:"col s12 m12",children:n("button",{onClick:()=>{},"data-position":"bottom","data-tooltip":"Scroll down to view or download the report",className:"btn-small sub-modal-texts tooltipped white black-text waves-effect waves-black z-depth-1",style:{width:"100%",fontWeight:"bold"},children:["PERFORMANCE REPORT",e("i",{className:"material-icons right",children:"assessment"})]})})})]})})}),n("div",{className:"col s12 m12 l8",children:[T.length?e("div",{className:"card z-depth-0",style:{border:"1px solid #dcdee2"},children:n("div",{className:"card-content sub-modal-texts center",children:["Remarks: ",e("span",{style:{border:"1px solid green",padding:"1px 2px",borderRadius:"2px"},children:e("b",{children:y})}),R>0?n(k,{children:[" ",e("b",{children:"|"})," ","Av. Time Per Question: ",e("span",{style:{border:"1px solid green",padding:"1px 2px",borderRadius:"2px"},children:e("b",{children:_e(R,!0)})})]}):null]})}):null,e("div",{className:"card z-depth-0",style:{border:"1px solid #dcdee2"},children:e("div",{className:"card-content",children:e("div",{className:"row",id:"insertChart",children:e(fe,{options:Re("Performance Analysis",K),style:{height:"300px"},data:{labels:_.pass.map((r,i)=>`Attempt ${i+1}`),datasets:[{label:"Pass",data:_.pass,backgroundColor:"#00c853"},{label:"Fail",data:_.fail,backgroundColor:"#f44336"}]}})})})})]})]}),e("div",{id:"lastDonePapers",children:(o.isSpecial?o.prevStates.length:o.trees.length)?e("div",{className:"col s12 m12",children:n("div",{className:"section",children:[n("div",{className:"col s12",children:[(o.isSpecial?o.prevStates:o.trees).map((r,i)=>{let d=o.isSpecial?r.attemptTree.score.passed:r.score.passed,b=o.isSpecial?r.attemptTree.score.total:r.score.total;return e("button",{className:`btn-flat sub-modal-texts ${N===i?"teal lighten-5":""}`,style:{border:"1px solid #d3d3d3",borderTop:"2px solid #80cbc4",borderRadius:"5px 5px 0px 0px",marginRight:"1px"},onClick:we=>{A(i)},children:n("b",{children:["Attempt ",i+1," ",n("span",{className:"red-text sub-names",children:["( ",d," / ",b,")"]})]})},`attempt_pill_${i}`)}),e("div",{className:"divider",style:{marginBottom:"5px"}})]}),e("div",{className:"col s12",children:o.isSpecial?e(Te,{gradeName:"Sample Grade",prePaper:o.paper,prePrevState:o.prevStates[N]}):e(Se,{tree:o.trees[N]})})]})}):null})]})};export{P as currentlySavedPageNumberState,V as currentlySavedSubPageNumberState,Ie as default,Re as options};
