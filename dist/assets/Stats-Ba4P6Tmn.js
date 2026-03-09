import{r as c,g as n,j as e,c as t,S as k}from"./index-C5nTu8Ee.js";n.registerPlugin(k);const M=t.section`
    position: relative;
    padding: 200px 20px;
    background: #ffffff;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    z-index: 5;
    display: flex;
    justify-content: center;
    overflow: hidden;
`,z=t.div`
    max-width: 1400px;
    width: 100%;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
`,C=t.div`
    text-align: center;
    margin-bottom: 140px;
    
    h2 {
        font-size: 0.9rem;
        font-weight: 600;
        letter-spacing: 0.25em;
        text-transform: uppercase;
        color: #4a4a4f;
        margin-bottom: 24px;
        display: inline-block;
    }

    .main-title {
        font-size: clamp(3.5rem, 7vw, 6rem);
        font-weight: 700;
        color: #111111;
        letter-spacing: -0.05em;
        line-height: 1.05;
        margin: 0;
        max-width: 800px;
        margin: 0 auto;
        
        /* Subtle text reveal effect setup */
        clip-path: polygon(0 0, 100% 0, 100% 100%, 0% 100%);
        padding-bottom: 10px;

        span {
            display: inline-block;
            background: linear-gradient(135deg, #ff4400, #ff8800);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
    }
`,T=t.div`
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 32px;
    width: 100%;
    padding: 0 20px;
    
    @media (max-width: 1024px) {
        display: none;
    }
`,R=t.div`
    perspective: 2000px;
    height: 540px;
    width: 100%;
`,u=t.div`
    position: relative;
    background: #ffffff;
    height: 100%;
    width: 100%;
    padding: 64px 48px;
    border-radius: 36px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    
    /* Apple-style floating shadow */
    box-shadow: 
        0 4px 24px rgba(0, 0, 0, 0.04),
        0 1px 2px rgba(0, 0, 0, 0.02);
    
    /* Soft border using box-shadow inset for crispness */
    border: 1px solid rgba(0, 0, 0, 0.04);
    
    transform-style: preserve-3d;
    transition: box-shadow 0.5s cubic-bezier(0.25, 1, 0.5, 1),
                border-color 0.5s ease;
    will-change: transform;

    &:hover {
        box-shadow: 0 30px 60px rgba(0, 0, 0, 0.06);
        border-color: rgba(255, 68, 0, 0.3);
    }
`,E=t.div`
    width: 100%;
    transform: translateZ(30px); /* 3D pop on outer hover */
    display: flex;
    justify-content: space-between;
    align-items: center;
`,h=t.div`
    width: 64px;
    height: 64px;
    border-radius: 20px;
    background: #f5f5f7;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: none;
    border: 1px solid rgba(0, 0, 0, 0.03);
    transition: all 0.5s ease;

    ${u}:hover & {
        background: linear-gradient(135deg, #ff4400, #ff8800);
        box-shadow: 0 8px 24px rgba(255, 68, 0, 0.25);
        border: 1px solid transparent;
        
        i {
            color: #ffffff;
        }
    }
`,g=t.i`
    font-size: 1.8rem;
    color: #111111;
    transition: all 0.5s ease;
`,N=t.div`
    font-size: 1.5rem;
    font-weight: 600;
    color: rgba(0,0,0,0.15);
    font-variant-numeric: tabular-nums;
`,X=t.div`
    margin-top: auto;
    transform: translateZ(40px); /* Closer 3D pop for text */
`,W=t.h3`
    font-size: 2.25rem;
    font-weight: 700;
    color: #111111;
    margin: 0 0 24px 0;
    letter-spacing: -0.03em;
    line-height: 1.1;
`,D=t.p`
    font-size: 1.125rem;
    color: #4a4a4f;
    line-height: 1.5;
    margin: 0;
    font-weight: 400;
    max-width: 90%;
`,I=t.div`
    display: none;
    width: 100%;
    flex-direction: column;
    padding: 0 20px 100px 20px; /* Extra bottom padding to allow full scroll */
    position: relative;

    @media (max-width: 1024px) {
        display: flex;
    }
`,Y=t.div`
    position: sticky;
    /* Each card sticks slightly lower than the one before it to create the "deck" effect.
       Top offset ensures it clears the fixed Header. */
    top: ${a=>120+a.$index*20}px;
    
    background: #ffffff;
    border-radius: 36px;
    padding: 40px 32px;
    margin-bottom: 20px; /* Space between cards before they stack */
    overflow: hidden;
    
    display: flex;
    flex-direction: column;
    min-height: 380px;

    /* Distinct shadow to separate layers as they stack */
    box-shadow: 0 -10px 40px rgba(0, 0, 0, 0.08), 0 10px 40px rgba(0,0,0,0.02);
    border: 1px solid rgba(0, 0, 0, 0.04);
    
    /* Native smooth scaling when covered */
    transition: transform 0.3s ease;
`,P=t.div`
    display: flex;
    justify-content: flex-start;
    margin-bottom: 30px;
    position: relative;
    z-index: 2;
`,$=t.div`
    display: flex;
    flex-direction: column;
    gap: 15px;
    position: relative;
    z-index: 2;
`,B=t.h3`
    font-size: 1.75rem;
    font-weight: 700;
    color: #111111;
    margin: 0;
    letter-spacing: -0.03em;
    line-height: 1.1;
`,L=t.p`
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
    color: rgba(0,0,0,0.02);
    user-select: none;
    line-height: 1;
    z-index: 1;
`,m=[{id:"01",label:"Precision Engineered.",desc:"Uncompromising standards. We don't just build websites; we craft digital architecture with mathematical exactness.",icon:"fas fa-crosshairs"},{id:"02",label:"Built for Velocity.",desc:"Speed is a feature. We deploy next-generation frameworks designed to instantly outpace market evolution.",icon:"fas fa-bolt"},{id:"03",label:"Maximum Impact.",desc:"Measured purely in dominance. We focus entirely on performance metrics that aggressively shift your bottom line.",icon:"fas fa-chart-line"}],A=()=>{const a=c.useRef(null),d=c.useRef(null),l=c.useRef([]);c.useEffect(()=>{const o=n.context(()=>{n.fromTo(".stats-header-sub",{y:30,opacity:0},{y:0,opacity:1,duration:1,ease:"power3.out",scrollTrigger:{trigger:a.current,start:"top 75%"}}),n.fromTo(".stats-header-main",{y:60,opacity:0,rotationX:-20},{y:0,opacity:1,rotationX:0,duration:1.2,ease:"cubic-bezier(0.16, 1, 0.3, 1)",scrollTrigger:{trigger:a.current,start:"top 70%"}}),n.fromTo(".stat-card-container",{y:100,opacity:0,scale:.95},{y:0,opacity:1,scale:1,duration:1.4,stagger:.15,ease:"expo.out",scrollTrigger:{trigger:d.current,start:"top 80%"}})},a);return()=>o.revert()},[]);const b=(o,r)=>{const i=l.current[r];if(!i)return;const p=i.querySelector(".inner-card");if(!p)return;const s=i.getBoundingClientRect(),w=o.clientX-s.left,v=o.clientY-s.top,f=s.width/2,x=s.height/2,j=(v-x)/x*-8,S=(w-f)/f*8;n.to(p,{rotationX:j,rotationY:S,scale:1.02,duration:.4,ease:"power2.out",transformPerspective:1500,transformOrigin:"center center"})},y=o=>{const r=l.current[o];if(!r)return;const i=r.querySelector(".inner-card");i&&n.to(i,{rotationX:0,rotationY:0,scale:1,duration:.8,ease:"elastic.out(1, 0.5)"})};return e.jsx(M,{ref:a,children:e.jsxs(z,{children:[e.jsxs(C,{children:[e.jsx("h2",{className:"stats-header-sub",children:"Core Philosophy"}),e.jsxs("h3",{className:"main-title stats-header-main",children:["The foundation of ",e.jsx("span",{children:"scale."})]})]}),e.jsx(T,{ref:d,children:m.map((o,r)=>e.jsx(R,{className:"stat-card-container",ref:i=>{l.current[r]=i},onMouseMove:i=>b(i,r),onMouseLeave:()=>y(r),children:e.jsxs(u,{className:"inner-card",children:[e.jsxs(E,{children:[e.jsx(h,{children:e.jsx(g,{className:o.icon})}),e.jsx(N,{children:o.id})]}),e.jsxs(X,{children:[e.jsx(W,{children:o.label}),e.jsx(D,{children:o.desc})]})]})},r))}),e.jsx(I,{children:m.map((o,r)=>e.jsxs(Y,{$index:r,children:[e.jsx(P,{children:e.jsx(h,{children:e.jsx(g,{className:o.icon})})}),e.jsxs($,{children:[e.jsx(B,{children:o.label}),e.jsx(L,{children:o.desc})]}),e.jsx(U,{children:o.id})]},r))})]})})};export{A as default};
