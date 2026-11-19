/* Urban Streets */

const T=THREE,cv=document.getElementById('g');
const R=new T.WebGLRenderer({canvas:cv,antialias:true});R.setPixelRatio(Math.min(devicePixelRatio||1,1.75));
const S=new T.Scene(),cam=new T.PerspectiveCamera(68,1,.8,1600);
function rs(){R.setSize(cv.clientWidth,cv.clientHeight,false);cam.aspect=cv.clientWidth/cv.clientHeight;cam.updateProjectionMatrix()}
addEventListener('resize',rs);rs();
const hs=n=>{n|=0;n=Math.imul(n^(n>>>15),0x2c1b3c6d);n=Math.imul(n^(n>>>12),0x297a2d39);return((n^(n>>>15))>>>0)/4294967296};
const clamp=(a,b,c)=>Math.max(b,Math.min(c,a)),sm=(a,e0,e1)=>{a=clamp((a-e0)/(e1-e0),0,1);return a*a*(3-2*a)};
const CITIES=[
{n:'Tokyo',t:'Neon night',seed:1,r:'Shinjuku to Shibuya',a:[35.6905,139.7000],b:[35.6598,139.7005],cA:1.5,hA:8,top:'#05061a',fog:'#7a3585',fd:.0034,g:['#1c1a38','#252148'],road:'#2c2c40',curb:'#ff4d8d',lane:'#f6e27a',sun:'#ffd7f1',sI:.5,az:2.2,el:.35,hc:'#9a8ad0',hi:.85,stars:1,night:1,bd:['#6a6ab0','#7a62b0','#5a7ab8','#a062b0'],lamp:'#ffe9a8',objs:['tower','tower','tower','tree'],d:.3,tc:['#5d4a8e','#4a5a8e'],ts:0,tA:2,mt:30,mc:'#2a2450'},
{n:'New York',t:'Golden hour',seed:2,r:'Battery Park to Central Park',a:[40.7033,-74.0170],b:[40.7681,-73.9819],cA:1,hA:6,top:'#2d4f82',fog:'#e8a77b',fd:.0032,g:['#55555c','#4d4d54'],road:'#3c3c44',curb:'#c9c9d0',lane:'#f2c94c',sun:'#ffd9a0',sI:1.1,az:.5,el:.22,hc:'#ffe0c0',hi:.9,bd:['#c08060','#8590a8','#c0b090','#7a8498'],lamp:'#fff0b8',objs:['tower','tower','tower','tower','tree'],d:.32,tc:['#5d7b4a'],ts:1,tA:1,mt:10,mc:'#6b5a78'},
];
let C=CITIES[0];
const DS=8,N=16,CH=N*DS,AHEAD=11,MAX=38,BEHIND=4,DLIM=300;
const COLS=new Map();
let RT=null;
const kapP=s=>C.cA*.0025*(Math.sin(s*.0021+C.seed)*.7+Math.sin(s*.0007+1+C.seed*2)*1.1+Math.sin(s*.0003+3)*.8);
const hill=s=>C.hA*(Math.sin(s*.0031+C.seed)*.55+Math.sin(s*.0013+2+C.seed*2)+Math.sin(s*.0065+1)*.2);
let PA=[];
function gen(k){while(PA.length<=k){const i=PA.length;
 if(RT){if(i<RT.length)PA.push(RT[i]);else{const q=PA[i-1];PA.push({x:q.x+Math.sin(q.t)*DS,z:q.z+Math.cos(q.t)*DS,y:q.y,t:q.t})}continue}
 if(!i){PA.push({x:0,z:0,y:hill(0),t:0});continue}const q=PA[i-1],t=q.t+kapP((i-1)*DS)*DS;PA.push({x:q.x+Math.sin(t)*DS,z:q.z+Math.cos(t)*DS,y:hill(i*DS),t})}}
const kapR=s=>{const a=at(s),b=at(s+DS);return(b.t-a.t)/DS};
const kap=s=>RT?kapR(s):kapP(s);
function at(s){s=Math.max(0,s);const f=s/DS,k=Math.floor(f),u=f-k;gen(k+2);const a=PA[k],b=PA[k+1];return{x:a.x+(b.x-a.x)*u,y:a.y+(b.y-a.y)*u,z:a.z+(b.z-a.z)*u,t:a.t+(b.t-a.t)*u}}
/* textures & shared geometry */
function wtex(mode){const c=document.createElement('canvas');c.width=c.height=256;const g=c.getContext('2d');g.fillStyle=mode===2?'#000':'#fff';g.fillRect(0,0,256,256);for(let j=0;j<8;j++)for(let i=0;i<8;i++){if(mode===2){if(hs(j*8+i+55)<.55){g.fillStyle='#ffd27a';g.fillRect(i*32+7,j*32+6,18,20)}}else{g.fillStyle=mode?'#1c2236':'#6f8aa3';g.fillRect(i*32+7,j*32+6,18,20)}}const t=new T.CanvasTexture(c);t.wrapS=t.wrapT=T.RepeatWrapping;t.anisotropy=4;return t}
const TX=[wtex(0),wtex(1),wtex(2)];
function glow(){const c=document.createElement('canvas');c.width=c.height=128;const g=c.getContext('2d'),r=g.createRadialGradient(64,64,0,64,64,64);r.addColorStop(0,'rgba(255,255,255,1)');r.addColorStop(.12,'rgba(255,255,255,.95)');r.addColorStop(.13,'rgba(255,255,255,.3)');r.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=r;g.fillRect(0,0,128,128);return new T.CanvasTexture(c)}
const bgeo=(w,h)=>{const g=new T.BoxGeometry(1,1,1);g.translate(0,.5,0);const u=g.attributes.uv;for(let i=0;i<u.count;i++)u.setXY(i,u.getX(i)*w/32,u.getY(i)*h/32);return g};
const gx=g=>g.translate(0,.5,0);
const GEO={box:gx(new T.BoxGeometry(1,1,1)),cyl:gx(new T.CylinderGeometry(.5,.5,1,8)),cone:gx(new T.ConeGeometry(.5,1,8)),pyr:gx(new T.ConeGeometry(.7071,1,4).rotateY(Math.PI/4)),sph:gx(new T.SphereGeometry(.5,10,8)),B0:bgeo(14,40),B1:bgeo(18,70),B2:bgeo(12,26)};
const BD=[[14,40],[18,70],[12,26]];
const geoOf=n=>GEO[n==='gb'?'box':n==='gs'?'sph':n];
const MP=new T.MeshLambertMaterial(),MG=new T.MeshBasicMaterial();let MB=null;
const matOf=n=>n[0]==='B'?MB:n[0]==='g'?MG:MP;
/* scenery */
const MIN={tower:18,tree:11,villa:13,cypress:10,palm:10,pagoda:14,house:12,rock:10};
const B={
tower:(x,y,z,r,t,a)=>{const i=r*3|0,[w,h]=BD[i],f=.85+(r*7%1)*.5,hf=.8+(r*13%1)*.7;a('B'+i,x,y,z,w*f,h*f*hf,w*f,C.bd[r*11%C.bd.length|0],t)},
tree:(x,y,z,r,t,a)=>{const h=7+r*6,c=C.tc[r*7%C.tc.length|0];a('cyl',x,y,z,.7,h*.4,.7,'#4a3526',0);if(C.ts)a('sph',x,y+h*.3,z,h*.7,h*.7,h*.7,c,0);else{a('cone',x,y+h*.2,z,h*.6,h*.55,h*.6,c,0);a('cone',x,y+h*.5,z,h*.45,h*.5,h*.45,c,0)}},
villa:(x,y,z,r,t,a)=>{const w=7+r*5,h=5+(r*97%1)*3;a('box',x,y,z,w,h,w*.9,'#f6f4ee',t);if(r>.45)a('sph',x,y+h-.2,z,w*.5,w*.5,w*.5,'#2f6fc0',0);else a('box',x,y+h,z,w*1.05,.4,w*.95,'#2f6fc0',t)},
cypress:(x,y,z,r,t,a)=>a('cone',x,y,z,2.2,10+r*6,2.2,'#36502f',0),
palm:(x,y,z,r,t,a)=>{const h=11+r*4;a('cyl',x,y,z,.7,h,.7,'#7a5a3a',0);for(let k=0;k<5;k++)a('box',x,y+h,z,9,.35,1.6,'#2f8a4c',r*6+k*1.26)},
pagoda:(x,y,z,r,t,a)=>{for(let k=0;k<3;k++){const w=8-k*1.6;a('box',x,y+k*4.2,z,w,3,w,'#b8352b',t);a('pyr',x,y+k*4.2+3,z,w*1.9,1.8,w*1.9,'#3a3030',t)}a('cyl',x,y+12.6,z,.3,3,.3,'#3a3030',0)},
house:(x,y,z,r,t,a)=>{const w=7+r*4,h=4+(r*97%1)*2;a('box',x,y,z,w,h,w*.8,C.bd[r*13%C.bd.length|0],t);a('pyr',x,y+h,z,w*1.15,w*.45,w*.95,'#2b2f36',t);a('gb',x,y+1,z,1.4,1.3,w*.82,C.win||'#ffd98a',t)},
rock:(x,y,z,r,t,a)=>a('sph',x,y-.5,z,3+r*5,2+r*2,3+r*5,'#6b7480',r*6)
};
/* terrain, road & chunks */
let GC,CR,CU,MC;
function terr(k,o){const p=PA[k],x=p.x-Math.cos(p.t)*o,z=p.z+Math.sin(p.t)*o,a=Math.abs(o);
 const b=sm(a,9,55)*C.tA*(Math.sin(x*.021+C.seed)*Math.cos(z*.017)*.7+Math.sin((x+z)*.037)*.4)+sm(a,55,230)*C.mt*Math.abs(Math.sin(x*.006+z*.005+C.seed)*.6+Math.sin(x*.011-z*.009+1)*.5);
 return[x,p.y+b-(a<6?.04:0),z,b]}
