import{r as c,g as O,S as G,j as a,c as E,R as D}from"./index-BT_7v_Bk.js";O.registerPlugin(G);const Y=E.div`
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
`,N=D.memo(({isActive:p})=>{const R=c.useRef(null),l=c.useRef(null),d=c.useRef(p);return c.useEffect(()=>{d.current=p},[p]),c.useEffect(()=>{const o=R.current;if(!o)return;const t=o.getContext("2d");if(!t)return;let s=o.width,r=o.height,w;const P=20,z=15,y=[],g=()=>{y.length=0;const e=s/P,m=r/z;for(let x=0;x<z;x++)for(let u=0;u<P;u++)y.push({x:u*e+e/2,y:x*m+m/2,active:0,baseOpacity:Math.random()*.15+.05})},M=()=>{l.current&&o&&(s=l.current.clientWidth,r=l.current.clientHeight,o.width=s,o.height=r,g())};M(),window.addEventListener("resize",M);let h=-50;const n=()=>{if(!d.current){setTimeout(()=>{w=requestAnimationFrame(n)},100);return}t.clearRect(0,0,s,r),h+=2,h>r+50&&(h=-50),y.forEach(m=>{const x=Math.abs(m.y-h);x<30?m.active=1-x/30:m.active*=.95;const u=m.baseOpacity+m.active*.85;t.fillStyle=`rgba(255, 68, 0, ${u})`,t.beginPath(),t.arc(m.x,m.y,2,0,Math.PI*2),t.fill()});const e=t.createLinearGradient(0,h-30,0,h+30);e.addColorStop(0,"rgba(255, 68, 0, 0)"),e.addColorStop(.5,"rgba(255, 68, 0, 0.15)"),e.addColorStop(1,"rgba(255, 68, 0, 0)"),t.fillStyle=e,t.fillRect(0,h-30,s,60),t.fillStyle="rgba(255, 136, 0, 0.8)",t.fillRect(0,h,s,1),w=requestAnimationFrame(n)};return n(),()=>{window.removeEventListener("resize",M),cancelAnimationFrame(w)}},[]),a.jsx(Y,{ref:l,children:a.jsx("canvas",{ref:R,style:{width:"100%",height:"100%"}})})}),Z=D.memo(({isActive:p})=>{const R=c.useRef(null),l=c.useRef(null),d=c.useRef(p);return c.useEffect(()=>{d.current=p},[p]),c.useEffect(()=>{const o=R.current;if(!o)return;const t=o.getContext("2d");if(!t)return;let s=o.width,r=o.height,w;const P=45,z=120,y=[],g=()=>{y.length=0;for(let n=0;n<P;n++)y.push({x:Math.random()*s,y:Math.random()*r,vx:(Math.random()-.5)*.6,vy:(Math.random()-.5)*.6,radius:Math.random()*2+1,opacity:Math.random()*.5+.3})},M=()=>{l.current&&o&&(s=l.current.clientWidth,r=l.current.clientHeight,o.width=s,o.height=r,g())};M(),window.addEventListener("resize",M);const h=()=>{if(!d.current){setTimeout(()=>{w=requestAnimationFrame(h)},100);return}t.clearRect(0,0,s,r),y.forEach((n,e)=>{n.x+=n.vx,n.y+=n.vy,(n.x<0||n.x>s)&&(n.vx*=-1),(n.y<0||n.y>r)&&(n.vy*=-1),n.opacity+=(Math.random()-.5)*.02,n.opacity<.2&&(n.opacity=.2),n.opacity>.8&&(n.opacity=.8),t.beginPath(),t.arc(n.x,n.y,n.radius,0,Math.PI*2),t.fillStyle=`rgba(255, 136, 0, ${n.opacity})`,t.fill();for(let m=e+1;m<y.length;m++){const x=y[m],u=n.x-x.x,b=n.y-x.y,j=Math.sqrt(u*u+b*b);if(j<z){t.beginPath();const i=(1-j/z)*.5;t.strokeStyle=`rgba(255, 68, 0, ${i})`,t.lineWidth=1,t.moveTo(n.x,n.y),t.lineTo(x.x,x.y),t.stroke()}}}),w=requestAnimationFrame(h)};return h(),()=>{window.removeEventListener("resize",M),cancelAnimationFrame(w)}},[]),a.jsx(Y,{ref:l,children:a.jsx("canvas",{ref:R,style:{width:"100%",height:"100%"}})})}),B=D.memo(({isActive:p})=>{const R=c.useRef(null),l=c.useRef(null),d=c.useRef(p);return c.useEffect(()=>{d.current=p},[p]),c.useEffect(()=>{const o=R.current;if(!o)return;const t=o.getContext("2d");if(!t)return;let s=o.width,r=o.height,w;const P=[{radius:90,speedX:.025,speedY:.015,speedZ:.005,rotation:{x:0,y:0,z:0},color:"rgba(255, 136, 0, 0.8)",width:2.5},{radius:140,speedX:-.015,speedY:.025,speedZ:-.01,rotation:{x:0,y:0,z:0},color:"rgba(255, 68, 0, 0.5)",width:1.5,dashed:!0},{radius:200,speedX:.01,speedY:-.015,speedZ:.02,rotation:{x:0,y:0,z:0},color:"rgba(255, 68, 0, 0.3)",width:1}],z=()=>{l.current&&o&&(s=l.current.clientWidth,r=l.current.clientHeight,o.width=s,o.height=r)};z(),window.addEventListener("resize",z);const y=()=>{if(!d.current){setTimeout(()=>{w=requestAnimationFrame(y)},100);return}t.clearRect(0,0,s,r);const g=s/2,M=r/2,h=600,n=t.createRadialGradient(g,M,0,g,M,45);n.addColorStop(0,"rgba(255, 136, 0, 1)"),n.addColorStop(.3,"rgba(255, 68, 0, 0.5)"),n.addColorStop(1,"rgba(255, 68, 0, 0)"),t.fillStyle=n,t.beginPath(),t.arc(g,M,45,0,Math.PI*2),t.fill(),P.forEach((e,m)=>{e.rotation.x+=e.speedX,e.rotation.y+=e.speedY,e.rotation.z+=e.speedZ,t.beginPath(),t.strokeStyle=e.color,t.lineWidth=e.width,e.dashed?t.setLineDash([8,12]):t.setLineDash([]);const x=80;for(let u=0;u<=x;u++){const b=u/x*Math.PI*2,j=Math.cos(b)*e.radius,i=Math.sin(b)*e.radius,f=0,S=j,v=i*Math.cos(e.rotation.x)-f*Math.sin(e.rotation.x),k=i*Math.sin(e.rotation.x)+f*Math.cos(e.rotation.x),I=S*Math.cos(e.rotation.y)+k*Math.sin(e.rotation.y),C=v,T=-S*Math.sin(e.rotation.y)+k*Math.cos(e.rotation.y),L=I*Math.cos(e.rotation.z)-C*Math.sin(e.rotation.z),W=I*Math.sin(e.rotation.z)+C*Math.cos(e.rotation.z),A=h/(h+T),H=g+L*A,F=M+W*A;u===0?t.moveTo(H,F):t.lineTo(H,F)}if(t.stroke(),!e.dashed){const u=m===0?2:3;for(let b=0;b<u;b++){const j=Math.PI*2/u*b,i=Date.now()*.0015*(e.speedX>0?1:-1)+j,f=Math.cos(i)*e.radius,S=Math.sin(i)*e.radius,v=0,k=f,I=S*Math.cos(e.rotation.x)-v*Math.sin(e.rotation.x),C=S*Math.sin(e.rotation.x)+v*Math.cos(e.rotation.x),T=k*Math.cos(e.rotation.y)+C*Math.sin(e.rotation.y),L=I,W=-k*Math.sin(e.rotation.y)+C*Math.cos(e.rotation.y),q=T*Math.cos(e.rotation.z)-L*Math.sin(e.rotation.z),A=T*Math.sin(e.rotation.z)+L*Math.cos(e.rotation.z),F=h/(h+W);if(F>0){const V=g+q*F,X=M+A*F;t.fillStyle="#ffccaa",t.beginPath(),t.arc(V,X,3*F,0,Math.PI*2),t.fill(),t.fillStyle="rgba(255, 136, 0, 0.4)",t.beginPath(),t.arc(V,X,8*F,0,Math.PI*2),t.fill()}}}}),w=requestAnimationFrame(y)};return y(),()=>{window.removeEventListener("resize",z),cancelAnimationFrame(w)}},[]),a.jsx(Y,{ref:l,children:a.jsx("canvas",{ref:R,style:{width:"100%",height:"100%"}})})}),U=D.memo(({isActive:p})=>{const R=c.useRef(null),l=c.useRef(null),d=c.useRef(p);return c.useEffect(()=>{d.current=p},[p]),c.useEffect(()=>{const o=R.current;if(!o)return;const t=o.getContext("2d");if(!t)return;let s=o.width,r=o.height,w;const P=160,z=250,y=.002,g=[],M=()=>{g.length=0;const u=Math.PI*(3-Math.sqrt(5));for(let b=0;b<z;b++){const j=1-b/(z-1)*2,i=Math.sqrt(1-j*j),f=u*b,S=Math.cos(f)*i,v=Math.sin(f)*i;g.push({x:S*P,y:j*P,z:v*P,x2d:0,y2d:0,scale:1,baseAlpha:Math.random()*.5+.5})}},h=()=>{l.current&&o&&(s=l.current.clientWidth,r=l.current.clientHeight,o.width=s,o.height=r)};h(),M(),window.addEventListener("resize",h);let n=0,e=0,m=0;const x=()=>{if(!d.current){setTimeout(()=>{w=requestAnimationFrame(x)},100);return}t.clearRect(0,0,s,r);const u=s/2,b=r/2,j=600;n+=y,e+=y*.3,m+=.02,g.forEach((i,f)=>{const S=Math.cos(n),v=Math.sin(n);let k=i.x*S-i.z*v,I=i.z*S+i.x*v;const C=Math.cos(e),T=Math.sin(e);let L=i.y*C-I*T,W=I*C+i.y*T;const q=(Math.sin(m+f*.1)+1)*.5,A=j/(j+W);i.x2d=u+k*A,i.y2d=b+L*A,i.scale=A,i.visualAlpha=(.2+q*.8)*i.baseAlpha}),g.forEach(i=>{if(i.scale<.5)return;const f=Math.max(.1,(i.scale-.5)*2*i.visualAlpha);t.fillStyle=`rgba(255, 136, 0, ${f})`,t.beginPath(),t.arc(i.x2d,i.y2d,2.5*i.scale,0,Math.PI*2),t.fill(),f>.6&&(t.fillStyle=`rgba(255, 68, 0, ${f*.3})`,t.beginPath(),t.arc(i.x2d,i.y2d,6*i.scale,0,Math.PI*2),t.fill())});for(let i=0;i<z;i++){const f=g[i];if(!(f.scale<.8))for(let S=i+1;S<z;S++){const v=g[S];if(v.scale<.8)continue;const k=f.x2d-v.x2d,I=f.y2d-v.y2d;if(k*k+I*I<3e3){t.beginPath();const C=Math.min(f.visualAlpha,v.visualAlpha)*.3*f.scale;t.strokeStyle=`rgba(255, 68, 0, ${C})`,t.lineWidth=1,t.moveTo(f.x2d,f.y2d),t.lineTo(v.x2d,v.y2d),t.stroke()}}}w=requestAnimationFrame(x)};return x(),()=>{window.removeEventListener("resize",h),cancelAnimationFrame(w)}},[]),a.jsx(Y,{ref:l,children:a.jsx("canvas",{ref:R,style:{width:"100%",height:"100%"}})})}),J=E.section`
  padding: 160px 5% 100px 5%; /* Increased top padding dramatically to absorb the negative margin */
  background: #000000;
  color: #ffffff;
  position: relative;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  
  /* Slides strictly underneath the white section overhang from above */
  margin-top: -60px;
  z-index: 1;
`,K=E.div`
  text-align: center;
  margin-bottom: 80px;
  
  h2 {
    font-size: clamp(3rem, 6vw, 5rem);
    font-weight: 700;
    color: #ffffff;
    letter-spacing: -0.04em;
    line-height: 1.05;
    margin-bottom: 20px;

    span {
      display: inline-block;
      background: linear-gradient(135deg, #ff4400, #ff8800);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }
  
  p {
    font-size: 0.9rem;
    font-weight: 600;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    color: #86868b;
  }
`,Q=E.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  max-width: 1400px;
  margin: 0 auto;
  position: relative;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`,_=E.div`
  position: relative;
  /* Ensure this column has height so scroll triggers work */
