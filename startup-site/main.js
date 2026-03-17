import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// --- Navbar Scroll Effect ---
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// --- Hero Title Continuous Typing Animation ---
(function() {
    const heroTyped = document.getElementById('hero-typed-text');
    if (!heroTyped) return;

    const text = "Powerful Digital Solutions..";
    let isTyping = true;
    let index = 0;
    
    let isVisible = true;
    ScrollTrigger.create({
        trigger: "#home",
        start: "top bottom",
        end: "bottom top",
        onEnter: () => isVisible = true,
        onLeave: () => isVisible = false,
        onEnterBack: () => isVisible = true,
        onLeaveBack: () => isVisible = false
    });

    // Add cursor
    const heroCursor = document.createElement('span');
    heroCursor.className = 'typing-cursor';
    heroTyped.appendChild(heroCursor);

    function heroLoop() {
        if (!isVisible) {
            setTimeout(heroLoop, 500);
            return;
        }
        if (isTyping) {
            if (index < text.length) {
                const ch = document.createTextNode(text.charAt(index));
                heroTyped.insertBefore(ch, heroCursor);
                index++;
                setTimeout(heroLoop, 60 + Math.random() * 40);
            } else {
                isTyping = false;
                setTimeout(heroLoop, 3000); // pause before deleting
            }
        } else {
            const prev = heroCursor.previousSibling;
            if (prev) {
                if (prev.nodeType === Node.TEXT_NODE) {
                    if (prev.length > 1) {
                        prev.textContent = prev.textContent.slice(0, -1);
                    } else {
                        heroTyped.removeChild(prev);
                    }
                } else {
                    heroTyped.removeChild(prev);
                }
                setTimeout(heroLoop, 35);
            } else {
                isTyping = true;
                index = 0;
                setTimeout(heroLoop, 500); // pause before re-typing
            }
        }
    }

    heroLoop();
})();

// --- 3D Tilt Effect on Cards ---
const tiltCards = document.querySelectorAll('.tilt-card');
tiltCards.forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const cardRect = card.getBoundingClientRect();
    const cardCenterX = cardRect.left + cardRect.width / 2;
    const cardCenterY = cardRect.top + cardRect.height / 2;
    
    const mouseX = e.clientX - cardCenterX;
    const mouseY = e.clientY - cardCenterY;
    
    const rotateX = -mouseY / 15;
    const rotateY = mouseX / 15;
    
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
  });
  
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
  });
});

// --- UI Elements Fade In ---
const sections = document.querySelectorAll('.section');
sections.forEach(sec => {
    gsap.from(sec.children, {
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out",
        scrollTrigger: {
            trigger: sec,
            start: "top 80%",
            toggleActions: "play none none reverse"
        }
    });
});