function tc(k,o,b){const a=Math.abs(o),g=GC[hs(k*3+(o>0?1:0))>.5?1:0].clone().multiplyScalar(.88+hs(k*13+a)*.24);let c=g;if(a<4.7)c=CU.clone();else if(a<7.1)c=CU.clone().lerp(g,.75);else if(a>=55)c.lerp(MC,Math.min(1,Math.abs(b)/(C.mt*.8)));return c}
function ribbon(cols,k0,k1,fn,mat){const pos=[],col=[],idx=[],nc=cols.length;
 for(let k=k0;k<=k1;k++)for(const o of cols){const v=fn(k,o);pos.push(v[0],v[1],v[2]);col.push(v[3],v[4],v[5])}
 for(let r=0;r<k1-k0;r++)for(let c=0;c<nc-1;c++){const a=r*nc+c;idx.push(a,a+1,a+nc,a+1,a+nc+1,a+nc)}
 const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(pos,3));g.setAttribute('color',new T.Float32BufferAttribute(col,3));g.setIndex(idx);g.computeVertexNormals();return new T.Mesh(g,mat)}
const MT=new T.MeshLambertMaterial({vertexColors:true,side:T.DoubleSide}),MPT=new T.MeshBasicMaterial({color:0xffffff,side:T.DoubleSide,polygonOffset:true,polygonOffsetFactor:-2,polygonOffsetUnits:-4});
const MS=new T.MeshLambertMaterial({vertexColors:true,side:T.DoubleSide,polygonOffset:true,polygonOffsetFactor:-1,polygonOffsetUnits:-2});
const LC=[-520,-240,-110,-45,-16,-7,-4.6,4.6,7,16,45,110,240,520],D=new T.Object3D(),col=new T.Color();
function build(c){
 const k0=c*N,k1=k0+N;gen(k1+125);const g=new T.Group();
 g.add(ribbon(LC,k0,k1,(k,o)=>{const v=terr(k,o),q=tc(k,o,v[3]);return[v[0],v[1],v[2],q.r,q.g,q.b]},MT));
 g.add(ribbon([-4.6,4.6],k0,k1,(k,o)=>{const p=PA[k],q=CR.clone().multiplyScalar(.95+hs(k*7)*.1);return[p.x-Math.cos(p.t)*o,p.y+.04,p.z+Math.sin(p.t)*o,q.r,q.g,q.b]},MT));
 const pos=[],idx=[],q=(sa,sb,o1,o2)=>{const A=at(sa),Bp=at(sb),n=pos.length/3;for(const[P,o]of[[A,o1],[A,o2],[Bp,o2],[Bp,o1]])pos.push(P.x-Math.cos(P.t)*o,P.y+.07,P.z+Math.sin(P.t)*o);idx.push(n,n+1,n+2,n,n+2,n+3)};
 const s0=k0*DS,s1=k1*DS;
 for(let s=s0;s<s1;s+=DS){q(s,s+DS,-4.35,-4.1);q(s,s+DS,4.1,4.35)}
 for(let j=Math.ceil(s0/12);j*12<s1;j++)q(j*12,j*12+5,-.12,.12);
 const pg=new T.BufferGeometry();pg.setAttribute('position',new T.Float32BufferAttribute(pos,3));pg.setIndex(idx);
 const pm=new T.Mesh(pg,MPT);pm.material=MPT.clone();pm.material.color.set(C.lane);g.add(pm);
 const SL=STUBS.filter(s=>s.i>=k0-10&&s.i<k1+10),sm0=stubGeo(SL.filter(s=>s.i>=k0&&s.i<k1));if(sm0)g.add(sm0);
 const near=(x,z,r)=>STUBS.some(s=>x>s.bb[0]-r&&x<s.bb[2]+r&&z>s.bb[1]-r&&z<s.bb[3]+r&&s.rp.some(q=>(q[0]-x)**2+(q[1]-z)**2<r*r));
 const RAD={tower:12,tree:2,villa:7,cypress:2,palm:2,pagoda:6,house:6,rock:5};
 /* keep scenery off every other part of the route (loops, inside of tight corners) so nothing solid ever blocks the road */
 const clr=(x,z,rad,k)=>{const m=(rad+11)*(rad+11);for(let j=Math.max(0,k-120);j<=k+120;j++){if(j>=k-2&&j<=k+2)continue;const p=PA[j];if(!p)break;if((p.x-x)*(p.x-x)+(p.z-z)*(p.z-z)<m)return false}return true};
 const L={},CL=[],a=(n,x,y,z,sx,sy,sz,cc,yw)=>{(L[n]||(L[n]=[])).push([x,y,z,sx,sy,sz,yw,cc]);
  if(n[0]==='B'||(n==='box'&&sx>2.5&&sy>2.5))CL.push([x,z,sx/2,sz/2,yw||0]);
  else if(n==='cyl'&&sy>2)CL.push([x,z,Math.max(.2,sx/2),0,0]);
  else if(n==='cone'&&sx<3)CL.push([x,z,sx*.4,0,0])};
 for(let k=k0;k<k1;k++){const p=PA[k];
  for(let sd=-1;sd<2;sd+=2){
   if(k%5===0){const[x,y,z]=terr(k,sd*8.2);if(!near(x,z,5)&&clr(x,z,1,k)){a('cyl',x,y,z,.25,7,.25,'#4a4f58',0);a('gs',x,y+6.8,z,.9,.9,.9,C.lamp,0)}}
   for(let l=0;l<3;l++){const h0=l<2?k*4+(sd>0?1:0)+l*2+C.seed*977:k*4+(sd>0?1:0)+100003+C.seed*977;if(hs(h0)>(l<2?C.d:C.d*.6))continue;
    const t=C.objs[hs(h0+7)*C.objs.length|0],o=sd*(MIN[t]+hs(h0+3)*(l===0?6:l===1?60:380)),[x,y,z]=terr(k,o);if(!near(x,z,Math.max(13,(RAD[t]||6)+8))&&clr(x,z,RAD[t]||6,k))B[t](x,y,z,hs(h0+11),p.t,a)}}}
 for(const n in L){const arr=L[n],im=new T.InstancedMesh(geoOf(n),matOf(n),arr.length);
  arr.forEach((e,i)=>{D.position.set(e[0],e[1],e[2]);D.scale.set(e[3],e[4],e[5]);D.rotation.y=e[6];D.updateMatrix();im.setMatrixAt(i,D.matrix);im.setColorAt(i,col.set(e[7]))});
  im.frustumCulled=false;g.add(im)}
 COLS.set(c,CL);S.add(g);return g}
