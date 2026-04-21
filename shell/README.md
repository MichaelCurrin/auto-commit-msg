
# Shell

See [acm-hook.sh](acm-hook.sh) script.

A Bash CLI script that bypasses using VS Code or an extension. It will get output from Git, send it to Node CLI entry-point tool and print
it.

This can be used as part of Git commit message hook flow such as a **pre-commit hook**.

> [!NOTE]
> For **cross-platform support**, see [CLI docs](/docs/cli.md) as that uses Node instead of Bash and also supports creating a pre-built binary for distribution. Also that approach uses a new command which wraps the Git commit logic, while shell acm-hook.sh script works the opposite way as called by Git.

## Setup

If you want to use the hook:

1. Follow instructions to install the commands globally as per [CLI docs](/docs/cli.md).
1. Install the pre-commit hook.
    ```sh
    $ cp shell/acm-hook.sh YOUR_PROJECT/.hooks/pre-commit
    $ chmod +x YOUR_PROJECT/.hooks/pre-commit
    ```

## Debugging

Optionally add a `-p` debug flag to print without writing to a file. This
makes it easy to debug the script outside a Git commit hook flow.
