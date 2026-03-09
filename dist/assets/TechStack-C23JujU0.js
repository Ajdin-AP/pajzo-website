import{r as l,g as i,j as r,c as o,S as w}from"./index-C5nTu8Ee.js";i.registerPlugin(w);const y=o.section`
    background: #ffffff;
    padding: 180px 20px;
    position: relative;
    overflow: hidden;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
`,S=o.div`
    max-width: 1400px;
    margin: 0 auto;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
`,v=o.div`
    text-align: center;
    margin-bottom: 100px;
    
    h2 {
        font-size: 0.9rem;
        font-weight: 600;
        letter-spacing: 0.25em;
        text-transform: uppercase;
        color: #86868b;
        margin-bottom: 24px;
        display: inline-block;
    }

    .main-title {
        font-size: clamp(3.5rem, 7vw, 6rem);
        font-weight: 700;
        color: #1d1d1f;
        letter-spacing: -0.05em;
        line-height: 1.05;
        margin: 0;
        max-width: 800px;
        margin: 0 auto;
        
        span {
            display: inline-block;
            background: linear-gradient(120deg, #1d1d1f 30%, #86868b 80%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
    }
`,j=o.div`
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: repeat(2, 300px);
    gap: 32px;
    width: 100%;
    
    @media (max-width: 1024px) {
        grid-template-columns: repeat(2, 1fr);
        grid-template-rows: auto;
    }
    
    @media (max-width: 600px) {
        grid-template-columns: 1fr;
    }
`,C=o.div`
    perspective: 2000px;
    grid-column: span ${e=>e.$colSpan||1};
    grid-row: span ${e=>e.$rowSpan||1};
    
    @media (max-width: 1024px) {
        grid-column: span ${e=>e.$colSpan===3||e.$colSpan===4?2:1};
        grid-row: span 1;
        min-height: 300px;
    }
    
    @media (max-width: 600px) {
        grid-column: span 1;
        min-height: 280px;
    }
`,k=o.div`
    position: relative;
    background: #ffffff;
    height: 100%;
    width: 100%;
    padding: 40px;
    border-radius: 36px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    overflow: hidden;
    
    /* Apple soft shadow & border */
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.02);
    border: 1px solid rgba(0, 0, 0, 0.04);
    
    transform-style: preserve-3d;
    will-change: transform;
    cursor: default;
    
    /* Subtle metallic sheen that activates on hover */
    &::before {
        content: '';
        position: absolute;
        top: -50%;
        left: -50%;
        width: 200%;
        height: 200%;
        background: radial-gradient(circle at center, ${e=>e.$brandColor}15 0%, transparent 60%);
        opacity: 0;
        transition: opacity 0.6s ease;
        pointer-events: none;
        z-index: 0;
    }

    @media (hover: hover) {
        &:hover {
            box-shadow: 0 30px 60px rgba(0, 0, 0, 0.12), 0 10px 20px rgba(0, 0, 0, 0.08);
            border-color: rgba(0, 0, 0, 0.08);

            &::before {
                opacity: 1;
            }
            
            .bento-icon {
                transform: scale(1.1) translateZ(30px);
                color: ${e=>e.$brandColor};
            }
        }
    }
`,$=o.div`
    position: relative;
    z-index: 1;
    transform: translateZ(20px);
`,z=o.i`
    position: absolute;
    top: 40px;
    right: 40px;
    font-size: 2.5rem;
    color: #d2d2d7; /* Light Apple Gray */
    transition: all 0.5s cubic-bezier(0.25, 1, 0.5, 1);
    transform-style: preserve-3d;
`,T=o.span`
    font-size: 0.8rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: #86868b;
    margin-bottom: 12px;
    display: block;
`,R=o.h3`
    font-size: 2rem;
    font-weight: 700;
    color: #1d1d1f;
    margin: 0 0 12px 0;
    letter-spacing: -0.03em;
    line-height: 1.1;
`,M=o.p`
    font-size: 1.1rem;
    color: #86868b;
    line-height: 1.5;
    margin: 0;
    max-width: 90%;
`,B=[{tag:"Frontend",title:"React & Beyond.",desc:"We engineer lightning-fast interfaces using React and modern server-side rendering for optimal Core Web Vitals.",icon:"fab fa-react",color:"#00d8ff",colSpan:2,rowSpan:1},{tag:"Motion",title:"Fluid Dynamics.",desc:"Hardware-accelerated animations powered by GSAP. No jank, pure buttery smoothness at 60fps.",icon:"fas fa-fan",color:"#88ce02",colSpan:1,rowSpan:1},{tag:"Commerce",title:"Headless CMS.",desc:"Decoupled architecture utilizing Shopify Plus and custom Node.js middleware for infinite scale.",icon:"fab fa-shopify",color:"#95bf47",colSpan:1,rowSpan:2},{tag:"Backend",title:"Cloud Native.",desc:"Serverless edge functions and distributed databases ensuring zero downtime globally.",icon:"fas fa-cloud",color:"#f56565",colSpan:1,rowSpan:1},{tag:"Analytics",title:"Data Dominance.",desc:"Custom tracking pixels, server-side tagging, and real-time BI dashboards.",icon:"fas fa-chart-pie",color:"#6366f1",colSpan:2,rowSpan:1}],D=()=>{const e=l.useRef(null),c=l.useRef([]);l.useEffect(()=>{const t=i.context(()=>{i.fromTo(".bento-header",{y:40,opacity:0},{y:0,opacity:1,duration:1,ease:"power3.out",scrollTrigger:{trigger:e.current,start:"top 75%"}}),i.fromTo(".bento-card-container",{y:80,opacity:0,scale:.95},{y:0,opacity:1,scale:1,duration:1.2,stagger:.1,ease:"expo.out",scrollTrigger:{trigger:e.current,start:"top 70%"}})},e);return()=>t.revert()},[]);const f=(t,a)=>{const n=c.current[a];if(!n)return;const d=n.querySelector(".inner-bento");if(!d)return;const s=n.getBoundingClientRect(),h=t.clientX-s.left,u=t.clientY-s.top,p=s.width/2,g=s.height/2,x=(u-g)/g*-5,b=(h-p)/p*5;i.to(d,{rotationX:x,rotationY:b,scale:1.01,duration:.4,ease:"power2.out",transformPerspective:1500,transformOrigin:"center center"})},m=t=>{const a=c.current[t];if(!a)return;const n=a.querySelector(".inner-bento");n&&i.to(n,{rotationX:0,rotationY:0,scale:1,duration:.8,ease:"elastic.out(1, 0.5)"})};return r.jsx(y,{id:"tech-stack",ref:e,children:r.jsxs(S,{children:[r.jsxs(v,{className:"bento-header",children:[r.jsx("h2",{children:"Digital Infrastructure"}),r.jsxs("h3",{className:"main-title",children:["Engineered with ",r.jsx("span",{children:"precision."})]})]}),r.jsx(j,{children:B.map((t,a)=>r.jsx(C,{className:"bento-card-container",$colSpan:t.colSpan,$rowSpan:t.rowSpan,ref:n=>{c.current[a]=n},onMouseMove:n=>f(n,a),onMouseLeave:()=>m(a),children:r.jsxs(k,{className:"inner-bento",$brandColor:t.color,children:[r.jsx(z,{className:`bento-icon ${t.icon}`}),r.jsxs($,{children:[r.jsx(T,{children:t.tag}),r.jsx(R,{children:t.title}),r.jsx(M,{children:t.desc})]})]})},a))})]})})};export{D as default};
