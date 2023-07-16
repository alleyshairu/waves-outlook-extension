import { Configuration, OpenAIApi } from "openai";
import { EmailTemplate } from "./data/template";
import { EmailLength } from "./data/length";
import { EmailStyle } from "./data/style";
import { EmailTone } from "./data/tone";

// TODO: use environment variables
const KEY = "";

type Role = "user" | "system" | "assistant";

export interface Prompt {
  role: Role;
  content: string;
}

export interface WavesAssistantRules {
  include_waves_toc: boolean;
  include_email_content: boolean;
}

export interface WavesAssistant {
  email_template: EmailTemplate | null;
  email_length: EmailLength | null;
  email_style: EmailStyle | null;
  email_tone: EmailTone | null;
  instructions: string;
  email?: string;
  rules: WavesAssistantRules;
}

/**
 * This is the function which converts all the given input to prompts that ai will process.
 * So, if you want to change some prompt, this is place to modify it.
 */
function prepare_prompt(assistant: WavesAssistant): Prompt[] {
  const prompts: Prompt[] = [];

  if (null !== assistant.email_template) {
    prompts.push({ role: "user", content: `Write an email that ${assistant.email_template.template}` });
  }

  if (null !== assistant.email_style) {
    prompts.push({ role: "user", content: `Write email in ${assistant.email_style.style} style` });
  }

  if (null !== assistant.email_tone) {
    prompts.push({ role: "user", content: `Use the ${assistant.email_tone.tone}, when writing response` });
  }

  if (null !== assistant.email_length) {
    prompts.push({ role: "user", content: `Write the response in ${assistant.email_length.size}` });
  }

  // include instructions if they aren't empty
  if (assistant.instructions) {
    prompts.push({ role: "user", content: assistant.instructions });
  }

  // only include email content if specifically checked
  if (assistant.rules.include_email_content && assistant.email) {
    prompts.push({ role: "user", content: assistant.email });
  }

  // only include waves toc if specifically checked
  if (assistant.rules.include_email_content) {
    // TODO: need to write waves toc + services summary and then add it as a prompt
  }

  return prompts;
}

export function run_waves_assistant(assistant: WavesAssistant) {
  const messages = prepare_prompt(assistant);

  const configuration = new Configuration({
    apiKey: KEY,
  });

  const openai = new OpenAIApi(configuration);

  return openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: messages,
  });
}
