# Solar System Viewer

## Description

Solar System Viewer is a simple HTML-based project that allows you to explore the solar system in a basic 3D environment. The project utilizes WebGL for rendering and includes a set of interactive features to enhance user experience.

## Features

- View the solar system in 3D.
- Navigate around the target using WASD and arrow keys.
- Toggle the drawing of moons on and off (M).
- Toggle the drawing of planet's orbits on and off (O).
- Pause/resume the animation with Enter or Space.
- Adjust the animation speed with X (increase) and Z (decrease).
- Switch between Gouraud and Phong shading techniques using B.
- Enable/disable ambient (7), diffuse (8), and specular (9) components of lighting.

## Celestial Bodies
The project includes the following celestial bodies, all with orbital times up to the defined time scale (default: 1200 seconds per 365 days):

- Sun
- Mercury
- Venus
- Earth
    - Moon
- Mars
- Jupiter
    - Io
    - Europa
    - Ganymede
    - Callisto
- Saturn
    - Titan
- Uranus
- Neptune
    - Triton
- Pluto
    - Charon

## Installation

1. Launch the project:

Open `main.html` in a modern web browser.

## Folder Structure

* main.html: The main HTML file for the project.

* textures: Directory containing textures for planets, moons, etc. (JPEG, PNG, etc.).

* libs: Directory containing JavaScript libraries used in the project.
    * celestial.js:
        - celestial-full.js: Code defining celestial bodies and their features.
    * space.js:
        - space-full.js: Code with handlers for movement and keyboard interactions.
    * twgl.js/:
        - TWGL.js library, copied from the TWGL.js project.
