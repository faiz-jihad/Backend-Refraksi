import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function WebglBackground() {
    const containerRef = useRef(null);
    const canvasRef = useRef(null);

    useEffect(() => {
        if (!canvasRef.current) return;

        // --- 1. SETUP THREE.JS SCENE, CAMERA, & RENDERER ---
        const width = window.innerWidth;
        const height = window.innerHeight;
        
        const scene = new THREE.Scene();
        
        // Perspective Camera
        const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
        camera.position.set(0, 0, 6);
        scene.add(camera);

        // WebGLRenderer with high-definition and performance settings
        const renderer = new THREE.WebGLRenderer({
            canvas: canvasRef.current,
            antialias: true,
            alpha: true, // Transparent background to blend with CSS gradients
            powerPreference: "high-performance"
        });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limit pixel ratio to 2 for performance
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.0;
        renderer.outputColorSpace = THREE.SRGBColorSpace;

        // --- 2. LIGHTING SYSTEM (Studio Setup) ---
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.75); // Increased for light theme
        scene.add(ambientLight);

        // Key Light (Main light shining from top-right)
        const keyLight = new THREE.DirectionalLight(0xffffff, 2.0);
        keyLight.position.set(5, 5, 4);
        scene.add(keyLight);

        // Rim Light (Sky Blue glow from behind-left to trace edges)
        const rimLightBlue = new THREE.PointLight(0x0ea5e9, 5, 15);
        rimLightBlue.position.set(-4, 3, -3);
        scene.add(rimLightBlue);

        // Additional soft Emerald/Green highlight light
        const rimLightGreen = new THREE.PointLight(0x10b981, 3.5, 15);
        rimLightGreen.position.set(4, -3, -3);
        scene.add(rimLightGreen);

        // Focus/Pupil Light (Placed inside the pupil pointing outward)
        const pupilLight = new THREE.PointLight(0x38bdf8, 1.5, 8);
        pupilLight.position.set(0, 0, 1);
        scene.add(pupilLight);

        // --- 3. CREATING PROCEDURAL "DIGITAL EYE" ---
        const eyeGroup = new THREE.Group();
        scene.add(eyeGroup);

        // Geometry cache for disposal
        const geometries = [];
        const materials = [];

        // A. Pupil Core (Central glowing lens)
        const pupilGeo = new THREE.SphereGeometry(0.8, 64, 64);
        geometries.push(pupilGeo);
        
        const pupilMat = new THREE.MeshPhysicalMaterial({
            color: 0x0f172a, // Deep dark slate
            emissive: 0x0284c7, // Glowing sky blue
            emissiveIntensity: 0.6,
            roughness: 0.1,
            metalness: 0.9,
            clearcoat: 1.0,
            clearcoatRoughness: 0.05
        });
        materials.push(pupilMat);
        const pupilMesh = new THREE.Mesh(pupilGeo, pupilMat);
        eyeGroup.add(pupilMesh);

        // B. Concentric Outer Rings (Tech/Iris Structure)
        // Ring 1: Sky Blue outer ring
        const ring1Geo = new THREE.TorusGeometry(1.6, 0.05, 16, 100);
        geometries.push(ring1Geo);
        const ring1Mat = new THREE.MeshPhysicalMaterial({
            color: 0x0ea5e9,
            emissive: 0x0369a1,
            emissiveIntensity: 0.5,
            metalness: 0.9,
            roughness: 0.1
        });
        materials.push(ring1Mat);
        const ring1Mesh = new THREE.Mesh(ring1Geo, ring1Mat);
        eyeGroup.add(ring1Mesh);

        // Ring 2: Emerald Green middle ring, slightly angled
        const ring2Geo = new THREE.TorusGeometry(1.85, 0.04, 16, 100);
        geometries.push(ring2Geo);
        const ring2Mat = new THREE.MeshPhysicalMaterial({
            color: 0x10b981,
            emissive: 0x047857,
            emissiveIntensity: 0.4,
            metalness: 0.8,
            roughness: 0.2
        });
        materials.push(ring2Mat);
        const ring2Mesh = new THREE.Mesh(ring2Geo, ring2Mat);
        ring2Mesh.rotation.x = Math.PI / 6;
        ring2Mesh.rotation.y = Math.PI / 12;
        eyeGroup.add(ring2Mesh);

        // Ring 3: Small tech ring, fast-spinning diagonal
        const ring3Geo = new THREE.TorusGeometry(1.2, 0.02, 12, 80);
        geometries.push(ring3Geo);
        const ring3Mat = new THREE.MeshPhysicalMaterial({
            color: 0x34d399,
            emissive: 0x059669,
            emissiveIntensity: 0.3,
            metalness: 0.9,
            roughness: 0.1
        });
        materials.push(ring3Mat);
        const ring3Mesh = new THREE.Mesh(ring3Geo, ring3Mat);
        ring3Mesh.rotation.x = -Math.PI / 4;
        ring3Mesh.rotation.z = Math.PI / 3;
        eyeGroup.add(ring3Mesh);

        // C. Cornea Outer Glass Shell
        const corneaGeo = new THREE.SphereGeometry(2.2, 64, 64);
        geometries.push(corneaGeo);
        const corneaMat = new THREE.MeshPhysicalMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.12,
            transmission: 0.95, // Glass refractive effect
            ior: 1.5, // Index of refraction
            thickness: 0.8,
            roughness: 0.02,
            metalness: 0.05,
            clearcoat: 1.0,
            clearcoatRoughness: 0.02
        });
        materials.push(corneaMat);
        const corneaMesh = new THREE.Mesh(corneaGeo, corneaMat);
        eyeGroup.add(corneaMesh);

        // D. Particle Floaters (Floating neural nodes in space)
        const particleGroup = new THREE.Group();
        scene.add(particleGroup);

        const particleCount = 80;
        const particleGeo = new THREE.SphereGeometry(0.04, 8, 8);
        geometries.push(particleGeo);

        const blueParticleMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
        const greenParticleMat = new THREE.MeshBasicMaterial({ color: 0x34d399 });
        materials.push(blueParticleMat, greenParticleMat);

        for (let i = 0; i < particleCount; i++) {
            const mesh = new THREE.Mesh(
                particleGeo, 
                i % 2 === 0 ? blueParticleMat : greenParticleMat
            );
            // Distribute randomly around scene
            mesh.position.x = (Math.random() - 0.5) * 12;
            mesh.position.y = (Math.random() - 0.5) * 12;
            mesh.position.z = (Math.random() - 0.5) * 8 - 2;
            
            // Random floating speed factors stored on the mesh custom properties
            mesh.userData = {
                speedX: (Math.random() - 0.5) * 0.005,
                speedY: (Math.random() - 0.5) * 0.005,
                speedZ: (Math.random() - 0.5) * 0.005,
                originalY: mesh.position.y
            };
            particleGroup.add(mesh);
        }

        // Adjust eye position slightly downwards initially
        eyeGroup.position.set(0, -0.4, 0);

        // --- 4. CONNECTING TO GSAP SCROLLTRIGGER ---
        // A single timeline covering the entire page scroll height
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: "body", // Track scroll across the entire page body
                start: "top top",
                end: "bottom bottom",
                scrub: 1.5, // Easing delay for ultra-smooth momentum
            }
        });

        // Setup transitions between sections
        // Total duration is divided into keyframes/labels
        tl.addLabel("hero") // Scroll: 0%
          .to(camera.position, { x: 0, y: 0, z: 6 }, "hero");

        // Transisi ke StoryFacts (Section 2 - scroll ~12%)
        // Camera pans left, shifting the eye to the right side of the screen
        tl.to(camera.position, { x: -2.0, y: 0.3, z: 5.5, ease: "power2.inOut" }, "facts")
          .to(eyeGroup.rotation, { y: Math.PI / 4, x: 0.1, ease: "power2.inOut" }, "facts")
          .to(pupilMat, { emissiveIntensity: 0.8, ease: "power2.inOut" }, "facts");

        // Transisi ke SelfCheck (Section 3 - scroll ~25%)
        // Camera pans right, shifting the eye to the left side of the screen
        tl.to(camera.position, { x: 2.2, y: -0.3, z: 5.2, ease: "power2.inOut" }, "check")
          .to(eyeGroup.rotation, { y: -Math.PI / 4, x: -0.1, z: 0.1, ease: "power2.inOut" }, "check")
          .to(rimLightGreen, { intensity: 6, ease: "power2.inOut" }, "check");

        // Transisi ke ServicesShowcase (Section 4 - scroll ~40%)
        // Camera moves back to center, eye turns upwards slightly
        tl.to(camera.position, { x: 0, y: 0.5, z: 7.0, ease: "power2.inOut" }, "services")
          .to(eyeGroup.rotation, { y: Math.PI * 0.75, x: 0.3, ease: "power2.inOut" }, "services")
          .to(rimLightBlue, { intensity: 8, ease: "power2.inOut" }, "services");

        // Transisi ke ProcessTimeline (Section 5 - scroll ~55%)
        // Extreme Zoom In: Go INSIDE the eye center, creating a green portal effect
        tl.to(camera.position, { x: 0, y: 0, z: 1.8, ease: "power3.inOut" }, "timeline")
          .to(eyeGroup.rotation, { y: Math.PI * 1.5, x: 0.0, z: Math.PI / 4, ease: "power3.inOut" }, "timeline")
          .to(pupilMat, { emissiveIntensity: 2.0, ease: "power3.inOut" }, "timeline")
          .to(pupilLight, { intensity: 10, ease: "power3.inOut" }, "timeline");

        // Transisi ke TestimonialFade (Section 6 - scroll ~70%)
        // Camera zooms out, eye sits in upper-right quadrant
        tl.to(camera.position, { x: -2.4, y: 1.2, z: 6.2, ease: "power2.inOut" }, "testimonials")
          .to(eyeGroup.rotation, { y: Math.PI * 2.2, x: -0.2, z: 0, ease: "power2.inOut" }, "testimonials")
          .to(pupilMat, { emissiveIntensity: 0.7, ease: "power2.inOut" }, "testimonials")
          .to(pupilLight, { intensity: 2, ease: "power2.inOut" }, "testimonials");

        // Transisi ke EducationGrid (Section 7 - scroll ~82%)
        // Eye sits in bottom-left quadrant
        tl.to(camera.position, { x: 2.4, y: -1.2, z: 6.0, ease: "power2.inOut" }, "education")
          .to(eyeGroup.rotation, { y: Math.PI * 2.8, x: 0.2, ease: "power2.inOut" }, "education");

        // Transisi ke VisionSimulator & CTA (Section 8 & 9 - scroll 100%)
        // Center the camera, get very close and let it glow at full intensity
        tl.to(camera.position, { x: 0, y: 0, z: 5.0, ease: "power3.out" }, "cta")
          .to(eyeGroup.rotation, { y: Math.PI * 4.0, x: 0, z: 0, ease: "power3.out" }, "cta")
          .to(pupilMat, { emissiveIntensity: 1.5, ease: "power3.out" }, "cta")
          .to(rimLightBlue, { intensity: 12, ease: "power3.out" }, "cta")
          .to(rimLightGreen, { intensity: 8, ease: "power3.out" }, "cta");

        // Keep camera looking at the center
        const lookTarget = new THREE.Vector3(0, 0, 0);
        gsap.ticker.add(() => {
            camera.lookAt(lookTarget);
        });

        // --- 5. RENDER TICK & FLOATING ANIMATION ---
        const clock = new THREE.Clock();

        const tick = () => {
            const elapsedTime = clock.getElapsedTime();

            // A. Continuous slow idle rotation of elements
            if (eyeGroup) {
                // Gentle floating
                eyeGroup.position.y = -0.4 + Math.sin(elapsedTime * 0.6) * 0.12;
                
                // Slow rotation on top of scroll timeline values
                ring1Mesh.rotation.z = elapsedTime * 0.15;
                ring2Mesh.rotation.z = -elapsedTime * 0.1;
                ring3Mesh.rotation.y = elapsedTime * 0.25;
            }

            // B. Animate floating particles
            particleGroup.children.forEach((particle) => {
                particle.position.x += particle.userData.speedX;
                particle.position.y = particle.userData.originalY + Math.sin(elapsedTime * 0.4 + particle.position.x) * 0.3;
                particle.position.z += particle.userData.speedZ;

                // Wrap particles if they go off screen boundaries
                if (Math.abs(particle.position.x) > 6) particle.position.x *= -0.9;
                if (Math.abs(particle.position.z) > 10) particle.position.z *= -0.9;
            });

            // C. Pulsing pupil emissive intensity on idle
            if (pupilMat) {
                // Base pulsing glow
                const baseGlow = tl.scrollTrigger ? tl.scrollTrigger.progress * 0.9 + 0.6 : 0.6;
                pupilMat.emissiveIntensity = baseGlow + Math.sin(elapsedTime * 2.0) * 0.15;
            }

            renderer.render(scene, camera);
            window.requestAnimationFrame(tick);
        };
        
        tick();

        // --- 6. RESPONSIVE RESIZE HANDLER ---
        const handleResize = () => {
            const w = window.innerWidth;
            const h = window.innerHeight;
            
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            
            renderer.setSize(w, h);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        };
        window.addEventListener('resize', handleResize);

        // --- 7. CLEANUP / DISPOSE ON UNMOUNT ---
        return () => {
            window.removeEventListener('resize', handleResize);
            
            // Kill GSAP ticker listener and ScrollTrigger timeline
            gsap.ticker.remove(() => {
                camera.lookAt(lookTarget);
            });
            tl.kill();
            ScrollTrigger.getAll().forEach(st => {
                if (st.vars.trigger === "body") st.kill();
            });

            // Dispose Three.js objects
            geometries.forEach(geo => geo.dispose());
            materials.forEach(mat => mat.dispose());
            renderer.dispose();
        };
    }, []);

    return (
        <div ref={containerRef} className="fixed inset-0 w-full h-full pointer-events-none -z-10 bg-slate-50 overflow-hidden">
            {/* Soft medical gradient backgrounds in CSS to blend behind Three.js */}
            <div 
                className="absolute inset-0 pointer-events-none -z-20"
                style={{
                    background: 'radial-gradient(ellipse at center, rgba(14, 165, 233, 0.15) 0%, rgba(248, 250, 252, 0.8) 50%, rgba(255, 255, 255, 1) 100%)'
                }}
            />
            <canvas ref={canvasRef} className="w-full h-full block bg-transparent" />
        </div>
    );
}
