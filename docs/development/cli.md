# CLI Development

The code is in [src/bin/](/src/bin).

The CLI commands are built using steps set in [package.json](/package.json) - see the `cli*` scripts and `bin` sections.

### Test

Test the TS files directly.

```sh
npx --yes ts-node src/bin/diffIndexGenerate.ts -h
npx --yes ts-node src/bin/diffIndexGenerateCommit.ts -h
npx --yes ts-node src/bin/generate.ts -h
```
