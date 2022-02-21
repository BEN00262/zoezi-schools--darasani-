function c(e){let s=Math.floor(e/1e3%60),t=Math.floor(e/(1e3*60)%60),o=Math.floor(e/(1e3*60*60)%24),l=o<10?"0"+o:o,n=t<10?"0"+t:t,r=s<10?"0"+s:s;return`${l} hrs ${n} mins ${r} secs`}export{c};
