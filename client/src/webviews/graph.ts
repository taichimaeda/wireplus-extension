export const graphWebviewTemplate = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Show Graph</title>
    <script src="https://unpkg.com/cytoscape/dist/cytoscape.min.js"></script>
    <script src="https://unpkg.com/popper.js@1.14.7/dist/umd/popper.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/cytoscape-popper@1.0.4/cytoscape-popper.min.js"></script>
    <script src="https://unpkg.com/tippy.js@4.0.1/umd/index.all.min.js"></script>
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
      var cy = (window.cy = cytoscape({
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
        elements: {{content}},
      }));

      cy.ready(function () {
        cy.nodes().forEach(function (ele) {
          let ref = ele.popperRef();
          ele.tippy = tippy(ref, {
            trigger: "manual",
            interactive: true,
            content: () => {
              let content = document.createElement("div");
              content.innerHTML = ele.data().tooltip;
              return content;
            },
          });
        });
      });

      cy.elements().unbind("mouseover");
      cy.elements().bind(
        "mouseover",
        (event) => event.target.tippy && event.target.tippy.show()
      );
      cy.elements().unbind("mousedown");
      cy.elements().bind(
        "mousedown",
        (event) => event.target.tippy && event.target.tippy.hide()
      );
      cy.elements().unbind("mouseout");
      cy.elements().bind(
        "mouseout",
        (event) => event.target.tippy && event.target.tippy.hide()
      );
    </script>
  </body>
</html>
`;