// ==========================================
// --- Why Choose Us: Typing Animation & Hover Glow ---
// ==========================================
const typingElement = document.getElementById('typing-text');
if (typingElement) {
    // We use a custom state-based typing sequencer instead of Typewriter.js to keep dependencies low
    const phases = [
        { type: 'type', text: "From Idea to ", speed: 50 },
        { type: 'type_span', text: "Interrupted", class: "strike-target", speed: 50 },
        { type: 'type', text: " Solution.", speed: 50 },
        { type: 'pause', delay: 1000 },
        { type: 'strike', class: "strike-target", delay: 800 }, // Applies CSS class for red line
        { type: 'move_cursor_into', class: "strike-target" }, // Move cursor inside the span to delete only its contents
        { type: 'delete', count: 11, speed: 40, delay: 500 }, // Deletes only "Interrupted"
        { type: 'remove_strike', class: "strike-target" }, // Removes red line before typing new word
        { type: 'type', text: "Uninterrupted", speed: 50 }, // Types into the span
        { type: 'move_cursor_end' }, // Moves cursor back to the end of the sentence
        { type: 'pause', delay: 1000 }, // Pause before restarting the loop
        { type: 'delete_all', speed: 30 }, // Deletes the entire sentence smoothly backwards
        { type: 'reset' } // Resets state back to 0
    ];

    let currentPhase = 0;
    let charIndex = 0;
    let deleteCount = 0;
    
    let isVisible = false;
    
    // Create cursor
    const cursor = document.createElement('span');
    cursor.className = 'typing-cursor';
    typingElement.appendChild(cursor);

    function runPhase() {
        if (!isVisible) {
            setTimeout(runPhase, 500);
            return;
        }
        if (currentPhase >= phases.length) return; // Done
        
        const phase = phases[currentPhase];
        
        if (phase.type === 'type') {
            if (charIndex < phase.text.length) {
                const charSpan = document.createTextNode(phase.text.charAt(charIndex));
                cursor.parentNode.insertBefore(charSpan, cursor);
                charIndex++;
                setTimeout(runPhase, phase.speed + Math.random() * 30);
            } else {
                charIndex = 0;
                currentPhase++;
                runPhase();
            }
        } 
        else if (phase.type === 'type_span') {
            // Create the span wrapper if it doesn't exist for this phase yet
            let span = document.getElementById('temp-type-span');
            if (!span) {
                span = document.createElement('span');
                span.id = 'temp-type-span';
                span.className = phase.class;
                cursor.parentNode.insertBefore(span, cursor);
            }
            
            if (charIndex < phase.text.length) {
                span.textContent += phase.text.charAt(charIndex);
                charIndex++;
                setTimeout(runPhase, phase.speed + Math.random() * 30);
            } else {
                span.removeAttribute('id'); // lock it in
                charIndex = 0;
                currentPhase++;
                runPhase();
            }
        }
        else if (phase.type === 'pause') {
            setTimeout(() => {
                currentPhase++;
                runPhase();
            }, phase.delay);
        }
        else if (phase.type === 'strike') {
            const target = typingElement.querySelector(`.${phase.class}`);
            if (target) {
                target.classList.add('is-struck');
            }
            setTimeout(() => {
                currentPhase++;
                runPhase();
            }, phase.delay || 800);
        }
        else if (phase.type === 'move_cursor_into') {
            const target = typingElement.querySelector(`.${phase.class}`);
            if (target) {
                target.appendChild(cursor);
            }
            currentPhase++;
            runPhase();
        }
        else if (phase.type === 'remove_strike') {
            const target = typingElement.querySelector(`.${phase.class}`);
            if (target) {
                target.classList.remove('is-struck');
                target.classList.remove('strike-target'); // Completely neutralizes pseudo-element
            }
            currentPhase++;
            runPhase();
        }
        else if (phase.type === 'move_cursor_end') {
            typingElement.appendChild(cursor);
            currentPhase++;
            runPhase();
        }
        else if (phase.type === 'delete') {
            if (deleteCount < phase.count) {
                // Remove the node immediately preceding the cursor
                const prev = cursor.previousSibling;
                if (prev) {
                    if (prev.nodeType === Node.TEXT_NODE) {
                        if (prev.length > 1) {
                            prev.textContent = prev.textContent.slice(0, -1);
                        } else {
                            cursor.parentNode.removeChild(prev);
                        }
                    } else if (prev.nodeType === Node.ELEMENT_NODE) {
                        cursor.parentNode.removeChild(prev);
                    }
                }
                deleteCount++;
                setTimeout(runPhase, phase.speed);
            } else {
                deleteCount = 0;
                setTimeout(() => {
                    currentPhase++;
                    runPhase();
                }, phase.delay || 200);
            }
        }
        else if (phase.type === 'delete_all') {
            function backspace() {
                const prev = cursor.previousSibling;
                if (!prev) {
                    if (cursor.parentNode !== typingElement) {
                        const span = cursor.parentNode;
                        typingElement.insertBefore(cursor, span);
                        typingElement.removeChild(span);
                        setTimeout(backspace, phase.speed);
                    } else {
                        currentPhase++;
                        runPhase();
                    }
                    return;
                }
                
                if (prev.nodeType === Node.TEXT_NODE) {
                    if (prev.length > 1) {
                        prev.textContent = prev.textContent.slice(0, -1);
                    } else {
                        prev.parentNode.removeChild(prev);
                    }
                    setTimeout(backspace, phase.speed);
                } else if (prev.nodeType === Node.ELEMENT_NODE) {
                    prev.appendChild(cursor);
                    setTimeout(backspace, phase.speed);
                }
            }
            backspace();
        }
        else if (phase.type === 'reset') {
            currentPhase = 0;
            charIndex = 0;
            deleteCount = 0;
            setTimeout(runPhase, 500);
        }
    }

    // Start typing when section scrolls into view
    let hasStarted = false;
    ScrollTrigger.create({
        trigger: ".why-choose-us",
        start: "top 85%",
        onEnter: () => { 
            isVisible = true; 
            if (!hasStarted) {
                hasStarted = true;
                setTimeout(runPhase, 500);
            }
        },
        onLeave: () => isVisible = false,
        onEnterBack: () => isVisible = true,
        onLeaveBack: () => isVisible = false
    });
}

