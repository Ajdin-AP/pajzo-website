import{r as a,g as i,j as e,c as o,S as h}from"./index-C5nTu8Ee.js";i.registerPlugin(h);const u=o.section`
    position: relative;
    padding: 60px 20px;
    background: #ffffff;
    color: #1e293b;
    z-index: 10;
`,f=o.div`
    max-width: 1400px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1fr 1.5fr;
    gap: 80px;
    position: relative;

    @media (max-width: 1024px) {
        grid-template-columns: 1fr;
        gap: 60px;
    }
`,x=o.div`
    position: sticky;
    top: 150px;
    height: max-content;
    
    @media (max-width: 1024px) {
        position: relative;
        top: 0;
        text-align: center;
    }
`,m=o.span`
    display: inline-block;
    padding: 8px 16px;
    background: rgba(99, 102, 241, 0.1);
    color: #4f46e5;
    border-radius: 20px;
    font-size: 0.85rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    margin-bottom: 24px;
    backdrop-filter: blur(10px);
`,b=o.h2`
    font-size: clamp(3rem, 5vw, 4.5rem);
    font-weight: 800;
    color: #0f172a;
    letter-spacing: -0.03em;
    line-height: 1.1;
    margin-bottom: 24px;

    background: linear-gradient(180deg, #0f172a 0%, #475569 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
`,w=o.p`
    font-size: 1.1rem;
    line-height: 1.7;
    color: #64748b;
    margin-bottom: 40px;
    max-width: 400px;
    
    @media (max-width: 1024px) {
        margin: 0 auto 40px auto;
    }
`,y=o.div`
    background: rgba(255, 255, 255, 0.6);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.8);
    padding: 30px;
    border-radius: 24px;
    box-shadow: 0 10px 30px -10px rgba(0,0,0,0.05);
    display: flex;
    flex-direction: column;
    gap: 16px;
    transition: transform 0.3s ease;

    &:hover {
        transform: translateY(-5px);
        background: #fff;
    }

    h4 {
        margin: 0;
        font-size: 1.2rem;
        color: #1e293b;
    }
    p {
        margin: 0;
        font-size: 0.95rem;
        color: #64748b;
    }
    a {
        color: #4f46e5;
        font-weight: 600;
        text-decoration: none;
        display: inline-flex;
        align-items: center;
        gap: 8px;
        margin-top: 8px;
        
        &:hover { text-decoration: underline; }
    }

    @media (max-width: 1024px) {
        text-align: left;
        max-width: 400px;
        margin: 0 auto;
    }
`,v=o.div`
    display: flex;
    flex-direction: column;
    gap: 16px;
`,k=o.div`
    background: ${t=>t.$isOpen?"#ffffff":"rgba(255, 255, 255, 0.5)"};
    backdrop-filter: blur(20px);
    border: 1px solid ${t=>t.$isOpen?"rgba(99, 102, 241, 0.2)":"rgba(255, 255, 255, 0.6)"};
    border-radius: 20px;
    overflow: hidden;
    transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
    box-shadow: ${t=>t.$isOpen?"0 20px 40px -10px rgba(99, 102, 241, 0.15), 0 0 0 1px rgba(99,102,241,0.1)":"0 4px 6px -1px rgba(0,0,0,0.02)"};
        
    &:hover {
        background: #fff;
        transform: ${t=>t.$isOpen?"none":"translateY(-2px)"};
        box-shadow: 0 10px 20px -5px rgba(0,0,0,0.05);
    }
`,j=o.button`
    width: 100%;
    text-align: left;
    padding: 24px 32px;
    background: transparent;
    border: none;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    font-family: inherit;
    
    span {
        font-size: 1.15rem;
        font-weight: 700;
        color: #1e293b;
        padding-right: 20px;
    }

    @media (max-width: 768px) {
        padding: 20px 24px;
        span {
            font-size: 1.05rem; /* Prevent squeezing the arrow */
        }
    }
`,S=o.div`
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: ${t=>t.$isOpen?"#4f46e5":"#f1f5f9"};
    color: ${t=>t.$isOpen?"#fff":"#64748b"};
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    flex-shrink: 0;

    svg {
        width: 14px;
        height: 14px;
        transition: transform 0.4s ease;
        transform: ${t=>t.$isOpen?"rotate(180deg)":"rotate(0deg)"};
    }
`,$=o.div`
    height: 0;
    overflow: hidden;
    /* Height is animated by GSAP */
`,W=o.div`
    padding: 0 32px 32px 32px;
    color: #475569;
    line-height: 1.7;
    font-size: 1rem;
    max-width: 90%;
`,z=[{question:"What exactly does Pajzo do?",answer:"We are a hybrid branding and growth strategy agency. We don’t just design pretty logos or run ads; we build entire ecosystems. From forging a compelling brand identity to engineering the digital infrastructure that scales it, we handle the end-to-end journey of market dominance."},{question:"How is your approach different?",answer:"Most agencies fragment your business—hiring one for design, one for dev, and another for marketing. Pajzo integrates these disciplines into a singular, cohesive strike force. We use data-driven insights to inform creative decisions, ensuring every pixel and line of code serves a measurable business objective."},{question:"What is the typical project timeline?",answer:"We move fast without breaking things. A comprehensive brand overhaul and digital launch typically takes 6-10 weeks. Specific growth campaigns or separate asset production can be deployed in as little as 2-3 weeks. We value velocity, but never at the cost of precision."},{question:"Do you work with startups or established enterprises?",answer:"Both. We partner with ambitious startups ready to disrupt their industries and established enterprises looking to reinvent themselves. The common denominator is ambition—we work with clients who are ready to aggressive scale and lead their market."},{question:"How do you structure your pricing?",answer:"We believe in value-based pricing. We offer project-based retainers for end-to-end builds and performance-based models for growth campaigns. We are not the cheapest option on the market, but we are the most efficient investment for high-growth ROI."}],A=()=>{const[t,c]=a.useState(0),p=a.useRef([]),s=a.useRef(null),l=r=>{c(t===r?null:r)};a.useEffect(()=>{p.current.forEach((r,n)=>{r&&(n===t?(i.to(r,{height:"auto",duration:.4,ease:"power2.out"}),i.to(r.querySelector("div"),{opacity:1,y:0,duration:.4,delay:.1})):(i.to(r,{height:0,duration:.3,ease:"power2.in"}),i.to(r.querySelector("div"),{opacity:0,y:-10,duration:.2})))})},[t]),a.useEffect(()=>{const r=i.context(()=>{var d;const n=(d=s.current)==null?void 0:d.querySelectorAll(".stagger-in");n&&n.length>0&&i.fromTo(n,{opacity:0,y:30},{opacity:1,y:0,duration:.8,stagger:.1,ease:"power3.out",scrollTrigger:{trigger:s.current,start:"top 70%"}})},s);return()=>r.revert()},[]);const g=()=>e.jsx("svg",{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:e.jsx("polyline",{points:"6 9 12 15 18 9"})});return e.jsx(u,{ref:s,id:"faq",children:e.jsxs(f,{children:[e.jsxs(x,{className:"stagger-in",children:[e.jsx(m,{children:"Support"}),e.jsx(b,{children:"Frequently Asked Questions"}),e.jsx(w,{children:"Everything you need to know about our products and services. Can't find the answer? We're here to help."}),e.jsxs(y,{children:[e.jsx("h4",{children:"Still have questions?"}),e.jsx("p",{children:"Our team is ready to assist you."}),e.jsxs("a",{href:"#contact",onClick:r=>{var n;r.preventDefault(),(n=document.getElementById("footer"))==null||n.scrollIntoView({behavior:"smooth"})},children:["Contact Support ",e.jsx("span",{style:{fontSize:"1.2em"},children:"→"})]})]})]}),e.jsx(v,{children:z.map((r,n)=>e.jsxs(k,{$isOpen:t===n,className:"stagger-in",children:[e.jsxs(j,{onClick:()=>l(n),children:[e.jsx("span",{children:r.question}),e.jsx(S,{$isOpen:t===n,children:e.jsx(g,{})})]}),e.jsx($,{ref:d=>{p.current[n]=d},style:{height:n===0?"auto":0},children:e.jsx(W,{children:r.answer})})]},n))})]})})};export{A as default};
