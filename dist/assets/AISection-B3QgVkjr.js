import{r as l,j as e,R as M,g as T,c as o,p as F,S as z}from"./index-BT_7v_Bk.js";function L(){const[m,d]=l.useState([]),[b,h]=l.useState(!1),[u,i]=l.useState(""),r=l.useRef(""),n=l.useRef(0),y=l.useRef(!1);l.useEffect(()=>{let p;const x=()=>{const k=r.current.length,t=n.current;if(t<k){const s=k-t,f=Math.max(1,Math.min(s,Math.ceil(s/8)));n.current+=f,i(r.current.slice(0,n.current))}p=requestAnimationFrame(x)};return p=requestAnimationFrame(x),()=>{p&&cancelAnimationFrame(p)}},[]);const v=l.useCallback(async(p,x)=>{var j,I;if(y.current)return;y.current=!0,h(!0),r.current="",n.current=0,i("");let k=p;const t=/(https?:\/\/[^\s]+)/g,s=p.match(t);if(s&&s.length>0){const c=s[0];try{await fetch(`http://localhost:3001/api/scrape?url=${encodeURIComponent(c)}`)}catch{console.error("Scraper integration currently disabled on Claude Proxy")}}const f={role:"user",content:k},_={role:"user",content:p};x&&x.length>0&&(f.images=x,_.images=x);const A=[...m,f];d([...m,_]);try{const c=await fetch("/api/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({messages:A.map(g=>{if(g.images&&g.images.length>0){const R=g.images.map(B=>{let N="image/jpeg";return B.startsWith("iVBORw0KGgo")?N="image/png":B.startsWith("UklGR")?N="image/webp":B.startsWith("R0lGOD")&&(N="image/gif"),{type:"image",source:{type:"base64",media_type:N,data:B}}});return R.push({type:"text",text:g.content}),{role:g.role,content:R}}return{role:g.role,content:g.content}}),stream:!0})});if(!c.ok){const g=await c.text().catch(()=>"unknown error");throw new Error(`Server error ${c.status}: ${g.slice(0,200)}`)}const w=(j=c.body)==null?void 0:j.getReader();if(!w)throw new Error("No reader available");const S=new TextDecoder("utf-8");for(;;){const{done:g,value:R}=await w.read();if(g)break;const N=S.decode(R,{stream:!0}).split(`
`);for(const W of N){if(W.trim()==="data: [DONE]")break;if(W.startsWith("data: ")){const E=W.replace("data: ","").trim();if(E)try{const P=JSON.parse(E);(I=P.message)!=null&&I.content&&(r.current+=P.message.content)}catch(P){console.error("Error parsing SSE chunk:",P)}}}}await new Promise(g=>{const R=setInterval(()=>{n.current>=r.current.length&&(clearInterval(R),g())},50)});const D=r.current;d(g=>[...g,{role:"assistant",content:D}])}catch(c){console.error("Error with Claude API generation:",c);const w=c instanceof Error?c.message:"Unknown error";d(S=>[...S,{role:"assistant",content:`Connection error: ${w}`}])}finally{r.current="",n.current=0,i(""),h(!1),y.current=!1}},[m]);return{messages:m,isLoading:b,streamingMessage:u,sendMessage:v}}const $="_chatBox_1yf1o_1",O="_emptyState_1yf1o_33",U="_emptyIcon_1yf1o_52",J="_messageWrapper_1yf1o_78",H="_user_1yf1o_98",G="_assistant_1yf1o_102",K="_avatar_1yf1o_107",Z="_messageContent_1yf1o_129",V="_sentImage_1yf1o_154",X="_cursor_1yf1o_163",q="_typingIndicator_1yf1o_187",Y="_dot_1yf1o_195",a={chatBox:$,emptyState:O,emptyIcon:U,messageWrapper:J,user:H,assistant:G,avatar:K,messageContent:Z,sentImage:V,cursor:X,typingIndicator:q,dot:Y};function Q({messages:m,streamingMessage:d,isLoading:b}){const h=l.useRef(null);l.useEffect(()=>{h.current&&h.current.scrollTo({top:h.current.scrollHeight,behavior:"smooth"})},[m,d]);const u=i=>i.split(`
`).map((r,n,y)=>{const v=[];let p=r,x=0;const k=new RegExp("(\\*\\*(.+?)\\*\\*|\\*(?!\\*)(.+?)(?<!\\*)\\*|`(.+?)`)","g");let t=0,s;for(;(s=k.exec(p))!==null;)s.index>t&&v.push(p.slice(t,s.index)),s[0].startsWith("**")?v.push(e.jsx("strong",{style:{fontWeight:700,color:"#fff"},children:s[2]},x++)):s[0].startsWith("`")?v.push(e.jsx("code",{style:{background:"rgba(255,255,255,0.1)",padding:"2px 6px",borderRadius:"4px",fontSize:"0.85em",fontFamily:"monospace"},children:s[4]},x++)):v.push(e.jsx("em",{children:s[3]},x++)),t=s.index+s[0].length;return t<p.length&&v.push(p.slice(t)),e.jsxs(M.Fragment,{children:[v.length>0?v:r,n!==y.length-1&&e.jsx("br",{})]},n)});return e.jsxs("div",{className:a.chatBox,ref:h,children:[m.length===0&&!b&&e.jsxs("div",{className:a.emptyState,children:[e.jsx("div",{className:a.emptyIcon,children:e.jsxs("svg",{width:"48",height:"48",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("rect",{x:"2",y:"3",width:"20",height:"14",rx:"2",ry:"2"}),e.jsx("line",{x1:"8",y1:"21",x2:"16",y2:"21"}),e.jsx("line",{x1:"12",y1:"17",x2:"12",y2:"21"})]})}),e.jsx("h2",{children:"PAJZO INTELLIGENCE"}),e.jsx("p",{children:"Advanced enterprise processing active."})]}),m.map((i,r)=>e.jsxs("div",{className:`${a.messageWrapper} ${i.role==="user"?a.user:a.assistant}`,children:[i.role==="assistant"&&e.jsx("div",{className:a.avatar,children:e.jsx("img",{src:"/hero.svg",alt:"Pajzo"})}),e.jsxs("div",{className:a.messageContent,children:[i.images&&i.images.map((n,y)=>e.jsx("img",{src:`data:image/jpeg;base64,${n}`,alt:"User upload",className:a.sentImage},y)),u(i.content)]})]},r)),d&&e.jsxs("div",{className:`${a.messageWrapper} ${a.assistant}`,children:[e.jsx("div",{className:a.avatar,children:e.jsx("img",{src:"/hero.svg",alt:"Pajzo"})}),e.jsxs("div",{className:a.messageContent,children:[u(d),e.jsx("span",{className:a.cursor})]})]}),b&&!d&&e.jsxs("div",{className:`${a.messageWrapper} ${a.assistant}`,children:[e.jsx("div",{className:a.avatar,children:e.jsx("img",{src:"/hero.svg",alt:"Pajzo"})}),e.jsx("div",{className:a.messageContent,children:e.jsxs("div",{className:a.typingIndicator,children:[e.jsx("div",{className:a.dot}),e.jsx("div",{className:a.dot}),e.jsx("div",{className:a.dot})]})})]})]})}const ee="_inputForm_27oue_1",te="_inputWrapper_27oue_8",se="_imagePreviewContainer_27oue_24",re="_imagePreview_27oue_24",ne="_removeImageBtn_27oue_44",ae="_textarea_27oue_66",oe="_actionBtn_27oue_98",ie="_sendButton_27oue_125",C={inputForm:ee,inputWrapper:te,imagePreviewContainer:se,imagePreview:re,removeImageBtn:ne,textarea:ae,actionBtn:oe,sendButton:ie};function ce({onSend:m,disabled:d}){const[b,h]=l.useState(""),[u,i]=l.useState(null),r=l.useRef(null),n=l.useRef(null);l.useEffect(()=>{r.current&&(r.current.style.height="auto",r.current.style.height=`${Math.max(24,Math.min(r.current.scrollHeight,120))}px`)},[b]);const y=t=>{var _;const s=(_=t.target.files)==null?void 0:_[0];if(!s)return;const f=new FileReader;f.onloadend=()=>{const j=f.result.split(",")[1];i(j)},f.readAsDataURL(s)},v=()=>{i(null),n.current&&(n.current.value="")},p=t=>{t==null||t.preventDefault(),(b.trim().length>0||u)&&!d&&(m(b.trim()||"Describe this image.",u?[u]:void 0),h(""),i(null),n.current&&(n.current.value=""),r.current&&(r.current.style.height="auto"))},x=t=>{t.key==="Enter"&&!t.shiftKey&&(t.preventDefault(),p())},k=async t=>{var _,A;const s=(_=t.clipboardData)==null?void 0:_.items;if(s){for(let j=0;j<s.length;j++)if(s[j].type.indexOf("image")!==-1){const I=s[j].getAsFile();if(I){t.preventDefault();const c=new FileReader;c.onloadend=()=>{const S=c.result.split(",")[1];i(S)},c.readAsDataURL(I);return}}}const f=(A=t.clipboardData)==null?void 0:A.getData("text");if(f&&/\.(jpeg|jpg|gif|png|webp)(\?.*)?$/i.test(f)&&f.startsWith("http")){t.preventDefault();try{const c=await(await fetch(f)).blob();if(c.type.startsWith("image/")){const w=new FileReader;w.onloadend=()=>{const D=w.result.split(",")[1];i(D)},w.readAsDataURL(c)}}catch(I){console.error("Failed to auto-fetch pasted image URL:",I),h(c=>c+f)}}};return e.jsxs("form",{className:C.inputForm,onSubmit:p,children:[u&&e.jsxs("div",{className:C.imagePreviewContainer,children:[e.jsx("img",{src:`data:image/jpeg;base64,${u}`,alt:"Upload preview",className:C.imagePreview}),e.jsx("button",{type:"button",onClick:v,className:C.removeImageBtn,children:"✕"})]}),e.jsxs("div",{className:C.inputWrapper,children:[e.jsx("input",{type:"file",accept:"image/png, image/jpeg, image/jpg, image/webp",ref:n,onChange:y,style:{display:"none"}}),e.jsx("button",{type:"button",className:C.actionBtn,onClick:()=>{var t;return(t=n.current)==null?void 0:t.click()},disabled:d,title:"Attach image","aria-label":"Attach image",children:e.jsx("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:e.jsx("path",{d:"M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"})})}),e.jsx("textarea",{ref:r,className:C.textarea,placeholder:"Message Pajzo AI...",value:b,onChange:t=>h(t.target.value),onKeyDown:x,onPaste:k,disabled:d,rows:1}),e.jsx("button",{type:"submit",className:C.sendButton,disabled:!b.trim()&&!u||d,"aria-label":"Send message",children:e.jsxs("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("line",{x1:"22",y1:"2",x2:"11",y2:"13"}),e.jsx("polygon",{points:"22 2 15 22 11 13 2 9 22 2"})]})})]})]})}T.registerPlugin(z);const le=F`
    0%, 100% { opacity: 1; transform: scale(1); }
    50%       { opacity: 0.5; transform: scale(0.88); }
`,de=F`
    0%   { transform: translateX(-100%); }
    100% { transform: translateX(400%); }
`,pe=o.section`
    position: relative;
    /* Blend seamlessly with TechStack (above) and Partners (below) */
    background-color: #ffffff; 
    padding: 160px 24px;
    
    @media (max-width: 768px) {
        padding: 80px 16px;
    }
`,ge=o.div`
    position: relative;
    max-width: 1360px; /* Huge Bento Card */
    margin: 0 auto;
    border-radius: 48px;
    overflow: hidden;
    padding: 100px 80px;
    
    /* Stealth Dark Mode AI Card */
    background-color: #08080a; 
    border: 1px solid rgba(255, 255, 255, 0.05);

    /* Subtle orange ambient glow at the top for powerful AI vibe */
    background-image: radial-gradient(circle at 50% 0%, rgba(255, 68, 0, 0.15) 0%, transparent 60%);
        
    /* Deep beautiful shadow to detach the dark card from the white background */
    box-shadow: 
        0 40px 100px rgba(0, 0, 0, 0.15),
        0 10px 40px rgba(255, 68, 0, 0.08); /* Ambient edge reflection */

    @media (max-width: 1024px) {
        padding: 60px 40px;
        border-radius: 32px;
    }

    @media (max-width: 768px) {
        padding: 48px 24px;
        border-radius: 24px;
    }
`,ue=o.div`
    position: absolute;
    inset: 0;
    background-image: radial-gradient(rgba(255,255,255,0.12) 1px, transparent 0);
    background-size: 40px 40px;
    background-position: -19px -19px;
    pointer-events: none;
    z-index: 0;
`,fe=o.div`
    position: relative;
    z-index: 1;
    width: 100%;
`,he=o.div`
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 40px;
    margin-bottom: 72px;

    @media (max-width: 860px) {
        flex-direction: column;
        align-items: flex-start;
        margin-bottom: 48px;
    }
`,xe=o.div``,me=o.p`
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 4px;
    color: #ff4400;
    background: #ffffff;
    padding: 6px 14px;
    border-radius: 6px;
    display: inline-block;
    margin: 0 0 24px 0;
    box-shadow: 0 4px 12px rgba(0,0,0,0.08); /* Crisp tag */
`,be=o.h2`
    font-size: clamp(3rem, 6.5vw, 5.5rem);
    font-weight: 900;
    letter-spacing: -0.04em;
    line-height: 1.18;
    padding-bottom: 0.18em; /* Prevents descenders like 'g' from clipping */
    color: #ffffff;
    margin: 0;

    em {
        font-style: normal;
        background: linear-gradient(135deg, #ffffff, #888888);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        font-weight: 400;
        display: block;
    }
`,ye=o.p`
    font-size: 1.15rem;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.9);
    line-height: 1.6;
    max-width: 400px;
    margin: 0;

    @media (max-width: 860px) {
        max-width: 100%;
    }
`,ve=o.div`
    display: grid;
    grid-template-columns: 380px 1fr;
    gap: 40px;
    align-items: start;

    @media (max-width: 960px) {
        grid-template-columns: 1fr;
        gap: 32px;
    }
`,je=o.div`
    display: flex;
    flex-direction: column;
    gap: 2px;
`,we=o.div`
    padding: 24px 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.15);
    display: flex;
    align-items: flex-start;
    gap: 24px;
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);

    &:first-child {
        border-top: 1px solid rgba(255, 255, 255, 0.15);
    }

    @media (hover: hover) {
        &:hover { 
            transform: translateX(12px);
            
            /* Add subtle highlight indication */
            h4 {
                color: #ff4400;
            }
        }
    }
`,ke=o.span`
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    color: rgba(255, 255, 255, 0.6);
    letter-spacing: 2px;
    padding-top: 4px;
    flex-shrink: 0;
`,_e=o.div`
    h4 {
        font-size: 1.2rem;
        font-weight: 700;
        color: #ffffff;
        margin: 0 0 8px 0;
        letter-spacing: -0.01em;
        transition: color 0.3s ease;
    }
    p {
        font-size: 1rem;
        color: rgba(255, 255, 255, 0.5);
        margin: 0;
        line-height: 1.6;
        font-weight: 400;
    }
`,Ie=o.div`
    /* Dark Frosted Glass Effect - completely removing heavy GPU back-drop blur for max performance */
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 20px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    height: 520px;
    box-shadow:
        0 40px 100px -20px rgba(0,0,0,0.6),
        inset 0 1px 1px rgba(255,255,255,0.05); /* Subtle rim light reflection */
`,Ce=o.div`
    height: 3px;
    background: linear-gradient(90deg, #ff4400, #ff8800);
    flex-shrink: 0;
`,Se=o.div`
    padding: 16px 20px;
    border-bottom: 1px solid rgba(255,255,255,0.06);
    display: flex;
    align-items: center;
    gap: 10px;
    flex-shrink: 0;
`,Re=o.div`
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #ff4400;
    box-shadow: 0 0 6px #ff4400;
    animation: ${le} 2.2s ease-in-out infinite;
    flex-shrink: 0;
`,Ne=o.div`
    h3 {
        font-size: 0.82rem;
        font-weight: 700;
        color: #fff;
        margin: 0;
        letter-spacing: 0.03em;
    }
    span {
        font-family: 'JetBrains Mono', monospace;
        font-size: 0.62rem;
        color: rgba(255,68,0,0.7);
        letter-spacing: 0.06em;
    }
`,Ae=o.div`
    position: absolute;
    inset: 0;
    pointer-events: none;
    overflow: hidden;
    border-radius: 16px;
    z-index: 2;

    &::after {
        content: '';
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        height: 40%;
        background: linear-gradient(transparent, rgba(255,68,0,0.012), transparent);
        animation: ${de} 8s linear infinite;
    }
`,Be=o.div`
    flex: 1;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    position: relative;
`,Pe=o.div`
    flex-shrink: 0;
    padding: 20px 24px 24px; /* Suspends the input securely inside the panel */
`,Te=[{title:"Context-Aware",desc:"Trained on PAJZO services and capabilities to give instant, relevant answers."},{title:"Real-Time Streaming",desc:"Token-by-token responses. No spinners. No waiting. Pure instant output."},{title:"Vision & Multimodal",desc:"Attach images or paste screenshots — the AI reads and understands visuals."}];function We(){const{messages:m,isLoading:d,streamingMessage:b,sendMessage:h}=L(),u=l.useRef(null),i=l.useRef(null),r=l.useRef(null);return l.useEffect(()=>{const n=T.context(()=>{T.fromTo(i.current,{y:30,opacity:0},{y:0,opacity:1,duration:.8,ease:"power3.out",scrollTrigger:{trigger:i.current,start:"top 82%",once:!0}}),T.fromTo(r.current,{y:50,opacity:0},{y:0,opacity:1,duration:.9,ease:"power3.out",delay:.12,scrollTrigger:{trigger:r.current,start:"top 82%",once:!0}})},u);return()=>{n.revert()}},[]),e.jsx(pe,{ref:u,id:"ai-section",children:e.jsxs(ge,{children:[e.jsx(ue,{}),e.jsxs(fe,{children:[e.jsxs(he,{ref:i,children:[e.jsxs(xe,{children:[e.jsx(me,{children:"// AI Integration"}),e.jsxs(be,{children:["Built-in ",e.jsx("span",{style:{color:"#ff4400"},children:"AI."}),e.jsx("br",{}),e.jsx("em",{children:"Real intelligence."})]})]}),e.jsx(ye,{children:"Every PAJZO project ships with intelligent infrastructure. Our AI understands your brand, your stack, and your goals — from day one."})]}),e.jsxs(ve,{ref:r,children:[e.jsx(je,{children:Te.map((n,y)=>e.jsxs(we,{children:[e.jsxs(ke,{children:["0",y+1]}),e.jsxs(_e,{children:[e.jsx("h4",{children:n.title}),e.jsx("p",{children:n.desc})]})]},y))}),e.jsxs(Ie,{style:{position:"relative"},children:[e.jsx(Ce,{}),e.jsx(Ae,{}),e.jsxs(Se,{children:[e.jsx(Re,{}),e.jsx("img",{src:"/hero.svg",alt:"PAJZO",style:{width:24,height:24,borderRadius:5,filter:"brightness(0) invert(1)"}}),e.jsxs(Ne,{children:[e.jsx("h3",{children:"PAJZO AI"}),e.jsx("span",{children:"LIVE DEMO — ASK ANYTHING"})]})]}),e.jsx(Be,{children:e.jsx(Q,{messages:m,streamingMessage:b,isLoading:d})}),e.jsx(Pe,{children:e.jsx(ce,{onSend:h,disabled:d})})]})]})]})]})})}export{We as default};
