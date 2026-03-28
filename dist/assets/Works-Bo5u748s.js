import{r as s,g as n,S as f,j as e,c as t}from"./index-BT_7v_Bk.js";n.registerPlugin(f);const x=t.section`
    background: #ffffff;
    /* We don't pad top/bottom heavily because ScrollTrigger pinning handles spacing naturally */
    position: relative;
    /* overflow: visible allows the massive drop shadow to bleed down onto the black section cleanly */
    overflow: visible; 
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    
    /* 
       Premium Creative Transition (Closing the Arch):
       This curves the bottom of the white block and casts a deep ambient shadow downwards,
       transforming the entire multi-section white block into a single floating 'pill'.
    */
    border-bottom-left-radius: 60px;
    border-bottom-right-radius: 60px;
    z-index: 10;
    box-shadow: 0 30px 80px rgba(0, 0, 0, 0.6);
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
        color: #111111;
        letter-spacing: -0.04em;
        line-height: 1.05;
        margin: 0;

        span {
            display: inline-block;
            background: linear-gradient(135deg, #ff4400, #ff8800);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
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
`,b=t.div`
    width: 600px;
    height: 480px;
    background: #ffffff;
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
        box-shadow: 0 30px 60px rgba(0, 0, 0, 0.06);
        border-color: rgba(255, 68, 0, 0.3);
        transform: translateY(-10px);

        .mock-image {
            transform: scale(1.05);
        }

        .project-arrow {
            transform: translate(5px, -5px);
            color: #ffffff;
            background: linear-gradient(135deg, #ff4400, #ff8800);
            box-shadow: 0 8px 24px rgba(255, 68, 0, 0.25);
            i {
                color: #ffffff;
            }
        }
    }
`,u=t.div`
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
        color: #111111;
        margin: 0 0 10px 0;
        letter-spacing: -0.03em;
    }

    p {
        font-size: 1.1rem;
        color: #4a4a4f;
        margin: 0;
        font-weight: 400;
    }

    @media (max-width: 768px) {
        h3 { font-size: 1.5rem; }
        p { font-size: 1rem; }
    }
`,k=t.div`
    display: flex;
    gap: 8px;
    margin-bottom: 20px;
    flex-wrap: wrap;

    span {
        font-family: 'Inter', sans-serif;
        font-size: 0.85rem;
        color: #111111;
        padding: 8px 16px;
        border-radius: 100px;
        background: #f8f9fa;
        border: 1px solid rgba(0, 0, 0, 0.05);
        font-weight: 500;
        transition: background 0.3s ease;
    }
`,y=t.div`
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: #f5f5f7;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    border: 1px solid rgba(0, 0, 0, 0.03);

    i {
        font-size: 1.2rem;
        color: #111111;
        transition: all 0.3s ease;
    }
`,j=[{title:"Lumina Engine",client:"Fintech Enterprise",tags:["React","Blockchain","UI API"],colors:["#6366f1","#a855f7"]},{title:"Aura Commerce",client:"Luxury Retailer",tags:["Shopify Plus","Next.js","ThreeJS"],colors:["#ec4899","#f43f5e"]},{title:"Nexus Dashboard",client:"SaaS Analytics",tags:["Vue","Node","Real-time"],colors:["#14b8a6","#3b82f6"]},{title:"Equinox Protocol",client:"Defi Startup",tags:["Web3","Solidity","Design System"],colors:["#f59e0b","#ef4444"]}],R=()=>{const o=s.useRef(null),l=s.useRef(null);return s.useEffect(()=>{let i=n.context(()=>{const r=l.current;if(!r)return;n.matchMedia().add("(min-width: 769px)",()=>{const a=()=>-(r.scrollWidth-window.innerWidth),p=n.to(r,{x:a,ease:"none"});f.create({trigger:o.current,start:"top top",end:()=>`+=${a()*-1}`,pin:!0,animation:p,scrub:1,invalidateOnRefresh:!0})})},o);return()=>i.revert()},[]),e.jsx(x,{id:"work",ref:o,children:e.jsxs(h,{children:[e.jsx(g,{children:e.jsxs("h2",{children:["Selected ",e.jsx("span",{children:"Works."})]})}),e.jsx(m,{ref:l,children:j.map((i,r)=>e.jsxs(b,{children:[e.jsxs(u,{className:"mock-image",children:[e.jsx(c,{$color:i.colors[0],$delay:0,style:{width:"150px",height:"150px",top:"10%",left:"20%"}}),e.jsx(c,{$color:i.colors[1],$delay:1.5,style:{width:"200px",height:"200px",bottom:"10%",right:"10%"}})]}),e.jsxs(w,{children:[e.jsxs(v,{children:[e.jsx(k,{children:i.tags.map((d,a)=>e.jsx("span",{children:d},a))}),e.jsx("h3",{children:i.title}),e.jsx("p",{children:i.client})]}),e.jsx(y,{className:"project-arrow",children:e.jsx("i",{className:"fas fa-arrow-right"})})]})]},r))})]})})};export{R as default};
