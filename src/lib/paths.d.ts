export interface SplitPathResult {
  atRoot: boolean;
  dirPath: string;
  name: string;
  extension: string;
}

export type MoveAndOrRename = "move" | "rename" | "move and rename";
