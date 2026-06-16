import type { GalleryImage } from './GalleryImage';

export interface Gallery {
  name: string;
  description?: string;
  images: GalleryImage[];
}
