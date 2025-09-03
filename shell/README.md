
# Shell

See [acm-hook.sh](acm-hook.sh).

A CLI script that bypasses using VS Code or an extension.
It will get output from Git, send it to Node CLI entry-point tool and print
it. This can be used as part of Git commit message hook flow (pre-commit hook).


## Setup

If you want to use the hook:

1. Follow instructions to install the TS command globally as per [src/cli/README.md](/src/cli/README.md)
1. Install the pre-commit hook.
    ```sh
    $ cp shell/acm-hook.sh YOUR_PROJECT/.hooks/pre-commit
    $ chmod +x YOUR_PROJECT/.hooks/pre-commit
    ```

## Debugging

Optionally add a `-p` debug flag to print without writing to a file. This
makes it easy to debug the script outside a Git commit hook flow.
