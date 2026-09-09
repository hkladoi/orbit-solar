import * as THREE from 'three';
import { bodies } from './solar-data';
import { loadSpacecraft, disposeSpacecraft, type SpacecraftId } from './spacecraft-models';
import type { Language } from './i18n';
import { defaultSpaceLayers, spaceObjects, spaceObjectById, type SpaceObject, type SpaceLayers } from './space-data';

const tau = Math.PI * 2;
const yAxis = new THREE.Vector3(0, 1, 0);
const zAxis = new THREE.Vector3(0, 0, 1);
export function skyDirection(ra: number, dec: number) {
  const a = THREE.MathUtils.degToRad(ra), d = THREE.MathUtils.degToRad(dec), e = THREE.MathUtils.degToRad(23.43928);
  // Equatorial -> ecliptic, then map ecliptic north to Three's +Y.
  const x = Math.cos(d) * Math.cos(a), y = Math.cos(d) * Math.sin(a), z = Math.sin(d);
  return new THREE.Vector3(x, -y * Math.sin(e) + z * Math.cos(e), -y * Math.cos(e) - z * Math.sin(e));
}
export function orbitalPosition(orbit: NonNullable<SpaceObject['orbit']>, days: number) {
  const m = orbit.phase + (days % orbit.period) / orbit.period * tau, eccentricity = orbit.eccentricity ?? 0;
  let anomaly = m;
  for (let n = 0; n < 6; n++) anomaly -= (anomaly - eccentricity * Math.sin(anomaly) - m) / (1 - eccentricity * Math.cos(anomaly));
  const p = new THREE.Vector3(orbit.radius * (Math.cos(anomaly) - eccentricity), 0, -orbit.radius * Math.sqrt(1 - eccentricity ** 2) * Math.sin(anomaly));
  p.applyAxisAngle(zAxis, THREE.MathUtils.degToRad(orbit.inclination)).applyAxisAngle(yAxis, orbit.node);
  if (orbit.equatorial) p.applyAxisAngle(zAxis, THREE.MathUtils.degToRad(bodies[orbit.parent].tilt));
  return p;
}

export class SpaceScene {
  readonly root = new THREE.Group();
  readonly pickables: THREE.Object3D[] = [];
  private nodes = new Map<string, THREE.Group>();
  private paths = new Map<string, THREE.LineLoop>();
  private labels = new Map<string, HTMLButtonElement>();
  private layers = { ...defaultSpaceLayers };
  private selected: string | null = null;
  private lastDays=NaN;
  private language: Language = 'en';
  private rocks: THREE.InstancedMesh;
  private dust: THREE.Points;
  private rockOrbits: NonNullable<SpaceObject['orbit']>[] = [];
  private dustOrbits: NonNullable<SpaceObject['orbit']>[] = [];
  private dummy = new THREE.Object3D();
  private glow: THREE.CanvasTexture;
  private modelLifecycle=new AbortController();