const CK=new Map();
function dispose(g){S.remove(g);g.traverse(o=>{if(o.isInstancedMesh)o.dispose();else if(o.geometry)o.geometry.dispose()})}
function chunks(all){const cc=Math.floor(s/CH);let n=0;
 const ord=[];for(let c=Math.max(0,cc-BEHIND);c<=cc+AHEAD;c++)ord.push(c);ord.sort((p,q)=>Math.abs(p-cc)-Math.abs(q-cc));
 for(const c of ord)if(!CK.has(c)){CK.set(c,build(c));if(!all&&++n>=1)break}
 for(const[c,g]of CK)if(c<cc-BEHIND-1||c>cc+AHEAD+2){dispose(g);CK.delete(c);COLS.delete(c)}}
/* sky, sun, stars, aurora, lights */
const sg=new T.SphereGeometry(1000,24,16);sg.setAttribute('color',new T.BufferAttribute(new Float32Array(sg.attributes.position.count*3),3));
const sky=new T.Mesh(sg,new T.MeshBasicMaterial({vertexColors:true,side:T.BackSide,fog:false,depthWrite:false}));sky.renderOrder=-2;S.add(sky);
const GT=glow(),sunS=new T.Sprite(new T.SpriteMaterial({map:GT,fog:false,depthWrite:false,blending:T.AdditiveBlending}));sunS.scale.set(300,300,1);S.add(sunS);
const sp=[];for(let i=0;i<420;i++){const u=hs(i)*6.283,v=Math.pow(hs(i+999),.7)*1.4,r=950;sp.push(Math.cos(u)*Math.cos(v)*r,Math.sin(v)*r+30,Math.sin(u)*Math.cos(v)*r)}
const sgm=new T.BufferGeometry();sgm.setAttribute('position',new T.Float32BufferAttribute(sp,3));
const stars=new T.Points(sgm,new T.PointsMaterial({size:2.2,sizeAttenuation:false,fog:false,transparent:true,opacity:.85,depthWrite:false}));S.add(stars);
const ac=document.createElement('canvas');ac.width=512;ac.height=256;{const g=ac.getContext('2d');for(let i=0;i<90;i++){const l=g.createLinearGradient(0,0,0,256);l.addColorStop(0,'rgba(120,255,190,0)');l.addColorStop(.3,`rgba(${100+hs(i)*60|0},255,${160+hs(i+7)*60|0},${.12+hs(i+3)*.3})`);l.addColorStop(1,'rgba(120,255,190,0)');g.fillStyle=l;g.fillRect(hs(i+50)*512,0,3+hs(i+9)*12,256)}}
const AT=new T.CanvasTexture(ac);AT.wrapS=T.RepeatWrapping;
const aur=new T.Group();for(const r of[.3,1.5,4.2]){const pv=new T.Group(),m=new T.Mesh(new T.PlaneGeometry(1500,320),new T.MeshBasicMaterial({map:AT,transparent:true,blending:T.AdditiveBlending,side:T.DoubleSide,depthWrite:false,fog:false,opacity:.8}));m.position.set(0,330,880);pv.rotation.y=r;pv.add(m);aur.add(pv)}S.add(aur);
const hemi=new T.HemisphereLight(0xffffff,0x888888,1),dl=new T.DirectionalLight(0xffffff,1);S.add(hemi,dl);
/* car */
const car=new T.Group(),wheels=[],tails=[],revs=[],fpiv=[];car.rotation.order='YXZ';
/* Body panels are lofted from smooth cross-sections (rounded superellipses), so nothing is a plain box. */
function loft(sts,n,mat){const pos=[],idx=[];
 sts.forEach(q=>{const e=2/(q.e||3);for(let i=0;i<n;i++){const a=i/n*6.2832,c=Math.cos(a),s=Math.sin(a);
  pos.push(Math.sign(c)*Math.pow(Math.abs(c),e)*q.hw,q.cy+Math.sign(s)*Math.pow(Math.abs(s),e)*q.hh,q.z)}});
 for(let k=0;k<sts.length-1;k++)for(let i=0;i<n;i++){const a=k*n+i,b=k*n+(i+1)%n,c=(k+1)*n+i,d=(k+1)*n+(i+1)%n;idx.push(a,c,b,b,c,d)}
 for(const[k,f]of[[0,0],[sts.length-1,1]]){const ci=pos.length/3;pos.push(0,sts[k].cy,sts[k].z);for(let i=0;i<n;i++){const a=k*n+i,b=k*n+(i+1)%n;f?idx.push(ci,a,b):idx.push(ci,b,a)}}
 const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(pos,3));g.setIndex(idx);g.computeVertexNormals();
 const m=new T.Mesh(g,mat);car.add(m);return m}
/* half-width of a lofted shape at height y and position z (same maths as loft), used to seat trim exactly on the surface */
function halfW(S,y,z){let i=0;while(i<S.length-2&&z>S[i+1].z)i++;const a=S[i],b=S[i+1],u=clamp((z-a.z)/(b.z-a.z),0,1),f=k=>a[k]+(b[k]-a[k])*u,
 n=(a.e||3)+((b.e||3)-(a.e||3))*u,q=Math.abs(y-f('cy'))/f('hh');return q>=1?0:f('hw')*Math.pow(1-Math.pow(q,n),1/n)}
