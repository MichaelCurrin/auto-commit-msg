# Releases

The CLI commands are packaged as binaries as distributed on GithUb.

## Upload assets

Release uploads are configured in [release.yml](/.github/workflows/release.yml). This will create a release on a tag and it will build and attach the binaries as assets.

See [softprops/action-gh-release](https://github.com/softprops/action-gh-release) on GH for more info.

> [!WARNING]
> The release must **not** be ticked as pre-release or this URL will not work: https://github.com/MichaelCurrin/auto-commit-msg/releases/latest/download/acm-macos

## Download

See [bin](/bin/) for scripts used for users to get the distributed binaries.

Test the install script locally without curl to install from a release:

```sh
$ bin/install_cli.sh
```
