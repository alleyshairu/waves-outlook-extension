import * as React from "react";
import { Form } from "./Form";
import Header from "./Header";
import { version } from "../../version";
import { Stack } from "@fluentui/react";

/* global require */

export interface AppProps {
  title: string;
  isOfficeInitialized: boolean;
}

export interface AppState {}

export default class App extends React.Component<AppProps, AppState> {
  constructor(props, context) {
    super(props, context);
  }

  componentDidMount() {}

  click = async () => {
    /**
     * Insert your Outlook code here
     */
  };

  render() {
    const { title, isOfficeInitialized } = this.props;

    if (!isOfficeInitialized) {
      return (
        <Header
          title={title}
          logo={require("./../../../assets/waves-logo.png")}
          message="Please sideload your addin to see app body."
        />
      );
    }

    return (
      <div className="waves-app">
        <Form></Form>
        <div className="version">
          <small>Version: {version}</small>
        </div>
      </div>
    );
  }
}
