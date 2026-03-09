import{r as c,g as Y,S as X,j as r,c as k,R as A}from"./index-C5nTu8Ee.js";Y.registerPlugin(X);const D=k.div`
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(10px);
  border-radius: 24px;
  position: relative;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;

  /* Subtle inner glow */
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at center, rgba(255,255,255,0.03) 0%, transparent 70%);
    pointer-events: none;
  }
`,$=A.memo(({isActive:m})=>{const R=c.useRef(null),l=c.useRef(null),d=c.useRef(m);return c.useEffect(()=>{d.current=m},[m]),c.useEffect(()=>{const n=R.current;if(!n)return;const t=n.getContext("2d");if(!t)return;let i=n.width,a=n.height,g;const P=20,w=15,p=[],y=()=>{p.length=0;const e=i/P,b=a/w;for(let h=0;h<w;h++)for(let x=0;x<P;x++)p.push({x:x*e+e/2,y:h*b+b/2,active:0})},v=()=>{l.current&&n&&(i=l.current.clientWidth,a=l.current.clientHeight,n.width=i,n.height=a,y())};v(),window.addEventListener("resize",v);let f=0;const o=()=>{if(!d.current){setTimeout(()=>{g=requestAnimationFrame(o)},100);return}t.clearRect(0,0,i,a),f+=2,f>a+20&&(f=-20),p.forEach(e=>{Math.abs(e.y-f)<10?e.active=1:e.active*=.92;const b=.1+e.active*.9;t.fillStyle=`rgba(255, 255, 255, ${b})`,t.fillRect(e.x-2,e.y-2,4,4)}),t.fillStyle="rgba(255, 255, 255, 0.8)",t.fillRect(0,f,i,1),g=requestAnimationFrame(o)};return o(),()=>{window.removeEventListener("resize",v),cancelAnimationFrame(g)}},[]),r.jsx(D,{ref:l,children:r.jsx("canvas",{ref:R,style:{width:"100%",height:"100%"}})})}),G=A.memo(({isActive:m})=>{const R=c.useRef(null),l=c.useRef(null),d=c.useRef(m);return c.useEffect(()=>{d.current=m},[m]),c.useEffect(()=>{const n=R.current;if(!n)return;const t=n.getContext("2d");if(!t)return;let i=n.width,a=n.height,g;const P=40,w=100,p=[],y=()=>{p.length=0;for(let o=0;o<P;o++)p.push({x:Math.random()*i,y:Math.random()*a,vx:(Math.random()-.5)*.5,vy:(Math.random()-.5)*.5})},v=()=>{l.current&&n&&(i=l.current.clientWidth,a=l.current.clientHeight,n.width=i,n.height=a,y())};v(),window.addEventListener("resize",v);const f=()=>{if(!d.current){setTimeout(()=>{g=requestAnimationFrame(f)},100);return}t.clearRect(0,0,i,a),p.forEach((o,e)=>{o.x+=o.vx,o.y+=o.vy,(o.x<0||o.x>i)&&(o.vx*=-1),(o.y<0||o.y>a)&&(o.vy*=-1),t.beginPath(),t.arc(o.x,o.y,2,0,Math.PI*2),t.fillStyle="#ffffff",t.fill();for(let b=e+1;b<p.length;b++){const h=p[b],x=o.x-h.x,M=o.y-h.y,s=Math.sqrt(x*x+M*M);s<w&&(t.beginPath(),t.strokeStyle=`rgba(255, 255, 255, ${1-s/w})`,t.lineWidth=.5,t.moveTo(o.x,o.y),t.lineTo(h.x,h.y),t.stroke())}}),g=requestAnimationFrame(f)};return f(),()=>{window.removeEventListener("resize",v),cancelAnimationFrame(g)}},[]),r.jsx(D,{ref:l,children:r.jsx("canvas",{ref:R,style:{width:"100%",height:"100%"}})})}),N=A.memo(({isActive:m})=>{const R=c.useRef(null),l=c.useRef(null),d=c.useRef(m);return c.useEffect(()=>{d.current=m},[m]),c.useEffect(()=>{const n=R.current;if(!n)return;const t=n.getContext("2d");if(!t)return;let i=n.width,a=n.height,g;const P=[{radius:100,speedX:.02,speedY:.01,speedZ:.005,rotation:{x:0,y:0,z:0},color:"rgba(255,255,255,0.8)",width:2},{radius:150,speedX:-.015,speedY:.02,speedZ:-.01,rotation:{x:0,y:0,z:0},color:"rgba(255,255,255,0.5)",width:1,dashed:!0},{radius:210,speedX:.01,speedY:-.01,speedZ:.02,rotation:{x:0,y:0,z:0},color:"rgba(255,255,255,0.3)",width:1}],w=()=>{l.current&&n&&(i=l.current.clientWidth,a=l.current.clientHeight,n.width=i,n.height=a)};w(),window.addEventListener("resize",w);const p=()=>{if(!d.current){setTimeout(()=>{g=requestAnimationFrame(p)},100);return}t.clearRect(0,0,i,a);const y=i/2,v=a/2,f=500,o=t.createRadialGradient(y,v,0,y,v,40);o.addColorStop(0,"rgba(255, 255, 255, 1)"),o.addColorStop(.4,"rgba(255, 255, 255, 0.4)"),o.addColorStop(1,"rgba(255, 255, 255, 0)"),t.fillStyle=o,t.beginPath(),t.arc(y,v,40,0,Math.PI*2),t.fill(),P.forEach(e=>{e.rotation.x+=e.speedX,e.rotation.y+=e.speedY,e.rotation.z+=e.speedZ,t.beginPath(),t.strokeStyle=e.color,t.lineWidth=e.width,e.dashed?t.setLineDash([5,10]):t.setLineDash([]);const b=60;for(let h=0;h<=b;h++){const x=h/b*Math.PI*2,M=Math.cos(x)*e.radius,s=Math.sin(x)*e.radius,u=0,S=M,z=s*Math.cos(e.rotation.x)-u*Math.sin(e.rotation.x),E=s*Math.sin(e.rotation.x)+u*Math.cos(e.rotation.x),j=S*Math.cos(e.rotation.y)+E*Math.sin(e.rotation.y),F=z,T=-S*Math.sin(e.rotation.y)+E*Math.cos(e.rotation.y),I=j*Math.cos(e.rotation.z)-F*Math.sin(e.rotation.z),C=j*Math.sin(e.rotation.z)+F*Math.cos(e.rotation.z),W=f/(f+T+200),q=y+I*W,H=v+C*W;h===0?t.moveTo(q,H):t.lineTo(q,H)}if(t.stroke(),!e.dashed){const h=Date.now()*.002*(e.speedX>0?1:-1),x=Math.cos(h)*e.radius,M=Math.sin(h)*e.radius,s=0,u=x,S=M*Math.cos(e.rotation.x)-s*Math.sin(e.rotation.x),z=M*Math.sin(e.rotation.x)+s*Math.cos(e.rotation.x),E=u*Math.cos(e.rotation.y)+z*Math.sin(e.rotation.y),j=S,F=-u*Math.sin(e.rotation.y)+z*Math.cos(e.rotation.y),T=E*Math.cos(e.rotation.z)-j*Math.sin(e.rotation.z),I=E*Math.sin(e.rotation.z)+j*Math.cos(e.rotation.z),L=f/(f+F+200);if(L>0){const W=y+T*L,q=v+I*L;t.fillStyle="#fff",t.beginPath(),t.arc(W,q,4*L,0,Math.PI*2),t.fill()}}}),g=requestAnimationFrame(p)};return p(),()=>{window.removeEventListener("resize",w),cancelAnimationFrame(g)}},[]),r.jsx(D,{ref:l,children:r.jsx("canvas",{ref:R,style:{width:"100%",height:"100%"}})})}),O=A.memo(({isActive:m})=>{const R=c.useRef(null),l=c.useRef(null),d=c.useRef(m);return c.useEffect(()=>{d.current=m},[m]),c.useEffect(()=>{const n=R.current;if(!n)return;const t=n.getContext("2d");if(!t)return;let i=n.width,a=n.height,g;const P=180,w=200,p=.003,y=[],v=()=>{y.length=0;const h=Math.PI*(3-Math.sqrt(5));for(let x=0;x<w;x++){const M=1-x/(w-1)*2,s=Math.sqrt(1-M*M),u=h*x,S=Math.cos(u)*s,z=Math.sin(u)*s;y.push({x:S*P,y:M*P,z:z*P,x2d:0,y2d:0,scale:1})}},f=()=>{l.current&&n&&(i=l.current.clientWidth,a=l.current.clientHeight,n.width=i,n.height=a)};f(),v(),window.addEventListener("resize",f);let o=0,e=0;const b=()=>{if(!d.current){setTimeout(()=>{g=requestAnimationFrame(b)},100);return}t.clearRect(0,0,i,a);const h=i/2,x=a/2,M=500;o+=p,e+=p*.2,y.forEach(s=>{const u=Math.cos(o),S=Math.sin(o);let z=s.x*u-s.z*S,E=s.z*u+s.x*S;const j=Math.cos(e),F=Math.sin(e);let T=s.y*j-E*F,I=E*j+s.y*F;const C=M/(M+I+250);s.x2d=h+z*C,s.y2d=x+T*C,s.scale=C}),y.forEach(s=>{if(s.scale<.4)return;const u=Math.max(.3,s.scale-.2);t.fillStyle=`rgba(255, 255, 255, ${u})`,t.beginPath(),t.arc(s.x2d,s.y2d,2*s.scale,0,Math.PI*2),t.fill()}),t.strokeStyle="rgba(255, 255, 255, 0.4)";for(let s=0;s<w;s++){const u=y[s];if(!(u.scale<.7))for(let S=s+1;S<w;S++){const z=y[S];if(z.scale<.7)continue;const E=u.x2d-z.x2d,j=u.y2d-z.y2d;E*E+j*j<2500&&(t.beginPath(),t.strokeStyle=`rgba(255, 255, 255, ${.4*u.scale})`,t.lineWidth=.8,t.moveTo(u.x2d,u.y2d),t.lineTo(z.x2d,z.y2d),t.stroke())}}g=requestAnimationFrame(b)};return b(),()=>{window.removeEventListener("resize",f),cancelAnimationFrame(g)}},[]),r.jsx(D,{ref:l,children:r.jsx("canvas",{ref:R,style:{width:"100%",height:"100%"}})})}),Z=k.section`
  padding: 100px 5%;
  background: #000000;
  color: #ffffff;
  position: relative;
`,B=k.div`
  text-align: center;
  margin-bottom: 80px;
  
  h2 {
    font-size: 3.5rem;
    font-weight: 700;
    letter-spacing: -2px;
    background: linear-gradient(to right, #ffffff, #94a3b8);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-bottom: 20px;
  }
  
  p {
    font-family: 'JetBrains Mono', monospace;
    color: #64748b;
    font-size: 0.8rem;
    letter-spacing: 4px;
    text-transform: uppercase;
  }
`,J=k.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  max-width: 1400px;
  margin: 0 auto;
  position: relative;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`,K=k.div`
  position: relative;
  /* Ensure this column has height so scroll triggers work */
