import React, { useEffect, useRef } from 'react';

export const InnovationNetwork: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Accessibility check: reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Node definitions
    interface Node {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      label: string;
      color: string;
      pulse: number;
      pulseDir: number;
    }

    const labels = ['IDEAS', 'RESEARCH', 'CODE', 'PEOPLE', 'PROJECTS', 'IMPACT', 'R&D', 'APP DEV', 'BMSIT'];
    const nodes: Node[] = [];
    const maxNodes = Math.min(50, Math.floor((width * height) / 25000)); // Dynamic node count based on screen size

    for (let i = 0; i < maxNodes; i++) {
      const isLabeled = i < labels.length;
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: prefersReducedMotion ? 0 : (Math.random() - 0.5) * 0.4,
        vy: prefersReducedMotion ? 0 : (Math.random() - 0.5) * 0.4,
        radius: isLabeled ? Math.random() * 2 + 3 : Math.random() * 1.5 + 1.5,
        label: isLabeled ? labels[i] : '',
        color: i % 3 === 0 ? '#00f0ff' : i % 3 === 1 ? '#3b82f6' : '#818cf8',
        pulse: Math.random(),
        pulseDir: Math.random() > 0.5 ? 0.005 : -0.005
      });
    }

    // Mouse tracker
    const mouse = {
      x: -1000,
      y: -1000,
      radius: 180
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('resize', handleResize);

    // Animation Loop
    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Subtle Background Grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.01)';
      ctx.lineWidth = 1;
      const gridSpacing = 60;
      for (let x = 0; x < width; x += gridSpacing) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSpacing) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw Connections
      for (let i = 0; i < nodes.length; i++) {
        const n1 = nodes[i];

        // Draw connections between nodes close to each other
        for (let j = i + 1; j < nodes.length; j++) {
          const n2 = nodes[j];
          const dist = Math.hypot(n1.x - n2.x, n1.y - n2.y);

          if (dist < 120) {
            const alpha = (1 - dist / 120) * 0.08;
            ctx.strokeStyle = `rgba(0, 240, 255, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(n1.x, n1.y);
            ctx.lineTo(n2.x, n2.y);
            ctx.stroke();
          }
        }

        // Draw connections to mouse
        const mouseDist = Math.hypot(n1.x - mouse.x, n1.y - mouse.y);
        if (mouseDist < mouse.radius) {
          const alpha = (1 - mouseDist / mouse.radius) * 0.18;
          ctx.strokeStyle = `rgba(0, 240, 255, ${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(n1.x, n1.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();

          // Subtle pull force (unless prefers-reduced-motion)
          if (!prefersReducedMotion && mouseDist > 30) {
            n1.x += (mouse.x - n1.x) * 0.01;
            n1.y += (mouse.y - n1.y) * 0.01;
          }
        }

        // Update Position
        if (!prefersReducedMotion) {
          n1.x += n1.vx;
          n1.y += n1.vy;

          // Bounce at edges
          if (n1.x < 0 || n1.x > width) n1.vx *= -1;
          if (n1.y < 0 || n1.y > height) n1.vy *= -1;
        }

        // Pulse label & nodes
        n1.pulse += n1.pulseDir;
        if (n1.pulse > 1 || n1.pulse < 0.3) n1.pulseDir *= -1;

        // Draw Node Core
        ctx.fillStyle = n1.color;
        ctx.shadowBlur = mouseDist < mouse.radius ? 15 : 0;
        ctx.shadowColor = n1.color;
        ctx.beginPath();
        ctx.arc(n1.x, n1.y, n1.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0; // Reset shadow

        // Draw Labels for key nodes
        if (n1.label) {
          const alpha = mouseDist < mouse.radius ? 0.6 : 0.25;
          ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
          ctx.font = '8px var(--font-mono)';
          ctx.letterSpacing = '1px';
          ctx.textAlign = 'center';
          ctx.fillText(n1.label, n1.x, n1.y - 10);
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 w-full h-full -z-10 pointer-events-none opacity-80" />;
};
