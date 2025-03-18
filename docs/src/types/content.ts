export interface Content {
  id: string;
  type: 'fragment' | 'chapter';
  title: {
    zh: string;
    en: string;
    ko: string;
    ja: string;
  };
  content: {
    zh: string;
    en: string;
    ko: string;
    ja: string;
  };
  metadata: {
    chapter: number;
    fragment: number;
    isHidden: boolean;
  };
  media: {
    interactive: InteractiveElement[];
  };
}

export interface Chapter {
  id: number;
  title: {
    zh: string;
    en: string;
    ko: string;
    ja: string;
  };
  fragments: Content[];
  isHidden?: boolean;
}

export interface InteractiveElement {
  id: string;
  type: 'scene' | 'choice';
  data: {
    lines: string[];
    content: string;
  };
}

export interface Theme {
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
    accent: string;
  };
  effects: {
    glitch: boolean;
    neon: boolean;
    scanlines: boolean;
  };
} 