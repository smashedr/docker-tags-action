const core = require('@actions/core')
const github = require('@actions/github')
const { parse } = require('csv-parse/sync')

;(async () => {
    try {
        core.info('🏳️ Starting Docker Tags Action')

        // Debug
        // console.log('process.env:', process.env)
        // console.log('github.context:', github.context)

        console.log('github.context.ref:', github.context.ref)
        console.log('github.context.eventName:', github.context.eventName)
        console.log('prerelease:', github.context.payload.release?.prerelease)

        // Parse Ref
        let ref = github.context.ref.split('/')[2]
        if (github.context.ref.startsWith('refs/pull/')) {
            console.log('Pull Request Detected:', ref)
            ref = `pr-${ref}`
        }
        if (!ref) {
            return core.setFailed(`Unable to parse ref: ${github.context.ref}`)
        }
        core.info(`ref: \u001b[32;1m${ref}`)

        // Process Inputs
        // core.info(`images: "${images}"`)
        const images = parse(core.getInput('images', { required: true }), {
            delimiter: ',',
            trim: true,
            relax_column_count: true,
        }).flat()
        console.log('images:', images)
        const tags = core.getInput('tags')
        console.log('tags:', tags)
        const labels = core.getInput('labels')
        console.log('labels:', labels)
        const seperator =
            core.getInput('seperator', { trimWhitespace: false }) || `\n`
        console.log('seperator:', JSON.stringify(seperator))
        const latest = core.getInput('latest')
        console.log('latest:', latest)
        const summary = core.getBooleanInput('summary')
        console.log('summary:', summary)

        // Set Variables
        const repo = github.context.payload.repository
        console.log('name:', repo.name)
        console.log('description:', repo.description)
        console.log('html_url:', repo.html_url)
        console.log('spdx_id:', repo.license?.spdx_id)

        // Process Tags
        core.info('⌛ Processing Tags')
        const collectedTags = []
        if (ref) {
            collectedTags.push(ref)
        }
        if (latest === 'default') {
            if (
                github.context.eventName === 'release' &&
                !github.context.payload.release?.prerelease
            ) {
                console.log('\u001b[33;1mAdding latest tag on: release')
                collectedTags.push('latest')
            }
        } else if (latest === 'true') {
            console.log('\u001b[33;1mAdding latest tag on: true')
            collectedTags.push('latest')
        }
        if (tags) {
            const parsedTags = parse(tags, {
                delimiter: ',',
                trim: true,
                relax_column_count: true,
            }).flat()
            console.log('parsedTags:', parsedTags)
            collectedTags.push(...parsedTags)
        }
        console.log('collectedTags:', collectedTags)
        const allTags = [...new Set(collectedTags)]
        console.log('allTags:', allTags)
        const dockerTags = []
        for (const image of images) {
            for (const tag of allTags) {
                dockerTags.push(`${image}:${tag}`)
            }
        }
        console.log('dockerTags:', dockerTags)

        // Process Labels
        core.info('⌛ Processing Labels')
        const defaultLabels = {
            'org.opencontainers.image.created': new Date().toISOString(),
            'org.opencontainers.image.revision': github.context.sha,
            'org.opencontainers.image.source': repo.html_url,
            'org.opencontainers.image.title': repo.name,
            'org.opencontainers.image.url': repo.html_url,
            'org.opencontainers.image.version': ref,
        }
        if (repo.description) {
            defaultLabels['org.opencontainers.image.description'] =
                repo.description
        }
        if (repo.license?.spdx_id) {
            defaultLabels['org.opencontainers.image.licenses'] =
                repo.license.spdx_id
        }
        // console.log('defaultLabels:', defaultLabels)
        if (labels) {
            const parsedLabels = parse(labels, {
                delimiter: ',',
                trim: true,
                relax_column_count: true,
            }).flat()
            console.log('parsedLabels:', parsedLabels)
            for (const label of parsedLabels) {
                if (!label.includes('=')) {
                    return core.setFailed(
                        `Label provided without an = symbol: ${label}`
                    )
                }
                const [key, value] = label.split(/=(.*)/s).slice(0, 2)
                if (value) {
                    console.log(`\u001b[32;1mAdding: \u001b[0m${key}=${value}`)
                    defaultLabels[key] = value
                } else {
                    console.log(`\u001b[31;1mDeleting: \u001b[0m${key}`)
                    delete defaultLabels[key]
                }
            }
        }
        // console.log('defaultLabels:', defaultLabels)
        const dockerLabels = []
        for (const [key, value] of Object.entries(defaultLabels)) {
            dockerLabels.push(`${key}=${value}`)
        }
        console.log('dockerLabels:', dockerLabels)

        // Set Outputs
        core.info('📩 Setting Outputs')
        core.setOutput('tags', dockerTags.join(seperator))
        core.setOutput('labels', dockerLabels.join(seperator))

        // Write Summary
        if (summary) {
            core.info('📝 Writing Job Summary')

            core.summary.addRaw('## Docker Tags Action\n')
            core.summary.addRaw(
                `Generated **${dockerTags.length / images.length}** Tags and **${dockerLabels.length / images.length}** Labels for **${images.length}** Images.\n\n`
            )

            core.summary.addRaw('<details><summary>Docker Tags</summary>\n\n')
            core.summary.addCodeBlock(dockerTags.join('\n'), 'text')
            core.summary.addRaw('\n</details>\n')

            core.summary.addRaw('<details><summary>Docker Labels</summary>\n\n')
            core.summary.addCodeBlock(dockerLabels.join('\n'), 'text')
            core.summary.addRaw('\n</details>\n')

            core.summary.addRaw('<details><summary>Inputs</summary>')
            core.summary.addTable([
                [
                    { data: 'Input', header: true },
                    { data: 'Value', header: true },
                ],
                [
                    { data: 'images' },
                    { data: `<code>${images.join(',')}</code>` },
                ],
                [
                    { data: 'tags' },
                    { data: `<code>${tags.replaceAll('\n', ',')}</code>` },
                ],
                [
                    { data: 'labels' },
                    { data: `<code>${labels.replaceAll('\n', ',')}</code>` },
                ],
                [
                    { data: 'seperator' },
                    { data: `<code>${JSON.stringify(seperator)}</code>` },
                ],
                [{ data: 'latest' }, { data: `<code>${latest}</code>` }],
                [{ data: 'summary' }, { data: `<code>${summary}</code>` }],
            ])
            core.summary.addRaw('</details>\n')

            const text = 'View Documentation, Report Issues or Request Features'
            const link = 'https://github.com/cssnr/docker-tags-action'
            core.summary.addRaw(
                `\n[${text}](${link}?tab=readme-ov-file#readme)\n\n---`
            )
            await core.summary.write()
        }

        core.info('✅ \u001b[32;1mFinished Success')
    } catch (e) {
        core.debug(e)
        core.info(e.message)
        core.setFailed(e.message)
    }
})()
