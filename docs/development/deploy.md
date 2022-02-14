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

_This section is only relevant for the **maintainer** of this repo, as access to publishing to VS Code Marketplace requires authorization._

See [Publish recipe][] for more detailed steps.

Store a token for Azure DevOps - this only needs to be done once and grants access to publishing to VS Code Marketplace.

```sh
$ make login
```

Tag and push to GitHub and VS Code Marketplace. For major, minor, or bug/patch levels respectively.

```sh
$ make publish-M
$ make publish-m
$ make publish-b
```

[Publish recipe]: https://michaelcurrin.github.io/code-cookbook/recipes/other/vs-code-extensions/publish.html
