var ee=Object.defineProperty,te=Object.defineProperties;var se=Object.getOwnPropertyDescriptors;var L=Object.getOwnPropertySymbols;var ne=Object.prototype.hasOwnProperty,oe=Object.prototype.propertyIsEnumerable;var O=(r,n,u)=>n in r?ee(r,n,{enumerable:!0,configurable:!0,writable:!0,value:u}):r[n]=u,N=(r,n)=>{for(var u in n||(n={}))ne.call(n,u)&&O(r,u,n[u]);if(L)for(var u of L(n))oe.call(n,u)&&O(r,u,n[u]);return r},A=(r,n)=>te(r,se(n));import{r as i}from"./vendor.497bb12a.js";import{G as re,l as ie}from"./App.9052e22c.js";import{T as ae,N as ce}from"./TimerComp.c7840b8d.js";import{O as pe,C as ue}from"./old_version_question.94e555cc.js";import{a as Q,F as le,j as a}from"./index.70091d13.js";import"./millisecondsToTime.26b2335e.js";const ve=({questions:r,alreadyDone:n,isKiswahili:u,wasTimed:R})=>{const{subject:G,currentPage:s,totalPages:w,attemptTree:g,questionsPerPage:j,numOfQuestions:_,isMarked:h,compSubQuestionPage:c,updatePageNumber:k,setIsMarked:M,setCurrentSubPage:z,updateStudentTreeContentAtAndMove:v}=i.exports.useContext(re),[I,H]=i.exports.useState(!1),[l,K]=i.exports.useState(0),[de,U]=i.exports.useState(0),[me,V]=i.exports.useState([]),[d,fe]=i.exports.useState(r.length===1&&r[0].questionType?r[0].questionType==="comprehension":!1),[m,P]=i.exports.useState({[s]:[]}),f=i.exports.useMemo(()=>{var e;return d?(e=r[0].children)==null?void 0:e.length:r.length},[s]),W=i.exports.useMemo(()=>d?Math.floor((f||0)/5)+((f||0)%5>0?1:0):0,[s]),F=e=>e.reduce((t,o)=>{switch(o.questionType){case"normal":{t+=o.content.attempted_options.length>0?1:0;break}case"comprehension":{t+=o.content.children.slice(c*5,c*5+5).reduce((C,S)=>C+(S.attempted_options.length>0?1:0),0);break}}return t},0),$=e=>e.reduce((t,o)=>{switch(o.questionType){case"comprehension":{t+=o.content.children.slice(0,c>0?(c-1)*5+5:c).reduce((C,S)=>C+(S.attempted_options.length>0?1:0),0);break}}return t},0),B=i.exports.useMemo(()=>d?$(g.pages[s])+n+l:l+n,[l,s]),J=i.exports.useMemo(()=>d?$(g.pages[s])+n+l===_:l+n===_,[l,s,j,_]),b=i.exports.useMemo(()=>d?Math.floor((f||0)/5):1,[r]),q=(e,t)=>{const o=m[s],p=o.findIndex(C=>C.content.question===e);if(p<0){P({[s]:[...o,t]});return}o[p]=t,P(A(N({},m),{[s]:o}))},X=i.exports.useMemo(()=>{if(d){let e=0,t=0;return c>b?(t=(f||0)%5,e=b):e=c,e*5+t}return 0},[r]);i.exports.useEffect(()=>{const e=g.pages[s];x(F(e)),P(A(N({},m),{[s]:e}))},[s]),i.exports.useEffect(()=>{x(F(g.pages[s]))},[c]),i.exports.useEffect(()=>{I&&Y()},[I]);const Y=()=>{if(d){const t=(f||0)%5,o=b+(t>0?1:0),p=c+1;if(p<o){z(p),v(-1/0,p,s,m[s]);return}}const e=s+1;e<w&&v(e,-1/0,s,m[s])},T=i.exports.useCallback(()=>e=>{V(t=>[...t,e])},[])(),x=e=>{K(l+e)},y=e=>{U(t=>t+e)},E=i.exports.useCallback(e=>(m[s]||[]).find(o=>o.content.question===e)||null,[s]),Z=(e,t)=>{switch(e.questionType){case"normal":return a(ce,{setAttempted:x,AddPageStudentPaperContent:q,setCorrectAnswersCount:y,AddLibraryPaperContents:T,question:e,savedQuestion:E(e._id),position:t+n,isMarked:h},t);case"comprehension":return a(ue,{setAttempted:x,index:t,savedQuestion:E(e._id),position:t+n,AddPageStudentPaperContent:q,question:e,AddLibraryPaperContents:T,setCorrectAnswersCount:y,isMarked:h},t);default:return a(pe,{setAttempted:x,setCorrectAnswersCount:y,AddLibraryPaperContents:T,question:e,position:t+s*j,isMarked:h},t)}};return Q(le,{children:[Q("div",{className:"white",style:{display:"flex",flexDirection:"row",justifyContent:"space-between",borderRadius:"2px",padding:"5px 6px",border:"1px solid #d3d3d3",position:"sticky",top:64,zIndex:2},children:[a("button",{className:"waves-effect waves-light btn-small z-depth-0",disabled:s===0&&c===0,onClick:()=>{if(d&&c!==0){v(-1/0,c>0?c-1:c,s,m[s]);return}let e=0;const t=s>0?s-1:s,o=g.pages[t];if(o&&o[0].questionType==="comprehension"){const p=o[0].content.children.length;e=Math.floor((p||0)/5)+((p||0)%5>0?1:0)}e-=e>0?1:0,v(t,e,s,m[s]),k(t)},children:a("i",{className:"material-icons",children:"arrow_back"})}),h?null:R?a(ae,{onTimeUp:()=>{M(!0)}}):a("input",{disabled:!0,type:"range",min:"0",value:`${B}`,max:_,style:{flex:1,marginRight:"3px",alignSelf:"center",background:"#000"}}),a("div",{hidden:h,className:"teal white-text z-depth-1",style:{alignSelf:"center",padding:"5px",borderRadius:"4px"},children:a("b",{children:`${l+n+X}/${_}`})}),a("div",{hidden:!h,children:a("button",{disabled:(()=>{if(d){const e=(f||0)%5,t=b+(e>0?1:0);return c+1===t&&s+1===w}return s+1===w})(),onClick:()=>{if(d){const t=c+1;if(t<W){z(t);return}}const e=s+1;e<w&&k(e)},className:"waves-effect waves-light z-depth-0 btn-small",children:a("i",{className:"material-icons",children:"arrow_forward"})})})]}),a("div",{id:"zoeziPaper",children:a(ie.Card,{style:{marginTop:"13px",border:"1px solid #d3d3d3"},className:"z-depth-0",header:Q("div",{className:"card-image",children:[a("div",{className:"postergrad",children:a("img",{alt:"",style:{maxWidth:"100%",height:"84px",objectFit:"cover"},src:"https://www.zoezi-education.com/img/background2.webp"})}),a("span",{className:"card-title text-center sub-names truncate text-bold teal",children:`${G}`})]}),children:a("form",{onSubmit:e=>{if(e.preventDefault(),d)if(c<b){if(l!==5)return}else{const t=(f||0)%5;if(l!==t)return}else if(l!==f)return;H(!0),J&&M(!0)},children:r.map((e,t)=>Z(e,t))})})})]})};export{ve as default};
