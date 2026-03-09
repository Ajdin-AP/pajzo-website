import{r as c,g as s,j as i,c as t,S as m}from"./index-C5nTu8Ee.js";s.registerPlugin(m);const h=t.section`
    background: #ffffff;
    padding: 150px 20px;
    position: relative;
    overflow: hidden;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    color: #111111;
`,v=t.div`
    max-width: 1500px;
    margin: 0 auto;
    width: 100%;
    position: relative;
    z-index: 2;
    display: flex;
    flex-direction: column;
    align-items: center;
`,b=t.div`
    text-align: center;
    margin-bottom: 80px;
    
    h2 {
        font-size: clamp(3rem, 6vw, 5rem);
        font-weight: 700;
        color: #111111;
        letter-spacing: -0.04em;
        line-height: 1.05;
        margin: 0;
        
        span {
            /* Text gradient */
            background: linear-gradient(135deg, #ff4400, #ff8800);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
    }
`,u=t.div`
    display: flex;
    width: 100%;
    height: 600px; /* Fixed height for the accordion */
    gap: 16px;
    padding: 0 20px;

    /* Completely hide the accordion on mobile/tablets */
    @media (max-width: 1024px) {
        display: none;
    }
`,w=t.div`
    position: relative;
    height: 100%;
    background: #ffffff;
    border-radius: 32px;
    border: 1px solid ${e=>e.$isActive?"rgba(255, 68, 0, 0.15)":"rgba(0, 0, 0, 0.04)"};
    overflow: hidden;
    cursor: pointer;
    
    /* 
     Flex magic: 
     Inactive panels take up 1 part of the space (min-width logic prevents crushing).
     Active panel jumps to taking up significantly more space (flex-grow: 4 or 5).
    */
    flex: ${e=>e.$isActive?"5":"1"};
    min-width: ${e=>e.$isActive?"40%":"120px"};
    
    transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
    
    box-shadow: ${e=>e.$isActive?"0 30px 60px rgba(0, 0, 0, 0.06), 0 10px 20px rgba(0, 0, 0, 0.02)":"0 4px 12px rgba(0, 0, 0, 0.02)"};

    &:hover {
        border-color: ${e=>e.$isActive?"rgba(255, 68, 0, 0.3)":"rgba(0, 0, 0, 0.08)"};
        box-shadow: ${e=>e.$isActive?"0 30px 60px rgba(0, 0, 0, 0.06)":"0 8px 20px rgba(0, 0, 0, 0.04)"};
    }

    @media (max-width: 1024px) {
        min-height: ${e=>e.$isActive?"auto":"100px"};
        width: 100%;
        padding: ${e=>e.$isActive?"40px 30px":"0"};
    }
`,$=t.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    padding: 40px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    
    /* To keep text from wrapping strangely during the flex transition, 
       we use a fixed width for the content wrapper inside the dynamic panel */
    min-width: 500px; 
    
    @media (max-width: 1024px) {
        position: relative;
        padding: 0;
        min-width: 100%;
    }
`,y=t.div`
    display: flex;
    align-items: center;
    gap: 20px;
    
    /* When inactive, we want the title to rotate vertically on desktop */
    @media (min-width: 1025px) {
        flex-direction: ${e=>e.$isActive?"row":"column"};
        align-items: flex-start;
        padding-top: ${e=>e.$isActive?"0":"20px"};
    }
`,d=t.div`
    width: 64px;
    height: 64px;
    min-width: 64px; /* Prevent shrink */
    border-radius: 20px;
    background: ${e=>e.$isActive?"linear-gradient(135deg, #ff4400, #ff8800)":"#f5f5f7"};
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: ${e=>e.$isActive?"0 8px 24px rgba(255, 68, 0, 0.25)":"none"};
    border: 1px solid ${e=>e.$isActive?"transparent":"rgba(0, 0, 0, 0.03)"};
    transition: all 0.5s ease;

    i {
        font-size: 1.5rem;
        color: ${e=>e.$isActive?"#ffffff":"#1d1d1f"};
    }
`,A=t.h3`
    font-size: 1.75rem;
    font-weight: 700;
    color: #111111;
    margin: 0;
    white-space: nowrap;
    transition: all 0.8s ease;

    @media (min-width: 1025px) {
        /* Rotate the title when standing vertically */
        transform-origin: left top;
        transform: ${e=>e.$isActive?"none":"rotate(90deg) translateY(-100%) translateX(20px)"};
        
        /* Adjust positioning when rotated so it sits below the icon */
        margin-top: ${e=>e.$isActive?"0":"80px"};
        margin-left: ${e=>e.$isActive?"0":"-20px"};
        
        opacity: ${e=>e.$isActive?"1":"0.5"};
    }
    
    @media (max-width: 1024px) {
        padding: ${e=>e.$isActive?"0":"35px 20px"}; /* Click area padding on mobile */
    }

    @media (max-width: 768px) {
        font-size: 1.35rem; /* Better fit for small screens */
    }
`,j=t.div`
    opacity: ${e=>e.$isActive?1:0};
    transform: ${e=>e.$isActive?"translateY(0)":"translateY(20px)"};
    transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
    transition-delay: ${e=>e.$isActive?"0.2s":"0s"}; /* Wait for expansion to fade in */
    pointer-events: ${e=>e.$isActive?"auto":"none"};
    
    display: flex;
    flex-direction: column;
    gap: 30px;
    
    @media (max-width: 1024px) {
        display: ${e=>e.$isActive?"flex":"none"}; /* Hard hide on mobile to save space */
        margin-top: 30px;
    }