const PAINTS=[['Steel blue',0x365f8f],['Pearl white',0xe6e8ea],['Graphite',0x2c3138],['Racing green',0x1f5a43],['Silver',0xa9b0b8]];let paint=0;
const paintMat=new T.MeshPhongMaterial({color:PAINTS[0][1],shininess:90,specular:0x666666,side:T.DoubleSide}),
 glassMat=new T.MeshPhongMaterial({color:0x0e1722,shininess:140,specular:0x99aabb,side:T.DoubleSide}),
 trimMat=new T.MeshLambertMaterial({color:0x0b0d10}),
 tireMat=new T.MeshLambertMaterial({color:0x14161a}),
 rimMat=new T.MeshPhongMaterial({color:0xc9ced6,shininess:100,specular:0xffffff}),
 seamMat=new T.MeshBasicMaterial({color:0x07090c}),
 faceMat=new T.MeshLambertMaterial({color:0x16191e}),
 discMat=new T.MeshPhongMaterial({color:0x5a616b,shininess:60});
function setPaint(){paintMat.color.setHex(PAINTS[paint][1])}
/* stations run tail -> nose */
const HS=[{z:-2.25,hw:.60,hh:.20,cy:.66},{z:-2.17,hw:.78,hh:.26,cy:.67},{z:-1.85,hw:.90,hh:.30,cy:.68},{z:-1.2,hw:.93,hh:.31,cy:.68},{z:0,hw:.93,hh:.31,cy:.68},
 {z:1,hw:.92,hh:.29,cy:.66},{z:1.7,hw:.88,hh:.25,cy:.62},{z:2.1,hw:.78,hh:.21,cy:.58},{z:2.25,hw:.62,hh:.17,cy:.55}];
const GS=[{z:-1.3,hw:.70,hh:.05,cy:.98,e:2.5},{z:-1.05,hw:.74,hh:.16,cy:1.06,e:2.6},{z:-.55,hw:.76,hh:.24,cy:1.16,e:2.8},{z:0,hw:.76,hh:.25,cy:1.17,e:2.8},
 {z:.45,hw:.75,hh:.20,cy:1.13,e:2.8},{z:.85,hw:.72,hh:.10,cy:1.04,e:2.6},{z:1,hw:.66,hh:.04,cy:.99,e:2.5}];
const RS=[{z:-.95,hw:.64,hh:.03,cy:1.20,e:2.6},{z:-.5,hw:.72,hh:.06,cy:1.38,e:2.8},{z:0,hw:.72,hh:.06,cy:1.38,e:2.8},{z:.4,hw:.70,hh:.05,cy:1.33,e:2.8},{z:.62,hw:.62,hh:.03,cy:1.23,e:2.6}];
loft(HS,28,paintMat);      /* hull */
loft(GS,24,glassMat);      /* glasshouse */
loft(RS,20,paintMat);      /* roof panel */
const sph=(sx,sy,sz,x,y,z,mat)=>{const m=new T.Mesh(new T.SphereGeometry(1,14,10),mat);m.scale.set(sx,sy,sz);m.position.set(x,y,z);car.add(m);return m};
const box=(w,h,l,x,y,z,mat)=>{const m=new T.Mesh(new T.BoxGeometry(w,h,l),mat);m.position.set(x,y,z);car.add(m);return m};
const lampMat=()=>new T.MeshBasicMaterial({color:0xfff4d6});
/* thin tube that follows a lofted surface at height range y0..y1, offset a hair outside it */
function tubeAlong(S,z,y0,y1,rad,mat,off){for(const sd of[-1,1]){const pts=[];for(let i=0;i<=8;i++){const y=y0+(y1-y0)*i/8;pts.push(new T.Vector3(sd*(halfW(S,y,z)+off),y,z))}
 car.add(new T.Mesh(new T.TubeGeometry(new T.CatmullRomCurve3(pts),12,rad,6,false),mat))}}
function plateTex(txt){const c=document.createElement('canvas');c.width=128;c.height=32;const g=c.getContext('2d');
 g.fillStyle='#f3f1e6';g.fillRect(0,0,128,32);g.fillStyle='#1d3f8f';g.fillRect(0,0,12,32);g.strokeStyle='#222';g.lineWidth=2;g.strokeRect(1,1,126,30);
 g.fillStyle='#16181d';g.font='bold 20px monospace';g.textAlign='center';g.textBaseline='middle';g.fillText(txt,70,17);return new T.CanvasTexture(c)}
for(const sd of[-1,1]){
 sph(.24,.09,.095,sd*.52,.62,2.215,trimMat);                          /* headlight housings */
 sph(.20,.065,.07,sd*.52,.62,2.235,lampMat());                        /* headlights */
 sph(.035,.03,.03,sd*.52,.43,2.24,lampMat());                         /* fog lights */
 sph(.07,.055,.12,sd*.97,1.0,.68,paintMat);                           /* mirrors */
 box(.40,.03,.05,sd*.76,.975,.68,paintMat);                           /* mirror stems (root buried in the glass) */
 const arch=new T.Mesh(new T.CylinderGeometry(.43,.43,.03,24),trimMat);arch.rotation.z=Math.PI/2;arch.position.set(sd*.93,.36,1.38);car.add(arch);
 const arch2=arch.clone();arch2.position.set(sd*.93,.36,-1.32);car.add(arch2);
 const ex=new T.Mesh(new T.CylinderGeometry(.06,.06,.12,12),rimMat);ex.rotation.x=Math.PI/2;ex.position.set(sd*.42,.40,-2.25);car.add(ex);   /* exhaust tips */
 tails.push(box(.22,.10,.06,sd*.52,.70,-2.235,new T.MeshBasicMaterial({color:0xaa2222})));
 revs.push(box(.10,.05,.04,sd*.28,.70,-2.24,new T.MeshBasicMaterial({color:0x555555})));   /* reverse lights */
 for(const hz of[.05,-.9])box(.028,.03,.15,sd*(halfW(HS,.8,hz)+.012),.8,hz,rimMat);          /* door handles */
}
tails.push(box(1.0,.05,.04,0,.80,-2.27,new T.MeshBasicMaterial({color:0xaa2222})));
box(.84,.11,.05,0,.46,2.27,trimMat);box(1.3,.05,.06,0,.40,2.25,trimMat);                 /* grille + front lip */
for(const z of[.88,-.12,-1.05])tubeAlong(HS,z,.46,.92,.0065,seamMat,.008);               /* door shut lines */
tubeAlong(GS,-.12,.97,1.32,.028,paintMat,.012);                                           /* B-pillars */
box(.05,.05,.17,0,1.43,-.55,paintMat);                                                    /* shark-fin antenna */
box(1.1,.04,.14,0,.94,-2.05,paintMat);                                                    /* boot-lid lip spoiler */
for(const[z,ry]of[[2.262,0],[-2.262,Math.PI]]){const p=new T.Mesh(new T.PlaneGeometry(.46,.12),new T.MeshBasicMaterial({map:plateTex('URBAN 01'),side:T.DoubleSide}));
 p.position.set(0,z>0?.60:.57,z);p.rotation.y=ry;car.add(p)}                              /* number plates */
