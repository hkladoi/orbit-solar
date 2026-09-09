import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';

export const spacecraftModels = {
  iss: { credit: 'NASA / VTAD', url: 'https://science.nasa.gov/resource/international-space-station-3d-model/' },
  hubble: { credit: 'NASA · Hubble model A', url: 'https://science.nasa.gov/3d-resources/hubble-space-telescope-a/' },
  tiangong: { credit: 'CMSA · 2022 reference configuration', url: 'https://www.cmse.gov.cn/fxrw/mengtian/mtjj/202211/t20221106_51285.html' },
};
export type SpacecraftId = keyof typeof spacecraftModels;

/** Centre and uniformly scale the whole assembly, preserving component proportions. */
export function normalizeSpacecraft(model: THREE.Group) {
  model.updateMatrixWorld(true);
  const bounds = new THREE.Box3().setFromObject(model), extent = bounds.getSize(new THREE.Vector3());
  const scale = 4 / Math.max(extent.x, extent.y, extent.z);
  if (!Number.isFinite(scale)) throw new Error('Invalid spacecraft bounds');
  const assembly = new THREE.Group(); assembly.name = 'spacecraft-assembly';
  assembly.add(model); model.position.sub(bounds.getCenter(new THREE.Vector3())); assembly.scale.setScalar(scale);
  return assembly;
}

/** Local assets: no NASA requests or API key needed by the deployed application. */
export async function loadSpacecraft(id: SpacecraftId, signal?: AbortSignal): Promise<THREE.Group> {
  if (id === 'tiangong') return normalizeSpacecraft(buildTiangong());
  const response = await fetch(`/models/${id}.glb`, { signal });
  if (!response.ok) throw new Error(`Unable to load ${id}: ${response.status}`);
  const bytes = await response.arrayBuffer();
  const loader = new GLTFLoader().setMeshoptDecoder(MeshoptDecoder);
  const gltf = await loader.parseAsync(bytes, '/models/');
  if (signal?.aborted) { disposeSpacecraft(gltf.scene); throw new DOMException('Aborted', 'AbortError'); }
  gltf.scene.name = `${id}-nasa-model`;
  gltf.scene.traverse(object => {
    if (!(object instanceof THREE.Mesh)) return;
    // Thin radiator/array faces must remain visible from both viewing directions.
    for (const material of Array.isArray(object.material) ? object.material : [object.material]) {
      material.side = THREE.DoubleSide;
    }
  });
  return normalizeSpacecraft(gltf.scene);
}

/** Tiangong's three-module T configuration (2022), without visiting vehicles.
 * Metres expressed at 1:10: Tianhe ~16.6×4.2 m; labs ~17.9×4.2 m.
 * Panels/radiators are simplified. This is a visual reconstruction, not CMSA CAD.
 */
