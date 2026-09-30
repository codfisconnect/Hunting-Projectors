import { useState, useRef, useEffect, useCallback } from 'react';

interface UseProductRotationOptions {
  totalFrames?: number;
  sensitivity?: number;
  autoRotateSpeed?: number;
  initialAngle?: number;
}

export function useProductRotation(options: UseProductRotationOptions = {}) {
  const {
    totalFrames = 16,
    sensitivity = 0.45,
    autoRotateSpeed = 0.4,
    initialAngle = 0,
  } = options;

  const [angle, setAngle] = useState(initialAngle);
  const [isDragging, setIsDragging] = useState(false);
  const [isAutoRotating, setIsAutoRotating] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);

  const startXRef = useRef(0);
  const startAngleRef = useRef(initialAngle);
  const velocityRef = useRef(0);
  const lastXRef = useRef(0);
  const lastTimeRef = useRef(0);
  const animFrameRef = useRef<number | null>(null);

  // Normalize angle between 0 and 360
  const normalizeAngle = (a: number) => {
    let normalized = a % 360;
    if (normalized < 0) normalized += 360;
    return normalized;
  };

  // Convert current continuous angle to discrete frame index (0..totalFrames-1)
  const currentFrame = Math.floor(
    (normalizeAngle(angle) / 360) * totalFrames
  ) % totalFrames;

  // Handle pointer down (mouse or touch)
  const handlePointerDown = useCallback((clientX: number) => {
    setIsDragging(true);
    setIsAutoRotating(false);
    startXRef.current = clientX;
    lastXRef.current = clientX;
    lastTimeRef.current = performance.now();
    startAngleRef.current = angle;
    velocityRef.current = 0;

    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
    }
  }, [angle]);

  // Handle pointer move
  const handlePointerMove = useCallback((clientX: number) => {
    if (!isDragging) return;
    const now = performance.now();
    const dt = Math.max(1, now - lastTimeRef.current);
    const dx = clientX - lastXRef.current;
    
    velocityRef.current = (dx / dt) * 8; // inertia boost
    lastXRef.current = clientX;
    lastTimeRef.current = now;

    const totalDx = clientX - startXRef.current;
    const newAngle = normalizeAngle(startAngleRef.current - totalDx * sensitivity);
    setAngle(newAngle);
  }, [isDragging, sensitivity]);

  // Handle pointer up (with inertia decay)
  const handlePointerUp = useCallback(() => {
    if (!isDragging) return;
    setIsDragging(false);

    let v = velocityRef.current;
    const friction = 0.92;

    const stepInertia = () => {
      if (Math.abs(v) > 0.05) {
        setAngle(prev => normalizeAngle(prev - v * sensitivity));
        v *= friction;
        animFrameRef.current = requestAnimationFrame(stepInertia);
      } else {
        velocityRef.current = 0;
      }
    };

    if (Math.abs(v) > 0.2) {
      animFrameRef.current = requestAnimationFrame(stepInertia);
    }
  }, [isDragging, sensitivity]);

  // Auto rotation loop
  useEffect(() => {
    let frameId: number;
    if (isAutoRotating && !isDragging) {
      const loop = () => {
        setAngle(prev => normalizeAngle(prev + autoRotateSpeed));
        frameId = requestAnimationFrame(loop);
      };
      frameId = requestAnimationFrame(loop);
    }
    return () => {
      if (frameId) cancelAnimationFrame(frameId);
    };
  }, [isAutoRotating, isDragging, autoRotateSpeed]);

  const toggleAutoRotate = () => setIsAutoRotating(prev => !prev);

  const resetView = () => {
    setAngle(0);
    setZoomLevel(1);
    setIsAutoRotating(false);
  };

  const setSpecificAngle = (targetDeg: number) => {
    setAngle(normalizeAngle(targetDeg));
    setIsAutoRotating(false);
  };

  return {
    angle: Math.round(normalizeAngle(angle)),
    currentFrame,
    isDragging,
    isAutoRotating,
    zoomLevel,
    setZoomLevel,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    toggleAutoRotate,
    resetView,
    setSpecificAngle,
  };
}
