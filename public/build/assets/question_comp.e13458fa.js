var ee=Object.defineProperty,te=Object.defineProperties;var se=Object.getOwnPropertyDescriptors;var F=Object.getOwnPropertySymbols;var ne=Object.prototype.hasOwnProperty,oe=Object.prototype.propertyIsEnumerable;var L=(c,n,l)=>n in c?ee(c,n,{enumerable:!0,configurable:!0,writable:!0,value:l}):c[n]=l,N=(c,n)=>{for(var l in n||(n={}))ne.call(n,l)&&L(c,l,n[l]);if(F)for(var l of F(n))oe.call(n,l)&&L(c,l,n[l]);return c},k=(c,n)=>te(c,se(n));import{r}from"./vendor.497bb12a.js";import{G as re,l as ie}from"./App.9052e22c.js";import{T as ae,N as ce}from"./TimerComp.c7840b8d.js";import{O as pe,C as le}from"./old_version_question.94e555cc.js";import{a as v,j as i}from"./index.70091d13.js";import"./millisecondsToTime.26b2335e.js";const ve=({questions:c,alreadyDone:n,isKiswahili:l,wasTimed:O})=>{const{subject:q,currentPage:s,totalPages:w,attemptTree:f,questionsPerPage:Q,numOfQuestions:b,isMarked:g,compSubQuestionPage:a,updatePageNumber:G,setIsMarked:M,setCurrentSubPage:j,updateStudentTreeContentAtAndMove:y}=r.exports.useContext(re),[I,W]=r.exports.useState(!1),[u,H]=r.exports.useState(0),[ue,U]=r.exports.useState(0),[de,V]=r.exports.useState([]),[d,me]=r.exports.useState(c.length===1&&c[0].questionType?c[0].questionType==="comprehension":!1),[m,P]=r.exports.useState({[s]:[]}),h=r.exports.useMemo(()=>{var e;return d?(e=c[0].children)==null?void 0:e.length:c.length},[s]),B=r.exports.useMemo(()=>d?Math.floor((h||0)/5)+((h||0)%5>0?1:0):0,[s]),z=r.exports.useCallback(e=>e.reduce((t,o)=>{switch(o.questionType){case"normal":{t+=o.content.attempted_options.length>0?1:0;break}case"comprehension":{t+=o.content.children.slice(a*5,a*5+5).reduce((C,A)=>C+(A.attempted_options.length>0?1:0),0);break}}return t},0),[a]),$=r.exports.useCallback(e=>e.reduce((t,o)=>{switch(o.questionType){case"comprehension":{t+=o.content.children.slice(0,a>0?(a-1)*5+5:a).reduce((C,A)=>C+(A.attempted_options.length>0?1:0),0);break}}return t},0),[a]),J=r.exports.useMemo(()=>d?$(f.pages[s])+n+u:u+n,[u,s]),K=r.exports.useMemo(()=>d?$(f.pages[s])+n+u===b:u+n===b,[u,s,Q,b]),_=r.exports.useMemo(()=>d?Math.floor((h||0)/5):1,[c]),R=(e,t)=>{const o=m[s],p=o.findIndex(C=>C.content.question===e);if(p<0){P({[s]:[...o,t]});return}o[p]=t,P(k(N({},m),{[s]:o}))},X=r.exports.useMemo(()=>{if(d){let e=0,t=0;return a>_?(t=(h||0)%5,e=_):e=a,e*5+t}return 0},[c]);r.exports.useEffect(()=>{const e=f.pages[s];x(z(e)),P(k(N({},m),{[s]:e}))},[s]),r.exports.useEffect(()=>{x(z(f.pages[s]))},[a]),r.exports.useEffect(()=>{I&&Y()},[I]);const Y=()=>{if(d){const t=(h||0)%5,o=_+(t>0?1:0),p=a+1;if(p<o){console.log("[*] We are here ---> ",p,o),j(p),y(-1/0,p,s,m[s]);return}}const e=s+1;e<w&&y(e,-1/0,s,m[s])},T=r.exports.useCallback(()=>e=>{V(t=>[...t,e])},[])(),x=e=>{H(u+e)},S=e=>{U(t=>t+e)},E=r.exports.useCallback(e=>(console.log(m),(m[s]||[]).find(o=>o.content.question===e)||null),[s]),Z=(e,t)=>{switch(e.questionType){case"normal":return i(ce,{setAttempted:x,AddPageStudentPaperContent:R,setCorrectAnswersCount:S,AddLibraryPaperContents:T,question:e,savedQuestion:E(e._id),position:t+n,isMarked:g},t);case"comprehension":return i(le,{setAttempted:x,index:t,savedQuestion:E(e._id),position:t+n,AddPageStudentPaperContent:R,question:e,AddLibraryPaperContents:T,setCorrectAnswersCount:S,isMarked:g},t);default:return i(pe,{setAttempted:x,setCorrectAnswersCount:S,AddLibraryPaperContents:T,question:e,position:t+s*Q,isMarked:g},t)}};return v("div",{style:{paddingTop:"0.3rem"},children:[v("div",{className:"white",style:{display:"flex",flexDirection:"row",justifyContent:"space-between",alignItems:"center",border:"1px solid #d3d3d3",borderRadius:"2px",boxShadow:"0 4px 8px 0 rgba(0,0,0,0.2)",padding:"5px 6px",position:"sticky",top:62,zIndex:2},children:[i("button",{className:"waves-effect waves-light btn-small",disabled:s===0&&a===0,onClick:()=>{if(d&&a!==0){y(-1/0,a>0?a-1:a,s,m[s]);return}let e=0;const t=s>0?s-1:s,o=f.pages[t];if(o&&o[0].questionType==="comprehension"){const p=o[0].content.children.length;e=Math.floor((p||0)/5)+((p||0)%5>0?1:0)}e-=e>0?1:0,y(t,e,s,m[s])},children:i("i",{className:"material-icons",children:"arrow_back"})}),i("div",{className:"white",hidden:!g,style:{alignSelf:"center",padding:"5px",borderRadius:"3px",border:"1px solid #d3d3d3"},children:i("b",{children:v("span",{children:[l?"ALAMA":"SCORE"," : ",`${f.score.passed}/${b}`," ",v("span",{style:{fontFamily:"'Abril Fatface', cursive",color:"red"},children:["( ",Math.ceil(f.score.passed/f.score.total*100),"% )"]})]})})}),g?null:O?i(ae,{onTimeUp:()=>{M(!0)}}):i("input",{disabled:!0,type:"range",min:"0",value:`${J}`,max:b,style:{flex:1,marginRight:"3px",alignSelf:"center",background:"#000"}}),i("div",{hidden:g,className:"teal white-text z-depth-1",style:{alignSelf:"center",padding:"5px",borderRadius:"4px"},children:i("b",{children:`${u+n+X}/${b}`})}),i("div",{hidden:!g,children:i("button",{disabled:(()=>{if(d){const e=(h||0)%5,t=_+(e>0?1:0);return a+1===t&&s+1===w}return s+1===w})(),onClick:()=>{if(d){const t=a+1;if(t<B){j(t);return}}const e=s+1;e<w&&G(e)},className:"waves-effect waves-light z-depth-1 btn-small",children:i("i",{className:"material-icons",children:"arrow_forward"})})})]}),i("div",{id:"zoeziPaper",children:i(ie.Card,{style:{marginTop:"8px",border:"1px solid #d3d3d3"},header:v("div",{className:"card-image",children:[i("div",{className:"postergrad",children:i("img",{alt:"",style:{maxWidth:"100%",height:"84px",objectFit:"cover"},src:"https://www.zoezi-education.com/img/background2.webp"})}),i("span",{className:"card-title text-center sub-names truncate text-bold teal",children:`${q}`})]}),children:i("form",{onSubmit:e=>{if(e.preventDefault(),d)if(a<_){if(u!==5)return}else{const t=(h||0)%5;if(u!==t)return}else if(u!==h)return;W(!0),K&&M(!0)},children:c.map((e,t)=>Z(e,t))})})})]})};export{ve as default};