`,Q=k.div`
  min-height: 80vh; /* Each step takes full viewport height scroll */
  display: flex;
  flex-direction: column;
  justify-content: center;
  opacity: 0.3;
  transition: opacity 0.5s;
  padding: 40px;

  &.active {
    opacity: 1;
  }

  /* Mobile: stack cards */
  @media (max-width: 1024px) {
    min-height: auto;
    margin-bottom: 80px;
    opacity: 1;
    background: rgba(255,255,255,0.05);
    border-radius: 20px;
    border: 1px solid rgba(255,255,255,0.1);
  }
`,U=k.span`
  font-family: 'JetBrains Mono', monospace;
  font-size: 1rem;
  color: #cbd5e1;
  margin-bottom: 20px;
  display: block;
`,_=k.h3`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 20px;
  color: #ffffff;
  line-height: 1.2;
`,tt=k.p`
  font-size: 1.1rem;
  color: #94a3b8;
  line-height: 1.6;
  max-width: 450px;
`,et=k.div`
  position: relative;
  
  @media (max-width: 1024px) {
    display: none; /* Hide sticky visual on mobile, or move it inside steps */
  }
`,nt=k.div`
  position: sticky;
  top: calc(50vh - 250px); /* Vertically centered (50% viewport - half height) */
  height: 500px;
  width: 100%;
