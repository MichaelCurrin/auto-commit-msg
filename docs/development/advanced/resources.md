# Resources


See also the [License](/README.md#license) section for links to repos.

NPM packages that parse git status output:


## git-status

[NPM - git-status](https://www.npmjs.com/package/git-status)

Published in 2020. This _has_ to use the git status command so is limiting. It wraps `parse-git-status` - see [index.js](https://github.com/IonicaBizau/git-status/blob/master/lib/index.js).


## parse-git-status

[NPM - parse-git-status](https://www.npmjs.com/package/parse-git-status)

Published in 2016 and no activity since.

See [index.js](https://github.com/jamestalmage/parse-git-status/blob/master/index.js) - that is the core logic and a `DESCRIPTIONS` mapping. This package can be used against string output so does not require actually running git status. It doesn't have Types though and also from the tests it doesn't support renaming properly.

The output looks like this:

```javascript
parseGitStatus(output)
{
    x: 'X DESCRIPTION',
    y: 'Y DESCRIPTION',
    to: 'TO PATH',
    from: 'FROM PATH OR NULL'
}
```
