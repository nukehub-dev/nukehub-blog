# Content authoring

## Create a post

The fastest way to start a post is the interactive scaffold:

```bash
npm run create:post
```

This prompts for the title, description, category, author, tags, and cover
image, then creates a folder-based post:

- `src/content/posts/<slug>/index.mdx` — the post source
- `src/content/posts/<slug>/` — the asset folder for images, videos, and 3-D
  models

After the script finishes, add your assets to the same folder and reference them
by filename only.

### Manual frontmatter example

If you prefer to create the file by hand, create a folder at
`src/content/posts/your-slug/` with `index.mdx` and your images:

```mdx
---
title: Your Post Title
description: A short summary of the post.
publishedDate: 2026-07-10
category: tutorials
author: ahnaf-tahmid-chowdhury
tags: [openmc, python]
featured: false
draft: false
coverImage: hero.png
---

Your post content here.
```

## Markdown quick reference

Posts are written in MDX, which is Markdown with JSX components.

````mdx
## Headings use hashes

Paragraphs are separated by blank lines. **Bold**, _italic_, and `inline code`
work as usual.

- Use dashes for bullet lists
- Nested items are indented two spaces

1. Numbered lists work too
2. Like this

[Link text](https://example.com)

> Blockquotes look like this.

```python
# Code blocks use triple backticks with an optional language
import openmc
```

Table

| Name    | Value |
| ------- | ----- |
| Fuel    | UO2   |
| Coolant | H2O   |
````

## Available MDX components

These components are available inside any post without importing them.

### Images and video

`ImageFigure` automatically detects the image's aspect ratio at build time. You
can override it with `aspectRatio`, or change the fit with `fit`, the corner
style with `rounded`, and the placeholder background with `transparent`.

```mdx
<ImageFigure
  src="diagram.png"
  alt="Reactor diagram"
  caption="Figure 1: Cross-section of a PWR fuel assembly."
/>

{/* Optional overrides */}

<ImageFigure
  src="diagram.png"
  alt="Reactor diagram"
  caption="Figure 2: Optional custom sizing."
  aspectRatio="4/3"
  fit="contain"
  rounded="lg"
  transparent={true}
/>
```

```mdx
<YouTube id="dQw4w9WgXcQ" title="Demo" />

<Odysee url="https://odysee.com/$/embed/name/claimId" title="Demo" />

<Video src="demo.mp4" title="Demo" />
```

### Callouts

```mdx
<Callout type="tip">Quick tips and best practices.</Callout>

<Callout type="note">Extra context or background information.</Callout>

<Callout type="warning">Something that might trip readers up.</Callout>

<Callout type="danger">
  Critical warnings that could cause errors or safety issues.
</Callout>
```

### Citations

Use `<Citation id="..." />` in the body and define the matching reference in
the frontmatter. See the **References** section below for details.

```mdx
OpenMC uses continuous-energy nuclear data<Citation id="openmc-docs" />.
```

### Math

Render LaTeX math with KaTeX. Use `<InlineMath />` for equations inside a
sentence and `<Math />` for display equations.

```mdx
The macroscopic absorption cross section is

<InlineMath math="\Sigma_a = N \sigma_a" />.

<Math math="\frac{\partial n}{\partial t} + v \cdot \nabla n = \frac{\nu \Sigma_f}{k_{\text{eff}}} \phi - \Sigma_a \phi" />
```

### Data tables

Use `<DataTable />` for structured data that needs better styling and horizontal
scrolling on small screens. Pass `columns` and `data` as props; each row is an
object whose keys match the column keys.

```mdx
<DataTable
  columns={[
    { key: "isotope", header: "Isotope" },
    { key: "halfLife", header: "Half-life", align: "right" },
    { key: "decayMode", header: "Decay mode" },
  ]}
  data={[
    { isotope: "U-235", halfLife: "704 Myr", decayMode: "α" },
    { isotope: "U-238", halfLife: "4.468 Gyr", decayMode: "α" },
    { isotope: "Pu-239", halfLife: "24.1 kyr", decayMode: "α" },
  ]}
  caption="Selected actinide half-lives."
/>
```

### Charts

Use `<Plotly />` for interactive charts. Pass a Plotly `data` array and an
optional `layout` object. Plotly loads on demand, so it only adds weight to
pages that use it.

```mdx
<Plotly
  data={[
    {
      x: [0, 0.625, 1.25, 2.5, 5.0, 10.0],
      y: [1.0, 0.88, 0.72, 0.48, 0.22, 0.05],
      type: "scatter",
      mode: "lines+markers",
      name: "U-235 fission spectrum",
    },
  ]}
  layout={{
    title: "Fission neutron spectrum",
    xaxis: { title: "Energy (eV)", type: "log" },
    yaxis: { title: "Relative flux" },
  }}
/>
```

For larger datasets, put a `.json` (or `.ts`) file in the post folder and
import it at the top of the MDX instead of inlining the data:

```mdx
import spectrum from "./spectrum.json";

<Plotly data={spectrum.traces} layout={spectrum.layout} />
```

Note the data is serialized into the page HTML, so keep imports below roughly
100 KB.

### 3-D models

Use `<Model3D />` to embed an interactive glTF viewer. Drop a `.glb` file into
the post folder and reference it by filename. The viewer (three.js) loads
lazily when scrolled into view, follows the site theme, and is static by
default. A control bar lets readers toggle auto-rotation, snap to Iso / Front /
Top / Side views, and expand the viewer to fullscreen (Esc to exit).

```mdx
<Model3D
  src="tokamak_with_divertor.glb"
  caption="Drag to orbit, scroll to zoom."
/>
```

Optional props: `aspect` (`video`, `square`, `portrait`, `wide`, `auto`) and
`autoRotate` (turntable rotation on load; default off). Convert STEP/B-rep
geometry to `.glb` offline (e.g. with cadquery + trimesh) and keep files under
~5 MB.

### Diagrams

Use `<Mermaid />` for flowcharts, sequence diagrams, Gantt charts, and other
diagrams. Pass the diagram source as a string.

```mdx
<Mermaid
  chart={`
flowchart TD
    A[Fuel pellet] --> B[Cladding]
    B --> C[Coolant]
    C --> D[Steam generator]
`}
/>
```

## Frontmatter schema

| Field                   | Required | Type     | Notes                                                                   |
| ----------------------- | -------- | -------- | ----------------------------------------------------------------------- |
| `title`                 | Yes      | string   | Post title                                                              |
| `description`           | Yes      | string   | Short summary for SEO and cards                                         |
| `publishedDate`         | Yes      | date     | `YYYY-MM-DD`                                                            |
| `updatedDate`           | No       | date     | `YYYY-MM-DD`                                                            |
| `category`              | Yes      | enum     | `news`, `tutorials`, `nuclear-industry`, `community`, `project-updates` |
| `author`                | Yes      | string   | ID of the primary author in `src/content/authors/`                      |
| `coAuthors`             | No       | string[] | IDs of additional authors. Default `[]`                                 |
| `tags`                  | No       | string[] | Default `[]`                                                            |
| `featured`              | No       | boolean  | Default `false`                                                         |
| `draft`                 | No       | boolean  | Default `false`; excluded from production builds                        |
| `citable`               | No       | boolean  | Show the "Cite" button (copy-able citation formats). Default `false`    |
| `coverImage`            | No       | string   | Image filename inside the post folder                                   |
| `coverImageFit`         | No       | enum     | `cover`, `contain`, `fill`, `none`. Default `cover`                     |
| `coverImageTransparent` | No       | boolean  | Remove the default gray background. Default `false`                     |
| `canonicalUrl`          | No       | string   | If the post was originally published elsewhere                          |
| `references`            | No       | object[] | Citations rendered at the end of the post. See below.                   |

## References

Add a `references` array to the frontmatter to cite external sources. Each
reference needs a unique `id` that matches `<Citation id="..." />` used in the
post body.

```yaml
references:
  - id: openmc2023
    title: OpenMC User's Guide
    url: https://docs.openmc.org/
    source: OpenMC Development Team
    date: "2023"
```

Use the citation component in MDX:

```mdx
OpenMC uses continuous-energy nuclear data<Citation id="openmc2023" />.
```

The references section is rendered automatically at the bottom of the post.
Each entry has a copy button: one click copies the plain-text citation, and
the chevron opens a menu with **BibTeX** and **RIS** formats. For clean
BibTeX/RIS output, add the optional structured fields (`source` stays the
display string):

```yaml
references:
  - id: duderstadt1976
    title: Nuclear Reactor Analysis
    url: https://www.amazon.com/Nuclear-Reactor-Analysis-James-Duderstadt/dp/0471223638
    source: James J. Duderstadt and Louis J. Hamilton
    date: "1976"
    type: book # article | book | inproceedings | techreport | misc (default)
    authors: ["Duderstadt, James J.", "Hamilton, Louis J."]
    publisher: John Wiley & Sons
```

Entries without the structured fields still export valid BibTeX/RIS using
`source` and the year extracted from `date` as fallbacks.

## Sharing and citing posts

Every post automatically gets **Share** and **Cite** controls in its header
meta row — no author action needed. Share offers copy-link, X, Bluesky,
Mastodon (via an instance picker), LinkedIn, and email (plus the system share
sheet where the browser supports it). Cite opens a dialog with Text / BibTeX /
RIS formats generated from the post's own metadata (title, authors,
publication date, URL), using the same formatters as the references copy menu.
BibTeX and RIS also carry a retrieval date (`urldate` / `Y2`) since every
citation points at a web source.

