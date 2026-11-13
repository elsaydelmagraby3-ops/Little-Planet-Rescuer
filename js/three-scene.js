import * as THREE from "three";
import {planets} from "./data.js";

export function createSolarSystem(container,onSelect){
  if(!container) return {selectPlanet:()=>{},dispose:()=>{}};
  let scene,camera,renderer,frameId,resizeObserver;
  const planetMeshes=[];
  let dragging=false,lastX=0,lastY=0,rotationX=0,rotationY=0;
  const raycaster=new THREE.Raycaster(), pointer=new THREE.Vector2();
  const root=new THREE.Group();

  try{
    scene=new THREE.Scene();
    camera=new THREE.PerspectiveCamera(45,container.clientWidth/container.clientHeight,.1,150);
    camera.position.set(0,19,36);
    renderer=new THREE.WebGLRenderer({antialias:true,alpha:true});
    renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
    renderer.setSize(container.clientWidth,container.clientHeight);
    renderer.outputColorSpace=THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);
    scene.add(root);
    scene.add(new THREE.AmbientLight(0x9bbde2,1.7));
    const sunLight=new THREE.PointLight(0xffd9a1,150,100);sunLight.position.set(0,0,0);scene.add(sunLight);
    const sun=new THREE.Mesh(new THREE.SphereGeometry(1.6,32,32),new THREE.MeshBasicMaterial({color:0xffc66e}));
    root.add(sun);
    const glow=new THREE.Mesh(new THREE.SphereGeometry(2.1,32,32),new THREE.MeshBasicMaterial({color:0xffa83d,transparent:true,opacity:.12}));
    root.add(glow);

    planets.forEach((p,index)=>{
      const orbit=new THREE.Mesh(new THREE.RingGeometry(p.orbit-.012,p.orbit+.012,128),new THREE.MeshBasicMaterial({color:0x56708c,side:THREE.DoubleSide,transparent:true,opacity:.3}));
      orbit.rotation.x=Math.PI/2;root.add(orbit);
      const mesh=new THREE.Mesh(new THREE.SphereGeometry(p.size,28,28),new THREE.MeshStandardMaterial({color:p.color,roughness:.9,metalness:0}));
      mesh.position.set(p.orbit,0,0);mesh.userData.planetId=p.id;root.add(mesh);planetMeshes.push(mesh);
      if(p.id==="saturn"){
        const ring=new THREE.Mesh(new THREE.RingGeometry(1.35,2.05,64),new THREE.MeshBasicMaterial({color:0xcab58b,side:THREE.DoubleSide,transparent:true,opacity:.7}));
        ring.rotation.x=Math.PI/2.35;mesh.add(ring);
      }
      mesh.userData.angle=index*.8;
    });
    const starGeometry=new THREE.BufferGeometry(),starPositions=[];
    for(let i=0;i<900;i++){starPositions.push((Math.random()-.5)*85,(Math.random()-.5)*55,(Math.random()-.5)*85);}
    starGeometry.setAttribute("position",new THREE.Float32BufferAttribute(starPositions,3));
    scene.add(new THREE.Points(starGeometry,new THREE.PointsMaterial({color:0xb9d8ff,size:.09,transparent:true,opacity:.8})));

    function resize(){
      if(!renderer)return;
      const w=Math.max(1,container.clientWidth),h=Math.max(1,container.clientHeight);
      camera.aspect=w/h;camera.updateProjectionMatrix();renderer.setSize(w,h);
    }
    resizeObserver=new ResizeObserver(resize);resizeObserver.observe(container);
    function animate(){
      frameId=requestAnimationFrame(animate);
      root.rotation.y=rotationY;
      root.rotation.x=rotationX;
      planetMeshes.forEach((m,i)=>{m.userData.angle+=.0015/(i*.4+1);const p=planets[i];m.position.x=Math.cos(m.userData.angle)*p.orbit;m.position.z=Math.sin(m.userData.angle)*p.orbit;m.rotation.y+=.004;});
      renderer.render(scene,camera);
    }
    animate();
    renderer.domElement.addEventListener("pointerdown",e=>{dragging=true;lastX=e.clientX;lastY=e.clientY;renderer.domElement.setPointerCapture(e.pointerId);});
    renderer.domElement.addEventListener("pointermove",e=>{
      if(dragging){rotationY+=(e.clientX-lastX)*.005;rotationX+=(e.clientY-lastY)*.003;lastX=e.clientX;lastY=e.clientY;}
    });
    renderer.domElement.addEventListener("pointerup",()=>{dragging=false;});
    renderer.domElement.addEventListener("pointercancel",()=>{dragging=false;});
    renderer.domElement.addEventListener("click",e=>{
      const rect=renderer.domElement.getBoundingClientRect();
      pointer.x=((e.clientX-rect.left)/rect.width)*2-1;
      pointer.y=-((e.clientY-rect.top)/rect.height)*2+1;
      raycaster.setFromCamera(pointer,camera);
      const hits=raycaster.intersectObjects(planetMeshes);
      if(hits.length)onSelect?.(hits[0].object.userData.planetId);
    });
    return {
      selectPlanet(id){const m=planetMeshes.find(x=>x.userData.planetId===id);if(m){camera.position.set(m.position.x+4, m.position.y+3, m.position.z+7);camera.lookAt(m.position);}},
      zoom(amount){camera.position.multiplyScalar(amount);},
      reset(){camera.position.set(0,19,36);camera.lookAt(0,0,0);rotationX=0;rotationY=0;},
      dispose(){cancelAnimationFrame(frameId);resizeObserver?.disconnect();renderer.dispose();container.innerHTML="";}
    };
  }catch(error){
    console.warn("3D scene could not start:",error);
    container.innerHTML='<div class="scene-fallback">3D view is unavailable in this browser. You can still choose planets below.</div>';
    return {selectPlanet:()=>{},zoom:()=>{},reset:()=>{},dispose:()=>{}};
  }
}
