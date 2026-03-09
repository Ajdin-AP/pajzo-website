import{r as s,g as i,j as t,c as n,p as h,S as b}from"./index-C5nTu8Ee.js";i.registerPlugin(b);const v=h`
  0% { transform: translateX(0); }
  100% { transform: translateX(-33.333%); } /* Moves exactly 1/3 of the width (one set) */
`,k=n.section`
    position: relative;
    padding: 60px 0;
    overflow: hidden;
    background: #ffffff;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 40px;
    min-height: 300px;
`,w=n.div`
    text-align: center;
    z-index: 2;
    padding: 0 20px;
    margin-bottom: 20px;

    h2 {
        font-size: 3.5rem;
        font-weight: 800;
        letter-spacing: -2px;
        color: #0f172a; /* Dark Slate */
        margin-bottom: 12px;
    }

    p {
        font-size: 1.1rem;
        color: #64748b; /* Medium Slate */
        max-width: 500px;
        margin: 0 auto;
        line-height: 1.6;
        font-weight: 500;
        letter-spacing: 0.5px;
    }
`,y=n.div`
    position: relative;
    width: 100%;
    z-index: 2;
    padding: 40px 0;
    overflow: hidden;
    display: flex;
    align-items: center;
    /* Soft graduation mask */
    mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
    -webkit-mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
`,S=n.div`
    display: flex;
    gap: 60px; /* Increased gap for cleaner look */
    width: max-content;
    will-change: transform;
    align-items: center;
    /* CSS Animation for smooth infinite loop */
    animation: ${v} 30s linear infinite;
    
    /* Removed pause on hover to keep it moving */
    &:hover {
        /* animation-play-state: running; */
    }
`,j=n.div`
    position: relative;
    width: 180px;
    height: 100px;
    /* Clean White Card */
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 16px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
    
    /* Holographic glow on hover */
    &::after {
        content: '';
        position: absolute;
        inset: -2px;
        border-radius: 18px;
        padding: 2px;
        background: linear-gradient(135deg, #6366f1, #8b5cf6, #ec4899);
        -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
        -webkit-mask-composite: xor;
        mask-composite: exclude;
        opacity: 0;
        transition: opacity 0.3s ease;
    }

    i {
        font-size: 2.5rem;
        color: #334155; /* Slate 700 */
        transition: all 0.3s ease;
    }

    span {
        position: absolute;
        bottom: 15px;
        font-size: 0.75rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 1px;
        color: #0f172a;
        opacity: 0;
        transform: translateY(5px);
        transition: all 0.3s ease;
    }

    &:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);

        &::after {
            opacity: 1;
        }

        i {
            color: #0f172a;
            transform: translateY(-12px) scale(0.9);
        }

        span {
            opacity: 1;
            transform: translateY(0);
        }
    }
`,c=Array(10).fill({name:"",icon:null}),C=()=>{const x=s.useRef(null),m=s.useRef(null);s.useEffect(()=>{const l=i.context(()=>{}),a=document.querySelectorAll(".partner-card"),p=e=>{const r=e.currentTarget,o=r.getBoundingClientRect(),f=e.clientX-o.left-o.width/2,u=e.clientY-o.top-o.height/2;i.to(r,{x:f*.2,y:u*.2,rotation:f*.05,duration:.5,ease:"power2.out"})},d=e=>{const r=e.currentTarget;i.to(r,{x:0,y:0,rotation:0,duration:.8,ease:"elastic.out(1, 0.3)"})};return a.forEach(e=>{e.addEventListener("mousemove",p),e.addEventListener("mouseleave",d)}),()=>{l.revert(),a.forEach(e=>{e.removeEventListener("mousemove",p),e.removeEventListener("mouseleave",d)})}},[]);const g=[...c,...c,...c];return t.jsxs(k,{id:"partners",ref:m,children:[t.jsxs(w,{children:[t.jsx("h2",{children:"Select Clients"}),t.jsx("p",{children:"Strategic partnerships with industry leaders."})]}),t.jsx(y,{children:t.jsx(S,{ref:x,children:g.map((l,a)=>t.jsx(j,{className:"partner-card"},`p-${a}`))})})]})};export{C as default};
