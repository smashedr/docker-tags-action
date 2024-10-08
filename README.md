[![Tags](https://img.shields.io/github/actions/workflow/status/smashedr/docker-tags-action/tags.yaml?logo=github&logoColor=white&label=tags)](https://github.com/smashedr/docker-tags-action/actions/workflows/tags.yaml)
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

-   [Inputs](#Inputs)
-   [Outputs](#Outputs)
-   [Examples](#Examples)
-   [Support](#Support)
-   [Contributing](#Contributing)

## Inputs

| input     | required | default   | description                     |
| --------- | -------- | --------- | ------------------------------- |
| images    | Yes      | -         | Image to Generate Tag for       |
| extra     | No       | -         | Extra Tags to Generate \*       |
| seperator | No       | `\n`      | Tag Seperator for Output        |
| latest    | No       | `default` | [`true`, `false`, `default`] \* |

**extra** - Extra tags can be newline or comma seperated.

**latest** - Default behavior only adds `latest` tag to a release that are not a pre-release.

```yaml
- name: 'Update Tags'
  uses: smashedr/docker-tags-action@master
  with:
      images: 'ghcr.io/${{ github.repository }}'
```

### Outputs

| output | description              |
| ------ | ------------------------ |
| tags   | Tags Generated for Image |

```yaml
- name: 'Generate Tags'
  id: tags
  uses: smashedr/docker-tags-action@master
  with:
      images: 'ghcr.io/${{ github.repository }}'

- name: 'Echo Result'
  run: echo '${{ steps.tags.outputs.tags }}'
```

## Examples

Coming Soon...

# Support

For general help or to request a feature, see:

-   Q&A Discussion: https://github.com/smashedr/docker-tags-action/discussions/categories/q-a
-   Request a Feature: https://github.com/smashedr/docker-tags-action/discussions/categories/feature-requests

If you are experiencing an issue/bug or getting unexpected results, you can:

-   Report an Issue: https://github.com/smashedr/docker-tags-action/issues
-   Chat with us on Discord: https://discord.gg/wXy6m2X8wY
-   Provide General
    Feedback: [https://cssnr.github.io/feedback/](https://cssnr.github.io/feedback/?app=Update%20JSON%20Value)

# Contributing

Currently, the best way to contribute to this project is to star this project on GitHub.

Additionally, you can support other GitHub Actions I have published:

-   [VirusTotal Action](https://github.com/cssnr/virustotal-action)
-   [Update Version Tags Action](https://github.com/cssnr/update-version-tags-action)
-   [Update JSON Value Action](https://github.com/cssnr/update-json-value-action)
-   [Parse Issue Form Action](https://github.com/cssnr/parse-issue-form-action)
-   [Mirror Repository Action](https://github.com/cssnr/mirror-repository-action)
-   [Portainer Stack Deploy](https://github.com/cssnr/portainer-stack-deploy-action)
-   [Mozilla Addon Update Action](https://github.com/cssnr/mozilla-addon-update-action)

For a full list of current projects to support visit: [https://cssnr.github.io/](https://cssnr.github.io/)
