import OpenAI from "openai";
import { EmailTemplate } from "./template";

// TODO: use environment variables
const KEY = "";

type Role = "user" | "system" | "assistant";

export interface Prompt {
  role: Role;
  content: string;
}

export interface WavesAssistant {
  email: string;
  instructions: string;
  email_template: EmailTemplate;
  use_sender_email_in_prompt?: string;
  use_waves_toc_in_prompt?: string;
}

/**
 * This is the function which converts all the given input to prompts that ai will process.
 * So, if you want to change some prompt, this is place to modify it.
 */
function prepare_prompt(assistant: WavesAssistant): Prompt[] {
  const prompts: Prompt[] = [];

  prompts.push({
    role: "user",
    content: generate_prompt(assistant),
  });

  // include instructions if they aren't empty
  if (assistant.instructions) {
    prompts.push({ role: "user", content: assistant.instructions });
  }

  // only include waves toc if specifically checked
  if (assistant.use_waves_toc_in_prompt) {
    // TODO: need to write waves toc + services summary and then add it as a prompt
  }

  return prompts;
}

function generate_prompt(assistant: WavesAssistant): string {
  let string = `I have an email that I need to convert into a ${assistant.email_template.key} format. Here's the original text of the email: ${assistant.email}. Could you help reformat and rewrite this email to meet these requirements?`;
  return string;
}

export function run_waves_assistant(assistant: WavesAssistant) {
  const messages = prepare_prompt(assistant);

  const openai = new OpenAI({
    apiKey: KEY,
    dangerouslyAllowBrowser: true,
  });

  return openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: messages,
  });
}