/* wheels: rounded tyre, dark face, silver spokes and rim ring over a brake disc; fronts sit on a steering pivot */
for(const[x,z,front]of[[-.855,1.38,1],[.855,1.38,1],[-.855,-1.32,0],[.855,-1.32,0]]){
 const pv=new T.Group(),w=new T.Group(),sd=Math.sign(x);
 const tg=new T.TorusGeometry(.265,.095,10,24);tg.rotateY(Math.PI/2);w.add(new T.Mesh(tg,tireMat));
 const core=new T.Mesh(new T.CylinderGeometry(.27,.27,.17,20),tireMat);core.rotation.z=Math.PI/2;w.add(core);
 const face=new T.Mesh(new T.CylinderGeometry(.225,.225,.03,24),faceMat);face.rotation.z=Math.PI/2;face.position.x=sd*.09;w.add(face);
 const ring=new T.TorusGeometry(.225,.022,8,28);ring.rotateY(Math.PI/2);const rg=new T.Mesh(ring,rimMat);rg.position.x=sd*.1;w.add(rg);
 const disc=new T.Mesh(new T.CylinderGeometry(.15,.15,.015,20),discMat);disc.rotation.z=Math.PI/2;disc.position.x=sd*.108;w.add(disc);
 for(let i=0;i<5;i++){const sp=new T.Mesh(new T.BoxGeometry(.024,.40,.05),rimMat);sp.rotation.x=i*Math.PI/5;sp.position.x=sd*.118;w.add(sp)}
 const cap=new T.Mesh(new T.CylinderGeometry(.055,.055,.03,14),rimMat);cap.rotation.z=Math.PI/2;cap.position.x=sd*.13;w.add(cap);
 pv.add(w);pv.position.set(x,.36,z);car.add(pv);wheels.push(w);if(front)fpiv.push(pv)}
/* soft ground shadow + night headlight beam */
{const c=document.createElement('canvas');c.width=c.height=64;const g=c.getContext('2d'),gr=g.createRadialGradient(32,32,2,32,32,32);gr.addColorStop(0,'rgba(0,0,0,.55)');gr.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=gr;g.fillRect(0,0,64,64);
 const sh=new T.Mesh(new T.PlaneGeometry(2.7,5.3),new T.MeshBasicMaterial({map:new T.CanvasTexture(c),transparent:true,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-2,polygonOffsetUnits:-4}));
 sh.rotation.x=-Math.PI/2;sh.position.y=.08;car.add(sh)}
const beam=new T.SpotLight(0xfff1d0,0,70,.55,.6,1);beam.position.set(0,.8,2.0);const beamT=new T.Object3D();beamT.position.set(0,0,14);car.add(beam,beamT);beam.target=beamT;
S.add(car);
/* state */
let s=0,d=0,v=0,vl=0,st=0,view=0,snap=true,brake=false,cur=0,target=-1,fade=1,menu=false,sel=0;
let busy=true,finished=false,tm=0,STUBS=[],mmMode=0;
let px=0,pz=0,py=0,hd=0,ci=0,pitch=0,roll=0,started=false,guide=null,onRoad=true,lastEdge=0;
const keys={},camLook=new T.Vector3(),fadeEl=document.getElementById('fade');
function setup(){
 C=CITIES[cur];for(const g of CK.values())dispose(g);CK.clear();COLS.clear();PA=[];
 GC=C.g.map(h=>new T.Color(h));CR=new T.Color(C.road);CU=new T.Color(C.curb);MC=new T.Color(C.mc);
 S.background=new T.Color(C.fog);S.fog=new T.FogExp2(C.fog,C.fd);
 const a=sg.attributes.position,co=sg.attributes.color,tp=new T.Color(C.top),f=new T.Color(C.fog),c=new T.Color();
 for(let i=0;i<a.count;i++){const h=a.getY(i)/1000;c.copy(f);if(h>0)c.lerp(tp,Math.pow(h,.55));co.setXYZ(i,c.r,c.g,c.b)}co.needsUpdate=true;
 hemi.color.set(C.hc);hemi.groundColor.set(C.g[0]);hemi.intensity=C.hi;dl.color.set(C.sun);dl.intensity=C.sI;
 const sd=new T.Vector3(Math.cos(C.el)*Math.sin(C.az),Math.sin(C.el),Math.cos(C.el)*Math.cos(C.az));dl.position.copy(sd).multiplyScalar(100);sunS.userData.dir=sd;sunS.material.color.set(C.sun);
 stars.visible=!!C.stars;aur.visible=!!C.aur;
 if(MB)MB.dispose();MB=new T.MeshLambertMaterial(C.night?{map:TX[1],emissiveMap:TX[2],emissive:0xffffff}:{map:TX[0]});
 s=0;d=0;vl=0;v=0;st=0;snap=true;tm=0;started=false;finished=false;guide=null;onRoad=true;pitch=0;roll=0;finEl.classList.remove('on');chunks(true);
 gen(80);px=PA[0].x;pz=PA[0].z;hd=PA[0].t;py=PA[0].y;ci=0}

/* ---- routes: precomputed in data/routes.json (built once with tools/build-routes.html; no map servers needed while playing) ---- */
/* ---- real roads from OpenStreetMap ---- */
const msgEl=document.getElementById('msg'),toastEl=document.getElementById('toast'),finEl=document.getElementById('fin');
let tt=0;function toast(t,ms){toastEl.textContent=t;toastEl.classList.add('on');clearTimeout(tt);tt=setTimeout(()=>toastEl.classList.remove('on'),ms||4000)}
function resample(P,st){const o=[[P[0][0],P[0][1]]];let need=st;
 for(let i=0;i<P.length-1;i++){let ax=P[i][0],ay=P[i][1];const bx=P[i+1][0],by=P[i+1][1];let sl=Math.hypot(bx-ax,by-ay);
  while(sl>=need&&sl>0){const u=need/sl;ax+=(bx-ax)*u;ay+=(by-ay)*u;o.push([ax,ay]);sl=Math.hypot(bx-ax,by-ay);need=st}
  need-=sl}
 return o}
function pathFrom(pts){const n=pts.length,o=[];let pt=0;
 for(let i=0;i<n;i++){const j=Math.min(i,n-2),dx=pts[j+1][0]-pts[j][0],dz=pts[j+1][1]-pts[j][1];let t=Math.atan2(dx,dz);
  while(t-pt>Math.PI)t-=2*Math.PI;while(t-pt<-Math.PI)t+=2*Math.PI;pt=t;o.push({x:pts[i][0],z:pts[i][1],y:hill(i*DS)*.5,t})}
 return o}
let STATIC=null,ROUTES_ERR=null;
async function staticRoutes(){if(STATIC===null){if(window.ROUTES)STATIC=window.ROUTES;else{STATIC={};ROUTES_ERR=new Error('routes.js not loaded');console.warn('routes.js not loaded')}}return STATIC}
async function loadRoute(){
 RT=null;STUBS=[];const o=(await staticRoutes())[C.n];
 if(o&&o.p&&o.p.length>20){RT=pathFrom(o.p);prepStubs(o.s||[]);return}
 toast(ROUTES_ERR?'Could not load routes.js. Make sure routes.js is in the same folder as index.html. Driving an endless made-up road for now.':C.n+' has no saved route yet, so this is an endless made-up road. See the README to add one.',9000)}