Each post also ends with an **Edit this page** link to the source file on
GitHub (`SITE.repo` in `src/data/site.ts`). The link only works for posts
committed to the repository.

## Newsletter

The blog uses the NukeHub API server for email subscriptions. To enable the
signup form, set these environment variables:

```bash
PUBLIC_API_URL=http://localhost:3000
PUBLIC_TURNSTILE_SITE_KEY=1x00000000000000000000AA
```

The API endpoint is `POST ${PUBLIC_API_URL}/newsletter` with JSON body
`{ email, turnstileToken }`. The API server stores subscribers in SQLite and
exposes admin endpoints for listing and exporting them.

## Authors

Create or update an author with the interactive scaffold:

```bash
npm run create:author
```

Authors are YAML files in `src/content/authors/`:

```yaml
name: Author Name
bio: A short bio.
role: Contributor
organization: NukeHub
location: Canada
email: author@nukehub.org
url: https://nukehub.org
avatar: /assets/images/author.png
links:
  github: username
  gitlab: username
  linkedin: username
  x: username
  bluesky: username.bsky.social
  mastodon: "@username@example.com"
  youtube: "@channel"
  orcid: 0000-0000-0000-0000
  researchgate: username
```

## Drafts

Use the `draft` frontmatter flag to control publication:

- `draft: true` — the post is visible in development so you can preview it, but
  it is excluded from production builds.
- `draft: false` (default) — the post is published.

To publish a draft, change `draft: true` to `draft: false`. The interactive
`npm run create:post` scaffold asks whether to start a post as a draft and sets
the flag automatically.