// Track mouse position on cards for the radial glow effect
const whyCards = document.querySelectorAll('.why-card');
whyCards.forEach(card => {
    card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
    });
});
// ==========================================
// --- Cinematic 4K WebGL Day-To-Night Environment ---
// ==========================================

const canvas = document.getElementById('bg-canvas');
let scene, camera, renderer, skyUniforms, sun, sunGlow, moon, moonMat, moonGlow, ambientLight, dirLight, cloudMat, cloudCount, starMat, birdMat, flockGroup, birdMeshes, shootingStar, shootingStarMat;
let ssActive = false;
let ssTime = 0;
let cloudGeo, cloudPos;

// Dynamic Lazy Load Three.js
function initThree(THREE) {
scene = new THREE.Scene();

// We use a custom shader on a large sphere to create a seamless, non-banding sky gradient
const skyGeo = new THREE.SphereGeometry(500, 64, 64);
const skyUniforms = {
    uTime: { value: 0 },
    uProgress: { value: 0 },
    topColorMorning: { value: new THREE.Color(0x3eaaf0) },   // Bright blue top
    bottomColorMorning: { value: new THREE.Color(0xffd580) }, // Orange/Gold horizon
    topColorEvening: { value: new THREE.Color(0x1a0b2e) },    // Dark purple top
    bottomColorEvening: { value: new THREE.Color(0xe64a19) }, // Deep sunset horizon
    topColorNight: { value: new THREE.Color(0x020111) },      // Pitch black top
    bottomColorNight: { value: new THREE.Color(0x20124d) }    // Deep blue horizon
};
const skyMat = new THREE.ShaderMaterial({
    uniforms: skyUniforms,
    side: THREE.BackSide,
    vertexShader: `
        varying vec3 vWorldPosition;
        void main() {
            vec4 worldPosition = modelMatrix * vec4(position, 1.0);
            vWorldPosition = worldPosition.xyz;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        uniform float uProgress;
        uniform vec3 topColorMorning;
        uniform vec3 bottomColorMorning;
        uniform vec3 topColorEvening;
        uniform vec3 bottomColorEvening;
        uniform vec3 topColorNight;
        uniform vec3 bottomColorNight;
        varying vec3 vWorldPosition;

        void main() {
            // Normalize y from -1 to 1 based on geometry size
            float h = normalize(vWorldPosition).y; 
            // Map altitude to mix value (0 at horizon, 1 at zenith)
            float mixVal = smoothstep(-0.2, 0.6, h);

            // Interpolate colors based on time of day (uProgress)
            vec3 topColor = mix(
                mix(topColorMorning, topColorEvening, smoothstep(0.0, 0.5, uProgress)),
                topColorNight, smoothstep(0.5, 1.0, uProgress)
            );
            vec3 bottomColor = mix(
                mix(bottomColorMorning, bottomColorEvening, smoothstep(0.0, 0.5, uProgress)),
                bottomColorNight, smoothstep(0.5, 1.0, uProgress)
            );

            vec3 finalColor = mix(bottomColor, topColor, mixVal);
            
            // Add slight dithering to prevent color banding in 4K
            float noise = fract(sin(dot(vWorldPosition.xy, vec2(12.9898, 78.233))) * 43758.5453);
            finalColor += (noise - 0.5) * 0.01;

            gl_FragColor = vec4(finalColor, 1.0);
        }
    `
});
const sky = new THREE.Mesh(skyGeo, skyMat);
scene.add(sky);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 5, 20);

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
scene.add(ambientLight);
const dirLight = new THREE.DirectionalLight(0xffeedd, 2);
scene.add(dirLight);

