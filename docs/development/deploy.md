# Deploy
> Prepare and publish a release


## Checks

The CI/CD flow is setup on GitHub Actions to compile the app and runs checks against it. This is done on every push.

See the [main.yml](/.github/workflows/main.yml) config file.

Note the full extension is not built or persisted yet. That will be added later using the release/tag trigger.


## Commands

### List

Preview what will be included in the `.vsix` file.

```sh
$ make ls
```

### Tag
> How to create a release

```sh
$ make tag
```

That will do the following:

1. Run checks.
2. Build an extension file in `build` directory.
3. Increment a minor tag version.
4. Push.

Then go into the [Releases](https://github.com/MichaelCurrin/auto-commit-msg/releases) section on GitHub, create a release from the tag and upload the built extension `.vsix` file to the binaries part.


## Publishing

Note that there is no marketplace extension yet. This section will be completed when that happens around version `1.0`.

Also there is no package on NPM - this would not be useful as this is a standalone project extension and not a library.


## Docs and versions

Note that the doc badge on root `README.md` will increment to the latest tag number but not the latest release. This is okay, as tags can be regular to track progress but if there is nothing meaningful the extension doesn't have to be rebuilt. Until that flow becomes automated to upload to releases with CI, or publish to marketplace.

When it's at that point, I'll also have to be more conservative with pushing out a newer version with is unstable to be downloaded. It would be useful to use a prerelease (`-alpha`) tag or prerelease checkbox on the release and avoid have that go through publishing.
