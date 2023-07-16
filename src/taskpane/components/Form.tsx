import { Checkbox, Dropdown, IDropdownOption, PrimaryButton, Stack, TextField } from "@fluentui/react";
import React from "react";
import { useState } from "react";
import { EMAIL_TONES_LIST, EmailTone, get_email_tone_by_key } from "../../data/tone";
import { EMAIL_TEMPLATE_LIST, EmailTemplate } from "../../data/template";
import { EMAIL_LENGTH_LIST, EmailLength } from "../../data/length";
import { EMAIL_STYLE_LIST, EmailStyle } from "../../data/style";

interface Form {
  tone?: IDropdownOption;
  style?: IDropdownOption;
  length?: IDropdownOption;
  template?: IDropdownOption;
  instructions: string;
  toc: boolean;
}

const transform_list_to_dropdown = (
  list: Array<EmailTone | EmailLength | EmailStyle | EmailTemplate>,
): IDropdownOption[] => {
  const dropdown: IDropdownOption[] = list.map(
    (item: EmailTone | EmailLength | EmailStyle | EmailTemplate, key: number) => {
      let text = "";
      if ("tone" in item) {
        text = item.tone;
      }

      if ("style" in item) {
        text = item.style;
      }

      if ("size" in item) {
        text = item.size;
      }

      if ("template" in item) {
        text = item.template;
      }

      return { key: key, text: text };
    },
  );

  return dropdown;
};
const stackTokens = { childrenGap: 50 };

const Form: React.FunctionComponent = () => {
  const [form, set_form] = useState<Form>({ instructions: "", toc: false });
  const [reply, set_reply] = useState<string>("");

  const on_email_tone_dropdown_change = (_event: React.FormEvent<HTMLDivElement>, item: IDropdownOption): void => {
    set_form({ ...form, tone: item });
  };

  const on_email_template_dropdown_change = (_event: React.FormEvent<HTMLDivElement>, item: IDropdownOption): void => {
    set_form({ ...form, template: item });
  };

  const on_email_style_dropdown_change = (_event: React.FormEvent<HTMLDivElement>, item: IDropdownOption): void => {
    set_form({ ...form, style: item });
  };

  const on_email_length_dropdown_change = (_event: React.FormEvent<HTMLDivElement>, item: IDropdownOption): void => {
    set_form({ ...form, length: item });
  };

  const on_email_instructions_change = (
    _event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    val?: string,
  ): void => {
    set_form({ ...form, instructions: val });
  };

  function handle_waves_terms_conditions(_ev?: React.FormEvent<HTMLElement | HTMLInputElement>, checked?: boolean) {
    set_form({ ...form, toc: checked });
  }

  const handle_generate_mail_click = () => {
    // call openai

    set_reply("mock response from openai.");
  };

  const handle_generate_reply_click = () => {
    const reply_content = {
      htmlBody: reply,
      attachments: get_waves_toc_file_attachment(),
    };

    Office.context.mailbox.item.displayReplyForm(reply_content);
  };

  return (
    <div className="main-form">
      <Stack tokens={{ childrenGap: 15 }}>
        <Dropdown
          label="Email Template"
          selectedKey={form.template?.key}
          // eslint-disable-next-line react/jsx-no-bind
          onChange={on_email_template_dropdown_change}
          placeholder="Select email template"
          options={transform_list_to_dropdown(EMAIL_TEMPLATE_LIST)}
        />

        <Dropdown
          label="Email Style"
          selectedKey={form.style?.key}
          // eslint-disable-next-line react/jsx-no-bind
          onChange={on_email_style_dropdown_change}
          placeholder="Select email style"
          options={transform_list_to_dropdown(EMAIL_STYLE_LIST)}
        />

        <Dropdown
          label="Email Tone"
          selectedKey={form.tone?.key}
          // eslint-disable-next-line react/jsx-no-bind
          onChange={on_email_tone_dropdown_change}
          placeholder="Select email tone"
          options={transform_list_to_dropdown(EMAIL_TONES_LIST)}
        />

        <Dropdown
          label="Email Length"
          selectedKey={form.length?.key}
          // eslint-disable-next-line react/jsx-no-bind
          onChange={on_email_tone_dropdown_change}
          placeholder="Select email length"
          options={transform_list_to_dropdown(EMAIL_LENGTH_LIST)}
        />

        <TextField
          label="Instructions"
          multiline
          rows={5}
          value={form.instructions}
          onChange={on_email_instructions_change}
        />

        <PrimaryButton text="Prepare Mail Based On Instructions Only" onClick={handle_generate_mail_click} />
        <PrimaryButton text="Prepare Mail Based On Content" onClick={handle_generate_mail_click} />
        <PrimaryButton text="Prepare Mail Based On Content And TOC" onClick={handle_generate_mail_click} />

        <TextField label="Generated Reply" multiline rows={5} disabled value={reply} />

        <Checkbox
          label="Add Waves Terms & Condition Attachment In Reply"
          checked={form.toc}
          onChange={handle_waves_terms_conditions}
        />

        <PrimaryButton text="Generate Reply Form" onClick={handle_generate_reply_click} />
      </Stack>
    </div>
  );
};

const get_waves_toc_file_attachment = () => {
  return [
    {
      type: "file",
      name: "waves-terms-and-conditions.pdf",
      url: "https://members.wavescarwash.com.au/shared/washer/members/uwc/uwc-terms-and-conditions.pdf",
    },
  ];
};

export { Form };
