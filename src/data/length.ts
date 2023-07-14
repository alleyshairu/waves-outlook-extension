export interface EmailLength {
  size: string;
}

export const get_email_length_by_key = (key: number): EmailLength => {
  return EMAIL_LENGTH_LIST[key];
};

export const EMAIL_LENGTH_LIST: EmailLength[] = [
  { size: "Concise, to the point" },
  { size: "Multi Paragrah response" },
];
