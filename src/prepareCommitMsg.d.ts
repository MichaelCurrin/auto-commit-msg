import { CONVENTIONAL_TYPE } from "./lib/constants";

export type ConvCommitMsg = {
  typePrefix: CONVENTIONAL_TYPE;
  description: string;
};
