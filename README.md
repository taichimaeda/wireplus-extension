# Wireplus Extension

This is a VSCode extension for [wireplus](https://github.com/taichimaeda/wireplus).

## Screenshot

<video width="100%" height="100%" controls>
  <source src="https://user-images.githubusercontent.com/28210288/285507006-47874149-4d37-499d-b3ea-4f49efac2709.mov" type="video/mp4">
</video>

## Quick Start

Make sure you have installed `wireplus`.

```bash
go install github.com/taichimaeda/wireplus/cmd/wireplus@latest
```

## Features

- Display wire-related errors in the editor.
- Show `graphviz` visualization of wire `NewSet` and `Build`.
- Show analysis for wire `Build`.
- Jump to the definition of a wire dependency from `injector.go` (WIP).
  - Currently disabled as it often jumps to the wrong place and takes too long to complete.
