import{a as A,r as o,g as h,j as e,c as n,p as D,S as O}from"./index-C5nTu8Ee.js";var _=A();h.registerPlugin(O);const H=D`
  0% { box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.4); }
  70% { box-shadow: 0 0 0 20px rgba(99, 102, 241, 0); }
  100% { box-shadow: 0 0 0 0 rgba(99, 102, 241, 0); }
`,J=n.section`
    position: relative;
    padding-top: 80vh;
    padding-bottom: 80vh;
    width: 100%;
    background: #000000;
    display: flex;
    flex-direction: column;
    align-items: center;
    z-index: 10;
    overflow: hidden;
`,X=n.div`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 80%;
    height: 80%;
    background: radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, rgba(0,0,0,0) 70%);
    pointer-events: none;
    z-index: 1;
`,L=n.div`
    position: absolute;
    inset: 0;
    z-index: 0;
    opacity: 0.3;
    background-image: 
        linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
    background-size: 60px 60px;
`,U=n.div`
    position: relative;
    width: 90%;
    max-width: 1200px;
    z-index: 2;
`,y=n.div`
    position: relative;
    width: 100%;
    aspect-ratio: 16/9;
    background: rgba(255, 255, 255, 0.03);
    backdrop-filter: blur(10px);
    border-radius: 16px;
    overflow: hidden;
    border: 1px solid rgba(255, 255, 255, 0.1);
    cursor: pointer;
    transition: all 0.5s cubic-bezier(0.25, 0.8, 0.25, 1);
    box-shadow: 0 20px 50px -10px rgba(0,0,0,0.5);

    &:hover {
        transform: scale(1.02);
        border-color: rgba(99, 102, 241, 0.5);
        box-shadow: 0 0 30px rgba(99, 102, 241, 0.2);
    }
`,W=n.video`
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0.6;
    filter: grayscale(80%) contrast(1.2);
    transition: all 0.7s ease;

    ${y}:hover & {
        opacity: 0.8;
        filter: grayscale(0%) contrast(1.1);
        transform: scale(1.05);
    }
`,G=n.div`
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: radial-gradient(circle, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.6) 100%);
    transition: all 0.5s ease;
`,K=n.div`
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(8px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    margin-bottom: 24px;
    position: relative;
    box-shadow: 0 0 20px rgba(255,255,255,0.05);

    i {
        font-size: 2rem;
        color: #fff;
        margin-left: 6px; 
        text-shadow: 0 0 10px rgba(255,255,255,0.5);
    }

    &::after {
        content: '';
        position: absolute;
        inset: -2px;
        border-radius: 50%;
        border: 2px solid rgba(99, 102, 241, 0.5);
        opacity: 0;
        transition: opacity 0.3s ease;
    }

    ${y}:hover & {
        transform: scale(1.1);
        background: rgba(255, 255, 255, 0.2);
        border-color: rgba(99, 102, 241, 0.8);
        box-shadow: 0 0 30px rgba(99, 102, 241, 0.4);
        animation: ${H} 2s infinite;

        &::after {
            opacity: 1;
        }
    }
`,Q=n.div`
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.9rem;
    letter-spacing: 2px;
    color: #94a3b8;
    text-transform: uppercase;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 10px;

    span { 
        color: #fff; 
        font-weight: 700; 
        text-shadow: 0 0 10px rgba(255,255,255,0.3);
    }

    &::after {
        content: '_';
        animation: blink 1s step-end infinite;
    }
    @keyframes blink { 50% { opacity: 0; } }
`,z=n.div`
    position: fixed;
    inset: 0;
    z-index: 2147483647;
    background: rgba(0,0,0,0.95);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.5s ease;
    backdrop-filter: blur(20px);

    &.open {
        opacity: 1;
        pointer-events: auto;
    }
`,Z=n.div`
    width: 90vw;
    max-width: 1400px;
    display: flex;
    flex-direction: column;
    position: relative;
    background: transparent;
    transform: scale(0.95);
    transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);

    ${z}.open & {
        transform: scale(1);
    }
`,ee=n.div`
    width: 100%;
    aspect-ratio: 16/9;
    position: relative;
    background: #000;
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 20px 50px -10px rgba(0,0,0,0.5);
`,te=n.div`
    margin-top: 16px;
    width: 100%;
    padding: 16px 24px;
    background: rgba(25, 25, 25, 0.9);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.3);
`,T=n.div`
    width: 100%;
    height: 6px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 3px;
    cursor: pointer;
    position: relative;
    overflow: hidden;

    &:hover {
        background: rgba(255, 255, 255, 0.15);
    }
`,re=n.div`
    height: 100%;
    background: linear-gradient(90deg, #6366f1, #818cf8);
    border-radius: 3px;
    position: relative;
    box-shadow: 0 0 15px rgba(99, 102, 241, 0.6);
    width: 0%; /* Intial width */
    
    /* Head */
    &::after {
        content: '';
        position: absolute;
        right: -6px;
        top: 50%;
        transform: translateY(-50%);
        width: 12px;
        height: 12px;
        background: #fff;
        border-radius: 50%;
        box-shadow: 0 0 10px rgba(255,255,255,0.8);
        opacity: 0;
        transition: opacity 0.2s;
    }

    ${T}:hover &::after {
        opacity: 1;
    }
`,ne=n.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: #fff;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.9rem;
`,oe=n.div`
    display: flex;
    align-items: center;
    gap: 20px;
