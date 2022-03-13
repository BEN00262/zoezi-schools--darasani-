var je=Object.defineProperty,$e=Object.defineProperties;var Be=Object.getOwnPropertyDescriptors;var ge=Object.getOwnPropertySymbols;var Ve=Object.prototype.hasOwnProperty,Me=Object.prototype.propertyIsEnumerable;var me=(t,n,c)=>n in t?je(t,n,{enumerable:!0,configurable:!0,writable:!0,value:c}):t[n]=c,E=(t,n)=>{for(var c in n||(n={}))Ve.call(n,c)&&me(t,c,n[c]);if(ge)for(var c of ge(n))Me.call(n,c)&&me(t,c,n[c]);return t},$=(t,n)=>$e(t,Be(n));import{_,F as Qe,H as w,I as ve,J as xe,K as be,R as O,M as Ce,N as ye,y as W,m as ee,O as De}from"./App.a8681f4d.js";import{R as N,a as m}from"./vendor.0b632b43.js";import{j as o,a as x,F as Ke}from"./index.1e4c208f.js";import{totalStudentsInSubject as te,studentsWhoPartcipatedState as Ae}from"./TopFailedQuestions.df4e1347.js";function Se(t,n){var c=Object.keys(t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(t);n&&(a=a.filter(function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable})),c.push.apply(c,a)}return c}function Le(t){for(var n=1;n<arguments.length;n++){var c=arguments[n]!=null?arguments[n]:{};n%2?Se(Object(c),!0).forEach(function(a){_(t,a,c[a])}):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(c)):Se(Object(c)).forEach(function(a){Object.defineProperty(t,a,Object.getOwnPropertyDescriptor(c,a))})}return t}function G(t){return G=Object.setPrototypeOf?Object.getPrototypeOf:function(c){return c.__proto__||Object.getPrototypeOf(c)},G(t)}function Je(){if(typeof Reflect=="undefined"||!Reflect.construct||Reflect.construct.sham)return!1;if(typeof Proxy=="function")return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],function(){})),!0}catch{return!1}}function Fe(t){if(t===void 0)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}function Ue(t,n){if(n&&(Qe(n)==="object"||typeof n=="function"))return n;if(n!==void 0)throw new TypeError("Derived constructors may only return object or undefined");return Fe(t)}function Ne(t){var n=Je();return function(){var a=G(t),e;if(n){var r=G(this).constructor;e=Reflect.construct(a,arguments,r)}else e=a.apply(this,arguments);return Ue(this,e)}}var J=function(n){var c,a="".concat(n.rootPrefixCls,"-item"),e=w(a,"".concat(a,"-").concat(n.page),(c={},_(c,"".concat(a,"-active"),n.active),_(c,"".concat(a,"-disabled"),!n.page),_(c,n.className,!!n.className),c)),r=function(){n.onClick(n.page)},s=function(u){n.onKeyPress(u,n.onClick,n.page)};return N.createElement("li",{title:n.showTitle?n.page:null,className:e,onClick:r,onKeyPress:s,tabIndex:"0"},n.itemRender(n.page,"page",N.createElement("a",{rel:"nofollow"},n.page)))},T={ZERO:48,NINE:57,NUMPAD_ZERO:96,NUMPAD_NINE:105,BACKSPACE:8,DELETE:46,ENTER:13,ARROW_UP:38,ARROW_DOWN:40},Pe=function(t){ve(c,t);var n=Ne(c);function c(){var a;xe(this,c);for(var e=arguments.length,r=new Array(e),s=0;s<e;s++)r[s]=arguments[s];return a=n.call.apply(n,[this].concat(r)),a.state={goInputText:""},a.buildOptionText=function(l){return"".concat(l," ").concat(a.props.locale.items_per_page)},a.changeSize=function(l){a.props.changeSize(Number(l))},a.handleChange=function(l){a.setState({goInputText:l.target.value})},a.handleBlur=function(l){var u=a.props,i=u.goButton,p=u.quickGo,d=u.rootPrefixCls,h=a.state.goInputText;i||h===""||(a.setState({goInputText:""}),!(l.relatedTarget&&(l.relatedTarget.className.indexOf("".concat(d,"-item-link"))>=0||l.relatedTarget.className.indexOf("".concat(d,"-item"))>=0))&&p(a.getValidValue()))},a.go=function(l){var u=a.state.goInputText;u!==""&&(l.keyCode===T.ENTER||l.type==="click")&&(a.setState({goInputText:""}),a.props.quickGo(a.getValidValue()))},a}return be(c,[{key:"getValidValue",value:function(){var e=this.state.goInputText;return!e||isNaN(e)?void 0:Number(e)}},{key:"getPageSizeOptions",value:function(){var e=this.props,r=e.pageSize,s=e.pageSizeOptions;return s.some(function(l){return l.toString()===r.toString()})?s:s.concat([r.toString()]).sort(function(l,u){var i=isNaN(Number(l))?0:Number(l),p=isNaN(Number(u))?0:Number(u);return i-p})}},{key:"render",value:function(){var e=this,r=this.props,s=r.pageSize,l=r.locale,u=r.rootPrefixCls,i=r.changeSize,p=r.quickGo,d=r.goButton,h=r.selectComponentClass,f=r.buildOptionText,v=r.selectPrefixCls,g=r.disabled,P=this.state.goInputText,I="".concat(u,"-options"),y=h,j=null,B=null,V=null;if(!i&&!p)return null;var F=this.getPageSizeOptions();if(i&&y){var H=F.map(function(M,z){return N.createElement(y.Option,{key:z,value:M.toString()},(f||e.buildOptionText)(M))});j=N.createElement(y,{disabled:g,prefixCls:v,showSearch:!1,className:"".concat(I,"-size-changer"),optionLabelProp:"children",dropdownMatchSelectWidth:!1,value:(s||F[0]).toString(),onChange:this.changeSize,getPopupContainer:function(z){return z.parentNode},"aria-label":l.page_size,defaultOpen:!1},H)}return p&&(d&&(V=typeof d=="boolean"?N.createElement("button",{type:"button",onClick:this.go,onKeyUp:this.go,disabled:g,className:"".concat(I,"-quick-jumper-button")},l.jump_to_confirm):N.createElement("span",{onClick:this.go,onKeyUp:this.go},d)),B=N.createElement("div",{className:"".concat(I,"-quick-jumper")},l.jump_to,N.createElement("input",{disabled:g,type:"text",value:P,onChange:this.handleChange,onKeyUp:this.go,onBlur:this.handleBlur,"aria-label":l.page}),l.page,V)),N.createElement("li",{className:"".concat(I)},j,B)}}]),c}(N.Component);Pe.defaultProps={pageSizeOptions:["10","20","50","100"]};var We={items_per_page:"\u6761/\u9875",jump_to:"\u8DF3\u81F3",jump_to_confirm:"\u786E\u5B9A",page:"\u9875",prev_page:"\u4E0A\u4E00\u9875",next_page:"\u4E0B\u4E00\u9875",prev_5:"\u5411\u524D 5 \u9875",next_5:"\u5411\u540E 5 \u9875",prev_3:"\u5411\u524D 3 \u9875",next_3:"\u5411\u540E 3 \u9875",page_size:"\u9875\u7801"};function ne(){}function _e(t){var n=Number(t);return typeof n=="number"&&!isNaN(n)&&isFinite(n)&&Math.floor(n)===n}function Ge(t,n,c){return c}function R(t,n,c){var a=typeof t=="undefined"?n.pageSize:t;return Math.floor((c.total-1)/a)+1}var Ie=function(t){ve(c,t);var n=Ne(c);function c(a){var e;xe(this,c),e=n.call(this,a),e.getJumpPrevPage=function(){return Math.max(1,e.state.current-(e.props.showLessItems?3:5))},e.getJumpNextPage=function(){return Math.min(R(void 0,e.state,e.props),e.state.current+(e.props.showLessItems?3:5))},e.getItemIcon=function(i,p){var d=e.props.prefixCls,h=i||o("button",{type:"button","aria-label":p,className:"".concat(d,"-item-link")});return typeof i=="function"&&(h=N.createElement(i,Le({},e.props))),h},e.savePaginationNode=function(i){e.paginationNode=i},e.isValid=function(i){var p=e.props.total;return _e(i)&&i!==e.state.current&&_e(p)&&p>0},e.shouldDisplayQuickJumper=function(){var i=e.props,p=i.showQuickJumper,d=i.total,h=e.state.pageSize;return d<=h?!1:p},e.handleKeyDown=function(i){(i.keyCode===T.ARROW_UP||i.keyCode===T.ARROW_DOWN)&&i.preventDefault()},e.handleKeyUp=function(i){var p=e.getValidValue(i),d=e.state.currentInputValue;p!==d&&e.setState({currentInputValue:p}),i.keyCode===T.ENTER?e.handleChange(p):i.keyCode===T.ARROW_UP?e.handleChange(p-1):i.keyCode===T.ARROW_DOWN&&e.handleChange(p+1)},e.handleBlur=function(i){var p=e.getValidValue(i);e.handleChange(p)},e.changePageSize=function(i){var p=e.state.current,d=R(i,e.state,e.props);p=p>d?d:p,d===0&&(p=e.state.current),typeof i=="number"&&("pageSize"in e.props||e.setState({pageSize:i}),"current"in e.props||e.setState({current:p,currentInputValue:p})),e.props.onShowSizeChange(p,i),"onChange"in e.props&&e.props.onChange&&e.props.onChange(p,i)},e.handleChange=function(i){var p=e.props.disabled,d=i;if(e.isValid(d)&&!p){var h=R(void 0,e.state,e.props);d>h?d=h:d<1&&(d=1),"current"in e.props||e.setState({current:d,currentInputValue:d});var f=e.state.pageSize;return e.props.onChange(d,f),d}return e.state.current},e.prev=function(){e.hasPrev()&&e.handleChange(e.state.current-1)},e.next=function(){e.hasNext()&&e.handleChange(e.state.current+1)},e.jumpPrev=function(){e.handleChange(e.getJumpPrevPage())},e.jumpNext=function(){e.handleChange(e.getJumpNextPage())},e.hasPrev=function(){return e.state.current>1},e.hasNext=function(){return e.state.current<R(void 0,e.state,e.props)},e.runIfEnter=function(i,p){if(i.key==="Enter"||i.charCode===13){for(var d=arguments.length,h=new Array(d>2?d-2:0),f=2;f<d;f++)h[f-2]=arguments[f];p.apply(void 0,h)}},e.runIfEnterPrev=function(i){e.runIfEnter(i,e.prev)},e.runIfEnterNext=function(i){e.runIfEnter(i,e.next)},e.runIfEnterJumpPrev=function(i){e.runIfEnter(i,e.jumpPrev)},e.runIfEnterJumpNext=function(i){e.runIfEnter(i,e.jumpNext)},e.handleGoTO=function(i){(i.keyCode===T.ENTER||i.type==="click")&&e.handleChange(e.state.currentInputValue)};var r=a.onChange!==ne,s="current"in a;s&&!r&&console.warn("Warning: You provided a `current` prop to a Pagination component without an `onChange` handler. This will render a read-only component.");var l=a.defaultCurrent;"current"in a&&(l=a.current);var u=a.defaultPageSize;return"pageSize"in a&&(u=a.pageSize),l=Math.min(l,R(u,void 0,a)),e.state={current:l,currentInputValue:l,pageSize:u},e}return be(c,[{key:"componentDidUpdate",value:function(e,r){var s=this.props.prefixCls;if(r.current!==this.state.current&&this.paginationNode){var l=this.paginationNode.querySelector(".".concat(s,"-item-").concat(r.current));l&&document.activeElement===l&&l.blur()}}},{key:"getValidValue",value:function(e){var r=e.target.value,s=R(void 0,this.state,this.props),l=this.state.currentInputValue,u;return r===""?u=r:isNaN(Number(r))?u=l:r>=s?u=s:u=Number(r),u}},{key:"getShowSizeChanger",value:function(){var e=this.props,r=e.showSizeChanger,s=e.total,l=e.totalBoundaryShowSizeChanger;return typeof r!="undefined"?r:s>l}},{key:"renderPrev",value:function(e){var r=this.props,s=r.prevIcon,l=r.itemRender,u=l(e,"prev",this.getItemIcon(s,"prev page")),i=!this.hasPrev();return m.exports.isValidElement(u)?m.exports.cloneElement(u,{disabled:i}):u}},{key:"renderNext",value:function(e){var r=this.props,s=r.nextIcon,l=r.itemRender,u=l(e,"next",this.getItemIcon(s,"next page")),i=!this.hasNext();return m.exports.isValidElement(u)?m.exports.cloneElement(u,{disabled:i}):u}},{key:"render",value:function(){var e=this,r=this.props,s=r.prefixCls,l=r.className,u=r.style,i=r.disabled,p=r.hideOnSinglePage,d=r.total,h=r.locale,f=r.showQuickJumper,v=r.showLessItems,g=r.showTitle,P=r.showTotal,I=r.simple,y=r.itemRender,j=r.showPrevNextJumpers,B=r.jumpPrevIcon,V=r.jumpNextIcon,F=r.selectComponentClass,H=r.selectPrefixCls,M=r.pageSizeOptions,z=this.state,b=z.current,Q=z.pageSize,we=z.currentInputValue;if(p===!0&&d<=Q)return null;var C=R(void 0,this.state,this.props),S=[],se=null,ie=null,oe=null,le=null,D=null,U=f&&f.goButton,k=v?1:2,ce=b-1>0?b-1:0,ue=b+1<C?b+1:C,pe=Object.keys(this.props).reduce(function(fe,L){return(L.substr(0,5)==="data-"||L.substr(0,5)==="aria-"||L==="role")&&(fe[L]=e.props[L]),fe},{});if(I)return U&&(typeof U=="boolean"?D=o("button",{type:"button",onClick:this.handleGoTO,onKeyUp:this.handleGoTO,children:h.jump_to_confirm}):D=o("span",{onClick:this.handleGoTO,onKeyUp:this.handleGoTO,children:U}),D=o("li",{title:g?"".concat(h.jump_to).concat(b,"/").concat(C):null,className:"".concat(s,"-simple-pager"),children:D})),x("ul",$(E({className:w(s,"".concat(s,"-simple"),_({},"".concat(s,"-disabled"),i),l),style:u,ref:this.savePaginationNode},pe),{children:[o("li",{title:g?h.prev_page:null,onClick:this.prev,tabIndex:this.hasPrev()?0:null,onKeyPress:this.runIfEnterPrev,className:w("".concat(s,"-prev"),_({},"".concat(s,"-disabled"),!this.hasPrev())),"aria-disabled":!this.hasPrev(),children:this.renderPrev(ce)}),x("li",{title:g?"".concat(b,"/").concat(C):null,className:"".concat(s,"-simple-pager"),children:[o("input",{type:"text",value:we,disabled:i,onKeyDown:this.handleKeyDown,onKeyUp:this.handleKeyUp,onChange:this.handleKeyUp,onBlur:this.handleBlur,size:"3"}),o("span",{className:"".concat(s,"-slash"),children:"/"}),C]}),o("li",{title:g?h.next_page:null,onClick:this.next,tabIndex:this.hasPrev()?0:null,onKeyPress:this.runIfEnterNext,className:w("".concat(s,"-next"),_({},"".concat(s,"-disabled"),!this.hasNext())),"aria-disabled":!this.hasNext(),children:this.renderNext(ue)}),D]}));if(C<=3+k*2){var de={locale:h,rootPrefixCls:s,onClick:this.handleChange,onKeyPress:this.runIfEnter,showTitle:g,itemRender:y};C||S.push(m.exports.createElement(J,$(E({},de),{key:"noPager",page:1,className:"".concat(s,"-item-disabled")})));for(var K=1;K<=C;K+=1){var Ee=b===K;S.push(m.exports.createElement(J,$(E({},de),{key:K,page:K,active:Ee})))}}else{var Re=v?h.prev_3:h.prev_5,ze=v?h.next_3:h.next_5;j&&(se=o("li",{title:g?Re:null,onClick:this.jumpPrev,tabIndex:"0",onKeyPress:this.runIfEnterJumpPrev,className:w("".concat(s,"-jump-prev"),_({},"".concat(s,"-jump-prev-custom-icon"),!!B)),children:y(this.getJumpPrevPage(),"jump-prev",this.getItemIcon(B,"prev page"))},"prev"),ie=o("li",{title:g?ze:null,tabIndex:"0",onClick:this.jumpNext,onKeyPress:this.runIfEnterJumpNext,className:w("".concat(s,"-jump-next"),_({},"".concat(s,"-jump-next-custom-icon"),!!V)),children:y(this.getJumpNextPage(),"jump-next",this.getItemIcon(V,"next page"))},"next")),le=o(J,{locale:h,last:!0,rootPrefixCls:s,onClick:this.handleChange,onKeyPress:this.runIfEnter,page:C,active:!1,showTitle:g,itemRender:y},C),oe=o(J,{locale:h,rootPrefixCls:s,onClick:this.handleChange,onKeyPress:this.runIfEnter,page:1,active:!1,showTitle:g,itemRender:y},1);var q=Math.max(1,b-k),Y=Math.min(b+k,C);b-1<=k&&(Y=1+k*2),C-b<=k&&(q=C-k*2);for(var A=q;A<=Y;A+=1){var Te=b===A;S.push(o(J,{locale:h,rootPrefixCls:s,onClick:this.handleChange,onKeyPress:this.runIfEnter,page:A,active:Te,showTitle:g,itemRender:y},A))}b-1>=k*2&&b!==1+2&&(S[0]=m.exports.cloneElement(S[0],{className:"".concat(s,"-item-after-jump-prev")}),S.unshift(se)),C-b>=k*2&&b!==C-2&&(S[S.length-1]=m.exports.cloneElement(S[S.length-1],{className:"".concat(s,"-item-before-jump-next")}),S.push(ie)),q!==1&&S.unshift(oe),Y!==C&&S.push(le)}var he=null;P&&(he=o("li",{className:"".concat(s,"-total-text"),children:P(d,[d===0?0:(b-1)*Q+1,b*Q>d?d:b*Q])}));var Z=!this.hasPrev()||!C,X=!this.hasNext()||!C;return x("ul",$(E({className:w(s,l,_({},"".concat(s,"-disabled"),i)),style:u,unselectable:"unselectable",ref:this.savePaginationNode},pe),{children:[he,o("li",{title:g?h.prev_page:null,onClick:this.prev,tabIndex:Z?null:0,onKeyPress:this.runIfEnterPrev,className:w("".concat(s,"-prev"),_({},"".concat(s,"-disabled"),Z)),"aria-disabled":Z,children:this.renderPrev(ce)}),S,o("li",{title:g?h.next_page:null,onClick:this.next,tabIndex:X?null:0,onKeyPress:this.runIfEnterNext,className:w("".concat(s,"-next"),_({},"".concat(s,"-disabled"),X)),"aria-disabled":X,children:this.renderNext(ue)}),o(Pe,{disabled:i,locale:h,rootPrefixCls:s,selectComponentClass:F,selectPrefixCls:H,changeSize:this.getShowSizeChanger()?this.changePageSize:null,current:b,pageSize:Q,pageSizeOptions:M,quickGo:this.shouldDisplayQuickJumper()?this.handleChange:null,goButton:U})]}))}}],[{key:"getDerivedStateFromProps",value:function(e,r){var s={};if("current"in e&&(s.current=e.current,e.current!==r.current&&(s.currentInputValue=s.current)),"pageSize"in e&&e.pageSize!==r.pageSize){var l=r.current,u=R(e.pageSize,r,e);l=l>u?u:l,"current"in e||(s.current=l,s.currentInputValue=l),s.pageSize=e.pageSize}return s}}]),c}(N.Component);Ie.defaultProps={defaultCurrent:1,total:0,defaultPageSize:10,onChange:ne,className:"",selectPrefixCls:"rc-select",prefixCls:"rc-pagination",selectComponentClass:null,hideOnSinglePage:!1,showPrevNextJumpers:!0,showQuickJumper:!1,showLessItems:!1,showTitle:!0,onShowSizeChange:ne,locale:We,style:{},itemRender:Ge,totalBoundaryShowSizeChanger:50};const He=({option:t,index:n,position:c,analytics:a})=>o("div",{children:o("p",{children:x("label",{children:[o("input",{type:"checkbox",className:"filled-in",disabled:!0,checked:t.isCorrect,name:`options_${c}`}),o("span",{className:t.isCorrect?"green-text":"black-text",children:o("b",{children:o("span",{dangerouslySetInnerHTML:{__html:t.option}})})})]})})},n),qe=({option:t,index:n,position:c,analytics:a})=>o("div",{children:o("p",{children:x("label",{children:[o("input",{disabled:!0,required:!0,checked:t.isCorrect,className:"with-gap",name:`options_${c}`,type:"radio"}),o("span",{className:t.isCorrect?"green-text":"black-text",children:o("b",{children:o("span",{dangerouslySetInnerHTML:{__html:`
                                <div>${t.option}</div>
                                <div class="sub-modal-texts ${t.isCorrect?"green-text":"red-text"}">Selected by (${a}%) of the students</div>
                                `}})})})]})})},n),Ye=({question:t,failed:n,students:c,position:a,choices:e,paperName:r,questionPosition:s,paperID:l})=>{const u=O(te),p=m.exports.useMemo(()=>{var f,v;return((v=(f=t==null?void 0:t.options_next)==null?void 0:f.filter(g=>g.isCorrect))==null?void 0:v.length)||0},[t])>1||!1;m.exports.useEffect(()=>{let f=document.querySelectorAll(".question-comp img");Ce.Materialbox.init(f)},[]);const h=(()=>{let f=p?He:qe;return({index:v,option:g,analytics:P})=>o(f,{analytics:P,position:v+1,option:g,index:v},v)})();return x("div",{children:[r&&s&&s>0&&l?o("div",{className:"center",style:{marginTop:"8px"},children:o(ye,{to:`/view-paper/${l}/${t._id}`,children:x("span",{className:"sub-modal-texts teal-text",style:{border:"1px solid #d3d3d3",padding:"5px 15px",cursor:"pointer"},children:[" ",x("b",{children:[r," | Number ",s]})," "]})})}):null,o("span",{dangerouslySetInnerHTML:{__html:`
                    <div style="display:flex;flex-direction:row;align-items:flex-start;">
                        <p style="margin-right:5px;">${a}.  </p>
                        <div>
                            <strong class="question-comp">${t.question}</strong>
                            <span class="sub-modal-texts green-text" style="margin-left:5px;">
                                <b>[ Attempted by ${c} (${(c/(u||1)*100).toFixed(0)}%) student(s) ]</b>
                            </span>

                            <span class="sub-modal-texts red-text" style="margin-left:5px;">
                                <b>[ Failed by ${(n/c*100).toFixed(0)}% of the students ]</b>
                            </span>
                        </div>
                    </div>
                `}}),o("div",{style:{marginTop:"10px",marginLeft:"17px",marginBottom:"10px"},children:t.options_next&&t.options_next.map((f,v)=>{let g=Object.keys(e).find(P=>P===f._id);return h({option:f,index:v,analytics:((g&&e[f._id]||0)/c*100).toFixed(0)})})}),o("div",{style:{marginLeft:"17px",marginBottom:"10px"},children:o("span",{dangerouslySetInnerHTML:{__html:`
                        <blockquote class="red lighten-5">
                            <span>
                            ${t.additionalInfo}
                            </span>
                        </blockquote>
                    `}})})]})};const Ze=({option:t,index:n,position:c,optionAnalytics:a})=>o("div",{children:o("p",{children:x("label",{children:[o("input",{type:"checkbox",checked:t.isCorrect,className:"filled-in",disabled:!0,required:!0,name:`sub_option_answer_${c}`}),o("span",{className:t.isCorrect?"green-text":"black-text",children:o("b",{children:o("span",{dangerouslySetInnerHTML:{__html:`
                                        <div>${t.option}</div>
                                        <div class="sub-modal-texts ${t.isCorrect?"green-text":"red-text"}">Selected by (${a.toFixed(0)}%) of the students</div>
                                    `}})})})]})})},n),Xe=({option:t,keyValue:n,position:c,optionAnalytics:a})=>o("p",{children:x("label",{children:[o("input",{disabled:!0,checked:t.isCorrect,required:!0,className:"with-gap",type:"radio",name:`sub_option_answer_${c}`}),o("span",{className:t.isCorrect?"green-text":"black-text",children:o("b",{children:o("span",{dangerouslySetInnerHTML:{__html:`
                                    <div>${t.option}</div>
                                    <div class="sub-modal-texts ${t.isCorrect?"green-text":"red-text"}">Selected by (${a.toFixed(0)}%) of the students</div>
                                    `}})})})]})},n),et=({children:t,index:n})=>{const c=O(re);return x("div",{style:{marginLeft:"15px",marginTop:"5px",marginBottom:"5px",display:"flex",flexDirection:"row",alignItems:"flex-start"},children:[x("p",{children:[c+n,"."]}),o("div",{children:t})]})},tt=({children:t})=>o("div",{style:{marginLeft:"15px",marginTop:"5px",marginBottom:"5px"},children:t}),nt=({question:t,index:n,savedState:c,parentId:a})=>{const e=O(re),r=O(ke),s=O(Oe),l=O(te),u=m.exports.useMemo(()=>{var f,v;return((v=(f=t==null?void 0:t.options)==null?void 0:f.filter(g=>g.isCorrect))==null?void 0:v.length)>1},[t]),i=s?et:tt,p=m.exports.useMemo(()=>r.find(f=>f.questionId===t._id)||{},[r,t]),h=(()=>{let f=u?Ze:Xe;return({position:v,index:g,option:P,quesIndex:I,optionAnalytics:y})=>o(f,{keyValue:`sub_option_${g}_${I}`,position:v,option:P,index:g,optionAnalytics:y},`sub_option_${g}_${I}`)})();return x("div",{style:{marginLeft:"6px"},children:[o("span",{dangerouslySetInnerHTML:{__html:s?"":`
                        <div style="display:flex;flex-direction:row;">
                            <p style="margin-right:5px;">
                                ${e+n}.  
                            </p>
                            <p><strong>
                            ${t.question}
                            </strong></p>
                        </div>
                    `}}),x(i,{index:n,children:[t.options.map((f,v)=>{let g=Object.keys(p).length?p.choices[f._id]/(p.students||1)*100:0;return h({position:n,index:n,quesIndex:v,option:f,optionAnalytics:g||0})}),x("div",{style:{letterSpacing:"1px",display:"flex",flexDirection:"row",alignItems:"center"},className:"sub-modal-texts blue-text",children:[o("i",{className:"material-icons",children:"info"})," ",x("b",{style:{marginLeft:"4px"},children:["Attempted by ",p.students," ( ",((p.students||0)/(l||1)*100).toFixed(0)," %) of the learners"]})]})]}),o("div",{style:{marginLeft:"15px",marginBottom:"10px"},children:o("span",{dangerouslySetInnerHTML:{__html:`
                        <blockquote class="red lighten-5">
                            <span>
                                ${t.additionalInfo}
                            </span>
                        </blockquote>
                    `}})})]})},rt=t=>{let n=5,c=t.length%n,a=Math.floor(t.length/n)+(c>0?1:0),e=new Array(a).fill([]);for(let r=0;r<a;r++)e[r]=t.slice(r*n,r*n+n);return e},at=N.memo(({parentId:t,sub_questions:n,savedChildren:c})=>{const a=O(ae),e=m.exports.useCallback(u=>c.find(i=>i.question===u)||null,[n]);let r=m.exports.useMemo(()=>rt(n||[]),[n]),s=r[a],l=r.slice(0,a).reduce((u,i)=>u+i.length,0);return o(Ke,{children:s.map((u,i)=>o(nt,{parentId:t,question:u,savedState:e(u._id),index:i+l},i))})}),Oe=W({key:"isBrokenPassageId",default:!1}),ke=W({key:"subQuestionsContextStateId",default:[]}),re=W({key:"baseQuestionNumberStateId",default:0}),st=({question:t,failed:n,students:c,children_stats:a,paperName:e,questionPosition:r,paperID:s})=>{var y;const l=ee(Oe),u=ee(re),i=ee(ke);O(Ae);const[p,d]=m.exports.useState([]),[h,f]=m.exports.useState(t.question),[v,g]=m.exports.useState(-1),P=O(ae),I=O(te);return m.exports.useEffect(()=>{let j=document.querySelectorAll(".question-comp img");Ce.Materialbox.init(j)},[]),m.exports.useEffect(()=>{g(Math.random())},[P]),m.exports.useEffect(()=>{a.length&&i(a)},[a]),m.exports.useEffect(()=>{u(r||1)},[r]),m.exports.useEffect(()=>{l(t.children[0].question.trim().replace(/(<([^>]+)>)/ig,"").trim().length<=1)},[t]),x("div",{children:[e&&r&&r>0&&s?o("div",{className:"center",style:{marginTop:"8px"},children:o(ye,{to:`/view-paper/${s}/${t._id}`,children:x("span",{className:"sub-modal-texts teal-text",style:{border:"1px solid #d3d3d3",padding:"5px 15px",cursor:"pointer"},children:[" ",x("b",{children:[e," | Numbers ",r," - ",r+(((y=t.children)==null?void 0:y.length)||1)-1]})," "]})})}):null,o("span",{dangerouslySetInnerHTML:{__html:`
                    <div>
                        <div>
                            <span class="sub-modal-texts green-text" style="margin-left:5px;">
                                <b>[ Attempted by ${c} (${(c/(I||1)*100).toFixed(0)}%) student(s) ]</b>
                            </span>
                        </div>
                        <div class="question-comp">${h}</div>
                    </div>`}}),o("div",{style:{marginTop:"5px"},children:o(at,{parentId:t._id,savedChildren:p,sub_questions:t.children||[]},v)})]})},it=t=>{if(!t.question)return null;switch(t.question.questionType){case"normal":return o(Ye,E({},t));case"comprehension":return o(st,E({},t));default:return null}},ae=W({key:"compSubQuestionPageId",default:0}),dt=({stats:t})=>{const[n,c]=m.exports.useState(0),[a,e]=m.exports.useState(-1),[r,s]=De(ae),[l,u]=m.exports.useState({});m.exports.useEffect(()=>{t.length&&(s(0),u(t[n]),e(Math.random()))},[n]);const i=m.exports.useMemo(()=>l.question&&l.question.questionType==="comprehension"?Math.floor((l.question?(l.question.children||[]).length:0)/5)+((l.question?(l.question.children||[]).length:0)%5>0?1:0):0,[l]);return x("div",{children:[o("div",{className:"row",children:o("div",{className:"col s12 left-align",children:t.length?o(Ie,{onChange:(p,d)=>{c(p-1)},current:n+1,total:t.length,pageSize:1}):null})}),l.question&&l.question.questionType==="comprehension"&&i>1?o("div",{style:{border:"1px solid #d3d3d3",marginBottom:"5px",borderRadius:"2px",padding:"5px 6px",position:"sticky",top:64,zIndex:2},children:x("div",{style:{display:"flex",flexDirection:"row",justifyContent:"space-between"},children:[o("button",{disabled:r===0,className:"waves-effect waves-light btn-small z-depth-0",onClick:p=>{s(d=>d>0?d-1:d)},children:o("i",{className:"material-icons",children:"arrow_back"})}),o("button",{className:"waves-effect waves-light btn-small z-depth-0",disabled:r>=i-1,onClick:p=>{s(d=>d+1)},children:o("i",{className:"material-icons",children:"arrow_forward"})})]})}):null,o("div",{className:"col s12",style:{border:"1px solid #d3d3d3"},children:t.length>n?o(it,$(E({},l),{position:n+1}),a):o("p",{className:"center",children:"No questions found"})})]})};export{ae as compSubQuestionPageState,dt as default};