export function buildTiangong() {
  const root = new THREE.Group(); root.name = 'tiangong-2022-reconstruction';
  const white = new THREE.MeshStandardMaterial({ color: '#e7e5dc', metalness: .18, roughness: .68 });
  const silver = new THREE.MeshStandardMaterial({ color: '#a8b0b5', metalness: .65, roughness: .32 });
  const dark = new THREE.MeshStandardMaterial({ color: '#222936', metalness: .4, roughness: .5 });
  const gold = new THREE.MeshStandardMaterial({ color: '#b7964f', metalness: .65, roughness: .45 });
  const texture = solarCellTexture();
  const blue = new THREE.MeshStandardMaterial({ map: texture, color: '#7894c7', metalness: .3, roughness: .45, side: THREE.DoubleSide });
  const add = (parent: THREE.Group, name: string, geometry: THREE.BufferGeometry, material: THREE.Material, x=0, y=0, z=0) => {
    const mesh = new THREE.Mesh(geometry, material); mesh.name=name; mesh.position.set(x,y,z); parent.add(mesh); return mesh;
  };
  const cylinder = (parent:THREE.Group,name:string,radius:number,length:number,z:number,material=white) => {
    const mesh=add(parent,name,new THREE.CylinderGeometry(radius,radius,length,32),material,0,0,z);mesh.rotation.x=Math.PI/2;return mesh;
  };
  const buildModule = (name:string, laboratory:boolean) => {
    const group=new THREE.Group(); group.name=name;
    cylinder(group,'pressurized-work-compartment',.21,laboratory?1.12:.94,laboratory?.8:.72);
    const taper=add(group,'tapered-transition',new THREE.CylinderGeometry(.13,.21,.18,32),white,0,0,.18);taper.rotation.x=-Math.PI/2;
    cylinder(group,'docking-neck',.13,.22,.04,silver);
    cylinder(group,'service-compartment',.16,.35,laboratory?1.54:1.37,silver);
    cylinder(group,'aft-docking-ring',.12,.07,laboratory?1.76:1.59,dark);
    // Exterior radiator strips, hatch rings and equipment boxes.
    for(const z of [.32,.52,.72,.92,1.12]){
      const ring=add(group,'thermal-blanket-seam',new THREE.TorusGeometry(.211,.003,4,40),silver,0,0,z);
      ring.rotation.set(0,0,0);
    }
    for(const side of [-1,1]){
      add(group,'radiator',new THREE.BoxGeometry(.015,.2,.7),white,side*.213,0,.77);
      add(group,'external-equipment',new THREE.BoxGeometry(.11,.08,.16),gold,side*.19,.15,1.26);
    }
    return group;
  };
  const core=buildModule('Tianhe',false); root.add(core);
  add(root,'spherical-forward-node',new THREE.SphereGeometry(.18,24,16),white,0,0,-.12);
  cylinder(root,'forward-docking-port',.105,.09,-.32,dark);
  const nadir=add(root,'nadir-docking-port',new THREE.CylinderGeometry(.095,.095,.12,24),silver,0,-.2,-.12);
  nadir.rotation.z=0;
  for(const side of [-1,1]){
    const lab=buildModule(side<0?'Wentian':'Mengtian',true); lab.rotation.y=side*Math.PI/2;lab.position.set(side*.1,0,-.12);root.add(lab);
    // Two long flexible wings per laboratory; long axes are perpendicular to the lab.
    for(const wing of [-1,1]){
      const panel=add(root,`${lab.name}-solar-wing-${wing}`,new THREE.BoxGeometry(.46,.012,2.7),blue,side*1.76,0,-.12+wing*1.53);
      panel.rotation.z=side*.1;
      add(root,'solar-array-mast',new THREE.BoxGeometry(.015,.023,2.94),silver,side*1.76,-.019,-.12+wing*1.44);
      for(let fold=0;fold<12;fold++)add(root,'array-fold',new THREE.BoxGeometry(.46,.014,.003),silver,side*1.76,.009,-.12+wing*(.19+fold*.225));
    }
    // The smaller original Tianhe arrays are retained in this 2022 configuration.
    add(root,'Tianhe-solar-wing',new THREE.BoxGeometry(1.0,.012,.35),blue,side*.76,0,1.32);
    add(root,'Tianhe-array-mast',new THREE.BoxGeometry(1.1,.024,.014),silver,side*.72,-.02,1.32);
  }
  const arm = new THREE.Group();arm.name='Tianhe-robotic-arm';root.add(arm);
  const joint=(x:number,y:number,z:number)=>add(arm,'arm-joint',new THREE.SphereGeometry(.035,12,8),silver,x,y,z);
  const beam=(from:THREE.Vector3,to:THREE.Vector3)=>{const mesh=add(arm,'robotic-arm-segment',new THREE.CylinderGeometry(.018,.018,from.distanceTo(to),10),white);mesh.position.copy(from).lerp(to,.5);mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),to.clone().sub(from).normalize());};
  const joints=[new THREE.Vector3(.14,.2,.4),new THREE.Vector3(.38,.38,.7),new THREE.Vector3(.4,.3,1.08)];
  joints.forEach(p=>joint(p.x,p.y,p.z));beam(joints[0],joints[1]);beam(joints[1],joints[2]);
  // Static assembly: merge by material to avoid one draw call per seam/cell.
  root.updateMatrixWorld(true);
  const batches=new Map<THREE.Material,THREE.BufferGeometry[]>();
  root.traverse(object=>{if(!(object instanceof THREE.Mesh))return;const material=object.material as THREE.Material;const geometry=object.geometry.clone().applyMatrix4(object.matrixWorld);const bucket=batches.get(material)??[];bucket.push(geometry);batches.set(material,bucket);object.geometry.dispose();});
  root.clear();
  for(const [material,geometries] of batches){const geometry=mergeGeometries(geometries);if(geometry)root.add(new THREE.Mesh(geometry,material));geometries.forEach(g=>g.dispose());}
  return root;
}

function solarCellTexture() {
  const canvas=document.createElement('canvas');canvas.width=128;canvas.height=512;
  const ctx=canvas.getContext('2d')!;ctx.fillStyle='#0e244e';ctx.fillRect(0,0,128,512);
  for(let y=0;y<512;y+=16)for(let x=0;x<128;x+=16){
    ctx.fillStyle=(x+y)%32===0?'#244577':'#294b7c';ctx.fillRect(x+1,y+1,14,14);
    ctx.fillStyle='#476b97';ctx.fillRect(x+3,y+3,1,10);
  }
  const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;texture.anisotropy=4;return texture;
}

export function disposeSpacecraft(root: THREE.Object3D) {
  const geometries=new Set<THREE.BufferGeometry>(),materials=new Set<THREE.Material>(),textures=new Set<THREE.Texture>();
  root.traverse(object=>{
    if(!(object instanceof THREE.Mesh))return;
    geometries.add(object.geometry);
    for(const material of Array.isArray(object.material)?object.material:[object.material]){
      materials.add(material);for(const value of Object.values(material))if(value instanceof THREE.Texture)textures.add(value);
    }
  });
  textures.forEach(texture=>{texture.dispose();const bitmap=texture.source.data;if(typeof ImageBitmap!=='undefined'&&bitmap instanceof ImageBitmap)bitmap.close();});
  materials.forEach(material=>material.dispose());geometries.forEach(geometry=>geometry.dispose());
}