  constructor(private host: HTMLDivElement, private parents: THREE.Group[], private select: (id: string) => void) {
    this.root.name = 'extended-space';
    this.root.add(new THREE.AmbientLight('#c3d5eb', .8), new THREE.PointLight('#fff0dc', 45, 0, 1));
    const canvas = document.createElement('canvas'); canvas.width = canvas.height = 64;
    const ctx = canvas.getContext('2d')!; const gradient = ctx.createRadialGradient(32,32,0,32,32,32);
    gradient.addColorStop(0,'#fff'); gradient.addColorStop(.12,'#fff'); gradient.addColorStop(.28,'#ffffff80'); gradient.addColorStop(1,'#ffffff00');
    ctx.fillStyle=gradient; ctx.fillRect(0,0,64,64); this.glow = new THREE.CanvasTexture(canvas);
    spaceObjects.filter(o=>o.kind!=='constellation').forEach(item => this.createObject(item));
    spaceObjects.filter(o=>o.kind==='constellation').forEach(item => this.createConstellation(item));
    let seed=4269; const random=()=>{seed=(seed*16807)%2147483647;return seed/2147483647;};
    const beltOrbit=()=>{ const au=2.15+random()*1.15; return {parent:0, radius:22.8+(au-2.15)*2.9, size:.022+random()*.035, period:365.256*Math.pow(au,1.5), inclination:random()*7, node:random()*tau, phase:random()*tau, eccentricity:random()*.055}; };
    this.rocks = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(1,0),new THREE.MeshStandardMaterial({color:'#b0a18e',roughness:1}),650);
    this.rocks.name='representative-asteroid-belt'; this.rocks.instanceMatrix.setUsage(THREE.DynamicDrawUsage); this.rocks.frustumCulled=false;
    for(let i=0;i<650;i++) this.rockOrbits.push(beltOrbit());
    const positions=new Float32Array(1600*3);
    for(let i=0;i<1600;i++) this.dustOrbits.push(beltOrbit());
    const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.BufferAttribute(positions,3).setUsage(THREE.DynamicDrawUsage));
    this.dust=new THREE.Points(geometry,new THREE.PointsMaterial({color:'#bda887',size:.035,transparent:true,opacity:.32,depthWrite:false}));
    this.dust.frustumCulled=false; this.root.add(this.rocks,this.dust);
  }

  private createObject(item: SpaceObject) {
    const node=new THREE.Group(); node.name=item.id; this.nodes.set(item.id,node); this.root.add(node);
    if(item.star){
      node.position.copy(skyDirection(item.star.ra,item.star.dec).multiplyScalar(9000));
      const sprite=new THREE.Sprite(new THREE.SpriteMaterial({map:this.glow,color:item.color,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending}));
      const size=45+Math.max(0,4-item.star.magnitude)*12; sprite.scale.set(size,size,1); node.add(sprite);
    } else if(item.orbit){
      if(item.layer==='missions') {node.scale.setScalar(item.orbit.size);void this.attachCraft(node,item);}
      else {
        const geometry=new THREE.SphereGeometry(item.orbit.size,32,24), pos=geometry.getAttribute('position'), colors=new Float32Array(pos.count*3), base=new THREE.Color(item.color);
        for(let i=0;i<pos.count;i++){
          const x=pos.getX(i)/item.orbit.size,y=pos.getY(i)/item.orbit.size,z=pos.getZ(i)/item.orbit.size;
          const grain=Math.sin(x*91+y*137+z*71)*Math.sin(z*113-y*57), patches=Math.sin(x*12+Math.sin(z*7))*Math.sin(y*15-z*8);
          const color=base.clone().multiplyScalar(.77+grain*.08+patches*.19);colors.set([color.r,color.g,color.b],i*3);
        }
        geometry.setAttribute('color',new THREE.BufferAttribute(colors,3));
        const mesh=new THREE.Mesh(geometry,new THREE.MeshStandardMaterial({vertexColors:true,roughness:1}));
        if(item.id==='vesta')mesh.scale.set(1,.83,.9); node.add(mesh);
      }
      const points=Array.from({length:180},(_,i)=>orbitalPosition({...item.orbit!,phase:0},i/180*item.orbit!.period));
      const path=new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(points),new THREE.LineBasicMaterial({color:item.color,transparent:true,opacity:.24}));
      this.paths.set(item.id,path);this.root.add(path);
    }
    node.traverse(o=>{if(o instanceof THREE.Mesh||o instanceof THREE.Sprite){o.userData.spaceId=item.id;this.pickables.push(o);}});
    this.createLabel(item);
  }
  private async attachCraft(node:THREE.Group,item:SpaceObject){
    node.userData.modelStatus='loading';
    try{
      const model=await loadSpacecraft(item.id as SpacecraftId,this.modelLifecycle.signal);
      if(this.modelLifecycle.signal.aborted){disposeSpacecraft(model);return;}
      model.traverse(object=>{if(object instanceof THREE.Mesh){object.userData.spaceId=item.id;this.pickables.push(object);}});
      node.add(model);node.userData.modelStatus='ready';
      this.labels.get(item.id)?.removeAttribute('title');
    }catch(error){
      if(this.modelLifecycle.signal.aborted)return;
      node.userData.modelStatus='error';
      const label=this.labels.get(item.id);if(label)label.title=this.language==='vi'?'Không tải được mô hình. Bấm để thử lại.':'Model unavailable. Select to retry.';
      console.warn(`Spacecraft model ${item.id} could not be loaded`,error);
    }
  }
  private createConstellation(item: SpaceObject){
    const node=new THREE.Group();node.name=item.id;this.root.add(node);this.nodes.set(item.id,node);
    const positions:THREE.Vector3[]=[];
    for(const [a,b] of item.edges!){
      const start=this.nodes.get(a)!.position,end=this.nodes.get(b)!.position;
      for(let i=0;i<12;i++)positions.push(start.clone().lerp(end,i/12).normalize().multiplyScalar(9000),start.clone().lerp(end,(i+1)/12).normalize().multiplyScalar(9000));
    }
    const line=new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(positions),new THREE.LineBasicMaterial({color:'#7199b5',transparent:true,opacity:.4,depthWrite:false}));node.add(line);
    // The label is also the keyboard-accessible picking target for the whole pattern.
    this.createLabel(item);
  }
  private createLabel(item:SpaceObject){const label=document.createElement('button');label.className=`planet-label space-label space-label-${item.kind}`;label.textContent=item.name.en;label.addEventListener('click',()=>this.select(item.id));this.host.appendChild(label);this.labels.set(item.id,label);}
  position(id:string):THREE.Vector3{
    const item=spaceObjectById.get(id)!;
    if(item.edges){const center=new THREE.Vector3();const ids=[...new Set(item.edges.flat())];ids.forEach(key=>center.add(this.nodes.get(key)!.position));return center.normalize().multiplyScalar(9000);}
    return this.nodes.get(id)!.position.clone();
  }
  focus(id:string){this.selected=id;const node=this.nodes.get(id),item=spaceObjectById.get(id);if(node?.userData.modelStatus==='error'&&item)void this.attachCraft(node,item);}
  configure(layers:SpaceLayers){this.lastDays=NaN;this.layers={...layers};for(const item of spaceObjects)this.nodes.get(item.id)!.visible=layers[item.layer];this.rocks.visible=this.dust.visible=layers.debris;}
  setLanguage(language:Language){this.language=language;for(const item of spaceObjects){const label=this.labels.get(item.id)!;label.textContent=item.name[language];label.setAttribute('aria-label',`${language==='vi'?'Khám phá':'Explore'} ${item.name[language]}`);}}
  update(days:number,orbits:boolean){
    for(const item of spaceObjects){const path=this.paths.get(item.id);if(path)path.visible=orbits&&this.layers[item.layer];}
    if(days===this.lastDays)return;this.lastDays=days;
    for(const item of spaceObjects){if(!item.orbit)continue;const node=this.nodes.get(item.id)!,parent=this.parents[item.orbit.parent].position;
      node.position.copy(orbitalPosition(item.orbit,days)).add(parent);
      // Synchronous moon orientation; craft attitude is illustrative.
      node.lookAt(parent); if(item.kind==='asteroid')node.rotation.y=days*.5;
      const path=this.paths.get(item.id)!;path.position.copy(parent);path.visible=orbits&&this.layers[item.layer];
    }
    if(this.layers.debris){
      this.rockOrbits.forEach((orbit,i)=>{this.dummy.position.copy(orbitalPosition(orbit,days));this.dummy.rotation.set(i*.7+days*.1,i+days*.2,i*.4);this.dummy.scale.set(orbit.size,orbit.size*.7,orbit.size*1.3);this.dummy.updateMatrix();this.rocks.setMatrixAt(i,this.dummy.matrix);});this.rocks.instanceMatrix.needsUpdate=true;
      const attribute=this.dust.geometry.getAttribute('position');this.dustOrbits.forEach((orbit,i)=>{const p=orbitalPosition(orbit,days);attribute.setXYZ(i,p.x,p.y,p.z);});attribute.needsUpdate=true;
    }
  }
  updateLabels(camera:THREE.Camera,width:number,height:number,enabled:boolean){
    const active=spaceObjectById.get(this.selected??'');const members=new Set(active?.edges?.flat()??[]);const occupied:{x:number;y:number}[]=[];
    const ordered=[...spaceObjects].sort((a,b)=>Number(b.id===this.selected)-Number(a.id===this.selected));
    for(const item of ordered){
      const label=this.labels.get(item.id)!,position=this.position(item.id),p=position.clone();
      if(item.orbit)p.y+=item.id==='tiangong'?.1:item.orbit.size+.18;
      p.project(camera);const x=(p.x*.5+.5)*width,y=(-p.y*.5+.5)*height+(item.kind==='star'?-20:item.kind==='constellation'?30:0);
      const near=item.orbit?camera.position.distanceTo(this.parents[item.orbit.parent].position)<(item.layer==='missions'?13:24):true;
      const wanted=item.kind==='star'?(item.id===this.selected||members.has(item.id)):item.kind==='constellation'||near||item.id===this.selected;
      const visible=enabled&&this.layers[item.layer]&&wanted&&p.z>-1&&p.z<1&&x>30&&x<width-30&&y>105&&y<height-245&&!occupied.some(other=>Math.abs(other.x-x)<100&&Math.abs(other.y-y)<27);
      label.style.display=visible?'block':'none';if(visible){label.style.left=`${x}px`;label.style.top=`${y}px`;label.classList.toggle('selected',item.id===this.selected);label.dataset.modelStatus=this.nodes.get(item.id)?.userData.modelStatus??'';label.setAttribute('aria-busy',String(label.dataset.modelStatus==='loading'));occupied.push({x,y});}
    }
  }
  isVisible(id:string){return this.layers[spaceObjectById.get(id)!.layer];}
  clearSelection(){this.selected=null;}
  dispose(){this.modelLifecycle.abort();for(const item of spaceObjects){if(item.layer==='missions'){const node=this.nodes.get(item.id)!;disposeSpacecraft(node);node.removeFromParent();}}this.labels.forEach(label=>label.remove());this.glow.dispose();}
}
