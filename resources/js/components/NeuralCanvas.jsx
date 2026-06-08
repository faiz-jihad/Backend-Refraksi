import React, { useRef, useEffect } from 'react';

// DESIGN.MD palette: teal #006666, surface #E7E5E4, #b5b3b2 shadows
export default function NeuralCanvas({ mouseCoords }) {
    const canvasRef = useRef(null);
    const animRef = useRef(null);
    const nodesRef = useRef([]);
    const particlesRef = useRef([]);
    const timeRef = useRef(0);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        const resize = () => {
            canvas.width = canvas.offsetWidth * window.devicePixelRatio;
            canvas.height = canvas.offsetHeight * window.devicePixelRatio;
            ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        };
        resize();
        window.addEventListener('resize', resize);

        const W = canvas.offsetWidth;
        const H = canvas.offsetHeight;
        const nodeCount = 22;

        nodesRef.current = Array.from({ length: nodeCount }, (_, i) => ({
            x: Math.random() * W,
            y: Math.random() * H,
            vx: (Math.random() - 0.5) * 0.35,
            vy: (Math.random() - 0.5) * 0.35,
            radius: Math.random() * 3 + 2,
            pulse: Math.random() * Math.PI * 2,
            pulseSpeed: Math.random() * 0.02 + 0.01,
            // Alternate teal / warm gray
            color: i % 3 === 0 ? '#006666' : i % 3 === 1 ? '#004d4d' : '#338080',
        }));

        particlesRef.current = Array.from({ length: 22 }, () => ({
            progress: Math.random(),
            speed: Math.random() * 0.004 + 0.002,
            fromIdx: Math.floor(Math.random() * nodeCount),
            toIdx: Math.floor(Math.random() * nodeCount),
            size: Math.random() * 2 + 1,
        }));

        const draw = () => {
            timeRef.current += 0.016;
            const t = timeRef.current;
            const W2 = canvas.offsetWidth;
            const H2 = canvas.offsetHeight;

            ctx.clearRect(0, 0, W2, H2);

            const mx = (mouseCoords?.x || 0) * 14;
            const my = (mouseCoords?.y || 0) * 10;

            const nodes = nodesRef.current;
            const maxDist = 110;

            // Connections
            for (let i = 0; i < nodes.length; i++) {
                for (let j = i + 1; j < nodes.length; j++) {
                    const dx = nodes[i].x - nodes[j].x;
                    const dy = nodes[i].y - nodes[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < maxDist) {
                        const alpha = (1 - dist / maxDist) * 0.18;
                        ctx.beginPath();
                        ctx.moveTo(nodes[i].x, nodes[i].y);
                        ctx.lineTo(nodes[j].x, nodes[j].y);
                        ctx.strokeStyle = `rgba(0,102,102,${alpha})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }

            // Data particles
            particlesRef.current.forEach(p => {
                p.progress += p.speed;
                if (p.progress >= 1) {
                    p.progress = 0;
                    p.fromIdx = p.toIdx;
                    p.toIdx = Math.floor(Math.random() * nodes.length);
                }
                const from = nodes[p.fromIdx], to = nodes[p.toIdx];
                if (!from || !to) return;
                const px = from.x + (to.x - from.x) * p.progress;
                const py = from.y + (to.y - from.y) * p.progress;
                ctx.beginPath();
                ctx.arc(px, py, p.size, 0, Math.PI * 2);
                ctx.fillStyle = '#00A63D';
                ctx.shadowColor = '#00A63D';
                ctx.shadowBlur = 5;
                ctx.fill();
                ctx.shadowBlur = 0;
            });

            // Nodes
            nodes.forEach(n => {
                n.x += n.vx + mx * 0.0015;
                n.y += n.vy + my * 0.0015;
                n.pulse += n.pulseSpeed;
                if (n.x < -10) n.x = W2 + 10;
                if (n.x > W2 + 10) n.x = -10;
                if (n.y < -10) n.y = H2 + 10;
                if (n.y > H2 + 10) n.y = -10;

                const glow = Math.sin(n.pulse) * 0.35 + 0.65;
                ctx.beginPath();
                ctx.arc(n.x, n.y, n.radius + glow * 1.5, 0, Math.PI * 2);
                ctx.fillStyle = n.color;
                ctx.globalAlpha = 0.5 + glow * 0.45;
                ctx.shadowColor = n.color;
                ctx.shadowBlur = 8;
                ctx.fill();
                ctx.globalAlpha = 1;
                ctx.shadowBlur = 0;
            });

            // Central eye — teal palette
            const cx = W2 / 2 + mx * 0.25;
            const cy = H2 / 2 + my * 0.18;
            const eyeR = Math.min(W2, H2) * 0.17;
            const eyeScaleX = eyeR * 2.2;
            const eyeScaleY = eyeR * 0.85;

            // Outer halo
            const halo = ctx.createRadialGradient(cx, cy, eyeR * 0.3, cx, cy, eyeR * 1.6);
            halo.addColorStop(0, `rgba(0,102,102,${0.06 + Math.sin(t * 0.4) * 0.025})`);
            halo.addColorStop(1, 'transparent');
            ctx.beginPath();
            ctx.arc(cx, cy, eyeR * 1.6, 0, Math.PI * 2);
            ctx.fillStyle = halo;
            ctx.fill();

            // Eye outline
            ctx.save();
            ctx.translate(cx, cy);
            ctx.beginPath();
            ctx.ellipse(0, 0, eyeScaleX, eyeScaleY, 0, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(0,102,102,0.45)';
            ctx.lineWidth = 1.5;
            ctx.stroke();
            ctx.restore();

            // Iris
            const irisGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, eyeR);
            irisGrad.addColorStop(0, 'rgba(0,102,102,0.55)');
            irisGrad.addColorStop(0.5, 'rgba(0,102,102,0.2)');
            irisGrad.addColorStop(1, 'rgba(0,102,102,0)');
            ctx.beginPath();
            ctx.arc(cx, cy, eyeR, 0, Math.PI * 2);
            ctx.fillStyle = irisGrad;
            ctx.fill();

            // Iris rings
            for (let r = 1; r <= 3; r++) {
                ctx.beginPath();
                ctx.arc(cx, cy, eyeR * (r / 3), 0, Math.PI * 2);
                ctx.strokeStyle = `rgba(0,102,102,${0.06 + r * 0.04})`;
                ctx.lineWidth = 0.5;
                ctx.stroke();
            }

            // Pupil
            ctx.beginPath();
            ctx.arc(cx, cy, eyeR * 0.27, 0, Math.PI * 2);
            ctx.fillStyle = '#E7E5E4';
            ctx.fill();
            ctx.beginPath();
            ctx.arc(cx, cy, eyeR * 0.27, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(0,102,102,0.5)';
            ctx.lineWidth = 1.5;
            ctx.stroke();

            // Scan line — teal accent
            const scanY = Math.sin(t * 1.1) * eyeR * 0.65;
            ctx.beginPath();
            ctx.moveTo(cx - eyeScaleX * 0.55, cy + scanY);
            ctx.lineTo(cx + eyeScaleX * 0.55, cy + scanY);
            const scanAlpha = Math.abs(Math.sin(t * 1.1)) * 0.7;
            ctx.strokeStyle = `rgba(0,166,61,${scanAlpha})`;
            ctx.lineWidth = 1.5;
            ctx.shadowColor = '#00A63D';
            ctx.shadowBlur = 8;
            ctx.stroke();
            ctx.shadowBlur = 0;

            // Floating stat cards
            const statCards = [
                { x: cx - eyeR * 2.1, y: cy - eyeR * 0.85, label: 'Acuity', value: '20/20', color: '#006666' },
                { x: cx + eyeR * 1.4, y: cy - eyeR * 0.7, label: 'Digital Score', value: '98.7%', color: '#004d4d' },
                { x: cx - eyeR * 1.7, y: cy + eyeR * 0.9, label: 'Refraction', value: '-0.25D', color: '#006666' },
                { x: cx + eyeR * 1.2, y: cy + eyeR * 0.85, label: 'Status', value: 'Normal', color: '#00A63D' },
            ];

            statCards.forEach((card, i) => {
                const float = Math.sin(t * 0.5 + i * 1.1) * 4;
                const cx2 = card.x;
                const cy2 = card.y + float;

                ctx.save();
                ctx.beginPath();
                ctx.roundRect(cx2 - 42, cy2 - 22, 84, 44, 6);
                ctx.fillStyle = 'rgba(231,229,228,0.92)';
                ctx.shadowColor = '#b5b3b2';
                ctx.shadowBlur = 8;
                ctx.shadowOffsetX = 3;
                ctx.shadowOffsetY = 3;
                ctx.fill();
                ctx.shadowColor = '#ffffff';
                ctx.shadowOffsetX = -3;
                ctx.shadowOffsetY = -3;
                ctx.fill();
                ctx.shadowBlur = 0;
                ctx.shadowOffsetX = 0;
                ctx.shadowOffsetY = 0;

                ctx.fillStyle = '#94a3b8';
                ctx.font = '7px Montserrat, monospace';
                ctx.textAlign = 'center';
                ctx.fillText(card.label.toUpperCase(), cx2, cy2 - 7);

                ctx.fillStyle = card.color;
                ctx.font = 'bold 13px Montserrat, monospace';
                ctx.fillText(card.value, cx2, cy2 + 8);

                ctx.beginPath();
                ctx.arc(cx2 - 28, cy2 + 8, 2.5, 0, Math.PI * 2);
                ctx.fillStyle = card.color;
                ctx.fill();
                ctx.restore();
            });

            animRef.current = requestAnimationFrame(draw);
        };

        animRef.current = requestAnimationFrame(draw);

        return () => {
            cancelAnimationFrame(animRef.current);
            window.removeEventListener('resize', resize);
        };
    }, []);

    return <canvas ref={canvasRef} className="w-full h-full" style={{ display: 'block' }} />;
}



