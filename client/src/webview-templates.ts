// TODO: Use webpack raw loader to load these templates

export const graphWebviewTemplate = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Show Graph</title>
    <script src="https://unpkg.com/cytoscape/dist/cytoscape.min.js"></script>
    <style>
      #cy {
        height: 100%;
        width: 100%;
        position: absolute;
        left: 0;
        top: 0;
        background-color: #222831;
      }
    </style>
  </head>
  <body>
    <div id="cy"></div>
    <script>
      const cy = (window.cy = cytoscape({
        container: document.getElementById("cy"),
        boxSelectionEnabled: false,
        style: [
          {
            selector: "node",
            css: {
              content: (ele) => ele.data().content,
              shape: (ele) => ele.data().shape,
              backgroundColor: (ele) =>
                ele.data().subgraph ? "#222831" : "#393E46",
              textValign: "center",
              textHalign: "center",
              color: "#EEEEEE",
              textWrap: "wrap",
              textJustification: "center",
            },
          },
          {
            selector: ":parent",
            css: {
              textValign: "top",
              textHalign: "center",
            },
          },
          {
            selector: "edge",
            css: {
              curveStyle: "bezier",
              targetArrowShape: "triangle",
            },
          },
        ],
        layout: {
          name: "breadthfirst",
          directed: true,
        },
        // Placeholder for the webview content
        elements: {{content}}
      }));
    </script>
  </body>
</html>
`;

export const detailWebviewTemplate = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Show Detail</title>
  </head>
  <body>
    <!-- Placeholder for the webview content -->
    <pre><p>{{content}}</p></pre>
  </body>
</html>
`;