function prepStubs(raw){STUBS=raw.map(p=>{let bi=0,bd=1e18;for(let i=0;i<RT.length;i++){const d=(RT[i].x-p[0][0])**2+(RT[i].z-p[0][1])**2;if(d<bd){bd=d;bi=i}}const rp=resample(p,5);let x0=1e18,z0=1e18,x1=-1e18,z1=-1e18;for(const q of rp){x0=Math.min(x0,q[0]);x1=Math.max(x1,q[0]);z0=Math.min(z0,q[1]);z1=Math.max(z1,q[1])}return{i:bi,pts:p,rp,bb:[x0,z0,x1,z1]}})}
function groundY(x,z,i0){gen(i0+14);let bk=Math.max(0,i0-12),bd=1e18;
 for(let k=Math.max(0,i0-12);k<=i0+12;k++){const p=PA[k],d=(p.x-x)**2+(p.z-z)**2;if(d<bd){bd=d;bk=k}}
 const p=PA[bk],o=-(x-p.x)*Math.cos(p.t)+(z-p.z)*Math.sin(p.t);return terr(bk,o)[1]}
function stubGeo(list){const pos=[],col=[],idx=[];
 for(const s of list){const r=s.rp;if(r.length<2)continue;const base=pos.length/3;
  for(let j=0;j<r.length;j++){const a0=r[Math.max(0,j-1)],b0=r[Math.min(r.length-1,j+1)];let dx=b0[0]-a0[0],dz=b0[1]-a0[1];const L=Math.hypot(dx,dz)||1;dx/=L;dz/=L;
   for(const sd of[-3.3,3.3]){const x=r[j][0]-dz*sd,z=r[j][1]+dx*sd,q=CR.clone().multiplyScalar(.95+hs(j*7+s.i)*.1);pos.push(x,groundY(x,z,s.i)+.12,z);col.push(q.r,q.g,q.b)}}
  for(let j=0;j<r.length-1;j++){const q=base+j*2;idx.push(q,q+1,q+2,q+1,q+3,q+2)}}
 if(!idx.length)return null;
 const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(pos,3));g.setAttribute('color',new T.Float32BufferAttribute(col,3));g.setIndex(idx);g.computeVertexNormals();return new T.Mesh(g,MS)}
/* ---- minimap ---- */
const mm=document.getElementById('mm'),mg=mm.getContext('2d'),MW=160,mdp=Math.min(devicePixelRatio||1,2);mm.width=MW*mdp;mm.height=MW*mdp;
function drawMap(cp,t){
 if(!RT){mm.style.display='none';return}mm.style.display='block';
 const g=mg,sn=Math.sin(t),cs=Math.cos(t),idx=Math.min(RT.length-1,Math.max(0,Math.round(s/DS)));
 g.setTransform(mdp,0,0,mdp,0,0);g.clearRect(0,0,MW,MW);g.fillStyle='rgba(10,14,24,.74)';g.fillRect(0,0,MW,MW);
 let P,lo=0,hi=RT.length-1,step=1;
 if(mmMode===0){const sc=.42;P=(x,z)=>{const dx=x-cp.x,dz=z-cp.z;return[MW/2+(-dx*cs+dz*sn)*sc,MW*.62-(dx*sn+dz*cs)*sc]};lo=Math.max(0,idx-55);hi=Math.min(RT.length-1,idx+55)}
 else{let x0=1e18,x1=-1e18,z0=1e18,z1=-1e18;for(let i=0;i<RT.length;i+=4){const p=RT[i];x0=Math.min(x0,p.x);x1=Math.max(x1,p.x);z0=Math.min(z0,p.z);z1=Math.max(z1,p.z)}
  const sc=Math.min((MW-28)/Math.max(1,x1-x0),(MW-28)/Math.max(1,z1-z0)),mx=(x0+x1)/2,mz=(z0+z1)/2;P=(x,z)=>[MW/2-(x-mx)*sc,MW/2-(z-mz)*sc];step=2}
 g.lineCap='round';g.lineJoin='round';g.strokeStyle='rgba(255,255,255,.4)';g.lineWidth=1.6;g.beginPath();
 for(const s2 of STUBS){if(mmMode===0&&Math.abs(s2.i-idx)>60)continue;const q0=P(s2.pts[0][0],s2.pts[0][1]);g.moveTo(q0[0],q0[1]);for(let j=1;j<s2.pts.length;j++){const q=P(s2.pts[j][0],s2.pts[j][1]);g.lineTo(q[0],q[1])}}
 g.stroke();
 const seg=(a,b,c,w)=>{g.strokeStyle=c;g.lineWidth=w;g.beginPath();let f=1;for(let i=a;i<=b;i+=step){const q=P(RT[i].x,RT[i].z);if(f){g.moveTo(q[0],q[1]);f=0}else g.lineTo(q[0],q[1])}g.stroke()};
 if(idx>lo)seg(lo,idx,'rgba(255,255,255,.45)',3);seg(idx,hi,'#ffd166',3.4);
 if(guide&&guide.off>10){const a=P(cp.x,cp.z),b=P(guide.x,guide.z);g.save();g.setLineDash([5,4]);g.strokeStyle='#7cffb2';g.lineWidth=2;g.beginPath();g.moveTo(a[0],a[1]);g.lineTo(b[0],b[1]);g.stroke();g.restore();
  g.fillStyle='#7cffb2';g.beginPath();g.arc(b[0],b[1],3.2,0,6.283);g.fill()}
 const fe=RT[RT.length-1],fq=P(fe.x,fe.z);if(fq[0]>3&&fq[0]<MW-3&&fq[1]>3&&fq[1]<MW-3){g.fillStyle='#fff';g.beginPath();g.arc(fq[0],fq[1],4.5,0,6.283);g.fill();g.fillStyle='#e0483f';g.beginPath();g.arc(fq[0],fq[1],2.4,0,6.283);g.fill()}
 const cq=P(cp.x,cp.z);g.fillStyle='#e0483f';g.strokeStyle='#fff';g.lineWidth=1.5;g.beginPath();
 if(mmMode===0){g.moveTo(cq[0],cq[1]-7);g.lineTo(cq[0]+5,cq[1]+5);g.lineTo(cq[0],cq[1]+2);g.lineTo(cq[0]-5,cq[1]+5)}else g.arc(cq[0],cq[1],4,0,6.283);
 g.closePath();g.fill();g.stroke();
 if(mmMode===0){g.fillStyle='rgba(255,255,255,.8)';g.font='600 11px system-ui,sans-serif';g.textAlign='center';g.textBaseline='middle';g.fillText('N',MW/2+sn*62,MW/2-cs*62)}}
async function load(){
 busy=true;C=CITIES[cur];
 msgEl.innerHTML=`<div><b style="font-size:26px;letter-spacing:.02em">Urban Streets</b><br>Loading ${C.n}<small>${C.r}</small></div>`;msgEl.classList.add('on');
 await loadRoute();setup();msgEl.classList.remove('on');busy=false}
function finish(){finished=true;const L=(RT.length-1)*DS,m=Math.floor(tm/60),sc=Math.floor(tm%60);
 finEl.innerHTML=`<div class="panel"><h2>${C.n}: route complete</h2><div class="foot" style="font-size:14px">${C.r} · ${(L/1000).toFixed(1)} km in ${m}:${String(sc).padStart(2,'0')}</div><div class="foot">Enter to drive it again · C to choose another city</div></div>`;finEl.classList.add('on')}
