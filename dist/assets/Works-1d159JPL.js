import{r as s,g as a,S as p,j as e,c as t}from"./index-C5nTu8Ee.js";a.registerPlugin(p);const f=t.section`
    background: #ffffff;
    /* We don't pad top/bottom heavily because ScrollTrigger pinning handles spacing naturally */
    position: relative;
    overflow: hidden;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
`,h=t.div`
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    overflow: hidden;

    @media (max-width: 768px) {
        height: auto;
        padding-top: 100px;
        padding-bottom: 100px;
        overflow: visible;
    }
`,g=t.div`
    padding: 0 5vw;
    margin-bottom: 60px;
    z-index: 10;
    
    h2 {
        font-size: clamp(3rem, 6vw, 5rem);
        font-weight: 700;
        color: #1d1d1f;
        letter-spacing: -0.04em;
        line-height: 1.05;
        margin: 0;

        span {
            color: #86868b;
        }
    }
`,m=t.div`
    display: flex;
    gap: 40px;
    padding: 0 5vw;
    /* Extra padding on the right so the last card doesn't touch the edge of the screen */
    padding-right: 30vw; 
    width: max-content;
    will-change: transform;

    @media (max-width: 768px) {
        width: 100%;
        padding-right: 5vw; /* Normal padding */
        overflow-x: auto;
        scroll-snap-type: x mandatory;
        gap: 20px;
        -webkit-overflow-scrolling: touch;
        /* Hide scrollbar for a cleaner look */
        &::-webkit-scrollbar {
            display: none;
        }
        scrollbar-width: none;
    }
`,u=t.div`
    width: 600px;
    height: 480px;
    background: #fdfdfd;
    border-radius: 36px;
    border: 1px solid rgba(0, 0, 0, 0.05);
    padding: 40px;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    position: relative;
    overflow: hidden;
    cursor: pointer;
    
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.02);
    transition: all 0.5s cubic-bezier(0.25, 1, 0.5, 1);

    @media (max-width: 768px) {
        width: 85vw; /* On mobile, take up most of width */
        height: 60vh;
        border-radius: 24px;
        padding: 30px;
        scroll-snap-align: center;
        flex-shrink: 0;
    }

    &:hover {
        box-shadow: 0 30px 60px rgba(0, 0, 0, 0.12), 0 10px 20px rgba(0, 0, 0, 0.08);
        border-color: rgba(0, 0, 0, 0.08);
        transform: translateY(-10px);

        .mock-image {
            transform: scale(1.05);
        }

        .project-arrow {
            transform: translate(5px, -5px);
            color: #1d1d1f;
        }
    }
`,b=t.div`
    position: absolute;
    top: 5%;
    left: 5%;
    right: 5%;
    bottom: 35%; /* Leave room for text */
    background: linear-gradient(135deg, #f5f5f7 0%, #e8e8ed 100%);
    border-radius: 24px;
    overflow: hidden;
    z-index: 1;

    /* A subtle inner shadow to make it feel inset */
    box-shadow: inset 0 2px 10px rgba(0,0,0,0.03);
`,c=t.div`
    position: absolute;
    background: ${o=>o.$color};
    border-radius: 50%;
    filter: blur(40px);
    opacity: 0.5;
    animation: floatShape 10s ease-in-out infinite alternate;
    animation-delay: ${o=>o.$delay}s;

    @keyframes floatShape {
        0% { transform: translate(0, 0) scale(1); }
        100% { transform: translate(30px, 30px) scale(1.2); }
    }
`,w=t.div`
    position: relative;
    z-index: 2;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
`,v=t.div`
    h3 {
        font-size: 2rem;
        font-weight: 700;
        color: #1d1d1f;
        margin: 0 0 10px 0;
        letter-spacing: -0.03em;
    }

    p {
        font-size: 1.1rem;
        color: #86868b;
        margin: 0;
        font-weight: 400;
    }

    @media (max-width: 768px) {
        h3 { font-size: 1.5rem; }
        p { font-size: 1rem; }
    }
`,y=t.div`
    display: flex;
    gap: 8px;
    margin-bottom: 20px;

    span {
        font-size: 0.75rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: #4a4a4f;
        background: #f5f5f7;
        padding: 6px 14px;
        border-radius: 100px;
    }
`,k=t.div`
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: #f5f5f7;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;

    i {
        font-size: 1.2rem;
        color: #86868b;
        transition: all 0.3s ease;
    }
`,j=[{title:"Lumina Engine",client:"Fintech Enterprise",tags:["React","Blockchain","UI API"],colors:["#6366f1","#a855f7"]},{title:"Aura Commerce",client:"Luxury Retailer",tags:["Shopify Plus","Next.js","ThreeJS"],colors:["#ec4899","#f43f5e"]},{title:"Nexus Dashboard",client:"SaaS Analytics",tags:["Vue","Node","Real-time"],colors:["#14b8a6","#3b82f6"]},{title:"Equinox Protocol",client:"Defi Startup",tags:["Web3","Solidity","Design System"],colors:["#f59e0b","#ef4444"]}],R=()=>{const o=s.useRef(null),l=s.useRef(null);return s.useEffect(()=>{let i=a.context(()=>{const r=l.current;if(!r)return;a.matchMedia().add("(min-width: 769px)",()=>{const n=()=>-(r.scrollWidth-window.innerWidth),x=a.to(r,{x:n,ease:"none"});p.create({trigger:o.current,start:"top top",end:()=>`+=${n()*-1}`,pin:!0,animation:x,scrub:1,invalidateOnRefresh:!0})})},o);return()=>i.revert()},[]),e.jsx(f,{id:"work",ref:o,children:e.jsxs(h,{children:[e.jsx(g,{children:e.jsxs("h2",{children:["Selected ",e.jsx("span",{children:"Works."})]})}),e.jsx(m,{ref:l,children:j.map((i,r)=>e.jsxs(u,{children:[e.jsxs(b,{className:"mock-image",children:[e.jsx(c,{$color:i.colors[0],$delay:0,style:{width:"150px",height:"150px",top:"10%",left:"20%"}}),e.jsx(c,{$color:i.colors[1],$delay:1.5,style:{width:"200px",height:"200px",bottom:"10%",right:"10%"}})]}),e.jsxs(w,{children:[e.jsxs(v,{children:[e.jsx(y,{children:i.tags.map((d,n)=>e.jsx("span",{children:d},n))}),e.jsx("h3",{children:i.title}),e.jsx("p",{children:i.client})]}),e.jsx(k,{className:"project-arrow",children:e.jsx("i",{className:"fas fa-arrow-right"})})]})]},r))})]})})};export{R as default};
