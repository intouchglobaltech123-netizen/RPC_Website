"use client";
import { Html } from "@react-three/drei";
import { useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { mergeGeometries, mergeVertices } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { anatomy } from "@/lib/content";
import { buildElements, buildSite, dims, type BuildingConfig, type ElementSpec, type LayerKey, type MatKey } from "@/lib/three/building";
import { explodeOffsets, frame } from "@/lib/three/choreography";
import { sceneState, type AnatomyLayer } from "@/lib/three/store";
import { lerp } from "@/lib/utils/math";
import { AnimatedBoxes } from "./AnimatedBoxes";
import type { Materials } from "./materials";

const LAYERS: AnatomyLayer[] = ["foundation", "structure", "walls", "windows", "interior", "roof"];
const HIGHLIGHT = new THREE.Color("#3a6fc4");
const WHITE = new THREE.Color("#ffffff");
const _tmp = new THREE.Color();

function groupBy(specs: ElementSpec[]) {
  const out = new Map<string, ElementSpec[]>();
  for (const s of specs) {
    const k = `${s.layer}:${s.mat}`;
    if (!out.has(k)) out.set(k, []);
    out.get(k)!.push(s);
  }
  return out;
}

const foliageGeo = (() => {
  // clustered canopy: three irregular lobes merged into one mesh
  const lobes: THREE.BufferGeometry[] = [];
  const spec: [number, number, number, number][] = [
    [0, 0.08, 0, 0.5],
    [-0.2, -0.12, 0.12, 0.36],
    [0.22, -0.06, -0.1, 0.38],
    [0.05, 0.3, 0.05, 0.3],
  ];
  spec.forEach(([x, y, z, r], k) => {
    const g = new THREE.IcosahedronGeometry(r, 2);
    const p = g.attributes.position!;
    for (let i = 0; i < p.count; i++) {
      const v = new THREE.Vector3().fromBufferAttribute(p, i);
      const n = 1 + Math.sin(v.x * 17.1 + k + v.y * 9.3) * 0.07 + Math.cos(v.z * 13.7 - k) * 0.06;
      v.multiplyScalar(n);
      p.setXYZ(i, v.x + x, v.y + y, v.z + z);
    }
    lobes.push(g);
  });
  const g = mergeVertices(mergeGeometries(lobes)!.deleteAttribute("normal").deleteAttribute("uv"), 1e-4);
  g.computeVertexNormals();
  return g;
})();
const trunkGeo = new THREE.CylinderGeometry(0.35, 0.5, 1, 6);

const noShadow: MatKey[] = ["glass", "interiorLit", "interiorDark", "light", "water"];

interface Props {
  config: BuildingConfig;
  materials: Materials;
  quality: "high" | "medium" | "low";
  showLabels?: boolean;
}

export function Building({ config, materials, quality, showLabels = false }: Props) {
  const groups = useMemo(() => groupBy(buildElements(config)), [config]);
  const site = useMemo(() => groupBy(buildSite(config, quality === "low" ? 0.5 : 1)), [config, quality]);
  const layerRefs = useRef<Partial<Record<LayerKey, THREE.Group | null>>>({});
  const labelRefs = useRef<Partial<Record<string, HTMLDivElement | null>>>({});
  const { W, D, roof } = dims(config);
  const { gl } = useThree();

  /**
   * Each system gets its own copies of the shared materials so it can be lit
   * or ghosted independently while the visitor explores the anatomy. The
   * copies re-sync colour/emissive from the base every frame, so the
   * construction-sequence material evolution still applies to them.
   */
  const layerMats = useMemo(() => {
    const out = {} as Record<AnatomyLayer, Partial<Record<MatKey, THREE.MeshStandardMaterial>>>;
    for (const layer of LAYERS) {
      out[layer] = {};
      for (const [k, specs] of groups) {
        if (!k.startsWith(layer + ":")) continue;
        const mat = specs[0]!.mat;
        out[layer][mat] = (materials[mat] as THREE.MeshStandardMaterial).clone();
      }
    }
    return out;
  }, [groups, materials]);
  useEffect(
    () => () => {
      for (const layer of LAYERS) for (const m of Object.values(layerMats[layer])) m?.dispose();
    },
    [layerMats],
  );

  useFrame((state) => {
    const e = frame.explode;
    const a = sceneState.anatomy;
    const active = a.hover ?? a.focus;
    const pulse = 0.5 + 0.5 * Math.sin(state.clock.elapsedTime * 2.6);
    for (const l of LAYERS) {
      const g = layerRefs.current[l];
      const o = explodeOffsets[l]!;
      if (g) g.position.set(o[0] * e, o[1] * e, o[2] * e);

      const w = a.weights[l];
      const lit = active === l ? 1 : 0;
      for (const [k, m] of Object.entries(layerMats[l]) as [MatKey, THREE.MeshStandardMaterial][]) {
        const base = materials[k] as THREE.MeshStandardMaterial;
        m.color.copy(base.color);
        m.emissive.copy(base.emissive);
        m.emissiveIntensity = base.emissiveIntensity;
        // ghosted systems fade to a pale shell; the active one warms up with a slow pulse
        m.opacity = base.opacity * lerp(0.14, 1, w);
        m.transparent = base.transparent || w < 0.995;
        m.depthWrite = base.depthWrite && w > 0.5;
        if (lit > 0) {
          m.color.lerp(WHITE, 0.08);
          _tmp.copy(HIGHLIGHT).multiplyScalar(0.22 + pulse * 0.16);
          m.emissive.add(_tmp);
          m.emissiveIntensity = Math.max(m.emissiveIntensity, 1);
        }
      }
    }
    if (showLabels) {
      const baseO = Math.max(0, (e - 0.55) / 0.45);
      for (const ay of anatomy) {
        const el = labelRefs.current[ay.key];
        if (!el) continue;
        const o = active ? (active === ay.key ? 1 : baseO * 0.2) : baseO;
        el.style.opacity = String(o);
        el.classList.toggle("is-active", active === ay.key);
      }
    }
  });

  // events arrive from <body>: ignore ones that were really aimed at page UI
  const overUI = (ev: { nativeEvent: Event }) => {
    const t = ev.nativeEvent.target as Element | null;
    return !!t?.closest?.("button, a, input, textarea, select, label, [data-cursor]");
  };
  const out = (layer: AnatomyLayer) => () => {
    if (sceneState.anatomy.hover !== layer) return;
    sceneState.anatomy.hover = null;
    gl.domElement.style.cursor = "";
    window.dispatchEvent(new CustomEvent("rpc:cursor", { detail: null }));
  };
  const over = (layer: AnatomyLayer) => (ev: ThreeEvent<PointerEvent>) => {
    if (frame.mode !== "exploded") return;
    if (overUI(ev)) {
      // the pointer is on page UI that happens to sit over the model
      out(layer)();
      return;
    }
    ev.stopPropagation();
    if (sceneState.anatomy.hover === layer) return;
    sceneState.anatomy.hover = layer;
    gl.domElement.style.cursor = "pointer";
    const label = anatomy.find((x) => x.key === layer)?.label ?? layer;
    window.dispatchEvent(new CustomEvent("rpc:cursor", { detail: { label, kind: "view" } }));
  };
  const click = (layer: AnatomyLayer) => (ev: ThreeEvent<MouseEvent>) => {
    if (frame.mode !== "exploded" || overUI(ev)) return;
    ev.stopPropagation();
    sceneState.anatomy.focus = sceneState.anatomy.focus === layer ? null : layer;
    window.dispatchEvent(new CustomEvent("rpc:anatomy-focus", { detail: sceneState.anatomy.focus }));
  };

  // label anchor per layer (local coordinates, before explode offset)
  const labelPos: Record<string, [number, number, number]> = {
    roof: [W / 2 + 2, roof + 2.5, 0],
    windows: [W / 2 + 1, roof * 0.6, D / 2],
    walls: [W / 2 + 1, roof * 0.7, -D / 2],
    interior: [W / 2 + 1, roof * 0.4, D / 2 - 3.8],
    structure: [W / 2 + 1, roof * 0.35, 0],
    foundation: [W / 2 + 2, 0, D / 2],
  };

  return (
    <group>
      {LAYERS.map((layer) => (
        <group
          key={layer}
          ref={(g) => { layerRefs.current[layer] = g; }}
          onPointerOver={over(layer)}
          onPointerMove={over(layer)}
          onPointerOut={out(layer)}
          onClick={click(layer)}
        >
          {[...groups.entries()]
            .filter(([k]) => k.startsWith(layer + ":"))
            .map(([k, specs]) => {
              const mat = specs[0]!.mat;
              return (
                <AnimatedBoxes
                  key={k}
                  specs={specs}
                  material={layerMats[layer][mat] ?? materials[mat]}
                  castShadow={!noShadow.includes(mat)}
                  receiveShadow={mat !== "glass"}
                />
              );
            })}
          {showLabels && (
            <Html position={labelPos[layer]} zIndexRange={[5, 0]} style={{ pointerEvents: "none" }}>
              <div
                ref={(el) => { labelRefs.current[layer] = el; }}
                className="anatomy-label"
                style={{ opacity: 0 }}
              >
                <span className="anatomy-line" />
                <span className="font-mono text-body tracking-[0.2em] uppercase whitespace-nowrap">
                  {String(anatomy.findIndex((a) => a.key === layer) + 1).padStart(2, "0")} — {anatomy.find((a) => a.key === layer)?.label}
                </span>
              </div>
            </Html>
          )}
        </group>
      ))}
      <group>
        {[...site.entries()].map(([k, specs]) => {
          const mat = specs[0]!.mat;
          return (
            <AnimatedBoxes
              key={k}
              specs={specs}
              material={materials[mat]}
              geometry={mat === "foliage" ? foliageGeo : mat === "trunk" ? trunkGeo : undefined}
              castShadow={!noShadow.includes(mat) && mat !== "paving" && mat !== "lawn"}
              receiveShadow
            />
          );
        })}
      </group>
    </group>
  );
}