`,V=[{id:"01",title:"Discovery & Strategy",desc:"We analyze your business goals and technical infrastructure to build a data-driven roadmap for success.",Visual:$},{id:"02",title:"Architecture & Design",desc:"We design scalable, secure systems and intuitive interfaces tailored specifically to your operational needs.",Visual:G},{id:"03",title:"Development & Integration",desc:"Our engineers build robust, high-performance applications using modern frameworks, ensuring seamless integration with your existing stack.",Visual:N},{id:"04",title:"Launch & Optimization",desc:"We deploy your solution with zero downtime and continuously monitor performance to ensure global scalability and reliability.",Visual:O}],st=()=>{const[m,R]=c.useState(0),l=c.useRef(null);return c.useEffect(()=>{const d=Y.context(()=>{Y.utils.toArray(".step-item").forEach((t,i)=>{X.create({trigger:t,start:"top center",end:"bottom center",onToggle:a=>{a.isActive&&R(i)},toggleClass:{targets:t,className:"active"}})})},l);return()=>d.revert()},[]),r.jsxs(Z,{id:"process",ref:l,children:[r.jsxs(B,{children:[r.jsx("h2",{children:"Our Process"}),r.jsx("p",{children:"Streamlined Execution"})]}),r.jsxs(J,{children:[r.jsx(K,{children:V.map(d=>r.jsxs(Q,{className:"step-item",children:[r.jsxs(U,{children:["PHASE ",d.id]}),r.jsx(_,{children:d.title}),r.jsx(tt,{children:d.desc}),r.jsx("div",{className:"mobile-visual",style:{marginTop:30,display:"none"}})]},d.id))}),r.jsx(et,{children:r.jsx(nt,{children:r.jsx("div",{style:{position:"relative",width:"100%",height:"100%"},children:V.map((d,n)=>{const t=d.Visual,i=m===n;return r.jsx("div",{style:{position:"absolute",inset:0,opacity:i?1:0,transform:`scale(${i?1:.96}) translateY(${i?0:10}px)`,transition:"opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1), transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)",pointerEvents:i?"auto":"none",zIndex:i?10:0},children:r.jsx(t,{isActive:i})},d.id)})})})})]})]})};export{st as default};
