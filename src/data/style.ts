export interface EmailStyle {
  style: string;
}

export const get_email_style_by_key = (key: number): EmailStyle => {
  return EMAIL_STYLE_LIST[key];
};

export const EMAIL_STYLE_LIST: EmailStyle[] = [
  { style: "Academic" },
  { style: "Analytical" },
  { style: "Argumentative" },
  { style: "Autobiography" },
  { style: "Business" },
  { style: "Conversational" },
  { style: "Convincing" },
  { style: "Creative" },
  { style: "Critical" },
  { style: "Descriptive" },
  { style: "Directive" },
  { style: "Emotional" },
  { style: "Enthusiastic" },
  { style: "Epigrammatic" },
  { style: "Epistolary" },
  { style: "Expository" },
  { style: "Informative" },
  { style: "Inspirational" },
  { style: "Instructive" },
  { style: "Journalistic" },
  { style: "Legal" },
  { style: "Letter" },
  { style: "Mandamus" },
  { style: "Mandating" },
  { style: "Memoir" },
  { style: "Metaphorical" },
  { style: "Narrative" },
  { style: "Newsletter" },
  { style: "Persuasive" },
  { style: "Poetic" },
  { style: "Satirical" },
  { style: "Technical" },
];
