import React, { useEffect, useRef } from 'react';

export const AmbientBackdrop: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Particle definition
    interface Particle {
      x: number;
      y: number;
      originX: number;
      originY: number;
      size: number;
      alpha: number;
      baseAlpha: number;
      vx: number;
      vy: number;
      phase: number;
    }

    const particleCount = Math.min(Math.floor((width * height) / 22000), 55);
    const particles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const baseAlpha = 0.12 + Math.random() * 0.28;
      particles.push({
        x,
        y,
        originX: x,
        originY: y,
        size: Math.random() * 1.6 + 0.8,
        alpha: baseAlpha,
        baseAlpha,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        phase: Math.random() * Math.PI * 2,
      });
    }

    let mouseX = -1000;
    let mouseY = -1000;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouseX = e.touches[0].clientX;
        mouseY = e.touches[0].clientY;
      }
    };

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('resize', handleResize);

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let time = 0;

    const render = () => {
      time += 0.01;
      ctx.clearRect(0, 0, width, height);

      // Render subtle connections between close particles
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];

        if (!prefersReducedMotion) {
          // Subtle natural drift
          p1.originX += p1.vx;
          p1.originY += p1.vy;

          // Wrap edges
          if (p1.originX < 0) p1.originX = width;
          if (p1.originX > width) p1.originX = 0;
          if (p1.originY < 0) p1.originY = height;
          if (p1.originY > height) p1.originY = 0;

          // Mouse gentle repulsion (spring back)
          const dx = mouseX - p1.x;
          const dy = mouseY - p1.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxDist = 140;

          if (dist < maxDist && dist > 0) {
            const force = (1 - dist / maxDist) * 14;
            p1.x -= (dx / dist) * force;
            p1.y -= (dy / dist) * force;
          }

          // Return to origin with easing
          p1.x += (p1.originX - p1.x) * 0.04;
          p1.y += (p1.originY - p1.y) * 0.04;
        }

        // Draw particle
        const pulsingAlpha = p1.baseAlpha + Math.sin(time + p1.phase) * 0.08;
        ctx.beginPath();
        ctx.arc(p1.x, p1.y, p1.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(235, 238, 245, ${Math.max(0.04, pulsingAlpha)})`;
        ctx.fill();

        // Connect nearby points with delicate lines
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const distNodes = Math.hypot(p1.x - p2.x, p1.y - p2.y);
          if (distNodes < 110) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            const lineAlpha = (1 - distNodes / 110) * 0.06;
            ctx.strokeStyle = `rgba(220, 225, 240, ${lineAlpha})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      {/* Deep luxury ambient glow orbs */}
      <div 
        className="absolute -top-[25%] left-1/2 -translate-x-1/2 w-[700px] sm:w-[900px] h-[550px] rounded-full blur-[140px] opacity-25"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(120, 140, 200, 0.22) 0%, rgba(90, 80, 140, 0.12) 45%, transparent 70%)',
        }}
      />
      <div 
        className="absolute top-[40%] -left-[15%] w-[600px] h-[600px] rounded-full blur-[160px] opacity-15"
        style={{
          background: 'radial-gradient(circle, rgba(160, 130, 90, 0.18) 0%, transparent 65%)',
        }}
      />
      <div 
        className="absolute bottom-[-10%] -right-[10%] w-[650px] h-[650px] rounded-full blur-[150px] opacity-18"
        style={{
          background: 'radial-gradient(circle, rgba(90, 110, 160, 0.18) 0%, transparent 65%)',
        }}
      />

      {/* Subtle micro-grid noise texture */}
      <div 
        className="absolute inset-0 opacity-[0.022]"
        style={{
          backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.7) 1px, transparent 0)`,
          backgroundSize: '32px 32px',
        }}
      />

      {/* Physics particle canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 block w-full h-full" />
    </div>
  );
};
