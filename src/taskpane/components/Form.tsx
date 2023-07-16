import {
  Checkbox,
  Dropdown,
  IDropdownOption,
  Label,
  PrimaryButton,
  Spinner,
  SpinnerSize,
  Stack,
  TextField,
} from "@fluentui/react";
import React, { Children } from "react";
import { useState } from "react";
import { EMAIL_TONES_LIST, EmailTone, get_email_tone_by_key } from "../../data/tone";
import { EMAIL_TEMPLATE_LIST, EmailTemplate, get_email_template_by_key } from "../../data/template";
import { EMAIL_LENGTH_LIST, EmailLength, get_email_length_by_key } from "../../data/length";
import { EMAIL_STYLE_LIST, EmailStyle, get_email_style_by_key } from "../../data/style";
import { run_waves_assistant } from "../../assistant";

interface Form {
  tone?: IDropdownOption;
  style?: IDropdownOption;
  length?: IDropdownOption;
  template?: IDropdownOption;
  instructions: string;
  email?: string;
  include_waves_toc: boolean;
  include_email_content: boolean;
  include_waves_toc_file: boolean;
}

const Form: React.FunctionComponent = () => {
  const [loading, set_loading] = useState<boolean>(false);

  const [form, set_form] = useState<Form>({
    instructions: "",
    include_email_content: false,
    include_waves_toc: false,
    include_waves_toc_file: false,
  });

  const [preview, set_preview] = useState<string>("");

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

  function handle_email_content_checkbox(_ev?: React.FormEvent<HTMLElement | HTMLInputElement>, checked?: boolean) {
    set_form({ ...form, include_email_content: checked });
  }

  function handle_waves_toc_checkbox(_ev?: React.FormEvent<HTMLElement | HTMLInputElement>, checked?: boolean) {
    set_form({ ...form, include_waves_toc: checked });
  }

  function handle_waves_toc_file_checkbox(_ev?: React.FormEvent<HTMLElement | HTMLInputElement>, checked?: boolean) {
    set_form({ ...form, include_waves_toc_file: checked });
  }

  const handle_submit_click = async () => {
    const assistant = {
      email_length: form.length ? get_email_length_by_key(Number(form.length.key)) : null,
      email_tone: form.tone ? get_email_tone_by_key(Number(form.tone.key)) : null,
      email_style: form.style ? get_email_style_by_key(Number(form.style.key)) : null,
      email_template: form.template ? get_email_template_by_key(Number(form.template.key)) : null,
      instructions: form.instructions,
      email: form.email,
      rules: {
        include_waves_toc: form.include_waves_toc,
        include_email_content: form.include_email_content,
      },
    };

    try {
      set_preview("");
      set_loading(true);
      let response = await run_waves_assistant(assistant);
      set_loading(false);
      set_preview(response.data.choices[0].message.content);
    } catch (error) {
      set_loading(false);
      // TODO: Show error someone where else
      set_preview(error.message);
    }
  };

  const handle_generate_reply_click = () => {
    const reply_content = {
      htmlBody: preview,
    };

    if (form.include_waves_toc_file) {
      reply_content["attachments"] = get_waves_toc_file_attachment();
    }

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
          onChange={on_email_length_dropdown_change}
          placeholder="Select email length"
          options={transform_list_to_dropdown(EMAIL_LENGTH_LIST)}
        />

        <TextField
          label="Instructions"
          multiline
          rows={7}
          value={form.instructions}
          onChange={on_email_instructions_change}
        />

        <Stack tokens={{ childrenGap: 5 }}>
          <Checkbox
            label="Use email content as prompt"
            checked={form.include_email_content}
            onChange={handle_email_content_checkbox}
          />
          <Checkbox
            label="Use Waves Terms & Conditions as prompt"
            checked={form.include_waves_toc}
            onChange={handle_waves_toc_checkbox}
          />

          <Checkbox
            label="Add Waves Terms & Condition Attachment In Reply"
            checked={form.include_waves_toc_file}
            onChange={handle_waves_toc_file_checkbox}
          />
        </Stack>

        {!loading ? (
          <PrimaryButton text="Submit" onClick={handle_submit_click} />
        ) : (
          <Stack horizontal tokens={{ childrenGap: 5 }}>
            <Spinner size={SpinnerSize.xSmall} />
            <Label>Generating email ...</Label>
          </Stack>
        )}

        {preview ? (
          <div>
            <TextField label="Generated Reply" multiline rows={5} disabled value={preview} />
            <PrimaryButton text="Generate Reply Form" onClick={handle_generate_reply_click} />
          </div>
        ) : null}
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

export { Form };
