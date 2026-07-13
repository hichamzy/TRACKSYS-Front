import { useEffect, useRef } from 'react';

/**
 * Anime les véhicules le long de leur polyligne (comme la maquette : requestAnimationFrame,
 * interpolation segment par segment, vitesse proportionnelle à `speed`).
 * Les positions sont écrites directement dans le DOM SVG (attribut transform) : aucun re-render.
 *
 * @param {Array} vehicles     liste des véhicules
 * @param {object} nodesRef    ref -> { [id]: SVGGElement }
 * @param {object} ringRef     ref du cercle « suivi en direct »
 * @param {string|null} followId
 */
export default function useFleetAnimation(vehicles, nodesRef, ringRef, followId) {
  const motion = useRef({}); // { [id]: { seg, t, pos } }
  const followRef = useRef(followId);
  followRef.current = followId;

  // (Ré)initialise l'état de mouvement quand la flotte change
  useEffect(() => {
    const next = {};
    vehicles.forEach((v) => {
      next[v.id] = motion.current[v.id] || {
        seg: 0,
        t: Math.random() * 0.6,
        pos: v.route[0].slice(),
      };
    });
    motion.current = next;
  }, [vehicles]);

  useEffect(() => {
    let raf;

    const step = () => {
      vehicles.forEach((v) => {
        const m = motion.current[v.id];
        const node = nodesRef.current[v.id];
        if (!m) return;

        if (v.status === 'active' && v.route.length > 1) {
          const a = v.route[m.seg];
          m.t += v.speed / 1400;
          if (m.t >= 1) {
            m.t = 0;
            m.seg = (m.seg + 1) % v.route.length;
          }
          const b = v.route[(m.seg + 1) % v.route.length];
          m.pos = [a[0] + (b[0] - a[0]) * m.t, a[1] + (b[1] - a[1]) * m.t];
        }
        if (node) node.setAttribute('transform', `translate(${m.pos[0]},${m.pos[1]})`);
      });

      const ring = ringRef.current;
      if (ring) {
        const fid = followRef.current;
        const fm = fid ? motion.current[fid] : null;
        if (fm) {
          ring.setAttribute('opacity', '0.9');
          ring.setAttribute('cx', fm.pos[0]);
          ring.setAttribute('cy', fm.pos[1]);
        } else {
          ring.setAttribute('opacity', '0');
        }
      }

      raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [vehicles, nodesRef, ringRef]);
}
