import{r as t,g as c,j as e,c as n,S as k}from"./index-C5nTu8Ee.js";c.registerPlugin(k);const v=n.section`
    position: relative;
    width: 100%;
    height: 130vh; /* Extended vertical space */
    min-height: 900px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    z-index: 5; /* Ensure it sits nicely in the stack */
`,w=n.video`
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: 0;
    filter: brightness(0.6) contrast(1.1); /* Darken for text readability */
    /* Parallax effect will be applied via GSAP to this element */
`,S=n.div`
    position: absolute;
    inset: 0;
    background: linear-gradient(
        to bottom,
        #000000 0%,
        rgba(0,0,0,0) 20%,
        rgba(0,0,0,0) 80%,
        #000000 100%
    ); /* Smooth fade to black at edges */
    z-index: 1;
`,j=n.div`
    position: relative;
    z-index: 2;
    text-align: center;
    max-width: 900px;
    padding: 0 20px;
    color: #fff;
`,T=n.h2`
    font-size: clamp(2.5rem, 6vw, 5rem);
    font-weight: 800;
    letter-spacing: -0.02em;
    line-height: 1.1;
    margin-bottom: 32px;
    opacity: 0;
    transform: translateY(30px);
    
    background: linear-gradient(to right, #ffffff 20%, #94a3b8 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    
    /* Ensure the span inherits the gradient or has its own color */
    span {
        background: linear-gradient(to right, #6366f1, #818cf8);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }
`,E=n.span`
    display: inline-block;
    width: 0.1em;
    height: 1em;
    background-color: #6366f1;
    margin-left: 0.1em;
    vertical-align: middle;
    animation: blink 1s step-end infinite;
    
    @keyframes blink {
        0%, 100% { opacity: 1; }
        50% { opacity: 0; }
    }
`,R=n.div`
    width: 2px;
    height: 100px;
    background: linear-gradient(to bottom, #6366f1, transparent);
    margin: 0 auto;
    opacity: 0;
    transform: scaleY(0);
    transform-origin: top;
`,z=()=>{const s=t.useRef(null),l=t.useRef(null),p=t.useRef(null),[r,b]=t.useState(""),[i,g]=t.useState(!1),[u,y]=t.useState(0),[f,h]=t.useState(150),d=["The Future.","Lasting Legacy.","Market Leaders.","Digital Dominance.","Global Impact."];return t.useEffect(()=>{const x=setTimeout(()=>{const a=u%d.length,o=d[a];b(i?o.substring(0,r.length-1):o.substring(0,r.length+1)),h(i?30:150),!i&&r===o?setTimeout(()=>g(!0),1500):i&&r===""&&(g(!1),y(u+1),h(500))},f);return()=>clearTimeout(x)},[r,i,u,f,d]),t.useEffect(()=>{const m=c.context(()=>{var a,o;l.current&&c.to(l.current,{yPercent:20,ease:"none",scale:1.1,scrollTrigger:{trigger:s.current,start:"top bottom",end:"bottom top",scrub:!0}}),c.timeline({scrollTrigger:{trigger:s.current,start:"top 60%",toggleActions:"play none none reverse"}}).to((a=p.current)==null?void 0:a.querySelector("h2"),{opacity:1,y:0,duration:1,ease:"power3.out"}).to((o=p.current)==null?void 0:o.querySelector(".decorator"),{opacity:1,scaleY:1,duration:1.2,ease:"power3.inOut"},"-=0.8")},s);return()=>m.revert()},[]),e.jsxs(v,{ref:s,children:[e.jsxs(w,{ref:l,autoPlay:!0,loop:!0,muted:!0,playsInline:!0,poster:"https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop",children:[e.jsx("source",{src:"https://cdn.pixabay.com/video/2019/02/10/21268-316279641_large.mp4",type:"video/mp4"}),"Your browser does not support the video tag."]}),e.jsx(S,{}),e.jsxs(j,{ref:p,children:[e.jsxs(T,{children:["We engineer ",e.jsx("br",{}),e.jsx("span",{children:r}),e.jsx(E,{})]}),e.jsx(R,{className:"decorator"})]})]})};export{z as default};