// --- Sun ---
const sunGeo = new THREE.SphereGeometry(8, 64, 64);
const sunMat = new THREE.MeshBasicMaterial({ color: 0xfff0b3 });
const sun = new THREE.Mesh(sunGeo, sunMat);
scene.add(sun);
// Sun Glow (volumetric trick)
const sunGlowGeo = new THREE.SphereGeometry(11, 64, 64);
const sunGlowMat = new THREE.MeshBasicMaterial({ 
    color: 0xffaa00, transparent: true, opacity: 0.5, blending: THREE.AdditiveBlending 
});
const sunGlow = new THREE.Mesh(sunGlowGeo, sunGlowMat);
sun.add(sunGlow);
// Set initial position (sunrise: low left at p=0)
sun.position.set(Math.cos(Math.PI) * 150, Math.sin(Math.PI) * 150 - 20, -100);

// --- Moon ---
const moonGeo = new THREE.SphereGeometry(7, 64, 64);
const moonMat = new THREE.MeshStandardMaterial({ 
    color: 0xeeeeff, roughness: 0.8, emissive: 0x222244, transparent: true, opacity: 0
});
const moon = new THREE.Mesh(moonGeo, moonMat);
scene.add(moon);
const moonGlow = new THREE.Mesh(
    new THREE.SphereGeometry(9, 64, 64),
    new THREE.MeshBasicMaterial({ color: 0x8888ff, transparent: true, opacity: 0, blending: THREE.AdditiveBlending })
);
moon.add(moonGlow);

