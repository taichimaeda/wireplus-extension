# Wireplus Extension

This is a VSCode extension for [wireplus](https://github.com/taichimaeda/wireplus).

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
