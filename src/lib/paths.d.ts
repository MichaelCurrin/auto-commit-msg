export interface SplitPathResult {
  atRoot: boolean;
  dirPath: string;
  name: string;
  extension: string;
}

export type MoveOrRename = "move" | "rename" | "move and rename";
