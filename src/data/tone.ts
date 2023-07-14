export interface EmailTone {
  tone: string;
}

export const get_email_tone_by_key = (key: number): EmailTone => {
  return EMAIL_TONES_LIST[key];
};

export const EMAIL_TONES_LIST: EmailTone[] = [
  { tone: "Authoritative" },
  { tone: "Encouraging" },
  { tone: "Fair" },
  { tone: "Friendly" },
  { tone: "Happy" },
  { tone: "Informal" },
  { tone: "Serious" },
  { tone: "Sympathetic" },
  { tone: "Tentative" },
];
