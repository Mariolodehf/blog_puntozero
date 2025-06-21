import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function initInteractiveHero() {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const canvas = document.getElementById('webgl-canvas');
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    let airplane;
    const loader = new GLTFLoader();
    loader.load('/models/airplane.glb', (gltf) => {
        airplane = gltf.scene;
        airplane.scale.set(0.25, 0.25, 0.25);
        scene.add(airplane);
        createScrollAnimations();
    });

    // --- Generación de Nubes ---
    const clouds = new THREE.Group();
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load('/textures/cloud.png', (texture) => {
        for (let i = 0; i < 50; i++) {
            const spriteMaterial = new THREE.SpriteMaterial({ map: texture, transparent: true, opacity: 0.7 });
            const cloud = new THREE.Sprite(spriteMaterial);
            
            cloud.position.x = (Math.random() - 0.5) * 50;
            cloud.position.y = (Math.random() - 0.5) * 20 + 5;
            cloud.position.z = (Math.random() - 0.5) * 40 - 20;
            cloud.scale.set(8, 8, 1);
            clouds.add(cloud);
        }
    });
    scene.add(clouds);

    function animate() {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
    
    function createScrollAnimations() {
        if (!airplane) return;

        camera.position.set(0, 0.5, 7);
        airplane.position.set(0, 0, 0);
        airplane.rotation.set(0, Math.PI, 0);

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: "#scroll-container",
                start: "top top",
                end: "bottom bottom",
                scrub: 1.5,
            }
        });
        
        // Animación combinada de avión y cámara
        tl.to(airplane.position, {
            z: -30,
            x: 2,
            ease: "power1.inOut",
            duration: 10
        }, 0);
        tl.to(airplane.rotation, {
            x: 0.2,
            y: Math.PI - 0.5,
            duration: 10,
            ease: "power1.inOut",
        }, 0);
        tl.to(camera.position, {
            z: -23,
            ease: "power1.inOut",
            duration: 10
        }, 0);

        // Parallax de nubes
        tl.to(clouds.position, {
            z: 40,
            ease: "power1.in",
            duration: 10
        }, 0);

        // --- Animaciones de Contenido HTML ---

        // 3. Fade-in para el resto de los artículos
        document.querySelectorAll('.blog-post-section').forEach(section => {
            gsap.from(section, {
                opacity: 0,
                y: 50,
                scrollTrigger: {
                    trigger: section,
                    start: "top 80%",
                    end: "top 50%",
                    scrub: true,
                }
            });
        });

        // --- Lógica para activar transiciones CSS ---
        const principal = document.querySelector('.texto-principal');
        const bienvenido = document.querySelector('.bienvenido');

        if (principal && bienvenido) {
            window.addEventListener('scroll', () => {
                const scrollThreshold = window.innerHeight * 0.1;
                if (window.scrollY > scrollThreshold) {
                    principal.classList.add('fade-out-active');
                    bienvenido.classList.add('fade-behind-active');
                } else {
                    principal.classList.remove('fade-out-active');
                    bienvenido.classList.remove('fade-behind-active');
                }
            });
        }
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initInteractiveHero);
} else {
    initInteractiveHero();
} 