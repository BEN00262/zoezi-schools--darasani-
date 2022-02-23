var G=Object.defineProperty,V=Object.defineProperties;var H=Object.getOwnPropertyDescriptors;var A=Object.getOwnPropertySymbols;var K=Object.prototype.hasOwnProperty,W=Object.prototype.propertyIsEnumerable;var L=(a,s,t)=>s in a?G(a,s,{enumerable:!0,configurable:!0,writable:!0,value:t}):a[s]=t,$=(a,s)=>{for(var t in s||(s={}))K.call(s,t)&&L(a,t,s[t]);if(A)for(var t of A(s))W.call(s,t)&&L(a,t,s[t]);return a},j=(a,s)=>V(a,H(s));import{j as R,k as X,l as J,m as U,n as Y,o as Z,q as P,r as ee,C as se,a as te,L as ae,B as le,p as ie,b as ne,c as re,G as oe,u as ce,d as T,M as de,h as pe,S as k,e as ue}from"./App.453ee391.js";import{R as I,r as l}from"./vendor.5c57f7a1.js";import{c as me}from"./millisecondsToTime.6095074a.js";import{_ as q,j as e,L as E,F as D,a as i}from"./index.6ae16ec9.js";const he=I.lazy(()=>q(()=>import("./question_comp.3f71b7f9.js"),["assets/question_comp.3f71b7f9.js","assets/App.453ee391.js","assets/App.5b01b59d.css","assets/vendor.5c57f7a1.js","assets/index.6ae16ec9.js","assets/index.5cc787a4.css","assets/old_version_question.39a45e96.js"])),be=({tree:a})=>(console.log(a),e(l.exports.Suspense,{fallback:e(E,{}),children:a&&e(he,{paper:a})})),ge=I.lazy(()=>q(()=>import("./question_comp.8a961cc8.js"),["assets/question_comp.8a961cc8.js","assets/vendor.5c57f7a1.js","assets/App.453ee391.js","assets/App.5b01b59d.css","assets/index.6ae16ec9.js","assets/index.5cc787a4.css","assets/TimerComp.d218507e.js","assets/millisecondsToTime.6095074a.js"]));function fe({wasTimed:a}){const{subject:s,currentPage:t,updateNoQuesPerPage:b,questions:c,paperMap:o}=l.exports.useContext(R),[h,y]=l.exports.useState([]),[u,f]=l.exports.useState(0),d=l.exports.useMemo(()=>s.split(" ")[0].toLowerCase()==="kiswahili",[s]);return l.exports.useEffect(()=>{f(X(c,o,t));let m=o.pages[t];b(m.endIndex-m.startIndex),y(c.slice(m.startIndex,m.endIndex))},[t]),e(D,{children:e(l.exports.Suspense,{fallback:e(J.Container,{children:d?"Karatasi inatayarishwa ...":"Preparing paper ..."}),children:e(ge,{questions:h,alreadyDone:u,isKiswahili:d,wasTimed:a})})})}const xe=({gradeName:a,prePaper:s,prePrevState:t})=>{const{updateQuestions:b,setSubjectName:c}=l.exports.useContext(R),[o,h]=l.exports.useState(),[y,u]=l.exports.useState(!1);return l.exports.useEffect(()=>{var m,N,v,_,C;h(s),c((s==null?void 0:s.subject)||"");const f=Z((s==null?void 0:s.questions)||[]),d=P((s==null?void 0:s.questions)||[]);b({questions:(s==null?void 0:s.questions)||[],paperMap:f,gradeName:a,paperID:"paperid_something",isLibraryPaper:!0,paperHistoryID:t._id||"",currentPage:t.currentPage||0,compSubQuestionPage:t.compSubQuestionPage||0,isMarked:t.isMarked||!1,isTimed:t.isTimed||(o==null?void 0:o.isTimed)||!1,remainingTime:t.remainingTime||1e4,numOfQuestions:d,totalPages:Object.keys(f.pages).length,attemptTree:{subject:(s==null?void 0:s.subject)||"",score:{passed:((N=(m=t==null?void 0:t.attemptTree)==null?void 0:m.score)==null?void 0:N.passed)||0,total:((_=(v=t==null?void 0:t.attemptTree)==null?void 0:v.score)==null?void 0:_.total)||d},pages:((C=t==null?void 0:t.attemptTree)==null?void 0:C.pages)||ee(f,(s==null?void 0:s.questions)||[])}}),u(!0)},[]),o?y?e(fe,{wasTimed:!1}):null:e(E,{})},_e=({gradeName:a,prePaper:s,prePrevState:t})=>e(U,{children:e(Y,{children:e(xe,{gradeName:a,prePaper:s,prePrevState:t})})});se.register(te,ae,le,ie,ne,re);const ye=(a,s)=>({indexAxis:s?"y":"x",responsive:!0,maintainAspectRatio:!1,redraw:!0,plugins:{legend:{position:"top"},title:{display:!0,text:a},barValueSpacing:40,tooltips:{displayColors:!0,callbacks:{mode:"x"}},datalabels:{display:t=>!1},scales:{xAxes:[{gridLines:{display:!0,drawBorder:!1}}],yAxes:[{gridLines:{display:!1,drawBorder:!0}}]}}}),Ne=a=>{if(a.length<=1)return"First attempt";let t=a.reduce((c,o)=>[...c,o.pass-o.fail],[]),b=(t.length>2?t.slice(Math.max(t.length-2,1)):t).reduce((c,o)=>o-c,0);return b===0?"No change":b<0?"Declining":"Improving"},we=({subject:a})=>{const{authToken:s}=l.exports.useContext(oe);ce();const[t,b]=l.exports.useState([]),[c,o]=l.exports.useState([]),[h,y]=l.exports.useState(""),[u,f]=l.exports.useState({firstname:"",lastname:"",profilePic:"",gender:null}),[d,m]=l.exports.useState({isSpecial:!1,label:"",value:""}),[N,v]=l.exports.useState([]),[_,C]=l.exports.useState({pass:[],fail:[]}),[z,B]=l.exports.useState("First attempt"),[w,M]=l.exports.useState(0),[S,Q]=l.exports.useState(0),[x,O]=l.exports.useState({isSpecial:!1,paper:{},trees:[]}),F=!1;return l.exports.useEffect(()=>{const n=localStorage.getItem("classRefId")||"";T.get(`/api/grade/learners/${n}`,{headers:{Authorization:`Bearer ${s}`}}).then(({data:r})=>{if(r){b(r.learners.map(p=>({label:`${p.firstname} ${p.lastname}`,value:p._id})));return}}),de.Tabs.init(document.querySelector(".sub-tabs"),{})},[]),l.exports.useEffect(()=>{d&&d.value&&T.get(`/api/analytics/learner/${h}/${d.value}${d.isSpecial?"/special":""}`,{headers:{Authorization:`Bearer ${s}`}}).then(({data:n})=>{if(n){let r=[...n.plottable||[]].reverse();C({pass:r.map(g=>g.score.passed),fail:r.map(g=>g.score.total-g.score.passed)}),M(n.time_per_question),B(Ne(r.map(g=>({pass:g.score.passed,fail:g.score.total-g.score.passed}))));let p=n.attempt_trees;O(j($({},p),{trees:[...p.trees].reverse()})),v(r);return}})},[d]),l.exports.useEffect(()=>{if(h){o([]),m(null),C({fail:[],pass:[]}),v([]);const n=localStorage.getItem("classId")||"";T.get(`/api/analytics/subject/${n}/${h}/${a}`,{headers:{Authorization:`Bearer ${s}`}}).then(({data:r})=>{if(r){f(r.student),o(r.papersDone.map(p=>({label:`${a} ( ${p.subject} )`,value:p.paperID,isSpecial:p.isSpecial})));return}})}},[h]),i("div",{className:"row",children:[u.firstname?e("div",{className:"col s12 center",children:i("div",{style:{margin:"auto"},children:[e("img",{style:{height:"100px",width:"100px",objectFit:"contain",border:"1px solid #d3d3d3",borderRadius:"50%"},src:u.profilePic?u.profilePic:pe(u.gender)}),e("br",{}),e("span",{className:"sub-modal-texts",style:{letterSpacing:"1px"},children:i("b",{children:[u.firstname," ",u.lastname]})}),c.length?null:i(D,{children:[" ",e("span",{className:"sub-modal-texts",style:{border:"1px solid red",padding:"1px 10px",borderRadius:"20px"},children:e("b",{children:"has not attempted any paper(s)"})})]})]})}):null,e("div",{className:"col s12",children:i("ul",{className:"sub-tabs tabs tabs-fixed-width",style:{overflowX:"hidden"},children:[e("li",{className:"tab col s6",children:e("a",{href:"#analytics",className:"active",children:"Analytics"})}),e("li",{className:`tab col s6 ${x.trees.length?"":"disabled"}`,children:i("a",{href:"#lastDonePapers",children:["Last (",N.length,") Paper(s)"]})})]})}),i("div",{id:"analytics",children:[e("div",{className:"col s12 m12 l4",children:e("div",{className:"card z-depth-0",style:{border:"1px solid #dcdee2"},children:i("div",{className:"card-content",children:[i("div",{className:"row",children:[i("div",{className:"col s12 m12",children:[e("label",{children:"Learner"}),e(k,{hideSelectedOptions:!0,onChange:n=>{y((n==null?void 0:n.value)||"")},options:t,placeholder:"select learner..."})]}),i("div",{className:"col s12 m12",children:[e("label",{children:"Paper"}),e(k,{hideSelectedOptions:!0,isDisabled:!h||!c.length,options:c,value:d,onChange:n=>{m(n||{})},placeholder:"select paper..."})]})]}),e("div",{className:"row",id:"performanceReportButton",hidden:!0,children:e("div",{className:"col s12 m12",children:i("button",{onClick:()=>{},"data-position":"bottom","data-tooltip":"Scroll down to view or download the report",className:"btn-small sub-modal-texts tooltipped white black-text waves-effect waves-black z-depth-1",style:{width:"100%",fontWeight:"bold"},children:["PERFORMANCE REPORT",e("i",{className:"material-icons right",children:"assessment"})]})})})]})})}),i("div",{className:"col s12 m12 l8",children:[N.length?e("div",{className:"card z-depth-0",style:{border:"1px solid #dcdee2"},children:i("div",{className:"card-content sub-modal-texts center",children:["Remarks: ",e("span",{style:{border:"1px solid green",padding:"1px 2px",borderRadius:"2px"},children:e("b",{children:z})}),w>0?i(D,{children:[" ",e("b",{children:"|"})," ","Av. Time Per Question: ",e("span",{style:{border:"1px solid green",padding:"1px 2px",borderRadius:"2px"},children:e("b",{children:me(w,!0)})})]}):null]})}):null,e("div",{className:"card z-depth-0",style:{border:"1px solid #dcdee2"},children:e("div",{className:"card-content",children:e("div",{className:"row",id:"insertChart",children:e(ue,{options:ye("Performance Analysis",F),style:{height:"300px"},data:{labels:_.pass.map((n,r)=>`Attempt ${r+1}`),datasets:[{label:"Pass",data:_.pass,backgroundColor:"#00c853"},{label:"Fail",data:_.fail,backgroundColor:"#f44336"}]}})})})})]})]}),e("div",{id:"lastDonePapers",children:x.trees.length?e("div",{className:"col s12 m12",children:i("div",{className:"section",children:[i("div",{className:"col s12",children:[x.trees.map((n,r)=>e("button",{className:`btn-flat sub-modal-texts ${S===r?"teal lighten-5":""}`,style:{border:"1px solid #d3d3d3",borderTop:"2px solid #80cbc4",borderRadius:"5px 5px 0px 0px",marginRight:"1px"},onClick:p=>{Q(r)},children:i("b",{children:["Attempt ",r+1," ",i("span",{className:"red-text sub-names",children:["( ",n.score.passed," / ",n.score.total,")"]})]})},`attempt_pill_${r}`)),e("div",{className:"divider",style:{marginBottom:"5px"}})]}),e("div",{className:"col s12",children:x.isSpecial?e(_e,{gradeName:"Sample Grade",prePaper:x.paper,prePrevState:x.trees[S]}):e(be,{tree:x.trees[S]})})]})}):null})]})};export{we as default,ye as options};
