(self.webpackChunk=self.webpackChunk||[]).push([[524],{44:(e,t,a)=>{const s=a(89),n=a(863),{lightningChart:r,AxisTickStrategies:i,AxisScrollStrategies:o,Themes:l}=s,{createProgressiveTraceGenerator:c}=n,d=r({resourcesBaseUrl:new URL(document.head.baseURI).origin+new URL(document.head.baseURI).pathname+"resources/"}).Chart3D({theme:l[new URLSearchParams(window.location.search).get("theme")||"darkGold"]||void 0}).setBoundingBox({x:1,y:.5,z:.4}).setTitle("3D Realtime Line Series");d.getDefaultAxisX().setTitle("Axis X"),d.getDefaultAxisY().setTitle("Axis Y"),d.getDefaultAxisZ().setTitle(""),d.getDefaultAxisZ().setTickStrategy(i.Empty);const h=[{name:"Series A"},{name:"Series B"},{name:"Series C"},{name:"Series D"},{name:"Series E"}];d.getDefaultAxisX().setDefaultInterval((e=>({end:e.dataMax,start:(e.dataMax??0)-1e3,stopAxisAfter:!1}))).setScrollStrategy(o.progressive),d.getDefaultAxisZ().setInterval({start:-1,end:1+h.reduce(((e,t,a)=>Math.max(e,a)),0)}),Promise.all(h.map(((e,t)=>{const a=e.name||"",s=e.z||t,n=d.addLineSeries().setName(a);return c().setNumberOfPoints(1250).generate().toPromise().then((e=>e.map((e=>({y:e.y,z:s}))))).then((e=>({series:n,data:e.concat(e.slice(1,-1).reverse())})))}))).then((e=>{d.addLegendBox().setAutoDispose({type:"max-width",maxWidth:.2}).add(d);let t=Date.now(),a=0,s=0;e.forEach((e=>e.currentData=[]));const n=()=>{for(let t=0;t<5;t++){for(const{series:t,data:n,currentData:r}of e){const e=n[s%n.length],i={x:s,y:e.y,z:e.z};t.add(i),r.push(i),a++}s++}requestAnimationFrame(n)};n(),setInterval((()=>{const t=1e3;for(let a=0;a<e.length;a++){const{series:s,data:n,currentData:r}=e[a];if(r.length<t)continue;const i=r.length-t,o=Math.min(t,r.length-i),l=r.splice(i,o);s.clear().add(l),e[a].currentData=l}}),1e3);const r=d.getTitle();let i=Date.now();setInterval((()=>{if(a>0&&Date.now()-t>0){const e=1e3*a/(Date.now()-t);d.setTitle(`${r} (${Math.round(e)} data points / s)`)}Date.now()-i>=5e3&&(t=i=Date.now(),a=0)}),1e3)}))}},e=>{e.O(0,[502],(()=>(44,e(e.s=44)))),e.O()}]);