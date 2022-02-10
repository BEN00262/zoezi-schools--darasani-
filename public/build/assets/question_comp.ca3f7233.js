var ae=Object.defineProperty,ce=Object.defineProperties;var pe=Object.getOwnPropertyDescriptors;var Y=Object.getOwnPropertySymbols;var de=Object.prototype.hasOwnProperty,ue=Object.prototype.propertyIsEnumerable;var q=(e,s,r)=>s in e?ae(e,s,{enumerable:!0,configurable:!0,writable:!0,value:r}):e[s]=r,V=(e,s)=>{for(var r in s||(s={}))de.call(s,r)&&q(e,r,s[r]);if(Y)for(var r of Y(s))ue.call(s,r)&&q(e,r,s[r]);return e},G=(e,s)=>ce(e,pe(s));import{r as o,R as ee}from"./vendor.fd4def91.js";import{f as j,M as te,l as ne}from"./App.5b94b10e.js";import{a as w,j as t,F as W}from"./index.7f52cc9a.js";const me=({option:e,_id:s,isCorrect:r,isMarked:u,index:_,position:n,setSuggestedAnswer:p,wasSelected:m})=>t("div",{children:t("p",{children:w("label",{children:[t("input",{type:"checkbox",className:"filled-in",disabled:u,checked:m||!1,onChange:S=>{p({option:e,isCorrect:r,_id:s})},name:`options_${n}`}),t("span",{className:u&&r?"green-text":"black-text",children:t("b",{children:t("span",{dangerouslySetInnerHTML:{__html:e}})})})]})})},_),he=({option:e,_id:s,isCorrect:r,isMarked:u,index:_,position:n,setSuggestedAnswer:p,wasSelected:m})=>t("div",{children:t("p",{children:w("label",{children:[t("input",{disabled:u,onChange:S=>{p({option:e,isCorrect:r,_id:s})},required:!0,checked:m||!1,className:"with-gap",name:`options_${n}`,type:"radio"}),t("span",{className:u&&r?"green-text":"black-text",children:t("b",{children:t("span",{dangerouslySetInnerHTML:{__html:e}})})})]})})},_),fe=({question:e,position:s,isMarked:r,setAttempted:u,setCorrectAnswersCount:_,savedQuestion:n,AddPageStudentPaperContent:p})=>{const{currentPage:m,attemptTree:S}=o.exports.useContext(j),[l,a]=o.exports.useState([]),[h,y]=o.exports.useState(!1),b=o.exports.useMemo(()=>{var f,x;return((x=(f=e==null?void 0:e.options_next)==null?void 0:f.filter(C=>C.isCorrect))==null?void 0:x.length)||0},[e]),k=b>1||!1,P=f=>!!l.find(x=>x._id===f);o.exports.useEffect(()=>{let f=document.querySelectorAll(".question-comp img");te.Materialbox.init(f);let x=S.pages[m].find(g=>g.content.question===e._id);if(!x)return;let C=x.content,N=(e.options_next||[]).filter((g,d)=>C.attempted_options.findIndex(v=>v.optionID===g._id||v.optionIndex===d)>-1);y(N.length>0?N.every(g=>g.isCorrect):!1),a([...l,...N])},[]),o.exports.useEffect(()=>{l.length>0&&p(e._id,{questionType:"normal",content:{status:l.length>0?l.every(f=>f.isCorrect):!1,question:e._id,attempted_options:l.map(f=>({optionID:f._id,optionIndex:(e.options_next||[]).findIndex(x=>x._id===f._id)}))}})},[l]),o.exports.useEffect(()=>{if(r&&b===l.length){let f=l.length>0?l.every(x=>x.isCorrect):!1;y(f),_(f?1:0)}},[r]);const R=f=>{if(l.length||u(1),k){const x=l.findIndex(C=>C.option===f.option);if(x>-1){let C=[...l];C.splice(x),a(C),C.length||u(-1);return}a([...l,f]);return}a([f])},A=(()=>{let f=k?me:he;return({position:x,index:C,_id:N,option:g,isCorrect:d,wasSelected:v})=>t(f,{_id:N,setSuggestedAnswer:R,position:x,option:g,index:C,isCorrect:d,isMarked:r,wasSelected:v},C)})();return w("div",{children:[t("span",{dangerouslySetInnerHTML:{__html:`
                    <div style="display:flex;flex-direction:row;">
                        ${r?h?'<span style="color:green;">&#10004;</span>':'<span style="color:red;">&#10008;</span>':""} 
                        <p style="margin-right:5px;">${s+1}.  </p><strong class="question-comp">${e.question}</strong>
                    </div>
                `}}),t("div",{style:{marginTop:"10px",marginLeft:"17px",marginBottom:"10px"},children:e.options_next&&e.options_next.map(({option:f,isCorrect:x,_id:C},N)=>A({position:s,_id:C,option:f,index:N,isCorrect:x,wasSelected:P(C)}))}),t("div",{style:{marginLeft:"17px",marginBottom:"10px"},hidden:!r,children:t("span",{dangerouslySetInnerHTML:{__html:`
                        <blockquote class="red lighten-5">
                            <span>
                            ${e.additionalInfo}
                            </span>
                        </blockquote>
                    `}})})]})},ge=({option:e,wasSelected:s,isCorrect:r,_id:u,isMarked:_,index:n,position:p,setAnswers:m,isMultiAnswersQuestion:S})=>t("div",{children:t("p",{children:w("label",{children:[t("input",{type:"checkbox",checked:s,className:"filled-in",disabled:_,onChange:l=>{m({option:e,isCorrect:r,_id:u})},required:!0,name:`sub_option_answer_${p}`}),t("span",{className:_&&r?"green-text":"black-text",children:t("b",{children:t("span",{dangerouslySetInnerHTML:{__html:e}})})})]})})},n),_e=({option:e,wasSelected:s,isCorrect:r,_id:u,isMarked:_,keyValue:n,position:p,setAnswers:m,isMultiAnswersQuestion:S})=>t("p",{children:w("label",{children:[t("input",{disabled:_,checked:s,required:!0,onChange:l=>{m({option:e,isCorrect:r,_id:u})},className:"with-gap",type:"radio",name:`sub_option_answer_${p}`}),t("span",{className:_&&r?"green-text":"black-text",children:t("b",{children:t("span",{dangerouslySetInnerHTML:{__html:e}})})})]})},n),xe=({children:e,index:s,isMarked:r,isCorrect:u})=>w("div",{style:{marginLeft:"15px",marginTop:"5px",marginBottom:"5px",display:"flex",flexDirection:"row"},children:[r?u?t("span",{style:{color:"green"},children:"\u2714"}):t("span",{style:{color:"red"},children:"\u2718"}):null,s+1,".",t("div",{children:e})]}),be=({children:e,index:s})=>t("div",{style:{marginLeft:"15px",marginTop:"5px",marginBottom:"5px"},children:e}),Ce=({question:e,index:s,AddInternalPaperContents:r,setAttempted:u,setCorrectAnswersCount:_,savedState:n,parentId:p})=>{const{attemptTree:m,currentPage:S,isMarked:l}=o.exports.useContext(j),[a,h]=o.exports.useState([]),[y,b]=o.exports.useState(!1),[k,P]=o.exports.useState(0);o.exports.useEffect(()=>{let g=m.pages[S].find(Q=>Q.content.question===p);if(!g)return;let v=g.content.children.find(Q=>Q.question===e._id);if(!v)return;let T=(e.options||[]).filter((Q,$)=>v?v.attempted_options.findIndex(E=>E.optionID===Q._id||E.optionIndex===$)>-1:!1);b(v.status),h([...a,...T])},[]),o.exports.useEffect(()=>{if(l&&a.length>0){let g=a.every(d=>d.isCorrect);b(g)}},[l,a]),o.exports.useEffect(()=>{k>0&&r({status:a.length?a.every(g=>g.isCorrect):!1,question:e._id,attempted_options:a.map(g=>({optionID:g._id,optionIndex:e.options.findIndex(d=>d._id===g._id)}))})},[k]);const R=o.exports.useMemo(()=>{var g,d;return((d=(g=e==null?void 0:e.options)==null?void 0:g.filter(v=>v.isCorrect))==null?void 0:d.length)>1},[e]),L=e.question.trim().replace(/(<([^>]+)>)/ig,"").trim().length<=1,A=g=>{if(a.length||u(1),R){let d=[...a],v=d.findIndex(T=>T._id===g._id);v>-1?d[v]=g:d.push(g),h(d)}else h([g]);P(d=>d+1)},f=L?xe:be,C=(()=>{let g=R?ge:_e;return({position:d,index:v,option:T,isCorrect:Q,_id:$,quesIndex:E,wasSelected:B})=>t(g,{_id:$,wasSelected:B,keyValue:`sub_option_${v}_${E}`,setAnswers:A,isMultiAnswersQuestion:L,position:d,option:T,index:v,isCorrect:Q,isMarked:l},`sub_option_${v}_${E}`)})(),N=g=>!!a.find(d=>d._id===g||0);return w("div",{style:{marginLeft:"6px"},children:[t("span",{dangerouslySetInnerHTML:{__html:L?"":`
                        <div style="display:flex;flex-direction:row;">
                            <p style="margin-right:5px;">
                                ${l?y?'<span style="color:green;">&#10004;</span>':'<span style="color:red;">&#10008;</span>':""}${s+1}.  
                            </p>
                            <p><strong>
                            ${e.question}
                            </strong></p>
                        </div>
                    `}}),t(f,{index:s,isMarked:l,isCorrect:y,children:e.options.map(({option:g,isCorrect:d,_id:v},T)=>C({_id:v,position:s,index:s,quesIndex:T,option:g,wasSelected:N(v),isCorrect:d}))}),t("div",{style:{marginLeft:"15px",marginBottom:"10px"},hidden:!l,children:t("span",{dangerouslySetInnerHTML:{__html:`
                        <blockquote class="red lighten-5">
                            <span>
                                ${e.additionalInfo}
                            </span>
                        </blockquote>
                    `}})})]})},ye=e=>{let s=5,r=e.length%s,u=Math.floor(e.length/s)+(r>0?1:0),_=new Array(u).fill([]);for(let n=0;n<u;n++)_[n]=e.slice(n*s,n*s+s);return _},ve=(e,s,r=0)=>(u,_=!1)=>{let n=[];return u.forEach(p=>{let m=p.attempted_options[0].optionID,S=p.attempted_options[0].optionIndex,l=p.question;for(let a=0;a<s.length;a++){let h=s[a];if(h._id===l){let y=h.options.find((b,k)=>b._id===m||k===S);y&&n.push({position:a+1+r,option:y.option,isCorrect:y.isCorrect});break}}}),n.reduce((p,m)=>p.replace(new RegExp(`_{2,4}\\s?${m.position}\\s?_{2,4}`),`<span style="color:${_&&m.isCorrect?"green":"red"};"><u><b>${m.option}</b></u></span>`),e)},we=ee.memo(({parentId:e,position:s,sub_questions:r,AddInternalPaperContents:u,setCorrectAnswersCount:_,setAttempted:n,compSubQuestionPage:p,savedChildren:m})=>{const S=o.exports.useCallback(y=>m.find(b=>b.question===y)||null,[r]);let l=o.exports.useMemo(()=>ye(r||[]),[r]),a=l[p],h=l.slice(0,p).reduce((y,b)=>y+b.length,0);return t(W,{children:a.map((y,b)=>t(Ce,{parentId:e,question:y,savedState:S(y._id),index:b+h+s,AddInternalPaperContents:u,setAttempted:n,setCorrectAnswersCount:_},b))})}),Se=({question:e,isMarked:s,position:r,setAttempted:u,setCorrectAnswersCount:_,AddPageStudentPaperContent:n,savedQuestion:p})=>{const{compSubQuestionPage:m,currentPage:S,attemptTree:l}=o.exports.useContext(j),[a,h]=o.exports.useState([]),[y,b]=o.exports.useState([]),[k,P]=o.exports.useState(e.question),R=o.exports.useMemo(()=>e.children[0].question.trim().replace(/(<([^>]+)>)/ig,"").trim().length<=1,[e]),L=R?ve(e.question,e.children,r):f=>e.question,A=f=>{let x=[...a],C=x.findIndex(N=>N.question===f.question);C>-1?x[C]=f:x=[...x,f],h(x)};return o.exports.useEffect(()=>{a.length>0&&(n(e._id,{questionType:"comprehension",content:{question:e._id,children:a}}),R&&P(L(a,s)))},[a]),o.exports.useEffect(()=>{let f=document.querySelectorAll(".question-comp img");te.Materialbox.init(f);let x=l.pages[S].find(N=>N.content.question===e._id);if(!x)return;let C=x.content;h(C.children),b(C.children)},[]),w("div",{children:[t("span",{dangerouslySetInnerHTML:{__html:`<div class="question-comp">${k}</div>`}}),t("div",{style:{marginTop:"5px"},children:t(we,{AddInternalPaperContents:A,parentId:e._id,position:r,savedChildren:y,compSubQuestionPage:m,setAttempted:u,setCorrectAnswersCount:_,sub_questions:e.children||[]})})]})},Ie=({question:e,position:s,setAttempted:r,setCorrectAnswersCount:u,AddLibraryPaperContents:_,isMarked:n=!1})=>{const[p,m]=o.exports.useState(""),[S,l]=o.exports.useState(!1),a=b=>{const k=b.target.value;r(!p&&k?1:k?0:-1),m(b.target.value)},h=o.exports.useCallback(()=>p.toLocaleLowerCase()===e.answer.toLowerCase(),[p,e,n]),y=o.exports.useMemo(()=>e.subject.split(" ")[0].toLowerCase()==="kiswahili",[e]);return o.exports.useEffect(()=>{let b=h();l(b),u(b?1:0),_({questionType:"oldversion",content:{status:b,question:e._id,attempted_option:p}})},[n]),w("div",{className:"col s12",style:{marginBottom:"7px"},children:[w("div",{style:{display:"flex",flexDirection:"row"},children:[n?S?t("span",{style:{color:"green"},children:"\u2714"}):t("span",{style:{color:"red"},children:"\u2718"}):null,w("span",{style:{marginRight:"5px"},children:[s+1,". "]}),t("p",{children:w("span",{className:"left-align",children:[e.question,w("span",{className:"left-align",children:[t("br",{}),t("b",{children:e.options})]})]})})]}),w("div",{style:{marginLeft:"15px"},children:[w("div",{className:"input-field col s12",children:[t("input",{title:"Enter A B C or D",onChange:a,disabled:n,value:p,id:`trial_answer${s}`,required:!0,type:"text",className:"validate",style:{color:n?h()?"green":"red":"black"}}),t("label",{htmlFor:`trial_answer${s}`,children:y?"Jibu":"Answer"})]}),t("div",{hidden:!n,className:"col s12",children:t("blockquote",{className:"green lighten-5",style:{borderLeftColor:"#00e676"},children:w("p",{id:`correct_answer_display${s}`,className:"bold",children:[y?"Jibu Sahihi: ":"Correct Answer: ",e.answer]})})}),t("div",{hidden:!n,className:"col s12",children:t("blockquote",{className:"red lighten-5",children:t("p",{id:`additional_information${s}`,className:"bold",children:e.additionalInfo})})})]})]})};function Ae(e){let s=Math.floor(e/1e3%60),r=Math.floor(e/(1e3*60)%60),u=Math.floor(e/(1e3*60*60)%24),_=u<10?"0"+u:u,n=r<10?"0"+r:r,p=s<10?"0"+s:s;return`${_} hrs ${n} mins ${p} secs`}const Te=ee.memo(({onTimeUp:e})=>{const{isMarked:s}=o.exports.useContext(j),[r,u]=o.exports.useState(+`${localStorage.getItem("remainingTime")}`||0),[_,n]=o.exports.useState(!1),p=o.exports.useMemo(()=>Ae(r<0?0:r),[r]);return o.exports.useEffect(()=>{if(r<=0){n(!0),s||e();return}localStorage.setItem("remainingTime",`${r>=0?r:0}`)},[r]),o.exports.useEffect(()=>{if(!_||!s){let m=setInterval(()=>{u(S=>S-1e3)},1e3);return()=>{clearInterval(m)}}},[_]),t(W,{children:t("button",{className:"waves-effect waves-light btn-small z-depth-0 white black-text",children:p})})}),Pe=({questions:e,alreadyDone:s,isKiswahili:r,wasTimed:u})=>{const{subject:_,currentPage:n,totalPages:p,attemptTree:m,questionsPerPage:S,numOfQuestions:l,isMarked:a,compSubQuestionPage:h,updatePageNumber:y,setIsMarked:b,setCurrentSubPage:k,updateStudentTreeContentAtAndMove:P}=o.exports.useContext(j),[R,L]=o.exports.useState(!1),[A,f]=o.exports.useState(0),[x,C]=o.exports.useState(0),[N,g]=o.exports.useState([]),[d,v]=o.exports.useState(e.length===1&&e[0].questionType?e[0].questionType==="comprehension":!1),[T,Q]=o.exports.useState({[n]:[]});let $=o.exports.useMemo(()=>{var i;return d?(i=e[0].children)==null?void 0:i.length:e.length},[n]),E=o.exports.useMemo(()=>d?Math.floor(($||0)/5)+(($||0)%5>0?1:0):0,[n]);const B=i=>i.reduce((c,I)=>{switch(I.questionType){case"normal":{c+=I.content.attempted_options.length>0?1:0;break}case"comprehension":{c+=I.content.children.slice(h*5,h*5+5).reduce((H,z)=>H+(z.attempted_options.length>0?1:0),0);break}}return c},0),J=i=>i.reduce((c,I)=>{switch(I.questionType){case"comprehension":{c+=I.content.children.slice(0,h>0?(h-1)*5+5:h).reduce((H,z)=>H+(z.attempted_options.length>0?1:0),0);break}}return c},0),se=o.exports.useMemo(()=>d?J(m.pages[n])+s+A:A+s,[A,n]),K=o.exports.useMemo(()=>d?J(m.pages[n])+s+A===l:A+s===l,[A,n,S,l]);let O=o.exports.useMemo(()=>d?Math.floor(($||0)/5):1,[e]);const Z=(i,c)=>{let I=T[n],M=I.findIndex(H=>H.content.question===i);if(M<0){Q({[n]:[...I,c]});return}I[M]=c,Q(G(V({},T),{[n]:I}))},re=o.exports.useMemo(()=>{if(d){let i=0,c=0;return h>O?(c=($||0)%5,i=O):i=h,i*5+c}return 0},[e]);o.exports.useEffect(()=>{let i=m.pages[n];F(B(i)),Q(G(V({},T),{[n]:i}))},[n]),o.exports.useEffect(()=>{F(B(m.pages[n]))},[h]),o.exports.useEffect(()=>{R&&oe()},[R]);const oe=()=>{if(d){let c=($||0)%5,I=O+(c>0?1:0),M=h+1;if(M<I){k(M),P(-1/0,M,n,T[n]);return}}let i=n+1;i<p&&P(i,-1/0,n,T[n])},D=o.exports.useCallback(()=>i=>{g(c=>[...c,i])},[])(),F=i=>{f(A+i)},U=i=>{C(c=>c+i)},X=o.exports.useCallback(i=>T[n].find(I=>I.content.question===i)||null,[n]),ie=(i,c)=>{switch(i.questionType){case"normal":return t(fe,{setAttempted:F,AddPageStudentPaperContent:Z,setCorrectAnswersCount:U,AddLibraryPaperContents:D,question:i,savedQuestion:X(i._id),position:c+s,isMarked:a},c);case"comprehension":return t(Se,{setAttempted:F,index:c,savedQuestion:X(i._id),position:c+s,AddPageStudentPaperContent:Z,question:i,AddLibraryPaperContents:D,setCorrectAnswersCount:U,isMarked:a},c);default:return t(Ie,{setAttempted:F,setCorrectAnswersCount:U,AddLibraryPaperContents:D,question:i,position:c+n*S,isMarked:a},c)}};return w(W,{children:[w("div",{className:"white",style:{display:"flex",flexDirection:"row",justifyContent:"space-between",borderRadius:"2px",boxShadow:"0 4px 8px 0 rgba(0,0,0,0.2)",padding:"5px 6px",position:"sticky",top:56.2,zIndex:2},children:[t("button",{className:"waves-effect waves-light btn-small",disabled:n===0&&h===0,onClick:()=>{if(d&&h!==0){P(-1/0,h>0?h-1:h,n,T[n]);return}let i=0,c=n>0?n-1:n,I=m.pages[c];if(I&&I[0].questionType==="comprehension"){let M=I[0].content.children.length;i=Math.floor((M||0)/5)+((M||0)%5>0?1:0)}i-=i>0?1:0,P(c,i,n,T[n])},children:t("i",{className:"material-icons",children:"arrow_back"})}),t("div",{className:"white",hidden:!a,style:{alignSelf:"center",padding:"5px",borderRadius:"3px",border:"1px solid #d3d3d3"},children:t("b",{children:w("span",{children:[r?"ALAMA":"SCORE"," : ",`${m.score.passed}/${l}`," ",w("span",{style:{fontFamily:"'Abril Fatface', cursive",color:"red"},children:["( ",Math.ceil(m.score.passed/m.score.total*100),"% )"]})]})})}),a?null:u?t(Te,{onTimeUp:()=>{b(!0)}}):t("input",{disabled:!0,type:"range",min:"0",value:`${se}`,max:l,style:{flex:1,marginRight:"3px",alignSelf:"center",background:"#000"}}),t("div",{hidden:a,className:"teal white-text z-depth-1",style:{alignSelf:"center",padding:"5px",borderRadius:"4px"},children:t("b",{children:`${A+s+re}/${l}`})}),t("div",{hidden:!a,children:t("button",{disabled:(()=>{if(d){let i=($||0)%5,c=O+(i>0?1:0);return h+1===c&&n+1===p}return n+1===p})(),onClick:()=>{if(d){let c=h+1;if(c<E){k(c);return}}let i=n+1;i<p&&y(i)},className:"waves-effect waves-light z-depth-1 btn-small",children:t("i",{className:"material-icons",children:"arrow_forward"})})})]}),t("div",{id:"zoeziPaper",children:t(ne.Card,{style:{marginTop:"13px"},header:w("div",{className:"card-image",children:[t("div",{className:"postergrad",children:t("img",{alt:"",style:{maxWidth:"100%",height:"84px",objectFit:"cover"},src:"/img/background2.webp"})}),t("span",{className:"card-title text-center sub-names truncate text-bold teal",children:`${_}`})]}),children:w("form",{onSubmit:i=>{if(i.preventDefault(),d)if(h<O){if(A!==5)return}else{let c=($||0)%5;if(A!==c)return}else if(A!==$)return;L(!0),K&&b(!0)},children:[e.map((i,c)=>ie(i,c)),t(ne.Button,{node:"button",waves:"light",small:!0,style:{marginTop:"15px"},disabled:a,children:K?r?"SAHIHISHA KARATASI":"MARK PAPER":r?"GEUZA UKURUSA":"TURN PAGE"})]})})})]})};export{Pe as default};
