import React, { useEffect, useRef } from 'react';

export default function CustomCursor() {
    const cursorDotRef = useRef(null);
    const cursorRingRef = useRef(null);
    const trailsRef = useRef([]);
    const posRef = useRef({ x: 0, y: 0 });
    const ringPosRef = useRef({ x: 0, y: 0 });
    const rafRef = useRef(null);

    useEffect(() => {
        // Hide default cursor
        document.documentElement.style.cursor = 'none';

        const onMove = (e) => {
            posRef.current = { x: e.clientX, y: e.clientY };
            if (cursorDotRef.current) {
                cursorDotRef.current.style.transform = `translate(${e.clientX - 4}px, ${e.clientY - 4}px)`;
            }
        };

        const lerp = (a, b, t) => a + (b - a) * t;

        const animate = () => {
            ringPosRef.current.x = lerp(ringPosRef.current.x, posRef.current.x, 0.12);
            ringPosRef.current.y = lerp(ringPosRef.current.y, posRef.current.y, 0.12);
            if (cursorRingRef.current) {
                cursorRingRef.current.style.transform = `translate(${ringPosRef.current.x - 16}px, ${ringPosRef.current.y - 16}px)`;
            }
            rafRef.current = requestAnimationFrame(animate);
        };

        // Hover effects on interactive elements
        const onEnter = () => {
            if (cursorRingRef.current) {
                cursorRingRef.current.style.width = '44px';
                cursorRingRef.current.style.height = '44px';
                cursorRingRef.current.style.marginLeft = '-22px';
                cursorRingRef.current.style.marginTop = '-22px';
                cursorRingRef.current.style.borderColor = '#00FFA3';
                cursorRingRef.current.style.background = 'rgba(0,255,163,0.08)';
            }
        };
        const onLeave = () => {
            if (cursorRingRef.current) {
                cursorRingRef.current.style.width = '32px';
                cursorRingRef.current.style.height = '32px';
                cursorRingRef.current.style.marginLeft = '0px';
                cursorRingRef.current.style.marginTop = '0px';
                cursorRingRef.current.style.borderColor = 'rgba(0,229,255,0.7)';
                cursorRingRef.current.style.background = 'transparent';
            }
        };

        window.addEventListener('mousemove', onMove, { passive: true });
        rafRef.current = requestAnimationFrame(animate);

        const interactiveEls = document.querySelectorAll('a, button, [data-cursor-hover]');
        interactiveEls.forEach(el => {
            el.addEventListener('mouseenter', onEnter);
            el.addEventListener('mouseleave', onLeave);
        });

        return () => {
            window.removeEventListener('mousemove', onMove);
            cancelAnimationFrame(rafRef.current);
            document.documentElement.style.cursor = '';
            interactiveEls.forEach(el => {
                el.removeEventListener('mouseenter', onEnter);
                el.removeEventListener('mouseleave', onLeave);
            });
        };
    }, []);

    return (
        <>
            {/* Cursor dot */}
            <div
                ref={cursorDotRef}
                className="fixed top-0 left-0 w-2 h-2 rounded-full z-[9998] pointer-events-none"
                style={{
                    background: '#00E5FF',
                    boxShadow: '0 0 8px #00E5FF, 0 0 16px rgba(0,229,255,0.5)',
                    willChange: 'transform',
                    transition: 'transform 0s'
                }}
            />
            {/* Cursor ring - lagging */}
            <div
                ref={cursorRingRef}
                className="fixed top-0 left-0 w-8 h-8 rounded-full z-[9997] pointer-events-none"
                style={{
                    border: '1.5px solid rgba(0,229,255,0.7)',
                    willChange: 'transform',
                    transition: 'width 0.2s, height 0.2s, border-color 0.2s, background 0.2s'
                }}
            />
        </>
    );
}



