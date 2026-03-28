import{r as c,g as s,j as e,c as t,S as h}from"./index-BT_7v_Bk.js";s.registerPlugin(h);const m=t.section`
    background: #ffffff;
    padding: 150px 20px;
    position: relative;
    overflow: hidden;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    
    /* 
       Premium Creative Transition: 
       Overlapping Card Arch Architecture (Pulls the White Section UP to physically overlap the Black Section)
    */
    border-top-left-radius: 60px;
    border-top-right-radius: 60px;
    margin-top: -60px;
    z-index: 10;
    box-shadow: 0 -30px 80px rgba(0, 0, 0, 0.6);
`,b=t.div`
    max-width: 1400px;
    margin: 0 auto;
    width: 100%;
    position: relative;
    z-index: 2;
    display: flex;
    flex-direction: column;
    align-items: center;
`,u=t.div`
    text-align: center;
    margin-bottom: 80px;
    
    h2 {
        font-size: clamp(3rem, 6vw, 5rem);
        font-weight: 800;
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
`,v=t.div`
    display: flex;
    width: 100%;
    height: 600px; /* Fixed height for the accordion */
    gap: 16px;
    perspective: 2000px;

    /* Completely hide the accordion on mobile/tablets */
    @media (max-width: 1024px) {
        display: none;
    }
`,y=t.div`
    position: relative;
    height: 100%;
    background: ${i=>i.$isActive?"#ffffff":"#f0f0f3"};
    border-radius: 40px;
    border: 1px solid ${i=>i.$isActive?"rgba(255, 68, 0, 0.25)":"rgba(0, 0, 0, 0.03)"};
    overflow: hidden;
    cursor: pointer;
    
    /* Smooth flex interpolation */
    flex: ${i=>i.$isActive?"6":"1"};
    min-width: ${i=>i.$isActive?"45%":"100px"};
    
    transition: flex 0.8s cubic-bezier(0.16, 1, 0.3, 1), 
                min-width 0.8s cubic-bezier(0.16, 1, 0.3, 1),
                background 0.5s ease, 
                border-color 0.5s ease,
                box-shadow 0.6s cubic-bezier(0.16, 1, 0.3, 1);
    
    box-shadow: ${i=>i.$isActive?"0 40px 80px rgba(255, 68, 0, 0.08), 0 10px 30px rgba(0, 0, 0, 0.04)":"0 4px 12px rgba(0, 0, 0, 0.02)"};

    &:hover {
        background: ${i=>i.$isActive?"#ffffff":"#eaeaea"};
        transform: ${i=>i.$isActive?"none":"translateY(-2px)"};
    }

    /* Ambient glow for active card */
    &::before {
        content: '';
        position: absolute;
        top: -30%;
        left: -30%;
        width: 160%;
        height: 160%;
        background: radial-gradient(circle, rgba(255,68,0,0.06) 0%, transparent 60%);
        opacity: ${i=>i.$isActive?1:0};
        transition: opacity 1s ease;
        pointer-events: none;
        z-index: 0;
    }
`,w=t.div`
    position: absolute;
    inset: 0;
    padding: 50px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    opacity: ${i=>i.$isActive?1:0};
    visibility: ${i=>i.$isActive?"visible":"hidden"};
    transition: opacity 0.6s ease ${i=>i.$isActive?"0.4s":"0s"},
                visibility 0.6s;
    z-index: 2;
    min-width: 500px;
`,j=t.div`
    position: absolute;
    inset: 0;
    padding: 40px 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    opacity: ${i=>i.$isActive?0:1};
    visibility: ${i=>i.$isActive?"hidden":"visible"};
    transition: opacity 0.4s ease, visibility 0.4s;
    z-index: 2;
`,l=t.div`
    width: 76px;
    height: 76px;
    border-radius: 24px;
    background: linear-gradient(135deg, #ff4400, #ff8800);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 15px 30px rgba(255, 68, 0, 0.35);
    
    i {
        font-size: 2rem;
        color: #fff;
    }
`,A=t.div`
    width: 60px;
    height: 60px;
    border-radius: 20px;
    background: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 8px 16px rgba(0,0,0,0.04);

    i {
        font-size: 1.5rem;
        color: #111;
        opacity: 0.6;
    }
`,$=t.div`
    display: flex;
    align-items: center;
    gap: 25px;
`,z=t.h3`
    font-size: 2.2rem;
    font-weight: 800;
    color: #111;
    margin: 0;
    letter-spacing: -0.03em;
`,S=t.h3`
    font-size: 1.5rem;
    font-weight: 700;
    color: #111;
    margin: 0;
    letter-spacing: -0.02em;
    opacity: 0.4;
    
    /* Elegant vertical text rendering */
    writing-mode: vertical-rl;
    transform: rotate(180deg);
    margin-top: 50px;
    white-space: nowrap;
`,k=t.div`
    display: flex;
    flex-direction: column;
    gap: 30px;
    max-width: 85%;
`,C=t.p`
    font-size: 1.25rem;
    line-height: 1.6;
    color: #4a4a4f;
    margin: 0;
    font-weight: 400;
`,d=t.div`
    display: flex;
    gap: 12px;
    flex-wrap: wrap;

    span {
        font-family: 'Inter', sans-serif;
        font-size: 0.9rem;
        color: #ff4400;
        padding: 8px 18px;
        border-radius: 100px;
        background: rgba(255, 68, 0, 0.06);
        border: 1px solid rgba(255, 68, 0, 0.15);
        font-weight: 600;
        transition: all 0.3s ease;
        
        &:hover {
            background: #ff4400;
            color: #ffffff;
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(255, 68, 0, 0.2);
        }
    }
`,I=t.div`
    position: absolute;
    bottom: 30px;
    right: 40px;
    font-size: 8rem;
    font-weight: 900;
    color: rgba(0,0,0,0.02);
    line-height: 1;
    user-select: none;
    z-index: 1;
`,T=t.div`
    display: none;
    width: 100%;
    flex-direction: column;
    gap: 30px;
    padding: 0 20px;

    @media (max-width: 1024px) {
        display: flex;
    }
`,E=t.div`
    background: #ffffff;
    border-radius: 32px;
    border: 1px solid rgba(0, 0, 0, 0.05);
    padding: 40px 30px;
    position: relative;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.03);
    
    &::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 6px;
        background: linear-gradient(90deg, #ff4400, #ff8800);
        opacity: 0.9;
    }
`,N=t.div`
    display: flex;
    align-items: center;
    gap: 20px;
    margin-bottom: 25px;
    position: relative;
    z-index: 2;
`,B=t.h3`
    font-size: 1.6rem;
    font-weight: 800;
    color: #111111;
    margin: 0;
    letter-spacing: -0.02em;
`,M=t.p`
    font-size: 1.15rem;
    line-height: 1.6;
    color: #4a4a4f;
    margin: 0 0 25px 0;
    font-weight: 400;
    position: relative;
    z-index: 2;
`,P=t.div`
    position: absolute;
    bottom: -10px;
    right: 15px;
    font-size: 6rem;
    font-weight: 900;
    color: rgba(0,0,0,0.03);
    user-select: none;
    line-height: 1;
    z-index: 1;
`,p=[{id:"01",title:"Social & Ads",desc:"We align your organic social strategy with high-ROI ad campaigns to scale your revenue seamlessly. Leveraging data-driven insights to maximize every dollar spent.",icon:"fas fa-chart-line",tags:["Paid Social","PPC","Content Strategy"]},{id:"02",title:"Web Engineering",desc:"Lightning fast, custom applications built to convert. No rigid templates, just pure performance engineered from the ground up for maximum impact.",icon:"fas fa-laptop-code",tags:["React & Node","Headless Commerce","Custom Tech"]},{id:"03",title:"Brand Design",desc:"High-fidelity design systems, marks, and user interfaces that exponentially elevate your digital presence and build lasting trust.",icon:"fas fa-pen-nib",tags:["Brand Identity","UI/UX","Design Systems"]},{id:"04",title:"SEO Dynamics",desc:"Deep technical optimization and targeted content strategies designed to secure absolute dominance in search rankings and drive qualified organic traffic.",icon:"fas fa-search",tags:["Technical SEO","Audits","Organic Growth"]}],R=()=>{const i=c.useRef(null),[x,g]=c.useState(0);return c.useEffect(()=>{const n=s.context(()=>{s.fromTo(".accordion-panel",{x:100,opacity:0,rotationY:15},{x:0,opacity:1,rotationY:0,duration:1.2,stagger:.15,ease:"expo.out",scrollTrigger:{trigger:i.current,start:"top 75%"}}),s.fromTo(".mobile-service-card",{y:50,opacity:0},{y:0,opacity:1,duration:1.2,stagger:.25,ease:"expo.out",scrollTrigger:{trigger:".mobile-services-container",start:"top 85%"}})},i);return()=>n.revert()},[]),e.jsx(m,{id:"services",ref:i,children:e.jsxs(b,{children:[e.jsx(u,{children:e.jsxs("h2",{children:["Specialized ",e.jsx("span",{children:"Capabilities."})]})}),e.jsx(v,{children:p.map((n,o)=>{const a=o===x;return e.jsxs(y,{className:"accordion-panel",$isActive:a,onMouseEnter:()=>g(o),children:[e.jsxs(j,{$isActive:a,children:[e.jsx(A,{children:e.jsx("i",{className:n.icon})}),e.jsx(S,{children:n.title})]}),e.jsxs(w,{$isActive:a,children:[e.jsxs("div",{children:[e.jsxs($,{children:[e.jsx(l,{children:e.jsx("i",{className:n.icon})}),e.jsx(z,{children:n.title})]}),e.jsxs(k,{style:{marginTop:"40px"},children:[e.jsx(C,{children:n.desc}),e.jsx(d,{children:n.tags.map((r,f)=>e.jsx("span",{children:r},f))})]})]}),e.jsx(I,{children:n.id})]})]},o)})}),e.jsx(T,{className:"mobile-services-container",children:p.map((n,o)=>e.jsxs(E,{className:"mobile-service-card",children:[e.jsxs(N,{children:[e.jsx(l,{style:{width:60,height:60},children:e.jsx("i",{className:n.icon,style:{fontSize:"1.5rem"}})}),e.jsx(B,{children:n.title})]}),e.jsx(M,{children:n.desc}),e.jsx(d,{style:{zIndex:2,position:"relative"},children:n.tags.map((a,r)=>e.jsx("span",{children:a},r))}),e.jsx(P,{children:n.id})]},o))})]})})};export{R as default};
