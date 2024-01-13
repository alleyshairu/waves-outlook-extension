export interface EmailTemplate {
  key: string;
  text: string;
}

export const get_email_template_by_key = (key: string): EmailTemplate => {
  const index = EMAIL_TEMPLATE_LIST.findIndex((e) => e.key === key);
  return EMAIL_TEMPLATE_LIST[index];
};

export const EMAIL_TEMPLATE_LIST: EmailTemplate[] = [
  { key: "professional", text: "Transform this email into a professional email." },
  { key: "informal", text: "Transform this email in an informal email." },
];
