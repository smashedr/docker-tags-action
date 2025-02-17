[![Release](https://img.shields.io/github/actions/workflow/status/smashedr/docker-tags-action/release.yaml?logo=github&logoColor=white&label=release)](https://github.com/smashedr/docker-tags-action/actions/workflows/release.yaml)
[![Test](https://img.shields.io/github/actions/workflow/status/smashedr/docker-tags-action/test.yaml?logo=github&logoColor=white&label=test)](https://github.com/smashedr/docker-tags-action/actions/workflows/test.yaml)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=smashedr_docker-tags-action&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=smashedr_docker-tags-action)
[![GitHub Release Version](https://img.shields.io/github/v/release/smashedr/docker-tags-action?logo=github)](https://github.com/smashedr/docker-tags-action/releases/latest)
[![GitHub Last Commit](https://img.shields.io/github/last-commit/smashedr/docker-tags-action?logo=github&logoColor=white&label=updated)](https://github.com/smashedr/docker-tags-action/graphs/commit-activity)
[![Codeberg Last Commit](https://img.shields.io/gitea/last-commit/shaner/docker-tags-action/master?gitea_url=https%3A%2F%2Fcodeberg.org%2F&logo=codeberg&logoColor=white&label=updated)](https://codeberg.org/shaner/docker-tags-action)
[![GitHub Top Language](https://img.shields.io/github/languages/top/smashedr/docker-tags-action?logo=htmx&logoColor=white)](https://github.com/smashedr/docker-tags-action)
[![GitHub Org Stars](https://img.shields.io/github/stars/cssnr?style=flat&logo=github&logoColor=white)](https://cssnr.github.io/)
[![Discord](https://img.shields.io/discord/899171661457293343?logo=discord&logoColor=white&label=discord&color=7289da)](https://discord.gg/wXy6m2X8wY)

# Docker Tags Action

Generate Docker Tags. For a more detailed implementation see: https://github.com/docker/metadata-action

> [!NOTE]  
> Please submit
> a [Feature Request](https://github.com/smashedr/docker-tags-action/discussions/categories/feature-requests)
> for new features or [Open an Issue](https://github.com/smashedr/docker-tags-action/issues) if you find any bugs.

- [Inputs](#Inputs)
- [Outputs](#Outputs)
- [Examples](#Examples)
- [Support](#Support)
- [Contributing](#Contributing)

## Inputs

| input     | required | default                            | description                               |
| --------- | -------- | ---------------------------------- | ----------------------------------------- |
| images    | No       | `ghcr.io/${{ github.repository }}` | Images for Tag Generation, CSV or Newline |
| tags      | No       | _[see tags](#tags)_                | Extra Tags to Generate, CSV or Newline    |
| labels    | No       | _[see labels](#labels)_            | Extra Labels to Generate, CSV or Newline  |
| seperator | No       | `\n`                               | Output Seperator                          |
| latest    | No       | `default`                          | Latest Tag: [true, false, default] \*     |

```yaml
- name: 'Docker Tags'
  id: tags
  uses: smashedr/docker-tags-action@master
```

### tags

| Event             | Ref                 | Tags     |
| ----------------- | ------------------- | -------- |
| `tag` / `release` | `refs/tags/v1.0.0`  | `v1.0.0` |
| `push` / `other`  | `refs/heads/master` | `master` |
| `pull_request`    | `refs/pull/1/merge` | `pr-1`   |

This is the default tag added. To disable this set `default: false` (WIP).

### labels

```shell
org.opencontainers.image.description=Example Repository Description
org.opencontainers.image.revision=32b96cee5b4e940b4023f78261702470d59c8001
org.opencontainers.image.source=https://github.com/smashedr/docker-tags-action
org.opencontainers.image.title=repository-name
org.opencontainers.image.url=https://github.com/smashedr/docker-tags-action
org.opencontainers.image.version=v1.0.0
org.opencontainers.image.licenses=GPL-3.0
```

These are the default labels. You can remove them individually by providing a key with no value to `labels`.

Example removing `org.opencontainers.image.licenses` and adding `org.opencontainers.image.authors`.

```yaml
labels: |
  org.opencontainers.image.licenses=
  org.opencontainers.image.authors=smashedr
```

**latest** - Default behavior only adds `latest` tag to a release that are not a pre-release.

### Outputs

| output | description      |
| ------ | ---------------- |
| tags   | Generated Tags   |
| labels | Generated Labels |

All outputs are seperated by the inputs `seperator` which defaults to a newline.

```yaml
- name: 'Docker Tags'
  id: tags
  uses: smashedr/docker-tags-action@master
  with:
    images: 'ghcr.io/${{ github.repository }}'

- name: 'Echo Result'
  run: |
    echo tags: '${{ steps.tags.outputs.tags }}'
    echo labels: '${{ steps.tags.outputs.labels }}'
```

## Examples

With all inputs:

```yaml
- name: 'Docker Tags'
  id: tags
  uses: smashedr/docker-tags-action@master
  with:
    images: 'ghcr.io/${{ github.repository }}'
    tags: v1,v1.0
    labels: |
      org.opencontainers.image.licenses=
      org.opencontainers.image.authors=smashedr
    seperator: ','
    latest: true
```

Full Example:

```yaml
name: 'Release'

on:
  release:
    types: [published]

jobs:
  build:
    name: 'Build'
    runs-on: ubuntu-latest
    timeout-minutes: 5
    permissions:
      packages: write

    steps:
      - name: 'Checkout'
        uses: actions/checkout@v4

      - name: 'Docker Tags'
        id: tags
        uses: smashedr/docker-tags-action@master
        with:
          images: 'ghcr.io/${{ github.repository }}'
          extra: ${{ github.ref_name }}
          latest: false

      - name: 'Echo Tags'
        run: |
          echo -e "tags: \n${{ steps.tags.outputs.tags }}"
          echo -e "labels: \n${{ steps.tags.outputs.labels }}"

      - name: 'Docker Login'
        uses: docker/login-action@v3
        with:
          registry: 'ghcr.io'
          username: ${{ vars.GHCR_USER }}
          password: ${{ secrets.GHCR_PASS }}

      - name: 'Setup Buildx'
        uses: docker/setup-buildx-action@v3

      - name: 'Build and Push'
        uses: docker/build-push-action@v6
        with:
          context: .
          push: true
          tags: ${{ steps.tags.outputs.tags }}
          labels: ${{ steps.tags.outputs.labels }}
          cache-from: type=gha
          cache-to: type=gha,mode=max
```

To see this used in a release workflow, see: https://github.com/cssnr/cloudflare-purge-cache-action/blob/master/.github/workflows/release.yaml

# Support

For general help or to request a feature, see:

- Q&A Discussion: https://github.com/smashedr/docker-tags-action/discussions/categories/q-a
- Request a Feature: https://github.com/smashedr/docker-tags-action/discussions/categories/feature-requests

If you are experiencing an issue/bug or getting unexpected results, you can:

- Report an Issue: https://github.com/smashedr/docker-tags-action/issues
- Chat with us on Discord: https://discord.gg/wXy6m2X8wY
- Provide General
  Feedback: [https://cssnr.github.io/feedback/](https://cssnr.github.io/feedback/?app=Update%20JSON%20Value)

# Contributing

Currently, the best way to contribute to this project is to star this project on GitHub.

Additionally, you can support other GitHub Actions I have published:

- [VirusTotal Action](https://github.com/cssnr/virustotal-action)
- [Update Version Tags Action](https://github.com/cssnr/update-version-tags-action)
- [Update JSON Value Action](https://github.com/cssnr/update-json-value-action)
- [Parse Issue Form Action](https://github.com/cssnr/parse-issue-form-action)
- [Mirror Repository Action](https://github.com/cssnr/mirror-repository-action)
- [Stack Deploy Action](https://github.com/cssnr/stack-deploy-action)
- [Portainer Stack Deploy](https://github.com/cssnr/portainer-stack-deploy-action)
- [Mozilla Addon Update Action](https://github.com/cssnr/mozilla-addon-update-action)

For a full list of current projects to support visit: [https://cssnr.github.io/](https://cssnr.github.io/)

If you would like to submit a PR, please review the [CONTRIBUTING.md](CONTRIBUTING.md).
