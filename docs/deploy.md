# Deploy


## Checks

The CI/CD flow compiles the app and runs checks on every push - see [main.yml](/.github/workflows/main.yml).

But the full extension is not built or persisted yet. That will be added later using the release/tag trigger.


## Releases
> How to create a release

This will run checks, build an extension file in `build`, increment the tag version and push.

```sh
$ npm version minor
```

Then go into the [Releases](https://github.com/MichaelCurrin/auto-commit-msg/releases) section on GitHub, create a release from the tag and upload the built extension `.vsix` file to the binaries part.

### Doc notes

Note that the doc badge on root README.md will increment to the latest tag number but not the latest release. This is okay, as tags can be regular to track progress but if there is nothing meaningful the extension doesn't have to be rebuilt. Until that flow becomes automated to upload to releases with CI, or publish to marketplace.

When it's at that point, I'll also have to be more conservative with pushing out a newer version with is unstable to be downloaded. It would be useful to use a prerelease (`-alpha`) tag or prerelease checkbox on the release and avoid have that go through publishing.
