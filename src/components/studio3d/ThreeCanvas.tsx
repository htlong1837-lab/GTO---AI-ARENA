import React, { useEffect, useRef, useState, useImperativeHandle, forwardRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import { Loader2, AlertCircle } from 'lucide-react';
import { Slot3DType, ActiveSlotState, Item3D, STARTER_3D_ITEMS } from '../../data/models3d';

export type LightingMode = 'studio' | 'cyber' | 'natural' | 'minimal';
export type CameraPreset = 'all' | 'collar' | 'hem';

export interface ThreeCanvasHandle {
  exportMergedGLB: (fileName?: string) => Promise<void>;
  captureSnapshot: () => string | null;
}

interface ThreeCanvasProps {
  slots: Record<Slot3DType, ActiveSlotState>;
  items: Item3D[];
  lightingMode?: LightingMode;
  autoRotate?: boolean;
  isWireframe?: boolean;
  cameraPreset?: CameraPreset;
  onStatsUpdated?: (stats: { polyCount: number; meshCount: number }) => void;
}

export const ThreeCanvas = forwardRef<ThreeCanvasHandle, ThreeCanvasProps>(({
  slots,
  items,
  lightingMode = 'studio',
  autoRotate = false,
  isWireframe = false,
  cameraPreset = 'all',
  onStatsUpdated
}, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Three.js Core Refs
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const lightsGroupRef = useRef<THREE.Group | null>(null);

  // Slot Groups mapped into the scene
  const slotGroupsRef = useRef<Map<Slot3DType, THREE.Group>>(new Map());

  // Cache for loaded GLTF scenes to avoid refetching
  const glbCacheRef = useRef<Map<string, THREE.Group>>(new Map());

  // Keep callback ref updated
  const onStatsUpdatedRef = useRef(onStatsUpdated);
  useEffect(() => {
    onStatsUpdatedRef.current = onStatsUpdated;
  }, [onStatsUpdated]);

  // Expose methods to parent via forwardRef
  useImperativeHandle(ref, () => ({
    exportMergedGLB: async (fileName = 'vietphuc-3d-outfit.glb') => {
      const scene = sceneRef.current;
      if (!scene) return;

      const exportGroup = new THREE.Group();
      slotGroupsRef.current.forEach((group, slotType) => {
        if (slots[slotType]?.visible && group.children.length > 0) {
          const clone = group.clone(true);
          exportGroup.add(clone);
        }
      });

      const exporter = new GLTFExporter();
      exporter.parse(
        exportGroup,
        (gltf) => {
          const blob = new Blob([gltf as ArrayBuffer], { type: 'application/octet-stream' });
          const link = document.createElement('a');
          link.href = URL.createObjectURL(blob);
          link.download = fileName;
          link.click();
          URL.revokeObjectURL(link.href);
        },
        (err) => {
          console.error('Export GLB error:', err);
          alert('Có lỗi khi xuất file .GLB. Vui lòng thử lại!');
        },
        { binary: true }
      );
    },

    captureSnapshot: () => {
      const renderer = rendererRef.current;
      const scene = sceneRef.current;
      const camera = cameraRef.current;
      if (!renderer || !scene || !camera) return null;

      renderer.render(scene, camera);
      return renderer.domElement.toDataURL('image/png');
    }
  }));

  // 1. Initialize Three.js Scene
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 0.85, 2.3);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      preserveDrawingBuffer: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 + 0.05;
    controls.minDistance = 0.4;
    controls.maxDistance = 8;
    controls.target.set(0, 0.7, 0);
    controlsRef.current = controls;

    // Ground Grid & Contact Shadow
    const grid = new THREE.GridHelper(8, 16, 0xd4af37, 0xe2e8f0);
    grid.position.y = -0.001;
    scene.add(grid);

    const shadowGeo = new THREE.CircleGeometry(1.2, 32);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.15
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = 0;
    scene.add(shadowMesh);

    // Lights
    const lightsGroup = new THREE.Group();
    scene.add(lightsGroup);
    lightsGroupRef.current = lightsGroup;

    // Initialize Base Slot Group in Scene
    const slotKeys: Slot3DType[] = ['base'];
    slotKeys.forEach((key) => {
      const group = new THREE.Group();
      scene.add(group);
      slotGroupsRef.current.set(key, group);
    });

    // Render loop
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      if (controlsRef.current) {
        controlsRef.current.update();
      }
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      controls.dispose();
      renderer.dispose();
      if (container && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  // 2. Lighting & Environment updates
  useEffect(() => {
    const lightsGroup = lightsGroupRef.current;
    const scene = sceneRef.current;
    if (!lightsGroup || !scene) return;

    while (lightsGroup.children.length > 0) {
      lightsGroup.remove(lightsGroup.children[0]);
    }

    if (lightingMode === 'studio') {
      const ambientLight = new THREE.AmbientLight(0xfff8f0, 1.3);
      const keyLight = new THREE.DirectionalLight(0xffeedd, 2.2);
      keyLight.position.set(3, 4, 3);
      keyLight.castShadow = true;

      const fillLight = new THREE.DirectionalLight(0xddeeff, 1.1);
      fillLight.position.set(-3, 2, -2);

      const rimLight = new THREE.DirectionalLight(0xffd700, 1.3);
      rimLight.position.set(0, 4, -4);

      lightsGroup.add(ambientLight, keyLight, fillLight, rimLight);
      scene.background = new THREE.Color(0xfcfbf9);
    } else if (lightingMode === 'cyber') {
      const ambientLight = new THREE.AmbientLight(0x101525, 1.6);
      const pinkLight = new THREE.PointLight(0xff007f, 4.0, 10);
      pinkLight.position.set(2, 3, 2);

      const cyanLight = new THREE.PointLight(0x00f0ff, 4.0, 10);
      cyanLight.position.set(-2, 2, 2);

      const rimViolet = new THREE.DirectionalLight(0x8a2be2, 2.2);
      rimViolet.position.set(0, 3, -3);

      lightsGroup.add(ambientLight, pinkLight, cyanLight, rimViolet);
      scene.background = new THREE.Color(0x0c0e14);
    } else if (lightingMode === 'natural') {
      const ambientLight = new THREE.AmbientLight(0xe8f4f8, 1.5);
      const sunLight = new THREE.DirectionalLight(0xfffaed, 2.5);
      sunLight.position.set(4, 6, 2);
      sunLight.castShadow = true;

      const bounceLight = new THREE.DirectionalLight(0xcde1d5, 0.9);
      bounceLight.position.set(-2, 1, -2);

      lightsGroup.add(ambientLight, sunLight, bounceLight);
      scene.background = new THREE.Color(0xf4f8f6);
    } else {
      const ambientLight = new THREE.AmbientLight(0xffffff, 2.2);
      const topLight = new THREE.DirectionalLight(0xffffff, 1.6);
      topLight.position.set(0, 5, 2);

      lightsGroup.add(ambientLight, topLight);
      scene.background = new THREE.Color(0xffffff);
    }
  }, [lightingMode]);

  // 3. Auto Rotate
  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.autoRotate = autoRotate;
      controlsRef.current.autoRotateSpeed = 2.0;
    }
  }, [autoRotate]);

  // 4. Camera Presets
  useEffect(() => {
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    if (!camera || !controls) return;

    let targetCamPos = new THREE.Vector3(0, 0.85, 2.3);
    let targetLookAt = new THREE.Vector3(0, 0.7, 0);

    if (cameraPreset === 'collar') {
      // Close up on royal collar & chest embroidery
      targetCamPos = new THREE.Vector3(0, 1.25, 0.95);
      targetLookAt = new THREE.Vector3(0, 1.15, 0);
    } else if (cameraPreset === 'hem') {
      // Close up on lower hem & ngũ sắc bands
      targetCamPos = new THREE.Vector3(0, 0.45, 1.1);
      targetLookAt = new THREE.Vector3(0, 0.35, 0);
    }

    camera.position.copy(targetCamPos);
    controls.target.copy(targetLookAt);
    controls.update();
  }, [cameraPreset]);

  // 5. Garment Loader & Display Engine
  useEffect(() => {
    let isCancelled = false;

    const updateGarment = async () => {
      setLoading(true);
      setError(null);
      const loader = new GLTFLoader();
      loader.setMeshoptDecoder(MeshoptDecoder);

      try {
        const baseSlot = slots.base;
        const baseGroup = slotGroupsRef.current.get('base');
        if (baseGroup) {
          while (baseGroup.children.length > 0) {
            const child = baseGroup.children[0];
            baseGroup.remove(child);
            if ((child as any).geometry) (child as any).geometry.dispose();
          }
        }

        if (baseSlot?.visible && baseSlot?.itemId && baseGroup) {
          const itemConfig = items.find((i) => i.id === baseSlot.itemId) ||
            STARTER_3D_ITEMS.find((i) => i.id === baseSlot.itemId);

          if (itemConfig?.url) {
            let gltfRoot: THREE.Group;
            if (glbCacheRef.current.has(itemConfig.url)) {
              gltfRoot = glbCacheRef.current.get(itemConfig.url)!.clone(true);
            } else {
              const gltf = await loader.loadAsync(itemConfig.url);
              if (isCancelled) return;
              glbCacheRef.current.set(itemConfig.url, gltf.scene);
              gltfRoot = gltf.scene.clone(true);
            }

            // Clone materials so instance modifications don't corrupt cached textures/colors
            gltfRoot.traverse((node) => {
              if ((node as THREE.Mesh).isMesh) {
                const mesh = node as THREE.Mesh;
                if (mesh.material) {
                  if (Array.isArray(mesh.material)) {
                    mesh.material = mesh.material.map((m) => m.clone());
                  } else {
                    mesh.material = mesh.material.clone();
                  }
                }
              }
            });

            const rawBox = new THREE.Box3().setFromObject(gltfRoot);
            const rawSize = new THREE.Vector3();
            rawBox.getSize(rawSize);

            const isAccessory = itemConfig?.category === 'accessory';

            // Detect if shoulder width is along Z (Tripo3D format where rawSize.z > rawSize.x for garments)
            const needsRotateY = !isAccessory && rawSize.z > rawSize.x;
            if (needsRotateY) {
              gltfRoot.rotation.y = Math.PI / 2;
            }

            // Recompute bounding box after rotation
            const rotatedBox = new THREE.Box3().setFromObject(gltfRoot);
            const rotatedSize = new THREE.Vector3();
            rotatedBox.getSize(rotatedSize);
            const rotatedCenter = new THREE.Vector3();
            rotatedBox.getCenter(rotatedCenter);

            // Scale item:
            // For garments: life-size human proportions: height ~ 1.25m
            // For accessories: fit comfortably in viewport: max dimension ~ 0.75m
            let autoScale = 1;
            if (isAccessory) {
              const maxDim = Math.max(rotatedSize.x, rotatedSize.y, rotatedSize.z) || 1;
              autoScale = 0.75 / maxDim;
            } else {
              const targetRobeHeight = 1.25;
              autoScale = targetRobeHeight / (rotatedSize.y || 1);
            }
            const userScale = baseSlot.transform?.scale?.[0] ?? 1;
            const finalScale = autoScale * userScale;

            gltfRoot.scale.set(finalScale, finalScale, finalScale);
            gltfRoot.position.x = -rotatedCenter.x * finalScale + (baseSlot.transform?.position?.[0] ?? 0);
            gltfRoot.position.z = -rotatedCenter.z * finalScale + (baseSlot.transform?.position?.[2] ?? 0);

            if (isAccessory) {
              // Center accessory vertically right around camera focus (Y = 0.68m)
              gltfRoot.position.y = 0.68 - rotatedCenter.y * finalScale + (baseSlot.transform?.position?.[1] ?? 0);
            } else {
              // Place hem gently above contact shadow (Y = 0.08m)
              gltfRoot.position.y = 0.08 - rotatedBox.min.y * finalScale + (baseSlot.transform?.position?.[1] ?? 0);
            }

            if (baseSlot.transform?.rotation) {
              gltfRoot.rotation.x += baseSlot.transform.rotation[0];
              gltfRoot.rotation.y += baseSlot.transform.rotation[1];
              gltfRoot.rotation.z += baseSlot.transform.rotation[2];
            }

            baseGroup.add(gltfRoot);

            // Apply color tint if specified
            if (baseSlot.color) {
              const col = new THREE.Color(baseSlot.color);
              baseGroup.traverse((node) => {
                if ((node as THREE.Mesh).isMesh) {
                  const mesh = node as THREE.Mesh;
                  if (mesh.material) {
                    const tint = (m: any) => {
                      if (m && 'color' in m) {
                        m.color.copy(col);
                        m.needsUpdate = true;
                      }
                    };
                    if (Array.isArray(mesh.material)) {
                      mesh.material.forEach(tint);
                    } else {
                      tint(mesh.material);
                    }
                  }
                }
              });
            }
          }
        }

        // Apply Wireframe toggle to all meshes
        const scene = sceneRef.current;
        if (scene) {
          scene.traverse((node) => {
            if ((node as THREE.Mesh).isMesh) {
              const mesh = node as THREE.Mesh;
              if (mesh.material) {
                if (Array.isArray(mesh.material)) {
                  mesh.material.forEach((m) => { (m as any).wireframe = isWireframe; });
                } else {
                  (mesh.material as any).wireframe = isWireframe;
                }
              }
            }
          });
        }

        // Calculate total stats
        let totalPolys = 0;
        let totalMeshes = 0;
        slotGroupsRef.current.forEach((group) => {
          group.traverse((node) => {
            if ((node as THREE.Mesh).isMesh) {
              const mesh = node as THREE.Mesh;
              totalMeshes++;
              if (mesh.geometry) {
                if (mesh.geometry.index) {
                  totalPolys += mesh.geometry.index.count / 3;
                } else if (mesh.geometry.attributes.position) {
                  totalPolys += mesh.geometry.attributes.position.count / 3;
                }
              }
            }
          });
        });

        if (onStatsUpdatedRef.current) {
          onStatsUpdatedRef.current({
            polyCount: Math.round(totalPolys),
            meshCount: totalMeshes
          });
        }

        setLoading(false);
      } catch (err) {
        console.error('Failed to load 3D royal garment:', err);
        setError('Không thể nạp mô hình 3D cổ phục.');
        setLoading(false);
      }
    };

    updateGarment();

    return () => {
      isCancelled = true;
    };
  }, [slots, items, isWireframe]);

  return (
    <div className="relative w-full h-full min-h-[520px] select-none">
      <div
        ref={containerRef}
        className="w-full h-full cursor-grab active:cursor-grabbing rounded-3xl overflow-hidden shadow-inner"
      />

      {loading && (
        <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-xs flex flex-col items-center justify-center text-white rounded-3xl z-10">
          <Loader2 className="w-10 h-10 animate-spin text-heritage-gold mb-3" />
          <p className="font-semibold text-sm">Đang nạp mô hình 3D Cổ Phục Hoàng Cung PBR...</p>
        </div>
      )}

      {error && (
        <div className="absolute bottom-4 left-4 right-4 bg-rose-900/80 backdrop-blur-md text-white px-4 py-2.5 rounded-2xl flex items-center gap-2 text-xs">
          <AlertCircle className="w-4 h-4 text-rose-300 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Controller Guide */}
      <div className="absolute bottom-3 left-3 px-3 py-1.5 rounded-xl bg-black/40 backdrop-blur-md border border-white/10 text-white/80 text-[11px] flex items-center gap-2 pointer-events-none">
        <span>✨ Cổ Phục 3D PBR Siêu Thực</span>
        <span>•</span>
        <span>🖱️ Xoay 360°</span>
        <span>•</span>
        <span>Cuộn: Zoom</span>
      </div>
    </div>
  );
});

ThreeCanvas.displayName = 'ThreeCanvas';
