export interface DarUlIfta {
  id: number;
  en_id: string;
  name: string;
  logo: string;
  website: string;
}

export interface Kitab {
  id: number;
  en_id: string;
  urdu: string;
  dar_ul_ifta: number;
}

export interface Bab {
  id: number;
  en_id: string;
  urdu: string;
  kitab: number;
}

export interface Fasal {
  id: number;
  en_id: string;
  urdu: string;
  bab: number;
}
