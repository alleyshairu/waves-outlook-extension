import OpenAI from "openai";
import { EmailTemplate } from "./template";
import { terms_and_conditions } from "./tos";
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
  use_waves_toc_in_prompt: boolean;
}

/**
 * This is the function which converts all the given input to prompts that ai will process.
 * So, if you want to change some prompt, this is place to modify it.
 */
function prepare_prompt(assistant: WavesAssistant): Prompt[] {
  const prompts: Prompt[] = [];

  if (assistant.use_waves_toc_in_prompt) {
    prompts.push({
      role: "system",
      content: `You are running a car wash business and these are your terms and conditions are as follows: ${terms_and_conditions}`,
    });
  }

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

  let ref = "";
  if(assistant.use_waves_toc_in_prompt) {
    ref = ` Make sure you write based on the waves terms and condition. `
  }

  let string = `I have an email that I need to convert into a ${assistant.email_template.key} format. Here's the original text of the email: ${assistant.email}.${ref}Could you help reformat and rewrite this email to meet these requirements?`;
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
