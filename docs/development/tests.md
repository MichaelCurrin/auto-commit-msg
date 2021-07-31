# Tests


## Unit tests

This will clean the output directory, compile files and then run unit tests. No formatting or linting.

```sh
$ npm test
```

## Integration tests

There are no integration tests in this project.

For the `git-prefix` project this project was partly based on, unfortunately the tests were poor there, so I didn't copy over the extension tests, but I could bring back some from tag `v0.6.0` so there are integration tests if I think I need them.

Most of the logic is what happens internally so it is easy to test with unit tests. There is one frontend button and it just pushes a message, so there is not that much that can go wrong in the UI.

What would be more useful is testing the integration with `git` - namely using actual output from `git` commands. For now, the unit tests are created using output copied from git command output, so that is covered. It is possible to add integration tests for this area, but it would end up duplicating the unit tests - unless the integration is just focus on git commands to expected strings which is testing git itself and not the extension.

Notes:

- This extension was built around Git Prefix, but unfortunately the integration tests of Git Prefix extension there are not useful, so I left out integration tests out of my project. I also noticed that downloading of VS Code as an NPM script is different but clear compared with _Git Semantic Commit_ approach. I don't know which is best practice - need to look at some more VS Code samples.
- _Git Semantic Commit_ extension does in-depth integration tests and even creates a separate new repo in a subfolder to run activity in, so I could look at bringing this in to mine.


## Coverage

Test with code coverage, as a text report.

```sh
$ npm run cover
```

Generate a visual multi-page HTML report.

```sh
$ npm run cover:report
```

See the main page generated as `coverage/lcov-report/index.html`.

This can be viewed using a static site server.

```sh
$ cd coverage/lcov-report
$ python3 -m http.server
```

Then open as:

- http://localhost:8000

Or set up VS Code's _Live Server_ to start on that `index.html` page. That will hot-reload the browser tab when the HTML files change - this is useful if you are updating your tests and want to see the browser reflect changes to coverage.
