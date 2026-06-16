import type { Certificate } from './Certificate';
import type { Education } from './Education';
import type { Experience } from './Experience';
import type { InfoItem } from './InfoItem';
import type { Language } from './Language';
import type { Profile } from './Profile';
import type { Project } from './Project';
import type { Gallery } from './Gallery';
import type { Pet } from './Pet';
import type { Recommendation } from './Recommendation';

export interface Resume {
  profile: Profile;
  cv: InfoItem;
  information: InfoItem[];
  skill: string[];
  language: Language[];
  experience: Experience[];
  volunteer: Experience[];
  education: Education[];
  certificate: Certificate[];
  project: Project[];
  gallery: Gallery[];
  pets?: Pet[];
  recommendations?: Recommendation[];
}
