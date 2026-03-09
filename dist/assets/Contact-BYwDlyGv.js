import{r as c,g as z,j as e,c as r}from"./index-C5nTu8Ee.js";const D=[{id:"social_ads",label:"Social & Ads",desc:"Organic + Paid Scaling"},{id:"web_dev",label:"Web Development",desc:"High-Performance Sites"},{id:"brand_design",label:"Brand Design",desc:"Identity & Systems"},{id:"seo_analytics",label:"SEO & Analytics",desc:"Ranking & Data"}],C=["0 - 500 €","500 - 1.000 €","1.000 - 2.500 €","2.500 - 5.000 €","5.000 - 10.000 €","10.000 - 25.000 €","25.000 - 50.000 €","50.000 € +"],F=i=>/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(i),W=i=>!i||i.trim()===""?!0:/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(i),G=r.div`
    position: fixed;
    top: 0; 
    left: 0;
    width: 100%; 
    height: 100vh;
    background: #000000; /* Pure Black */
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: ${i=>i.$isOpen?1:0};
    pointer-events: ${i=>i.$isOpen?"auto":"none"};
    transition: opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1);
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    color: #fff;
    overflow: hidden;
`,Y=r.div`
    position: relative;
    z-index: 100;
    width: 100%;
    /* max-width: 900px;  Removed to allow infinite input expansion */
    padding: 40px;
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    justify-content: center;
    overflow-y: auto;
    
    /* Ensure content is scrollable if it exceeds viewport */
    @media (max-height: 800px) {
        justify-content: flex-start;
        padding-top: 100px;
        padding-bottom: 50px;
    }

    @media (max-width: 768px) {
        padding: 20px;
        min-height: 80vh;
        justify-content: flex-start;
        padding-top: 100px; /* Increased to avoid CloseButton overlap */
        padding-bottom: 80px; /* Give room for mobile browser bottom bars */
    }
`,V=r.button`
    position: absolute;
    top: 40px;
    right: 40px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: rgba(255,255,255,0.1);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255,255,255,0.1);
    cursor: pointer;
    z-index: 200;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);

    svg {
        width: 20px;
        height: 20px;
        stroke: #fff;
        transition: transform 0.4s ease;
    }

    @media (hover: hover) {
        &:hover {
            transform: scale(1.1);
            background: #fff;
            svg {
                transform: rotate(90deg);
                stroke: #000;
            }
        }
    }

    @media (max-width: 768px) {
        top: 20px;
        right: 20px;
        width: 40px;
        height: 40px;
    }
`,O=r.div`
    position: absolute;
    top: 40px;
    left: 40px;
    width: 200px;
    height: 4px;
    background: rgba(255,255,255,0.1);
    border-radius: 2px;
    overflow: hidden;
    z-index: 200;

    @media (max-width: 768px) {
        width: 100px;
        left: 20px; 
        top: 30px;
    }
`,K=r.div`
    height: 100%;
    background: #fff;
    width: ${i=>i.$progress}%;
    transition: width 0.6s cubic-bezier(0.16, 1, 0.3, 1);
`,m=r.div`
    position: relative;
    width: 100%;
    /* Removed absolute positioning to allow natural flow & scrolling */
    margin: 0 auto;
    transform: none;
    top: auto;
    left: auto;
    will-change: transform, opacity;
    display: flex;
    flex-direction: column;
    align-items: center; 
    /* We align details/inputs to center too */
`,$=r.h1`
    font-size: clamp(3rem, 6vw, 5rem);
    font-weight: 800; // Inter Tight
    letter-spacing: -0.04em;
    line-height: 1.1;
    color: #fff;
    margin: 0 0 40px 0;
    text-align: center;
    
    span.highlight {
        color: #666;
        font-weight: 400;
        display: block;
        font-size: 0.6em;
        margin-top: 10px;
    }
`,b=r.h2`
    font-size: clamp(2rem, 4vw, 3rem);
    font-weight: 600;
    letter-spacing: -0.03em;
    color: #fff;
    margin-bottom: 40px;
    text-align: center;
    max-width: 800px;

    @media (max-width: 768px) {
        margin-bottom: 20px; /* Reduced for mobile */
    }
`,M=r.div`
    display: inline-grid;
    align-items: center;
    justify-items: center;
    position: relative;
    width: auto;
    max-width: none; /* Truly infinite expansion (clamped by maxLength) */
    min-width: 200px;
    margin-bottom: 30px;
    transition: width 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    
    @media (max-width: 768px) {
        margin-bottom: 15px;
    }

    &::after {
        content: attr(data-value);
        visibility: hidden;
        white-space: pre;
        font-size: clamp(1.2rem, 3vw, 2.5rem);
        font-weight: 500;
        padding: 20px 0;
        grid-area: 1 / 1;
        min-width: 200px;

        @media (max-width: 768px) {
            padding: 10px 0;
        }
    }
`,_=r.input`
    width: 100%;
    grid-area: 1 / 1;
    background: transparent;
    border: none;
    border-bottom: 2px solid rgba(255,255,255,0.1);
    font-size: clamp(1.2rem, 3vw, 2.5rem);
    font-weight: 500;
    color: #fff;
    padding: 20px 0;
    outline: none;
    transition: border-color 0.3s ease;
    text-align: center;
    border-radius: 0;

    @media (max-width: 768px) {
        padding: 10px 0;
    }

    /* Kill WebKit Autofill Yellow Background */
    &:-webkit-autofill,
    &:-webkit-autofill:hover, 
    &:-webkit-autofill:focus, 
    &:-webkit-autofill:active {
        -webkit-box-shadow: 0 0 0 30px black inset !important;
        -webkit-text-fill-color: white !important;
        transition: background-color 5000s ease-in-out 0s;
        caret-color: white; /* Keep cursor white */
    }

    &::placeholder {
        color: #444;
    }

    &:focus {
        border-color: #fff;
    }
`,w=({value:i,placeholder:p,...a})=>{const u=i||p||" ";return e.jsx(M,{"data-value":u,children:e.jsx(_,{value:i,placeholder:p,...a})})},H=r.div`
    display: inline-grid;
    align-items: center;
    justify-items: center;
    position: relative;
    width: auto;
    max-width: 90vw;
    min-width: 300px;
    margin-bottom: 40px;
    transition: width 0.2s cubic-bezier(0.16, 1, 0.3, 1), height 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    
    @media (max-width: 768px) {
        margin-bottom: 20px;
        min-width: 250px;
    }

    &::after {
        content: attr(data-value);
        visibility: hidden;
        white-space: pre-wrap;
        word-break: break-word;
        font-size: clamp(1.1rem, 2vw, 1.5rem);
        font-family: inherit;
        line-height: 1.4;
        padding: 20px 0;
        grid-area: 1 / 1;
        min-width: 300px;
        text-align: center;

        @media (max-width: 768px) {
            padding: 10px 0;
            min-width: 250px;
        }
    }
`,q=r.textarea`
    width: 100%;
    height: 100%;
    grid-area: 1 / 1;
    background: transparent;
    border: none;
    border-bottom: 2px solid rgba(255,255,255,0.1);
    font-size: clamp(1.1rem, 2vw, 1.5rem);
    font-family: inherit;
    line-height: 1.4;
    color: #fff;
    outline: none;
    resize: none;
    padding: 20px 0;
    transition: border-color 0.3s ease;
    text-align: center;
    border-radius: 0;
    overflow: hidden;

    @media (max-width: 768px) {
        padding: 10px 0;
    }

    /* Kill WebKit Autofill Yellow Background */
    &:-webkit-autofill,
    &:-webkit-autofill:hover, 
    &:-webkit-autofill:focus, 
    &:-webkit-autofill:active {
        -webkit-box-shadow: 0 0 0 30px black inset !important;
        -webkit-text-fill-color: white !important;
        transition: background-color 5000s ease-in-out 0s;
        caret-color: white; /* Keep cursor white */
    }

    &::placeholder {
        color: #444;
    }

    &:focus {
        border-color: #fff;
    }
`,U=({value:i,placeholder:p,...a})=>{const u=(i||p||" ")+`
`;return e.jsx(H,{"data-value":u,children:e.jsx(q,{value:i,placeholder:p,...a})})},g=r.button`
    background: #fff;
    color: #000;
    border: none;
    padding: 24px 60px;
    border-radius: 100px;
    font-size: 1.1rem;
    font-weight: 600;
    letter-spacing: -0.01em;
    cursor: ${i=>i.disabled?"not-allowed":"pointer"};
    position: relative;
    overflow: hidden;
    transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease, opacity 0.3s ease;
    margin-top: 20px;
    opacity: ${i=>i.disabled?.3:1};

    @media (hover: hover) {
        &:not(:disabled):hover {
            transform: scale(1.05);
            box-shadow: 0 0 30px rgba(255, 255, 255, 0.3);
        }
    }

    &:not(:disabled):active {
        transform: scale(0.95);
    }
`,v=r.button`
    background: transparent;
    color: #666;
    border: 1px solid rgba(255, 255, 255, 0.1);
    padding: 16px 32px;
    border-radius: 100px;
    font-size: 0.9rem;
    font-weight: 600;
    cursor: pointer;
    margin-top: 20px;
    transition: all 0.3s ease;

    @media (hover: hover) {
        &:hover {
            color: #fff;
            border-color: #fff;
        }
    }
`,y=r.div`
    display: flex;
    gap: 30px;
    align-items: center;
    justify-content: center;
    margin-top: 40px;
`,J=r.div`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
    width: 100%;
    max-width: 800px;

    @media(max-width: 600px) { 
        grid-template-columns: 1fr;
        gap: 15px; 
    }
`,Q=r.div`
    background: ${i=>i.$selected?"#fff":"rgba(255,255,255,0.05)"};
    color: ${i=>i.$selected?"#000":"#fff"};
    padding: 30px;
    border-radius: 24px;
    border: 1px solid ${i=>i.$selected?"#fff":"rgba(255,255,255,0.1)"};
    cursor: pointer;
    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    text-align: left;
    position: relative;
    overflow: hidden;
    
    @media (hover: hover) {
        &:hover {
            transform: translateY(-5px);
            background: ${i=>i.$selected?"#fff":"rgba(255,255,255,0.1)"};
            border-color: ${i=>i.$selected?"#fff":"rgba(255,255,255,0.3)"};
        }
    }

    h3 {
        margin: 0 0 5px 0;
        font-size: 1.25rem;
        font-weight: 700;
    }
    
    p {
        margin: 0;
        font-size: 0.9rem;
        opacity: ${i=>i.$selected?.8:.5};
    }

    @media (max-width: 768px) {
        padding: 20px;
    }
`,X=r.div`
    width: 100%;
    max-width: 600px;
    margin: 40px auto;
    text-align: center;
`,Z=r.div`
    font-size: clamp(2.5rem, 8vw, 4rem);
    font-weight: 800;
    color: #fff;
    margin-bottom: 20px;
    font-variant-numeric: tabular-nums;
    letter-spacing: -2px;
    white-space: nowrap; /* Prevent awkward wrapping logic if possible */
    
    @media (max-width: 768px) {
        letter-spacing: -1px;
    }
`,ee=r.input`
    -webkit-appearance: none;
    width: 100%;
    height: 6px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 3px;
    outline: none;
    
    &::-webkit-slider-thumb {
        -webkit-appearance: none;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        background: #fff;
        cursor: pointer;
        box-shadow: 0 0 20px rgba(255, 255, 255, 0.5);
        transition: transform 0.2s ease;
    }
    
    @media (hover: hover) {
        &::-webkit-slider-thumb:hover {
            transform: scale(1.2);
        }
    }
`,ie=({isOpen:i,onClose:p})=>{const[a,u]=c.useState("INTRO"),[n,d]=c.useState({name:"",company:"",email:"",website:"",businessName:"",industry:"",businessDesc:"",services:[],budget:2,details:""}),[I,T]=c.useState(!1),[B,k]=c.useState(null),L=c.useRef(null),N=c.useRef(null);c.useEffect(()=>{i||setTimeout(()=>{u("INTRO"),d({name:"",company:"",email:"",website:"",businessName:"",industry:"",businessDesc:"",services:[],budget:2,details:""})},600)},[i]),c.useEffect(()=>{if(!i||!N.current)return;const t=N.current,s=t.getContext("2d");if(!s)return;let x=t.width=window.innerWidth,h=t.height=window.innerHeight,f=0;const j=[{x:x*.2,y:h*.3,r:300,dx:.5,dy:.3,color:"rgba(50, 50, 60, 0.4)"},{x:x*.8,y:h*.7,r:400,dx:-.4,dy:-.4,color:"rgba(60, 50, 50, 0.4)"},{x:x*.5,y:h*.5,r:200,dx:.2,dy:-.2,color:"rgba(50, 60, 50, 0.4)"}];let S;const R=()=>{f+=.01,s.clearRect(0,0,x,h),j.forEach(o=>{o.x+=o.dx+Math.sin(f)*.5,o.y+=o.dy+Math.cos(f)*.5,(o.x<0||o.x>x)&&(o.dx*=-1),(o.y<0||o.y>h)&&(o.dy*=-1);const E=s.createRadialGradient(o.x,o.y,0,o.x,o.y,o.r);E.addColorStop(0,o.color),E.addColorStop(1,"rgba(255,255,255,0)"),s.fillStyle=E,s.beginPath(),s.arc(o.x,o.y,o.r,0,Math.PI*2),s.fill()}),S=requestAnimationFrame(R)};return R(),()=>cancelAnimationFrame(S)},[i]);const l=t=>{const s=document.getElementById(`step - ${a} `);s?z.to(s,{y:-50,opacity:0,duration:.4,ease:"power3.in",onComplete:()=>{u(t)}}):u(t)};c.useEffect(()=>{if(!i)return;const t=document.getElementById(`step - ${a} `);t&&z.fromTo(t,{y:50,opacity:0},{y:0,opacity:1,duration:.6,ease:"power3.out",delay:.1})},[a,i]);const A=t=>{d(s=>s.services.includes(t)?{...s,services:s.services.filter(x=>x!==t)}:{...s,services:[...s.services,t]})},P=c.useMemo(()=>{const t=["INTRO","IDENTITY","BUSINESS","SERVICES","BUDGET","DETAILS","SUCCESS"];return t.indexOf(a)/(t.length-1)*100},[a]);return e.jsxs(G,{$isOpen:i,ref:L,children:[e.jsx(V,{onClick:p,children:e.jsxs("svg",{viewBox:"0 0 24 24",fill:"none",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("line",{x1:"18",y1:"6",x2:"6",y2:"18"}),e.jsx("line",{x1:"6",y1:"6",x2:"18",y2:"18"})]})}),e.jsx(O,{children:e.jsx(K,{$progress:P})}),e.jsxs(Y,{children:[a==="INTRO"&&e.jsxs(m,{id:"step-INTRO",children:[e.jsxs($,{children:["Let's build",e.jsx("br",{}),"something legendary."]}),e.jsx(g,{onClick:()=>l("IDENTITY"),children:" Start the Journey "})]}),a==="IDENTITY"&&e.jsxs(m,{id:"step-IDENTITY",children:[e.jsx(b,{children:"First, introduce yourself."}),e.jsx(w,{placeholder:"Your Name",value:n.name,onChange:t=>d({...n,name:t.target.value}),autoFocus:!0,maxLength:50}),e.jsx(w,{placeholder:"Your Email",type:"email",value:n.email,onChange:t=>d({...n,email:t.target.value}),maxLength:100}),e.jsxs(y,{children:[e.jsx(v,{onClick:()=>l("INTRO"),children:"Back"}),e.jsx(g,{onClick:()=>l("BUSINESS"),disabled:n.name.trim().length<2||!F(n.email),children:"Next"})]})]}),a==="BUSINESS"&&e.jsxs(m,{id:"step-BUSINESS",children:[e.jsx(b,{children:"Tell us about your business."}),e.jsx(w,{placeholder:"Business Name",value:n.businessName,onChange:t=>d({...n,businessName:t.target.value}),autoFocus:!0,maxLength:100}),e.jsx(w,{placeholder:"Industry (e.g. E-commerce)",value:n.industry,onChange:t=>d({...n,industry:t.target.value}),maxLength:100}),e.jsx(w,{placeholder:"Website URL (e.g. pajzo.com)",value:n.website,onChange:t=>d({...n,website:t.target.value}),maxLength:100}),e.jsx(U,{placeholder:"Briefly describe what your business does...",value:n.businessDesc,onChange:t=>d({...n,businessDesc:t.target.value}),maxLength:500}),e.jsxs(y,{children:[e.jsx(v,{onClick:()=>l("IDENTITY"),children:"Back"}),e.jsx(g,{onClick:()=>l("SERVICES"),disabled:n.businessName.trim().length<2||n.industry.trim().length<2||!W(n.website),children:"Next"})]})]}),a==="SERVICES"&&e.jsxs(m,{id:"step-SERVICES",children:[e.jsx(b,{children:"How can we help?"}),e.jsx(J,{children:D.map(t=>e.jsxs(Q,{$selected:n.services.includes(t.id),onClick:()=>A(t.id),children:[e.jsx("h3",{children:t.label}),e.jsx("p",{children:t.desc})]},t.id))}),e.jsxs(y,{children:[e.jsx(v,{onClick:()=>l("BUSINESS"),children:"Back"}),e.jsx(g,{onClick:()=>l("BUDGET"),disabled:n.services.length===0,children:"Next"})]})]}),a==="BUDGET"&&e.jsxs(m,{id:"step-BUDGET",children:[e.jsx(b,{children:"Ballpark figures."}),e.jsxs(X,{children:[e.jsx(Z,{children:C[n.budget]}),e.jsx(ee,{type:"range",min:"0",max:C.length-1,step:"1",value:n.budget,onChange:t=>d({...n,budget:Number(t.target.value)})})]}),e.jsxs(y,{children:[e.jsx(v,{onClick:()=>l("SERVICES"),children:"Back"}),e.jsx(g,{onClick:()=>l("DETAILS"),children:"Next"})]})]}),a==="DETAILS"&&e.jsxs(m,{id:"step-DETAILS",children:[e.jsx(b,{children:"Tell us the details."}),e.jsx(U,{placeholder:"Describe your vision, timeline, and any specific requirements...",value:n.details,onChange:t=>d({...n,details:t.target.value}),autoFocus:!0,maxLength:2e3}),e.jsxs(y,{children:[e.jsx(v,{onClick:()=>l("BUDGET"),children:"Back"}),e.jsx(g,{onClick:async()=>{T(!0),k(null);try{const t=n.services.length>0?n.services.map(f=>{const j=D.find(S=>S.id===f);return`• ${j?j.label:f}`}).join(`
`):"None selected",s={name:n.name,email:n.email,company:n.businessName,website:n.website,industry:n.industry,businessDesc:n.businessDesc,services:t,budget:C[n.budget],message:n.details},h=await(await fetch("/api/send",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(s)})).json();h.success?l("SUCCESS"):(console.error("Resend API Error:",h.error),k("Failed to send message. Please try again later."))}catch(t){console.error("Fetch Error:",t),k(`Failed: ${t.message||"Unknown error"}`)}finally{T(!1)}},disabled:n.details.trim().length<10||I,children:I?"Sending...":"Submit Proposal"}),B&&e.jsx("p",{style:{color:"red",marginTop:"10px",fontSize:"0.9rem"},children:B})]})]}),a==="SUCCESS"&&e.jsxs(m,{id:"step-SUCCESS",children:[e.jsxs($,{children:["Sent.",e.jsx("span",{className:"highlight",children:"We'll be in touch shortly."})]}),e.jsx(g,{onClick:p,children:" Return to Site "})]})]})]})};export{ie as default};
