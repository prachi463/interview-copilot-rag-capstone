import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function ThreeBackground() {
  const mountRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0b0f14);

    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);

    // Create animated geometries
    const geometries = [];

    // Rotating icosahedron
    const icoGeom = new THREE.IcosahedronGeometry(1, 4);
    const icoMat = new THREE.MeshPhongMaterial({ color: 0xe8a33d, wireframe: true, emissive: 0x664433 });
    const ico = new THREE.Mesh(icoGeom, icoMat);
    ico.position.set(-2, 1, 0);
    scene.add(ico);
    geometries.push({ mesh: ico, rotationSpeed: 0.005 });

    // Pulsing torus
    const torusGeom = new THREE.TorusGeometry(1.5, 0.4, 16, 100);
    const torusMat = new THREE.MeshPhongMaterial({ color: 0xc1666b, emissive: 0x662222 });
    const torus = new THREE.Mesh(torusGeom, torusMat);
    torus.position.set(2, -1, -2);
    scene.add(torus);
    geometries.push({ mesh: torus, rotationSpeed: 0.003, pulse: true });

    // Rotating cube in background
    const boxGeom = new THREE.BoxGeometry(1.2, 1.2, 1.2);
    const boxMat = new THREE.MeshPhongMaterial({ color: 0x6fcf97, wireframe: true });
    const box = new THREE.Mesh(boxGeom, boxMat);
    box.position.set(0, 0, -4);
    scene.add(box);
    geometries.push({ mesh: box, rotationSpeed: 0.002 });

    // Particle system
    const particleCount = 100;
    const particleGeom = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 20;
      positions[i + 1] = (Math.random() - 0.5) * 20;
      positions[i + 2] = (Math.random() - 0.5) * 20;
    }
    particleGeom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({ color: 0xe8a33d, size: 0.1, transparent: true, opacity: 0.6 });
    const particles = new THREE.Points(particleGeom, particleMat);
    scene.add(particles);

    // Lighting
    const light1 = new THREE.DirectionalLight(0xffffff, 0.8);
    light1.position.set(5, 5, 5);
    scene.add(light1);

    const light2 = new THREE.PointLight(0xe8a33d, 0.4);
    light2.position.set(-3, 2, 3);
    scene.add(light2);

    scene.add(new THREE.AmbientLight(0xffffff, 0.3));

    // Animation loop
    let animationFrameId;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      geometries.forEach((geo) => {
        geo.mesh.rotation.x += geo.rotationSpeed;
        geo.mesh.rotation.y += geo.rotationSpeed * 0.7;

        if (geo.pulse) {
          geo.mesh.scale.x = 1 + Math.sin(Date.now() * 0.003) * 0.15;
          geo.mesh.scale.y = 1 + Math.sin(Date.now() * 0.003) * 0.15;
        }
      });

      // Slowly rotate particle system
      particles.rotation.x += 0.0001;
      particles.rotation.y += 0.0002;

      renderer.render(scene, camera);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      const width = mountRef.current?.clientWidth || 1;
      const height = mountRef.current?.clientHeight || 1;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);

    return () => {
  window.removeEventListener('resize', handleResize);
  cancelAnimationFrame(animationFrameId);
  if (renderer) {
    renderer.dispose();
  }
  if (mountRef.current && renderer.domElement && renderer.domElement.parentNode ===        mountRef.current) {
    mountRef.current.removeChild(renderer.domElement);
    }
   };
  }, []);

  return <div ref={mountRef} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100vh', zIndex: 0 }} />;
}
