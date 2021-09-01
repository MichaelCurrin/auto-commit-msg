# Unused

Code that is no longer needed because approach changed, but kept in case it is needed again.


## Status

These were for when the `git status` approach was used. Before the `git diff-index` approach was used.

- `src/generate/action.ts`
    ```typescript
    /**
     * Extract single action from given X and Y actions.
     *
     * "Modified" must take preference over the others. Unfortunately, there is no way here to combine
     * update and move.
     */
    function _lookupStatusAction(x: string, y: string): string {
      if (ACTION[y as ActionKeys] === ACTION.M) {
        return ACTION.M;
      }

      return ACTION[x as ActionKeys];
    }
    ```
- `src/git/cli.ts`
    ```typescript
    /**
    * Run `git status` with flags and return output.
    *
    * This will ignore untracked and remove color.
    */
    async function status(options: string[] = []) {
      return execute(getWorkspaceFolder(), "status", [
        "--short",
        "-uno",
        "--porcelain",
        ...options,
      ]);
    }
    ```
