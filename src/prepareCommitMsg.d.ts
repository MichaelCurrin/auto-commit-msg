import { CONVENTIONAL_TYPE } from "./lib/constants";

export type ConvCommitMsg = {
  prefixType: CONVENTIONAL_TYPE;
  description: string;
};
