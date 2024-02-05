import { defineHex, Grid, rectangle } from '../lib/honeycomb-grid.js';
import { SVG } from 'https://unpkg.com/@svgdotjs/svg.js@latest?module';

const Hex = defineHex({ dimensions: 70, origin: 'topLeft' })

function createHoneycombStructure(containerId) {
    // Zielcontainer im DOM finden
    const container = document.getElementById(containerId);

    // Wörter aus den versteckten span-Elementen im Container extrahieren
    const words = Array.from(container.querySelectorAll('span')).map(span => span.textContent);
    console.log(words)
    // Stellen Sie sicher, dass genügend Waben für alle Wörter gezeichnet werden
    const columns = 2; // Anzahl der Waben horizontal
    const rows = Math.ceil(words.length / columns); // Anzahl der Waben vertikal

    // Erstellen einer Grid-Instanz mit der Hex-Klasse und einer Rechteckform
    const grid = new Grid(Hex, rectangle({ width: columns, height: rows }));

    // Erstellen eines SVG-Containers innerhalb des Zielcontainers
    const draw = SVG().addTo(container).size(500, 550);

    

    grid.forEach((hex, index) => {
        const word = words[index % words.length];

        // Erhalten der Ecken des Hexagons
        let corners;
        if (typeof hex.corners === 'function') {
            corners = hex.corners(); // Wenn corners eine Methode ist
        } else if (hex.corners) {
            corners = hex.corners; // Wenn corners eine Eigenschaft ist
        } else if (typeof hex.points === 'function') {
            corners = hex.points(); // Fallback auf points, falls vorhanden
        }

        // Sicherstellen, dass corners definiert ist
        if (!corners) {
            console.error('Unable to get corners of the hex', hex);
            return;
        }

        const polygon = draw
            .polygon(corners.map(({ x, y }) => `${x},${y}`))
            .fill('#f8f8f8')
            .stroke({ width: 1, color: '#999' });


        // Erstellen eines Textelements für das aktuelle Wort
        const textElement = draw
            .text('Test')
            .fill('#333')
            .font({ family: 'Arial', size: 10 })


        // Hinzufügen des Polygons und des Texts zu einer Gruppe
        draw.group().add(polygon).add(textElement);
    });
}

export { createHoneycombStructure };
