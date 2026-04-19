import { useState, useEffect, useRef } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';
import './CustomCursor.css';

export default function CustomCursor() {
    const [isVisible, setIsVisible] = useState(false);
    const [isHovering, setIsHovering] = useState(false);
    const [isClicking, setIsClicking] = useState(false);
    const [trail, setTrail] = useState([]);
    const trailIdRef = useRef(0);

    const cursorX = useMotionValue(-100);
    const cursorY = useMotionValue(-100);

    const springX = useSpring(cursorX, { damping: 25, stiffness: 200 });
    const springY = useSpring(cursorY, { damping: 25, stiffness: 200 });

    const ringX = useSpring(cursorX, { damping: 18, stiffness: 120 });
    const ringY = useSpring(cursorY, { damping: 18, stiffness: 120 });

    useEffect(() => {
        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        if (isTouchDevice) return;

        const move = (e) => {
            cursorX.set(e.clientX);
            cursorY.set(e.clientY);
            setIsVisible(true);

            trailIdRef.current += 1;
            const id = trailIdRef.current;
            setTrail(prev => [...prev.slice(-12), { id, x: e.clientX, y: e.clientY }]);
        };

        const handleEnter = () => setIsVisible(true);
        const handleLeave = () => setIsVisible(false);
        const handleDown = () => setIsClicking(true);
        const handleUp = () => setIsClicking(false);

        const handleHoverStart = (e) => {
            const el = e.target.closest('a, button, [role="button"], input, select, textarea, .clickable');
            setIsHovering(!!el);
        };

        document.addEventListener('mousemove', move);
        document.addEventListener('mouseenter', handleEnter);
        document.addEventListener('mouseleave', handleLeave);
        document.addEventListener('mousedown', handleDown);
        document.addEventListener('mouseup', handleUp);
        document.addEventListener('mouseover', handleHoverStart);

        return () => {
            document.removeEventListener('mousemove', move);
            document.removeEventListener('mouseenter', handleEnter);
            document.removeEventListener('mouseleave', handleLeave);
            document.removeEventListener('mousedown', handleDown);
            document.removeEventListener('mouseup', handleUp);
            document.removeEventListener('mouseover', handleHoverStart);
        };
    }, [cursorX, cursorY]);

    // Cleanup old trail particles
    useEffect(() => {
        const interval = setInterval(() => {
            setTrail(prev => prev.slice(-12));
        }, 100);
        return () => clearInterval(interval);
    }, []);

    if (!isVisible) return null;

    return (
        <div className="custom-cursor-wrapper">
            {/* Trail particles */}
            {trail.map((point, i) => (
                <motion.div
                    key={point.id}
                    className="cursor-trail"
                    initial={{ opacity: 0.6, scale: 1 }}
                    animate={{ opacity: 0, scale: 0.2 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    style={{
                        left: point.x,
                        top: point.y,
                        '--trail-hue': `${(i * 25 + 240) % 360}`,
                    }}
                />
            ))}

            {/* Outer glow ring */}
            <motion.div
                className={`cursor-ring ${isHovering ? 'cursor-ring--hover' : ''} ${isClicking ? 'cursor-ring--click' : ''}`}
                style={{
                    left: ringX,
                    top: ringY,
                }}
            />

            {/* Inner dot */}
            <motion.div
                className={`cursor-dot ${isHovering ? 'cursor-dot--hover' : ''} ${isClicking ? 'cursor-dot--click' : ''}`}
                style={{
                    left: springX,
                    top: springY,
                }}
            />

            {/* Glow aura */}
            <motion.div
                className="cursor-glow"
                style={{
                    left: ringX,
                    top: ringY,
                }}
            />
        </div>
    );
}