`,ie=n.div`
    display: flex;
    align-items: center;
    gap: 20px;
`,m=n.button`
    background: none;
    border: none;
    color: rgba(255,255,255,0.7);
    cursor: pointer;
    font-size: 1.1rem;
    padding: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
    border-radius: 6px;

    /* Highlight Active/Hover */
    &:hover {
        color: #fff;
        background: rgba(255,255,255,0.05);
        transform: translateY(-1px);
    }
    
    &:active {
        transform: translateY(0);
    }
`,se=n.div`
    display: flex;
    align-items: center;
    gap: 12px;
    position: relative;

    &:hover .volume-slider {
        width: 80px;
        opacity: 1;
        margin-left: 0px;
    }
`,ae=n.input`
    width: 0;
    opacity: 0;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    cursor: pointer;
    height: 4px;
    appearance: none;
    background: rgba(255,255,255,0.2);
    border-radius: 2px;
    
    &::-webkit-slider-thumb {
        appearance: none;
        width: 10px;
        height: 10px;
        background: #fff;
        border-radius: 50%;
        margin-top: -3px; /* Center thumb */
    }

    &::-webkit-slider-runnable-track {
        height: 4px;
        border-radius: 2px;
    }
`,ce=n.div`
    color: rgba(255,255,255,0.4);
    font-size: 0.8rem;
    letter-spacing: 1px;
    font-variant-numeric: tabular-nums;
    font-weight: 500;
    
    span { color: #fff; }
`,le=n.button`
    position: absolute;
    top: -50px;
    right: 0;
    background: none;
    border: none;
    color: white;
    font-size: 0.9rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 10px;
    opacity: 0.6;
    transition: opacity 0.3s ease;
    font-family: 'JetBrains Mono', monospace;
    letter-spacing: 2px;
    text-transform: uppercase;
    z-index: 2147483647;

    &:hover {
        opacity: 1;
        color: #6366f1;
    }
`,R=s=>{if(isNaN(s))return"00:00";const p=Math.floor(s/60),c=Math.floor(s%60);return`${p.toString().padStart(2,"0")}:${c.toString().padStart(2,"0")}`},ue=()=>{const[s,p]=o.useState(!1),c=o.useRef(null),v=o.useRef(null),t=o.useRef(null),l=o.useRef(null),[x,d]=o.useState(!1),[P,M]=o.useState(0),[$,B]=o.useState(0),[F,u]=o.useState(1),[w,g]=o.useState(!1),a=o.useRef(null),k=o.useRef(0);o.useEffect(()=>{const r=h.context(()=>{h.fromTo(v.current,{y:50,opacity:0,scale:.95,filter:"blur(10px)"},{y:0,opacity:1,scale:1,filter:"blur(0px)",duration:1.2,ease:"power3.out",scrollTrigger:{trigger:c.current,start:"top 70%"}})},c);return()=>r.revert()},[]),o.useEffect(()=>{const r=document.body;if(r)if(s)k.current=window.scrollY,r.style.position="fixed",r.style.top=`-${k.current}px`,r.style.width="100%",r.style.overflowY="scroll";else{const i=r.style.top;r.style.position="",r.style.top="",r.style.width="",r.style.overflowY="",window.scrollTo(0,parseInt(i||"0")*-1)}},[s]);const b=o.useCallback(()=>{if(!t.current||!l.current)return;const r=t.current.currentTime,i=t.current.duration;if(i>0){const f=r/i*100;l.current.style.width=`${f}%`}!t.current.paused&&!t.current.ended&&(a.current=requestAnimationFrame(b))},[]);o.useEffect(()=>(x?a.current=requestAnimationFrame(b):a.current&&cancelAnimationFrame(a.current),()=>{a.current&&cancelAnimationFrame(a.current)}),[x,b]);const j=o.useCallback(()=>{t.current&&(t.current.paused?(t.current.play().catch(console.error),d(!0)):(t.current.pause(),d(!1)))},[]),E=()=>{t.current&&(M(t.current.currentTime),B(t.current.duration))},N=r=>{if(!t.current)return;const f=r.currentTarget.getBoundingClientRect(),S=(r.clientX-f.left)/f.width;t.current.currentTime=S*t.current.duration,l.current&&(l.current.style.width=`${S*100}%`)},V=r=>{const i=parseFloat(r.target.value);u(i),t.current&&(t.current.volume=i,t.current.muted=i===0,g(i===0))},Y=()=>{if(!t.current)return;const r=!w;g(r),t.current.muted=r,u(r?0:1)},I=()=>{var r;t.current&&(document.fullscreenElement?document.exitFullscreen():(r=t.current.parentElement)==null||r.requestFullscreen())},q=()=>{p(!0),setTimeout(()=>{t.current&&(t.current.currentTime=0,t.current.muted=!1,u(1),g(!1),t.current.play().catch(console.error),d(!0))},100)},C=()=>{p(!1),d(!1),t.current&&t.current.pause()};return e.jsxs(J,{ref:c,id:"presentation",children:[e.jsx(L,{}),e.jsx(X,{}),e.jsx(U,{children:e.jsxs(y,{ref:v,onClick:q,children:[e.jsx(W,{src:"https://assets.mixkit.co/videos/preview/mixkit-white-abstract-technology-network-background-2775-large.mp4",autoPlay:!0,muted:!0,loop:!0,playsInline:!0}),e.jsxs(G,{children:[e.jsx(K,{children:e.jsx("i",{className:"fas fa-play"})}),e.jsxs(Q,{children:[e.jsx("span",{children:"Mission Briefing"})," // v2.0"]})]})]})}),typeof document<"u"&&document.body&&_.createPortal(e.jsx(z,{className:s?"open":"",onClick:C,children:e.jsxs(Z,{onClick:r=>r.stopPropagation(),children:[e.jsxs(le,{onClick:C,children:["Close Briefing ",e.jsx("i",{className:"fas fa-times"})]}),e.jsx(ee,{children:e.jsx("video",{ref:t,src:"https://videos.pexels.com/video-files/3129671/3129671-uhd_2560_1440_30fps.mp4",style:{width:"100%",height:"100%",objectFit:"contain",display:"block"},playsInline:!0,onClick:j,onTimeUpdate:E,onEnded:()=>{d(!1)}})}),e.jsxs(te,{children:[e.jsx(T,{onClick:N,children:e.jsx(re,{ref:l})}),e.jsxs(ne,{children:[e.jsxs(oe,{children:[e.jsx(m,{onClick:j,children:e.jsx("i",{className:`fas fa-${x?"pause":"play"}`})}),e.jsxs(se,{children:[e.jsx(m,{onClick:Y,children:e.jsx("i",{className:`fas fa-volume-${w?"mute":"up"}`})}),e.jsx(ae,{className:"volume-slider",type:"range",min:"0",max:"1",step:"0.1",value:F,onChange:V})]}),e.jsxs(ce,{children:[e.jsx("span",{children:R(P)})," / ",R($)]})]}),e.jsx(ie,{children:e.jsx(m,{onClick:I,children:e.jsx("i",{className:"fas fa-expand"})})})]})]})]})}),document.body)]})};export{ue as default};
