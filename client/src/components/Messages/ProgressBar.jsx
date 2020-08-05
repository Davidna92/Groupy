import React from "react";
import { Progress } from "semantic-ui-react";

const ProgressBar = ({ uploadState, precentUploaded }) =>
  uploadState ==='uploading' && (
    <Progress
      className="progress__bar"
      percent={precentUploaded}
      progress
      indicating
      size="medium"
      inverted
    />
  );

export default ProgressBar;