// --- Clouds (Sprite based) ---
const cloudGeo = new THREE.BufferGeometry();
const cloudCount = 60;
const cloudPos = new Float32Array(cloudCount * 3);
const cloudScales = new Float32Array(cloudCount);
for(let i=0; i<cloudCount; i++) {
    cloudPos[i*3] = (Math.random() - 0.5) * 300; // x
    cloudPos[i*3+1] = Math.random() * 50 + 20;   // y
    cloudPos[i*3+2] = (Math.random() - 0.5) * 100 - 50; // z (behind camera focus)
    cloudScales[i] = Math.random() * 20 + 10;
}
cloudGeo.setAttribute('position', new THREE.BufferAttribute(cloudPos, 3));
cloudGeo.setAttribute('size', new THREE.BufferAttribute(cloudScales, 1));
// Procedural cloud shader
const cloudMat = new THREE.ShaderMaterial({
    uniforms: { 
        uTime: { value: 0 },
        uOpacity: { value: 0.6 } // Fades at night
    },
    vertexShader: `
        attribute float size;
        varying vec2 vUv;
        void main() {
            vUv = uv;
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            gl_PointSize = size * (300.0 / -mvPosition.z);
            gl_Position = projectionMatrix * mvPosition;
        }
    `,
    fragmentShader: `
        uniform float uTime;
        uniform float uOpacity;
        varying vec2 vUv;
        void main() {
            // Soft fluffy circles
            vec2 cxy = 2.0 * gl_PointCoord - 1.0;
            float r = dot(cxy, cxy);
            if (r > 1.0) discard;
            float alpha = (1.0 - r) * uOpacity;
            // Slightly warm white
            gl_FragColor = vec4(1.0, 0.95, 0.9, alpha * 0.5);
        }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.NormalBlending
});
const clouds = new THREE.Points(cloudGeo, cloudMat);
scene.add(clouds);

// --- Stars ---
const starGeo = new THREE.BufferGeometry();
const starCount = 1500;
const starPos = new Float32Array(starCount * 3);
const starPhase = new Float32Array(starCount);
for(let i=0; i<starCount; i++) {
    // Distribute on the upper hemisphere
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(1 - 2 * (0.5 + Math.random() * 0.5)); // Only upper half
    const r = 400; // Radius
    starPos[i*3] = r * Math.sin(phi) * Math.cos(theta);
    starPos[i*3+1] = r * Math.cos(phi);
    starPos[i*3+2] = r * Math.sin(phi) * Math.sin(theta);
    starPhase[i] = Math.random() * Math.PI * 2;
}
starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
starGeo.setAttribute('aPhase', new THREE.BufferAttribute(starPhase, 1));

const starMat = new THREE.ShaderMaterial({
    uniforms: {
        uTime: { value: 0 },
        uOpacity: { value: 0 } // Starts invisible
    },
    vertexShader: `
        attribute float aPhase;
        varying float vPhase;
        void main() {
            vPhase = aPhase;
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            gl_PointSize = (100.0 / -mvPosition.z);
            gl_Position = projectionMatrix * mvPosition;
        }
    `,
    fragmentShader: `
        uniform float uTime;
        uniform float uOpacity;
        varying float vPhase;
        void main() {
            vec2 cxy = 2.0 * gl_PointCoord - 1.0;
            float r = dot(cxy, cxy);
            if (r > 1.0) discard;
            float twinkle = sin(uTime * 3.0 + vPhase) * 0.3 + 0.7;
            float alpha = (1.0 - r) * uOpacity * twinkle;
            gl_FragColor = vec4(1.0, 1.0, 1.0, alpha);
        }
    `,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false
});
const stars = new THREE.Points(starGeo, starMat);
scene.add(stars);

// --- Shooting Stars System ---
const shootingStarGeo = new THREE.BufferGeometry();
const ssPos = new Float32Array([0,0,0, -2,2,0]); // Small trail
shootingStarGeo.setAttribute('position', new THREE.BufferAttribute(ssPos, 3));
const shootingStarMat = new THREE.LineBasicMaterial({
    color: 0xffffff, transparent: true, opacity: 0
});
const shootingStar = new THREE.Line(shootingStarGeo, shootingStarMat);
scene.add(shootingStar);
let ssActive = false;
let ssTime = 0;

// --- Birds (Simple V geometry) ---
const birdGeo = new THREE.BufferGeometry();
const wingspan = 1.2;
const birdVertices = new Float32Array([
    0, 0, 0,       // Center
    wingspan, 0.5, -0.5, // Right Wing tip
    -wingspan, 0.5, -0.5 // Left Wing tip
]);
birdGeo.setAttribute('position', new THREE.BufferAttribute(birdVertices, 3));
const birdMat = new THREE.MeshBasicMaterial({ color: 0x111111, side: THREE.DoubleSide, transparent: true, opacity: 0.8 });
const flockGroup = new THREE.Group();
const birdMeshes = [];
for (let i=0; i<15; i++) {
    const b = new THREE.Mesh(birdGeo, birdMat);
    b.position.set(
        (Math.random() - 0.5) * 40,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 20 - 10
    );
    b.scale.setScalar(0.5 + Math.random() * 0.5);
    flockGroup.add(b);
    birdMeshes.push({ mesh: b, offset: Math.random() * Math.PI * 2 });
}
flockGroup.position.set(-60, 25, -20);
scene.add(flockGroup);


// ==========================================
// --- Cinematic Scroll Timeline ---
// ==========================================
// Maps scroll directly to the environment's progression
ScrollTrigger.create({
    trigger: document.body,
    start: "top top",
    end: "bottom bottom",
    scrub: 1, // Smooth catch-up
    onUpdate: (self) => {
        const p = self.progress;
        
        // 1. Sky Color Transition
        skyUniforms.uProgress.value = p;

        // 2. Sun Arc (Sunrise -> Zenith -> Sunset)
        // Starts low left, arcs high, sets low right
        const sunAngle = Math.PI - (p * Math.PI); // PI (left) to 0 (right)
        const sunRadius = 150;
        sun.position.x = Math.cos(sunAngle) * sunRadius;
        sun.position.y = Math.sin(sunAngle) * sunRadius - 20; // -20 offset to sink below horizon
        sun.position.z = -100;
        sunGlow.material.opacity = (1 - p) * 0.5;

        // 3. Moon Arc (Night scene)
        // Rises from right as sun sets
        let moonP = (p - 0.5) * 2; // 0 at 50% scroll, 1 at 100%
        if (moonP < 0) moonP = 0;
        const moonAngle = (moonP * Math.PI / 2); // 0 to 90 degrees
        const moonRadius = 120;
        moon.position.x = 100 - Math.sin(moonAngle) * moonRadius;
        moon.position.y = -20 + Math.sin(moonAngle) * 80;
        moon.position.z = -150;
        moonMat.opacity = moonP;
        moonGlow.material.opacity = moonP * 0.4;

        // 4. Lighting changes
        ambientLight.intensity = 1.5 - (p * 1.2); // Dims at night
        dirLight.intensity = 2.0 - (p * 1.8);
        dirLight.position.copy(sun.position).normalize().multiplyScalar(10);
        
        // 5. Cloud Visibility
        // Fade out at night
        cloudMat.uniforms.uOpacity.value = 0.6 - (p * 0.5);

        // 6. Star Visibility
        starMat.uniforms.uOpacity.value = moonP;

        // 7. Birds fly away/fade
        if(birdMat) {
            birdMat.opacity = 0.8 - (p * 1.5);
        }
    }
});


// ==========================================
// --- Animation Loop ---
// ==========================================
const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);
    const elapsedTime = clock.getElapsedTime();

    // Uniforms
    skyUniforms.uTime.value = elapsedTime;
    cloudMat.uniforms.uTime.value = elapsedTime;
    starMat.uniforms.uTime.value = elapsedTime;

    // Slowly drift clouds
    const cPos = cloudGeo.attributes.position.array;
    for(let i=0; i<cloudCount; i++) {
        cPos[i*3] -= 0.05; // moves left
        if (cPos[i*3] < -200) cPos[i*3] = 200; // wrap
    }
    cloudGeo.attributes.position.needsUpdate = true;

    // Animate Birds (Flying right + wing flapping)
    if (birdMat.opacity > 0) {
        flockGroup.position.x += 0.1;
        if(flockGroup.position.x > 100) flockGroup.position.x = -100;

        birdMeshes.forEach(b => {
            // Flap wings (modulate Y position of wing vertices)
            const flap = Math.sin(elapsedTime * 8 + b.offset) * 0.5;
            const geo = b.mesh.geometry;
            const pos = geo.attributes.position.array;
            pos[4] = flap; // Right wing Y
            pos[7] = flap; // Left wing Y
            geo.attributes.position.needsUpdate = true;
            // Slight vertical bobbing
            b.mesh.position.y += Math.sin(elapsedTime * 3 + b.offset) * 0.01;
        });
    }

    // Shooting Stars (Only visible late night, progress > 0.7)
    if (skyUniforms.uProgress.value > 0.7) {
        if (!ssActive && Math.random() < 0.005) { // 0.5% chance per frame to spawn
            ssActive = true;
            ssTime = 0;
            // Spawn top right, shoot bottom left
            shootingStar.position.set(50 + Math.random()*50, 80 + Math.random()*20, -50 - Math.random()*50);
            shootingStarMat.opacity = 1;
        }

        if (ssActive) {
            ssTime += 0.1;
            shootingStar.position.x -= 3;
            shootingStar.position.y -= 2;
            shootingStarMat.opacity -= 0.02; // Fade out fast
            if (shootingStarMat.opacity <= 0) ssActive = false;
        }
    } else {
        shootingStarMat.opacity = 0;
    }

    renderer.render(scene, camera);
}
    animate();
}

// Intersect Observer to only load Three.js when the canvas element is visible / user scrolls
const lazyLoadThree = () => {
    import('three').then((THREE) => {
        initThree(THREE);
    }).catch(err => console.error("Error loading Three.js:", err));
};

// Check if mobile or low connection to defer further or just load
window.addEventListener('load', () => {
    // Start loading 3D environment slightly after DOM is fully painted
    setTimeout(lazyLoadThree, 500);
});

// --- Window Resize ---
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// --- Contact Form ---
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = contactForm.querySelector('button[type="submit"]');
        const originalText = btn.textContent;
        btn.textContent = 'Sending...';
        btn.disabled = true;

        const formData = new FormData(contactForm);
        // Web3Forms Access Key
        formData.append("access_key", "71fea4e5-9acd-4c8a-97c8-d81c0117a244");

        try {
            const response = await fetch("https://api.web3forms.com/submit", {
                method: "POST",
                body: formData
            });

            const data = await response.json();

            if (data.success) {
                btn.textContent = 'Message Sent!';
                btn.style.background = '#25D366'; // Green success color
                contactForm.reset();
            } else {
                btn.textContent = 'Error Sending!';
                btn.style.background = '#FF3D71'; // Red error color
                console.error("Web3Forms Error:", data.message);
            }
        } catch (error) {
            btn.textContent = 'Error Sending!';
            btn.style.background = '#FF3D71';
            console.error("Submission Error:", error);
        } finally {
            // Revert back after 3 seconds
            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.background = ''; // Revert to original
                btn.disabled = false;
            }, 3000);
        }
    });
}