/* ---- free roam: where am I relative to the route, ground height, collisions, guidance ---- */
function proj(x,z,hint,range){
 const lo=Math.max(0,hint-range),hi=hint+range;gen(hi+2);
 let bk=lo,bd=1e18;
 for(let k=lo;k<=hi;k++){const p=PA[k],dd=(p.x-x)*(p.x-x)+(p.z-z)*(p.z-z);if(dd<bd){bd=dd;bk=k}}
 let best=null;
 for(let k=Math.max(0,bk-1);k<=bk;k++){const a=PA[k],b=PA[k+1],ex=b.x-a.x,ez=b.z-a.z,l2=ex*ex+ez*ez||1,u=clamp(((x-a.x)*ex+(z-a.z)*ez)/l2,0,1),qx=a.x+ex*u,qz=a.z+ez*u,dd=(x-qx)*(x-qx)+(z-qz)*(z-qz);
  if(!best||dd<best.dd){const L=Math.sqrt(l2)||1;best={k,u,qx,qz,dd,tx:ex/L,tz:ez/L}}}
 best.o=(x-best.qx)*(-best.tz)+(z-best.qz)*best.tx;   /* signed offset, positive = right of the route */
 best.d=Math.sqrt(best.dd);best.idx=best.k+best.u;return best}
function colH(k,o){const n=LC.length;o=clamp(o,LC[0],LC[n-1]);let c=0;while(c<n-2&&o>LC[c+1])c++;
 const o0=LC[c],o1=LC[c+1],w=(o-o0)/(o1-o0);return terr(k,o0)[1]*(1-w)+terr(k,o1)[1]*w}
function ground(pr){const a=colH(pr.k,pr.o),b=colH(pr.k+1,pr.o);return a+(b-a)*pr.u}
/* circle (car) vs obstacle: obstacle is [x,z,hx,hz,yaw] (box, hz>0) or [x,z,r,0,0] (circle). Returns [nx,nz,penetration] or null */
function pushCircle(qx,qz,r,c){
 if(c[3]>0){const cs=Math.cos(c[4]),sn=Math.sin(c[4]),dx=qx-c[0],dz=qz-c[1],lx=cs*dx-sn*dz,lz=sn*dx+cs*dz,hx=c[2],hz=c[3];
  const cx=clamp(lx,-hx,hx),cz=clamp(lz,-hz,hz),ex=lx-cx,ez=lz-cz,dd=ex*ex+ez*ez;
  if(dd>=r*r)return null;
  let nx,nz,pen;
  if(dd>1e-9){const L=Math.sqrt(dd);nx=ex/L;nz=ez/L;pen=r-L}
  else{const a=hx-Math.abs(lx),b=hz-Math.abs(lz);if(a<b){nx=Math.sign(lx)||1;nz=0;pen=a+r}else{nx=0;nz=Math.sign(lz)||1;pen=b+r}}
  return[cs*nx+sn*nz,-sn*nx+cs*nz,pen]}
 const dx=qx-c[0],dz=qz-c[1],dd=dx*dx+dz*dz,rr=r+c[2];
 if(dd>=rr*rr)return null;
 const L=Math.sqrt(dd);return L<1e-6?[1,0,rr]:[dx/L,dz/L,rr-L]}
function collide(){
 const fx=Math.sin(hd),fz=Math.cos(hd);
 for(const off of[1.3,-1.3])for(const CL of COLS.values())for(const c of CL){
  const qx=px+fx*off,qz=pz+fz*off;
  if(Math.abs(c[0]-qx)>40||Math.abs(c[1]-qz)>40)continue;
  const h=pushCircle(qx,qz,1.0,c);if(!h)continue;
  px+=h[0]*h[2];pz+=h[1]*h[2];
  const f=-(fx*h[0]+fz*h[1])*(v>=0?1:-1);if(f>0&&Math.abs(v)>.5)v*=1-Math.min(1,f)*Math.min(1,f)*.5}}
function respawn(){if(busy||finished||menu||!PA.length)return;
 const pr=proj(px,pz,ci,60),k=Math.round(pr.idx);gen(k+2);const p=PA[k];px=p.x;pz=p.z;hd=p.t;v=0;st=0;snap=true;toast('Back on the route',1400)}
const guideEl=document.getElementById('guide'),garrow=document.getElementById('garrow'),gtxt=document.getElementById('gtxt');let lastGT='';
function updGuide(){
 if(!guide||finished||menu){guideEl.style.display='none';return}
 guideEl.style.display='block';
 const off=guide.off>8.5;let txt;
 if(!off)txt=Math.abs(guide.dh)>2.2?'Wrong way: turn around':'On route';
 else{const r=guide.rel,w=Math.abs(r)<.45?'straight ahead':Math.abs(r)>2.4?'behind you':(r>0?'to your left':'to your right');
  txt=(guide.rt?'Side street':'Off road')+' · '+Math.round(guide.off)+' m from route · route is '+w}
 if(txt!==lastGT){gtxt.textContent=txt;lastGT=txt}
 garrow.style.transform='rotate('+(-guide.rel*180/Math.PI).toFixed(1)+'deg)';garrow.style.color=off||Math.abs(guide.dh)>2.2?'#ffd166':'#7cffb2'}
