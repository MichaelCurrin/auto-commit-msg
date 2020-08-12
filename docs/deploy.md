# Deploy


## Checks

The CI/CD flow compiles the app and runs checks on every push - see [main.yml](/.github/workflows/main.yml). 

But the full extension is not built or persisted yet. That will be added later using the release/tag trigger.


## Releases

How to create a release.

```sh
$ npm version minor
```

```sh
$ git push --follow-tags
```

Then I go into the releases on GH section and add a title.
