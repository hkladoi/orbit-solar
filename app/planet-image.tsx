import { bodies } from './solar-data';
import Image from 'next/image';

// Transparent thumbnails rendered from SolarScene's existing meshes and shaders.
// The surrounding button or heading already supplies the accessible planet name.
export function PlanetImage({ bodyIndex, className = '' }: { bodyIndex: number; className?: string }) {
  const body = bodies[bodyIndex];
  if (!body) return null;
  return <Image unoptimized loading="eager" className={`planet-image ${className}`} src={`/planets/${body.name.toLowerCase()}.webp`} width={384} height={320} alt="" aria-hidden="true" draggable={false} decoding="async" />;
}
