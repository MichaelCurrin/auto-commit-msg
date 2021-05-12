# Project plan

This project is a work in progress. It is starting out as a specification of the desired behavior on the [Wiki](https://github.com/MichaelCurrin/auto-commit-msg/wiki), then will tests added and then only the functionality last.

This will probably be in Python for easy scaling and tests. And it will probably use git commit hooks - whatever I find works well for command-line use and also VS Code messages if left blank but allowing manual overrides. And ideally showing the message just before its made so one can confirm. But this may be reaching too much especially for two entry methods. Maybe it can be generated when files are staged based on an event in VS Code.


## Tasks

Roadmap of things to do to get this to v1 release.

- [x] Works with `git` repos.
- [x] Tests - Unit tests that are run with GitHub Actions CI
- [x] Test coverage report.
- [ ] Update logo.
- [ ] Available in VS Code marketplace.
- [ ] CI to build the package archive on tag (so it easily available outside the marketplace).
- [ ] Clean up docs and Wiki.

See [Issues](https://github.com/MichaelCurrin/auto-commit-msg/issues) on the repo.
