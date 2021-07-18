import { CONVENTIONAL_TYPE } from "./lib/constants";

export type ConvCommitMsg = {
  prefix: CONVENTIONAL_TYPE;
  description: string;
};
