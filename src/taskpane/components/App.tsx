import * as React from "react";
import Progress from "./Progress";
import { Form } from "./Form";

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
        <Progress
          title={title}
          logo={require("./../../../assets/waves-logo.png")}
          message="Please sideload your addin to see app body."
        />
      );
    }

    return (
      <div className="ms-welcome">
        <Form></Form>
      </div>
    );
  }
}
