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

  prompts.push({
    role: "system",
    content:
      "You are a helpful assistant of Waves Car Wash, and your primary goal is to transform the given text into a helpful email for the customers.",
  });

  prompts.push({
    role: "user",
    content: `Make sure to never add the email title, signature, and final greetings when writing the email. Strictly, skip greetings, title, and final signature from the email.`,
  });

  if (assistant.use_waves_toc_in_prompt) {
    prompts.push({
      role: "user",
      content: `The complete list of terms and conditions of the waves car wash business are as follows: ${terms_and_conditions}`,
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

  return prompts;
}

function generate_prompt(assistant: WavesAssistant): string {
  let ref = "";
  if (assistant.use_waves_toc_in_prompt) {
    ref = ` If you believe you can reference terms and conditions, make sure you to use them in your response.`;
  }

  let string = `Act as an Waves Car Wash business professional. I want you to convert the following text ${assistant.email} into a ${assistant.email_template.key} business email.${ref}Could you help reformat and rewrite this email to meet these requirements?`;
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
