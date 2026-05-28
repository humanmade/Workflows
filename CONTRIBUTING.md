# Contributing

## Release Process

1. In a pull request off of `master`,
    - bump the version number in the [plugin.php](./plugin.php) comment header
    - update the [CHANGELOG.md](./CHANGELOG.md) with a list of features to be released
2. Get sign-off from a teammate and merge the version bump PR
3. Create a tag on `master` matching the updated version number in [plugin.php](./plugin.php)
4. Push the tag to GitHub

When you push the release tag, a [GitHub Actions workflow](https://github.com/humanmade/Workflows/actions/workflows/release.yml) will automatically build the plugin and re-point your newly pushed tag to the SHA containing the built code, then promote that tag to a [release](https://github.com/humanmade/Workflows/releases).