/* update */
function update(dt){
 const m=menu,k=keys,fin=finished,drv=!m&&!fin;
 const up=drv&&(k.w||k.arrowup),dn=drv&&(k.s||k.arrowdown),lf=drv&&(k.a||k.arrowleft),rt=drv&&(k.d||k.arrowright);
 /* speed */
 if(up)v+=(v<-.3?26:9)*dt;else if(dn)v-=(v>.3?24:7)*dt;
 else if(fin)v-=Math.sign(v)*Math.min(Math.abs(v),24*dt);else v-=Math.sign(v)*Math.min(Math.abs(v),2*dt);
 if(!onRoad&&Math.abs(v)>10)v-=Math.sign(v)*8*dt;
 if(v>(onRoad?MAX:24))v-=15*dt;
 v=clamp(v,-9,MAX);if(m&&!fin&&v<10)v=Math.min(10,v+6*dt);
 brake=(dn&&v>.3)||(up&&v<-.3)||(fin&&v>.3);
 /* steering (the menu autopilot follows the guide so the car stays on the road behind it) */
 let sg=(rt?1:0)-(lf?1:0);if(m&&!fin)sg=guide?clamp(-guide.rel*2.2,-1,1):0;
 st+=(sg-st)*Math.min(1,dt*6);
 const om=-st*1.25/(1+Math.abs(v)*.045)*clamp(v/1.5,-1,1);   /* yaw rate, positive = turning left */
 hd+=om*dt;px+=Math.sin(hd)*v*dt;pz+=Math.cos(hd)*v*dt;
 collide();
 /* where am I relative to the route */
 let pr=proj(px,pz,ci,60),adj=false;
 if(pr.d>DLIM){const e=pr.d-DLIM;px+=(pr.qx-px)/pr.d*e;pz+=(pr.qz-pz)/pr.d*e;v*=.9;adj=true;
  const now=performance.now();if(now-lastEdge>4000){lastEdge=now;toast('Edge of the map: turn back toward the route',2200)}}
 if(pr.k===0&&pr.u===0){const al=(px-PA[0].x)*pr.tx+(pz-PA[0].z)*pr.tz;if(al<-2){px+=pr.tx*(-2-al);pz+=pr.tz*(-2-al);if(v<0)v*=.5;adj=true}}
 if(adj)pr=proj(px,pz,ci,60);
 let ns=false;for(const sb of STUBS){if(Math.abs(sb.i-pr.k)>90)continue;for(const q of sb.rp){const dx=q[0]-px,dz=q[1]-pz;if(dx*dx+dz*dz<16){ns=true;break}}if(ns)break}
 onRoad=pr.d<=7.1||ns;ci=pr.k;s=pr.idx*DS;d=pr.o;
 if(RT&&!finished&&pr.idx>=RT.length-6){const fe=RT[RT.length-1];if(Math.hypot(px-fe.x,pz-fe.z)<22)finish()}
 if(!finished&&(started||Math.abs(v)>.5)){started=true;tm+=dt}
 /* guidance */
 if(RT){const look=clamp(Math.round(3+pr.d/10),4,30),T2=RT[Math.min(RT.length-1,Math.floor(pr.idx)+look)];
  let rel=Math.atan2(T2.x-px,T2.z-pz)-hd;rel=Math.atan2(Math.sin(rel),Math.cos(rel));
  let dh=hd-Math.atan2(pr.tx,pr.tz);dh=Math.atan2(Math.sin(dh),Math.cos(dh));
  guide={x:T2.x,z:T2.z,rel,off:pr.d,dh,rt:onRoad}}else guide=null;
 updGuide();
 /* pose on the terrain */
 const fx=Math.sin(hd),fz=Math.cos(hd),ax=Math.cos(hd),az=-Math.sin(hd),gAt=(x,z)=>ground(proj(x,z,ci,12));
 py=gAt(px,pz)+(ns?.13:.08);
 const hf=gAt(px+fx*1.5,pz+fz*1.5),hr=gAt(px-fx*1.5,pz-fz*1.5),hl=gAt(px+ax,pz+az),hq=gAt(px-ax,pz-az),kk=Math.min(1,dt*10);
 pitch+=(clamp(-Math.atan2(hf-hr,3),-.5,.5)-pitch)*kk;
 roll+=(clamp(Math.atan2(hl-hq,2)+om*v*.003,-.4,.4)-roll)*kk;
 car.position.set(px,py,pz);car.rotation.set(pitch,hd,roll);
 wheels.forEach(w=>w.rotation.x+=v*dt/.36);fpiv.forEach(p=>p.rotation.y=-st*.38);beam.intensity=C.night?1.5:0;
 tails.forEach(t=>t.material.color.set(brake?0xff5555:0xaa2222));revs.forEach(t=>t.material.color.set(v<-.3?0xffffff:0x555555));
 /* camera */
 if(view===1){cam.position.set(px+fx*.5,py+1.2,pz+fz*.5);camLook.set(px+fx*30,py+1.2,pz+fz*30);cam.lookAt(camLook)}
 else{const dist=view?15:8.5,h=view?6.5:3.1,tx=px-fx*dist,ty=py+h,tz=pz-fz*dist,lx=px+fx*12,ly=py+1.4,lz=pz+fz*12;
  if(snap){cam.position.set(tx,ty,tz);camLook.set(lx,ly,lz);snap=false}
  else{const a=1-Math.exp(-dt*4.5),b=1-Math.exp(-dt*6);cam.position.x+=(tx-cam.position.x)*a;cam.position.y+=(ty-cam.position.y)*a;cam.position.z+=(tz-cam.position.z)*a;camLook.x+=(lx-camLook.x)*b;camLook.y+=(ly-camLook.y)*b;camLook.z+=(lz-camLook.z)*b}
  cam.lookAt(camLook)}
 cam.fov=68+Math.abs(v)*.4;cam.updateProjectionMatrix();
 sky.position.copy(cam.position);stars.position.copy(cam.position);aur.position.copy(cam.position);
 sunS.position.copy(cam.position).addScaledVector(sunS.userData.dir,900);AT.offset.x+=dt*.004;
 drawMap({x:px,z:pz},hd);const L=RT?(RT.length-1)*DS:0;document.getElementById('spd').innerHTML=Math.round(Math.abs(v)*3.6)+'<small>km/h</small>'+(RT?'<small style="display:block;margin:0">'+(Math.min(s,L)/1000).toFixed(1)+' / '+(L/1000).toFixed(1)+' km</small>':'')}
/* menu & input */
const list=document.getElementById('list'),menuEl=document.getElementById('menu');
CITIES.forEach((c,i)=>{const r=document.createElement('div');r.className='row';r.innerHTML=`<div class="sw" style="background:linear-gradient(${c.top},${c.fog} 70%,${c.g[0]})"></div><div><b>${c.n}</b><span>${c.t} · ${c.r}</span></div><i>${i+1}</i>`;r.dataset.city=c.n;r.onclick=()=>pick(i);r.onmouseenter=()=>{sel=i;mark()};list.appendChild(r)});
staticRoutes().then(R=>{[...list.children].forEach(r=>{if(!R[r.dataset.city]){const sp=r.querySelector('span');sp.textContent+=' · no route yet'}})});
function mark(){[...list.children].forEach((r,i)=>r.classList.toggle('sel',i===sel))}
function toggleMenu(x){menu=x===undefined?!menu:x;if(menu){sel=cur;mark()}menuEl.classList.toggle('on',menu)}
function pick(i){if(i!==cur&&target<0)target=i;toggleMenu(false)}
function label(){document.getElementById('name').innerHTML=`${C.n}<small>${C.t} · ${C.r}</small>`}
addEventListener('keydown',e=>{const k=e.key.toLowerCase();
 if(['arrowup','arrowdown','arrowleft','arrowright',' '].includes(k))e.preventDefault();
 if(k==='c'){if(!e.repeat)toggleMenu();return}
 if(menu){if(k==='escape')toggleMenu(false);else if(['arrowdown','s','arrowright','d'].includes(k)){sel=(sel+1)%CITIES.length;mark()}else if(['arrowup','w','arrowleft','a'].includes(k)){sel=(sel+CITIES.length-1)%CITIES.length;mark()}else if(k==='enter'||k===' ')pick(sel);else if(k>='1'&&+k<=CITIES.length)pick(+k-1);return}
 if(finished&&k==='enter'&&target<0){target=cur;return}
 if(k==='r'&&!e.repeat){respawn();return}
 if(k==='m'&&!e.repeat){mmMode^=1;return}
 if(k==='p'&&!e.repeat){paint=(paint+1)%PAINTS.length;setPaint();toast('Paint: '+PAINTS[paint][0],1600);return}
 if(k==='v'&&!e.repeat){view=(view+1)%3;snap=true;return}
 keys[k]=1});
addEventListener('keyup',e=>{keys[e.key.toLowerCase()]=0});
addEventListener('blur',()=>{for(const k in keys)keys[k]=0});
load();label();
let last=performance.now();
function loop(t){const dt=Math.max(0,Math.min(.05,(t-last)/1000));last=t;
 if(target>=0){fade+=dt*2.2;if(fade>=1){fade=1;cur=target;target=-1;load();label()}}else if(fade>0&&!busy)fade=Math.max(0,fade-dt*1.4);
 fadeEl.style.opacity=busy?1:fade;if(!busy){update(dt);chunks(false);R.render(S,cam)}requestAnimationFrame(loop)}
requestAnimationFrame(loop);