`,z=t.p`
    font-size: 1.25rem;
    line-height: 1.6;
    color: #4a4a4f;
    margin: 0;
    font-weight: 400;
    max-width: 85%;
    
    @media (max-width: 1024px) {
        max-width: 100%;
        font-size: 1.1rem;
    }
`,l=t.div`
    display: flex;
    gap: 10px;
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
`,k=t.div`
    position: absolute;
    bottom: 40px;
    right: 40px;
    font-size: 4rem;
    font-weight: 800;
    color: ${e=>e.$isActive?"rgba(0,0,0,0.03)":"rgba(0,0,0,0.00)"}; /* Only show big number when active */
    transition: color 0.8s ease;
    user-select: none;
`,S=t.div`
    display: none;
    width: 100%;
    flex-direction: column;
    gap: 30px;
    padding: 0 20px;

    @media (max-width: 1024px) {
        display: flex;
    }
`,C=t.div`
    background: #ffffff;
    border-radius: 32px;
    border: 1px solid rgba(0, 0, 0, 0.05);
    padding: 40px 30px;
    position: relative;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.03);
`,T=t.div`
    display: flex;
    align-items: center;
    gap: 20px;
    margin-bottom: 25px;
    position: relative;
    z-index: 2;
`,I=t.h3`
    font-size: 1.5rem;
    font-weight: 700;
    color: #111111;
    margin: 0;
    letter-spacing: -0.02em;
`,E=t.p`
    font-size: 1.1rem;
    line-height: 1.6;
    color: #4a4a4f;
    margin: 0 0 25px 0;
    font-weight: 400;
    position: relative;
    z-index: 2;
`,N=t.div`
    position: absolute;
    bottom: -10px;
    right: 15px;
    font-size: 6rem;
    font-weight: 800;
    color: rgba(0,0,0,0.02);
    user-select: none;
    line-height: 1;
    z-index: 1;
`,p=[{id:"01",title:"Social & Ads",desc:"We align your organic social strategy with high-ROI ad campaigns to scale your revenue seamlessly. Leveraging data-driven insights to maximize every dollar spent.",icon:"fas fa-chart-line",tags:["Paid Social","PPC","Content Strategy"]},{id:"02",title:"Web Engineering",desc:"Lightning fast, custom applications built to convert. No rigid templates, just pure performance engineered from the ground up for maximum impact.",icon:"fas fa-laptop-code",tags:["React & Node","Headless Commerce","Custom Tech"]},{id:"03",title:"Brand Design",desc:"High-fidelity design systems, marks, and user interfaces that exponentially elevate your digital presence and build lasting trust.",icon:"fas fa-pen-nib",tags:["Brand Identity","UI/UX","Design Systems"]},{id:"04",title:"SEO Dynamics",desc:"Deep technical optimization and targeted content strategies designed to secure absolute dominance in search rankings and drive qualified organic traffic.",icon:"fas fa-search",tags:["Technical SEO","Audits","Organic Growth"]}],R=()=>{const e=c.useRef(null),[x,g]=c.useState(0);return c.useEffect(()=>{const n=s.context(()=>{s.fromTo(".accordion-panel",{y:60,opacity:0},{y:0,opacity:1,duration:1.5,stagger:.2,ease:"power3.out",scrollTrigger:{trigger:e.current,start:"top 70%"}}),s.fromTo(".mobile-service-card",{y:50,opacity:0},{y:0,opacity:1,duration:1.2,stagger:.25,ease:"power3.out",scrollTrigger:{trigger:".mobile-services-container",start:"top 85%"}})},e);return()=>n.revert()},[]),i.jsx(h,{id:"services",ref:e,children:i.jsxs(v,{children:[i.jsx(b,{children:i.jsxs("h2",{children:["Specialized ",i.jsx("span",{children:"Capabilities."})]})}),i.jsx(u,{children:p.map((n,o)=>{const a=o===x;return i.jsx(w,{className:"accordion-panel",$isActive:a,onMouseEnter:()=>g(o),children:i.jsxs($,{children:[i.jsxs("div",{children:[i.jsxs(y,{$isActive:a,children:[i.jsx(d,{$isActive:a,children:i.jsx("i",{className:n.icon})}),i.jsx(A,{$isActive:a,children:n.title})]}),i.jsxs(j,{$isActive:a,children:[i.jsx(z,{children:n.desc}),i.jsx(l,{children:n.tags.map((r,f)=>i.jsx("span",{children:r},f))})]})]}),i.jsx(k,{$isActive:a,children:n.id})]})},o)})}),i.jsx(S,{className:"mobile-services-container",children:p.map((n,o)=>i.jsxs(C,{className:"mobile-service-card",children:[i.jsxs(T,{children:[i.jsx(d,{$isActive:!0,children:i.jsx("i",{className:n.icon})}),i.jsx(I,{children:n.title})]}),i.jsx(E,{children:n.desc}),i.jsx(l,{style:{zIndex:2,position:"relative"},children:n.tags.map((a,r)=>i.jsx("span",{children:a},r))}),i.jsx(N,{children:n.id})]},o))})]})})};export{R as default};
