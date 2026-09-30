import React, { useState, useRef, useEffect } from 'react';
import * as THREE from 'three';
import { 
  RotateCw, 
  ZoomIn, 
  ZoomOut, 
  RefreshCw, 
  Maximize2, 
  Minimize2, 
  Layers, 
  Box, 
  Sliders
} from 'lucide-react';
import { Product } from '../../../types/product';
import { useProductRotation } from '../../../hooks/useProductRotation';
import './ProductViewer360.css';

interface ProductViewer360Props {
  product: Product;
  className?: string;
  initialMode?: 'sequence' | '3d';
}

export const ProductViewer360: React.FC<ProductViewer360Props> = ({
  product,
  className = '',
  initialMode = 'sequence',
}) => {
  const [mode, setMode] = useState<'sequence' | '3d'>(initialMode);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const canvas3dRef = useRef<HTMLCanvasElement>(null);

  const totalFrames = product.rotationFrames?.length || 16;
  const rotation = useProductRotation({ totalFrames });

  // Handle Fullscreen
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen?.().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  // Three.js 3D Engine setup when mode === '3d'
  useEffect(() => {
    if (mode !== '3d' || !canvas3dRef.current) return;

    const canvas = canvas3dRef.current;
    const width = canvas.clientWidth || 700;
    const height = canvas.clientHeight || 500;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0c10);

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 1.2, 3.8);

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;

    // Lighting setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const mainSpot = new THREE.SpotLight(0x9ddcff, 2.5);
    mainSpot.position.set(3, 4, 3);
    mainSpot.angle = Math.PI / 4;
    mainSpot.penumbra = 0.5;
    scene.add(mainSpot);

    const rimLight = new THREE.SpotLight(0xc8ff38, 1.2);
    rimLight.position.set(-3, -2, -3);
    scene.add(rimLight);

    // Build Architectural Projector 3D Geometry
    const projectorGroup = new THREE.Group();

    // Chassis Box
    const bodyGeo = new THREE.BoxGeometry(2.2, 0.9, 1.8);
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0x141720,
      metalness: 0.85,
      roughness: 0.25,
    });
    const bodyMesh = new THREE.Mesh(bodyGeo, bodyMat);
    projectorGroup.add(bodyMesh);

    // Aluminum Top Plate
    const topPlateGeo = new THREE.BoxGeometry(2.18, 0.04, 1.78);
    const topPlateMat = new THREE.MeshStandardMaterial({
      color: 0x2e3442,
      metalness: 0.9,
      roughness: 0.2,
    });
    const topPlate = new THREE.Mesh(topPlateGeo, topPlateMat);
    topPlate.position.y = 0.47;
    projectorGroup.add(topPlate);

    // Front Optical Glass Barrel
    const lensBarrelGeo = new THREE.CylinderGeometry(0.38, 0.38, 0.22, 32);
    const lensBarrelMat = new THREE.MeshStandardMaterial({
      color: 0x1a1e28,
      metalness: 0.95,
      roughness: 0.15,
    });
    const lensBarrel = new THREE.Mesh(lensBarrelGeo, lensBarrelMat);
    lensBarrel.rotation.x = Math.PI / 2;
    lensBarrel.position.set(0.45, 0.05, 0.95);
    projectorGroup.add(lensBarrel);

    // Optical Glass Element with Anti-Reflective Blue Coating
    const lensGlassGeo = new THREE.SphereGeometry(0.32, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const lensGlassMat = new THREE.MeshPhysicalMaterial({
      color: 0x9ddcff,
      metalness: 0.1,
      roughness: 0.05,
      transmission: 0.8,
      ior: 1.52,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
    });
    const lensGlass = new THREE.Mesh(lensGlassGeo, lensGlassMat);
    lensGlass.rotation.x = Math.PI / 2;
    lensGlass.position.set(0.45, 0.05, 1.05);
    projectorGroup.add(lensGlass);

    // Floor contact shadow disc
    const shadowGeo = new THREE.PlaneGeometry(3.5, 3);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.6,
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = -0.55;
    scene.add(shadowMesh);

    scene.add(projectorGroup);

    // Interaction handling on 3D canvas
    let isInteracting = false;
    let prevMouseX = 0;

    const onMouseDown = (e: MouseEvent) => {
      isInteracting = true;
      prevMouseX = e.clientX;
    };
    const onMouseMove = (e: MouseEvent) => {
      if (!isInteracting) return;
      const delta = e.clientX - prevMouseX;
      projectorGroup.rotation.y += delta * 0.01;
      prevMouseX = e.clientX;
    };
    const onMouseUp = () => {
      isInteracting = false;
    };

    canvas.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    let animationFrameId: number;
    const renderLoop = () => {
      if (!isInteracting) {
        projectorGroup.rotation.y += 0.003;
      }
      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(renderLoop);
    };
    renderLoop();

    return () => {
      cancelAnimationFrame(animationFrameId);
      canvas.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      renderer.dispose();
    };
  }, [mode]);

  // Frame URL for sequence mode
  const currentFrameUrl = product.rotationFrames?.[rotation.currentFrame] || product.images.hero;

  return (
    <div 
      ref={containerRef} 
      className={`product-viewer-container ${isFullscreen ? 'fullscreen-active' : ''} ${className}`}
    >
      {/* Top Controls Bar */}
      <div className="viewer-top-bar">
        <div className="viewer-mode-selector">
          <button 
            type="button" 
            className={`mode-btn ${mode === 'sequence' ? 'active' : ''}`}
            onClick={() => setMode('sequence')}
          >
            <Layers size={14} />
            <span>360° FRAME VIEW</span>
          </button>
          <button 
            type="button" 
            className={`mode-btn ${mode === '3d' ? 'active' : ''}`}
            onClick={() => setMode('3d')}
          >
            <Box size={14} />
            <span>REALTIME 3D</span>
          </button>
        </div>

        <div className="viewer-angle-meter">
          <span className="angle-label">BEARING:</span>
          <span className="angle-degrees">{rotation.angle}°</span>
        </div>

        <div className="viewer-utility-buttons">
          <button 
            type="button" 
            className={`tool-btn ${rotation.isAutoRotating ? 'active-tool' : ''}`}
            onClick={rotation.toggleAutoRotate}
            title={rotation.isAutoRotating ? 'Stop Auto-Rotate' : 'Start Auto-Rotate'}
          >
            <RotateCw size={15} />
          </button>
          
          <button 
            type="button" 
            className="tool-btn" 
            onClick={() => rotation.setZoomLevel(Math.min(1.8, rotation.zoomLevel + 0.2))}
            title="Zoom In"
          >
            <ZoomIn size={15} />
          </button>

          <button 
            type="button" 
            className="tool-btn" 
            onClick={() => rotation.setZoomLevel(Math.max(0.8, rotation.zoomLevel - 0.2))}
            title="Zoom Out"
          >
            <ZoomOut size={15} />
          </button>

          <button 
            type="button" 
            className="tool-btn" 
            onClick={rotation.resetView}
            title="Reset View"
          >
            <RefreshCw size={15} />
          </button>

          <button 
            type="button" 
            className="tool-btn" 
            onClick={toggleFullscreen}
            title={isFullscreen ? 'Exit Fullscreen' : 'View Fullscreen'}
          >
            {isFullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
          </button>
        </div>
      </div>

      {/* Main Interactive Stage */}
      <div 
        className="viewer-stage"
        onMouseDown={e => mode === 'sequence' && rotation.handlePointerDown(e.clientX)}
        onMouseMove={e => mode === 'sequence' && rotation.handlePointerMove(e.clientX)}
        onMouseUp={() => mode === 'sequence' && rotation.handlePointerUp()}
        onMouseLeave={() => mode === 'sequence' && rotation.handlePointerUp()}
        onTouchStart={e => mode === 'sequence' && rotation.handlePointerDown(e.touches[0].clientX)}
        onTouchMove={e => mode === 'sequence' && rotation.handlePointerMove(e.touches[0].clientX)}
        onTouchEnd={() => mode === 'sequence' && rotation.handlePointerUp()}
      >
        {mode === 'sequence' ? (
          <div 
            className="sequence-image-wrapper"
            style={{ 
              transform: `scale(${rotation.zoomLevel})`,
              cursor: rotation.isDragging ? 'grabbing' : 'grab'
            }}
          >
            <img 
              src={currentFrameUrl} 
              alt={`${product.name} 360 degree frame ${rotation.currentFrame + 1}`}
              draggable={false}
              className="sequence-frame-img"
            />
          </div>
        ) : (
          <div className="three-canvas-wrapper">
            <canvas ref={canvas3dRef} className="three-stage-canvas" />
          </div>
        )}

        {/* Drag to Rotate Indicator Banner */}
        <div className={`drag-indicator-pill ${rotation.isDragging ? 'dragging' : ''}`}>
          <Sliders size={13} />
          <span>DRAG TO ROTATE 360°</span>
        </div>
      </div>

      {/* Angle Presets Quick Bar */}
      <div className="viewer-bottom-presets">
        <span className="presets-label">PERSPECTIVE PRESETS:</span>
        <div className="presets-group">
          {[
            { label: 'FRONT 0°', angle: 0 },
            { label: 'QUARTER 45°', angle: 45 },
            { label: 'PROFILE 90°', angle: 90 },
            { label: 'REAR PORTS 180°', angle: 180 },
            { label: 'CINEMA 315°', angle: 315 },
          ].map(p => (
            <button
              key={p.label}
              type="button"
              className={`preset-chip ${Math.abs(rotation.angle - p.angle) < 15 ? 'active-preset' : ''}`}
              onClick={() => rotation.setSpecificAngle(p.angle)}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

    </div>
  );
};