`,tt=E.div`
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
`,et=E.span`
  font-size: 0.9rem;
  font-weight: 600;
  color: #ff4400;
  letter-spacing: 0.1em;
  margin-bottom: 20px;
  display: block;
`,nt=E.h3`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 20px;
  color: #ffffff;
  line-height: 1.2;
  letter-spacing: -0.03em;
`,it=E.p`
  font-size: 1.1rem;
  color: #86868b;
  line-height: 1.6;
  max-width: 450px;
`,ot=E.div`
  position: relative;
  
  @media (max-width: 1024px) {
    display: none; /* Hide sticky visual on mobile, or move it inside steps */
  }
`,st=E.div`
  position: sticky;
  top: calc(50vh - 250px); /* Vertically centered (50% viewport - half height) */
  height: 500px;
  width: 100%;
`,$=[{id:"01",title:"Discovery & Strategy",desc:"We analyze your business goals and technical infrastructure to build a data-driven roadmap for success.",Visual:N},{id:"02",title:"Architecture & Design",desc:"We design scalable, secure systems and intuitive interfaces tailored specifically to your operational needs.",Visual:Z},{id:"03",title:"Development & Integration",desc:"Our engineers build robust, high-performance applications using modern frameworks, ensuring seamless integration with your existing stack.",Visual:B},{id:"04",title:"Launch & Optimization",desc:"We deploy your solution with zero downtime and continuously monitor performance to ensure global scalability and reliability.",Visual:U}],rt=()=>{const[p,R]=c.useState(0),l=c.useRef(null);return c.useEffect(()=>{const d=O.context(()=>{O.utils.toArray(".step-item").forEach((t,s)=>{G.create({trigger:t,start:"top center",end:"bottom center",onToggle:r=>{r.isActive&&R(s)},toggleClass:{targets:t,className:"active"}})})},l);return()=>d.revert()},[]),a.jsxs(J,{id:"process",ref:l,children:[a.jsxs(K,{children:[a.jsxs("h2",{children:["Our ",a.jsx("span",{children:"Process"})]}),a.jsx("p",{children:"Streamlined Execution"})]}),a.jsxs(Q,{children:[a.jsx(_,{children:$.map(d=>a.jsxs(tt,{className:"step-item",children:[a.jsxs(et,{children:["PHASE ",d.id]}),a.jsx(nt,{children:d.title}),a.jsx(it,{children:d.desc}),a.jsx("div",{className:"mobile-visual",style:{marginTop:30,display:"none"}})]},d.id))}),a.jsx(ot,{children:a.jsx(st,{children:a.jsx("div",{style:{position:"relative",width:"100%",height:"100%"},children:$.map((d,o)=>{const t=d.Visual,s=p===o;return a.jsx("div",{style:{position:"absolute",inset:0,opacity:s?1:0,transform:`scale(${s?1:.96}) translateY(${s?0:10}px)`,transition:"opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1), transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)",pointerEvents:s?"auto":"none",zIndex:s?10:0},children:a.jsx(t,{isActive:s})},d.id)})})})})]})]})};export{rt as default};
