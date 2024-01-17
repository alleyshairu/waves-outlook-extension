import {
  Checkbox,
  IDropdownOption,
  Label,
  MessageBar,
  MessageBarType,
  PrimaryButton,
  Spinner,
  SpinnerSize,
  Stack,
  ChoiceGroup,
  IChoiceGroupOption,
} from "@fluentui/react";
import React, { Children, useEffect, useState } from "react";
import { run_waves_assistant, WavesAssistant } from "../../assistant";
import { EMAIL_TEMPLATE_LIST, EmailTemplate, get_email_template_by_key } from "../../template";
import { version } from "../../version";

interface Form {
  email: string;
  instructions: string;
  template: IDropdownOption;
  include_waves_toc: boolean;
  use_sender_email_content: boolean;
  include_waves_toc_file: boolean;
}

const Form: React.FunctionComponent = () => {
  const [loading, set_loading] = useState<boolean>(false);
  const [error, set_error] = useState<string>("");
  const [is_compose_page, set_is_compose_page] = useState<boolean>(false);

  useEffect(() => {
    const url = window.location.href;
    if (url.indexOf("compose") > 1) {
      set_is_compose_page(true);
    }
  }, []);

  const [form, set_form] = useState<Form>({
    email: "",
    instructions: "",
    template: EMAIL_TEMPLATE_LIST[0],
    use_sender_email_content: false,
    include_waves_toc: false,
    include_waves_toc_file: false,
  });

  function handle_email_content_checkbox(
    _ev?: React.FormEvent<HTMLElement | HTMLInputElement>,
    checked?: boolean,
  ) {
    if (!checked || is_compose_page) {
      //set_form({ ...form, email: "", include_email_content: checked });
      return;
    }

    set_loading(true);

    try {
      Office.context.mailbox.item.body.getAsync(Office.CoercionType.Text, async function (res) {
        set_loading(false);

        if (res.status === Office.AsyncResultStatus.Succeeded) {
          //set_form({ ...form, email: res.value, include_email_content: true });
          return;
        }

        set_error(res.error.message);
        //set_form({ ...form, email: "", include_email_content: false });
      });
    } catch {
      set_loading(false);
      //set_form({ ...form, email: "", include_email_content: false });
      set_error("Something went wrong fetching email content");
    }
  }

  function handle_include_waves_toc_checkbox(
    _ev?: React.FormEvent<HTMLElement | HTMLInputElement>,
    checked?: boolean,
  ) {
    set_form({ ...form, include_waves_toc: checked });
  }

  function handle_waves_toc_file_checkbox(
    _ev?: React.FormEvent<HTMLElement | HTMLInputElement>,
    checked?: boolean,
  ) {
    set_form({ ...form, include_waves_toc_file: checked });
  }

  const handle_submit_click = async () => {
    set_error("");

    Office.context.mailbox.item.getSelectedDataAsync(Office.CoercionType.Text, async (res) => {
      if (res.status !== Office.AsyncResultStatus.Succeeded) {
        set_error(res.error.message);
        return;
      }

      const email = res.value.data.trim();
      if (email === "") {
        set_error("Please choose or highlight the email content that you want to transform.");
        return;
      }

      const assistant: WavesAssistant = {
        email: res.value.data,
        instructions: form.instructions,
        use_waves_toc_in_prompt: form.include_waves_toc,
        email_template: get_email_template_by_key(form.template.key.toString()),
      };

      try {
        set_loading(true);
        let response = await run_waves_assistant(assistant);
        let body = response.choices[0].message.content.split("\n").join("<br />");
        set_loading(false);

        if (form.include_waves_toc_file) {
          const attachment = get_waves_toc_file_attachment()[0];
          Office.context.mailbox.item.addFileAttachmentAsync(
            attachment["url"],
            attachment["name"],
            {
              isInline: false,
            },
          );
        }

        Office.context.mailbox.item.body.setSelectedDataAsync(
          body,
          { coercionType: Office.CoercionType.Html },
          (res) => {
            set_loading(false);
            if (res.status !== Office.AsyncResultStatus.Succeeded) {
              set_error(res.error.message);
              return;
            }
          },
        );
      } catch (error) {
        set_loading(false);
        set_error(error.message);
      }
    });

    return;
  };

  return (
    <div>
      <Stack tokens={{ childrenGap: 15 }}>
        <ChoiceGroup
          defaultSelectedKey={EMAIL_TEMPLATE_LIST[0].key}
          options={transform_list_to_choice_options(EMAIL_TEMPLATE_LIST)}
          label="Choose Email Format"
          required={true}
        />

        <Label>Optional Goodies</Label>
        <Checkbox
          label="Refer waves terms and conditions when generating email"
          checked={form.include_waves_toc}
          onChange={handle_include_waves_toc_checkbox}
        />

        <Checkbox
          label="Add waves Terms & condition attachment in email"
          checked={form.include_waves_toc_file}
          onChange={handle_waves_toc_file_checkbox}
        />

        {error ? (
          <MessageBar messageBarType={MessageBarType.error} isMultiline={true}>
            {error}
          </MessageBar>
        ) : null}

        {!loading ? (
          <PrimaryButton text="Generate Email" onClick={handle_submit_click} />
        ) : (
          <Stack horizontal tokens={{ childrenGap: 5 }}>
            <Spinner size={SpinnerSize.xSmall} />
            <Label>Generating email ...</Label>
          </Stack>
        )}
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

const transform_list_to_choice_options = (list: Array<EmailTemplate>): IChoiceGroupOption[] => {
  const choices: IChoiceGroupOption[] = list.map((item: EmailTemplate) => {
    return { key: item.key, text: item.text };
  });

  return choices;
};

export { Form };
