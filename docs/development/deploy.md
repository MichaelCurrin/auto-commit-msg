# Deploy
> Build and publish a release


## Checks

A CI/CD flow is set up on GitHub Actions to compile the app and run checks against it, but not publish it. This is run on every push.

See the [main.yml](/.github/workflows/main.yml) config file.


## Commands

### List

Preview what will be included in the `.vsix` file.

```sh
$ make ls
```

### Publish

This is only relevant for the maintainer of this repo, as access to publishing to VS Code Marketplace requires auth.

See [Publish recipe][] for more detailed steps.

Store a token for Azure DevOps (for accessing VS Code Marketplace).

```sh
$ make login
```

Tag and push to GitHub and VS Code Marketplace.

```sh
$ make publish
```

[Publish recipe]: https://michaelcurrin.github.io/code-cookbook/recipes/other/vs-code-extensions/publish.html

### Tag

How to create a Git release without publishing to the Marketplace. Rather use the [Publish](#publish) step above.

```sh
$ make tag
```

That will do the following:

1. Run checks.
2. Build an extension file in the `build` directory.
3. Increment a minor tag version.
4. Push.

Then go into the [Releases](https://github.com/MichaelCurrin/auto-commit-msg/releases) section on GitHub, create a release from the tag and upload the built extension `.vsix` file to the binaries part.
