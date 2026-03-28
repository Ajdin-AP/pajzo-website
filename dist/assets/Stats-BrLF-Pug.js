import{r as s,g as n,j as e,c as t,S as C}from"./index-BT_7v_Bk.js";n.registerPlugin(C);const S=t.section`
    position: relative;
    padding: 160px 20px;
    background: #e2e2e8; /* Deeper cool gray background for absolute premium contrast */
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    z-index: 5;
    display: flex;
    justify-content: center;
    overflow: hidden;

    /* Architectural Math Grid Background */
    &::before {
        content: '';
        position: absolute;
        top: 0; left: 0; right: 0; bottom: 0;
        background-image: 
            linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px);
        background-size: 60px 60px;
        z-index: 0;
        mask-image: linear-gradient(to bottom, transparent, black 15%, black 85%, transparent);
        -webkit-mask-image: linear-gradient(to bottom, transparent, black 15%, black 85%, transparent);
        pointer-events: none;
    }
`,M=t.div`
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 180px;
    background: linear-gradient(to bottom, #ffffff 0%, rgba(255,255,255,0) 100%);
    z-index: 3;
    pointer-events: none;
`,T=t.div`
    position: absolute;
    bottom: 0; left: 0; right: 0;
    height: 180px;
    background: linear-gradient(to top, #ffffff 0%, rgba(255,255,255,0) 100%);
    z-index: 3;
    pointer-events: none;
`,R=t.div`
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 1;
    overflow: hidden;
    opacity: 0.85; 
    
    /* 
       PERFORMANCE OPTIMIZATION: 
       Removed highly expensive 'filter: blur()' since the radial gradients 
       already have soft transparent edges. This eliminates mouse-hover lag!
    */
    .orb-1 {
        position: absolute;
        top: -10%; left: -10%;
        width: 800px; height: 800px;
        background: radial-gradient(circle, rgba(255, 68, 0, 0.25) 0%, transparent 70%);
        border-radius: 50%;
        animation: floatOrb 20s infinite alternate ease-in-out;
    }

    .orb-2 {
        position: absolute;
        bottom: -20%; right: -10%;
        width: 1000px; height: 1000px;
        background: radial-gradient(circle, rgba(0, 110, 255, 0.2) 0%, transparent 70%);
        border-radius: 50%;
        animation: floatOrb 25s infinite alternate-reverse ease-in-out;
    }

    .orb-3 {
        position: absolute;
        top: 30%; left: 30%;
        width: 700px; height: 700px;
        background: radial-gradient(circle, rgba(255, 0, 150, 0.15) 0%, transparent 70%);
        border-radius: 50%;
        animation: floatOrb 18s infinite alternate ease-in-out;
    }

    @keyframes floatOrb {
        0% { transform: translate(0, 0) scale(1); }
        100% { transform: translate(150px, 100px) scale(1.1); }
    }
`,I=t.div`
    max-width: 1400px;
    width: 100%;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    z-index: 2;
`,O=t.div`
    text-align: center;
    margin-bottom: 120px;
    position: relative;
    z-index: 4;
    
    h2 {
        font-size: 0.9rem;
        font-weight: 800;
        letter-spacing: 0.3em;
        text-transform: uppercase;
        color: #ff4400;
        margin-bottom: 24px;
        display: inline-block;
        background: rgba(255, 255, 255, 0.5);
        padding: 8px 20px;
        border-radius: 30px;
        backdrop-filter: blur(20px);
        border: 1px solid rgba(255, 255, 255, 0.8);
    }

    .main-title {
        font-size: clamp(3.5rem, 6vw, 6rem);
        font-weight: 900;
        color: #111111;
        letter-spacing: -0.05em;
        line-height: 1.1;
        margin: 0;
        max-width: 800px;
        margin: 0 auto;
        
        span {
            display: inline-block;
            background: linear-gradient(135deg, #ff4400, #ff8800);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
    }
`,E=t.div`
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 40px;
    width: 100%;
    padding: 0 20px;
    perspective: 2500px; 
    
    @media (max-width: 1024px) {
        display: none;
    }
`,d=t.div`
    height: 520px;
    width: 100%;
    position: relative;
    transform-style: preserve-3d;
`,N=t.div`
    position: relative;
    height: 100%;
    width: 100%;
    padding: 55px 45px;
    border-radius: 40px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    
    background: rgba(255, 255, 255, 0.45); 
    border: 1px solid rgba(255, 255, 255, 0.8);
    
    box-shadow: 
        0 30px 60px rgba(0, 0, 0, 0.05),
        inset 0 1px 1px rgba(255, 255, 255, 1),
        inset 0 0 40px rgba(255, 255, 255, 0.2);
    
    transform-style: preserve-3d;
    transition: box-shadow 0.4s ease, border-color 0.4s ease;

    /* Specular diagonal glare representing glass reflection */
    &::before {
        content: '';
        position: absolute;
        inset: 0;
        border-radius: inherit;
        background: linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.6) 0%,
            rgba(255, 255, 255, 0) 35%,
            rgba(255, 255, 255, 0) 100%
        );
        pointer-events: none;
        z-index: 1;
    }

    /* Core Philosophy: Interactive Cursor Spotlight */
    &::after {
        content: '';
        position: absolute;
        inset: 0;
        border-radius: inherit;
        opacity: 0;
        transition: opacity 0.4s ease;
        background: radial-gradient(
            500px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), 
            rgba(255, 68, 0, 0.18), 
            transparent 45%
        );
        pointer-events: none;
        z-index: 1;
    }

    /* Bug Fix: Bind hover states to the un-tilted Container box to eliminate raycast flicker */
    ${d}:hover & {
        border-color: rgba(255, 255, 255, 1);
        box-shadow: 
            0 40px 80px rgba(0, 0, 0, 0.1),
            inset 0 1px 2px rgba(255, 255, 255, 1),
            inset 0 0 60px rgba(255, 255, 255, 0.5);
    }
    
    ${d}:hover &::after {
        opacity: 1;
    }
`,B=t.div`
    width: 100%;
    transform: translateZ(50px); /* 3D pop so it floats above the glass */
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    z-index: 2;
`,m=t.div`
    width: 68px;
    height: 68px;
    border-radius: 20px;
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(10px);
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid rgba(255, 255, 255, 1);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.03);
    transition: all 0.4s ease;

    /* Bug Fix: Bind hover state to container */
    ${d}:hover & {
        background: linear-gradient(135deg, #ff4400, #ff8800);
        box-shadow: 0 10px 30px rgba(255, 68, 0, 0.3);
        border: 1px solid transparent;
        transform: scale(1.05); /* Extra dynamic pop! */
        
        i {
            color: #ffffff;
        }
    }
`,v=t.i`
    font-size: 1.8rem;
    color: #111111;
    transition: all 0.4s ease;
`,P=t.div`
    font-size: 1.5rem;
    font-weight: 700;
    color: rgba(0, 0, 0, 0.1);
    font-variant-numeric: tabular-nums;
`,D=t.div`
    margin-top: auto;
    transform: translateZ(40px); /* Closer 3D pop for text */
    position: relative;
    z-index: 2;
`,$=t.h3`
    font-size: 2.25rem;
    font-weight: 800;
    color: #111111;
    margin: 0 0 24px 0;
    letter-spacing: -0.03em;
    line-height: 1.1;
`,X=t.p`
    font-size: 1.15rem;
    color: #4a4a4f;
    line-height: 1.6;
    margin: 0;
    font-weight: 400;
`,W=t.div`
    display: none;
    width: 100%;
    flex-direction: column;
    padding: 0 20px 100px 20px;
    position: relative;
    perspective: 1500px;
    
    @media (max-width: 1024px) {
        display: flex;
    }
`,F=t.div`
    position: sticky;
    top: ${a=>120+a.$index*20}px;
    
    /* OPTIMIZED FOR MOBILE: Removed heavy backdrop filters */
    background: rgba(255, 255, 255, 0.45); 
    
    border: 1px solid rgba(255, 255, 255, 0.8);
    border-radius: 36px;
    padding: 40px 32px;
    margin-bottom: 20px;
    overflow: hidden;
    
    display: flex;
    flex-direction: column;
    min-height: 380px;

    /* Liquid Shadows */
    box-shadow: 
        0 -10px 40px rgba(0, 0, 0, 0.04), 
        0 10px 40px rgba(0, 0, 0, 0.02),
        inset 0 1px 2px rgba(255, 255, 255, 1);
    
    transition: transform 0.3s ease;

    /* Specular diagonal glare */
    &::before {
        content: '';
        position: absolute;
        inset: 0;
        background: linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.7) 0%,
            rgba(255, 255, 255, 0) 40%
        );
        pointer-events: none;
        z-index: 1;
    }
`,L=t.div`
    display: flex;
    justify-content: flex-start;
    margin-bottom: 30px;
    position: relative;
    z-index: 2;
`,Y=t.div`
    display: flex;
    flex-direction: column;
    gap: 15px;
    position: relative;
    z-index: 2;
`,A=t.h3`
    font-size: 1.75rem;
    font-weight: 800;
    color: #111111;
    margin: 0;
    letter-spacing: -0.03em;
    line-height: 1.1;
`,Z=t.p`
    font-size: 1.1rem;
    color: #4a4a4f;
    line-height: 1.5;
    margin: 0;
    font-weight: 400;
`,U=t.div`
    position: absolute;
    bottom: -10px;
    right: 18px;
    font-size: 6.5rem;
    font-weight: 800;
    color: rgba(0, 0, 0, 0.03);
    user-select: none;
    line-height: 1;
    z-index: 1;
`,y=[{id:"01",label:"Precision Engineered.",desc:"Uncompromising standards. We don't just build websites; we craft digital architecture with mathematical exactness.",icon:"fas fa-crosshairs"},{id:"02",label:"Built for Velocity.",desc:"Speed is a feature. We deploy next-generation frameworks designed to instantly outpace market evolution.",icon:"fas fa-bolt"},{id:"03",label:"Maximum Impact.",desc:"Measured purely in dominance. We focus entirely on performance metrics that aggressively shift your bottom line.",icon:"fas fa-chart-line"}],V=()=>{const a=s.useRef(null),g=s.useRef(null),x=s.useRef([]),p=s.useRef([]);s.useEffect(()=>{const r=n.context(()=>{n.fromTo(".stats-header-sub",{y:30,opacity:0},{y:0,opacity:1,duration:1,ease:"power3.out",scrollTrigger:{trigger:a.current,start:"top 75%"}}),n.fromTo(".stats-header-main",{y:60,opacity:0,rotationX:-20},{y:0,opacity:1,rotationX:0,duration:1.2,ease:"expo.out",scrollTrigger:{trigger:a.current,start:"top 70%"}}),n.fromTo(".stat-card-container",{y:100,opacity:0,scale:.95},{y:0,opacity:1,scale:1,duration:1.4,stagger:.15,ease:"expo.out",scrollTrigger:{trigger:g.current,start:"top 80%"}})},a);return()=>r.revert()},[]);const w=(r,i)=>{const o=x.current[i],l=p.current[i];if(!o||!l)return;const c=o.getBoundingClientRect(),b=r.clientX-c.left,f=r.clientY-c.top;l.style.setProperty("--mouse-x",`${b}px`),l.style.setProperty("--mouse-y",`${f}px`);const h=c.width/2,u=c.height/2,j=(f-u)/u*-12,z=(b-h)/h*12;n.to(l,{rotationX:j,rotationY:z,scale:1.02,duration:.6,ease:"power2.out",transformOrigin:"center center",overwrite:"auto"})},k=r=>{const i=p.current[r];i&&n.to(i,{rotationX:0,rotationY:0,scale:1,duration:1.2,ease:"elastic.out(1, 0.4)",overwrite:"auto"})};return e.jsxs(S,{ref:a,children:[e.jsx(M,{}),e.jsx(T,{}),e.jsxs(R,{children:[e.jsx("div",{className:"orb-1"}),e.jsx("div",{className:"orb-2"})]}),e.jsxs(I,{children:[e.jsxs(O,{children:[e.jsx("h2",{className:"stats-header-sub",children:"Core Philosophy"}),e.jsxs("h3",{className:"main-title stats-header-main",children:["The foundation of ",e.jsx("span",{children:"scale."})]})]}),e.jsx(E,{ref:g,children:y.map((r,i)=>e.jsx(d,{className:"stat-card-container",ref:o=>{x.current[i]=o},onMouseMove:o=>w(o,i),onMouseLeave:()=>k(i),children:e.jsxs(N,{className:"inner-card",ref:o=>{p.current[i]=o},children:[e.jsxs(B,{children:[e.jsx(m,{children:e.jsx(v,{className:r.icon})}),e.jsx(P,{children:r.id})]}),e.jsxs(D,{children:[e.jsx($,{children:r.label}),e.jsx(X,{children:r.desc})]})]})},i))}),e.jsx(W,{children:y.map((r,i)=>e.jsxs(F,{$index:i,children:[e.jsx(L,{children:e.jsx(m,{children:e.jsx(v,{className:r.icon})})}),e.jsxs(Y,{children:[e.jsx(A,{children:r.label}),e.jsx(Z,{children:r.desc})]}),e.jsx(U,{children:r.id})]},i))})]})]})};export{V as default};
