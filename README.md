# Wireplus Extension

This is a VSCode extension for [wireplus](https://github.com/taichimaeda/wireplus).

## Screenshot

<video width="100%" height="100%" controls>
  <source src="https://github.com/taichimaeda/wireplus-extension/assets/28210288/b4174139-b239-4298-813d-ddbbe92700c4" type="video/mp4">
</video>

https://github.com/taichimaeda/wireplus-extension/assets/28210288/b4174139-b239-4298-813d-ddbbe92700c4

## Quick Start

Make sure you have installed `wireplus`.

```bash
go install github.com/taichimaeda/wireplus/cmd/wireplus@latest
```

## Features

- Display wire-related diagnostics on _save_.
- Show analysis for individual `wire.Build`.
- Show [graphviz](https://graphviz.org/) or [cytospace](https://js.cytoscape.org/) visualization of `wire.NewSet` and `wire.Build`.
- Automatically switch `go.buildTags` so that IntelliSense works on both injector files and generated files.
