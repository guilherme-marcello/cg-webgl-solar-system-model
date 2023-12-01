import * as webgl from "../twgl.js/dist/5.x/twgl-full.js";

const m4 = twgl.m4;

class CelestialBody {
    constructor(name, buffer, texture, rotationFunction, translationFunction) {
        this.name = name
        this.buffer = buffer;
        this.worldMatrix = twgl.m4.identity();

        this.texture = texture;
        
        this.rotationFunction = rotationFunction;
        this.translationFunction = translationFunction;
    }

    updateWorldMatrix(time) {
        const rotation = this.rotationFunction(time);
        const translation = this.translationFunction(time);
        this.worldMatrix = twgl.m4.multiply(translation, rotation);
    }
}

function createSun(gl) {
    // texture src: https://svs.gsfc.nasa.gov/30362
    let name = "Sun";
    let buffer = twgl.primitives.createSphereBufferInfo(gl, 2.5, 20, 20);
    let texture = twgl.createTexture(gl, { src: 'textures/sun.jpeg' });
    let rotationF = (time) => m4.rotationY(1*time);
    let translationF = (time) => m4.translation([0, 0, 0]);

    return new CelestialBody(
        name,
        buffer, 
        texture, 
        rotationF,
        translationF
    );
}

function createMercury(gl) {
    // texture src: https://svs.gsfc.nasa.gov/11197
    let name =  "Mercury";
    let buffer = twgl.primitives.createSphereBufferInfo(gl, 0.1, 20, 20);
    let texture = twgl.createTexture(gl, { src: 'textures/mercury.jpeg' });
    let rotationF = (time) => m4.rotationY(10*time);
    let translationF = (time) => m4.translation([5*Math.sin(2*time), 0, 5*Math.cos(2*time)]);

    return new CelestialBody(
        name,
        buffer, 
        texture, 
        rotationF,
        translationF
    );
}

function createEarth(gl) {
    // texture src: https://visibleearth.nasa.gov/images/73580/january-blue-marble-next-generation-w-topography-and-bathymetry
    let name =  "Earth";
    let buffer = twgl.primitives.createSphereBufferInfo(gl, 0.5, 20, 20);
    let texture = twgl.createTexture(gl, { src: 'textures/earth.jpg' });
    let rotationF = (time) => m4.rotationY(50*time);
    let translationF = (time) => m4.translation([10*Math.sin(time), 0, 10*Math.cos(time)]);

    return new CelestialBody(
        name,
        buffer, 
        texture, 
        rotationF,
        translationF
    );
}

function createMars(gl) {
    // texture src: https://nasa3d.arc.nasa.gov/detail/mar0kuu2
    let name =  "Mars";
    let buffer = twgl.primitives.createSphereBufferInfo(gl, 0.6, 20, 20);
    let texture = twgl.createTexture(gl, { src: 'textures/mars.jpeg' });
    let rotationF = (time) => m4.rotationY(25*time);
    let translationF = (time) => m4.translation([15*Math.sin(0.7*time), 0, 15*Math.cos(0.7*time)]);

    return new CelestialBody(
        name,
        buffer, 
        texture, 
        rotationF,
        translationF
    );
}

function createJupiter(gl) {
    // texture src: https://svs.gsfc.nasa.gov/12021
    let name =  "Jupiter";
    let buffer = twgl.primitives.createSphereBufferInfo(gl, 1, 20, 20);
    let texture = twgl.createTexture(gl, { src: 'textures/jupiter.jpeg' });
    let rotationF = (time) => m4.rotationY(10*time);
    let translationF = (time) => (time) => m4.translation([20*Math.sin(0.5*time), 0, 20*Math.cos(0.5*time)]);

    return new CelestialBody(
        name,
        buffer, 
        texture, 
        rotationF,
        translationF
    );
}

function create(gl, name) {
    switch (name.toLowerCase()) {
        case "sun":
            console.log("Creating Sun!");
            return createSun(gl);
        case "mercury":
            console.log("Creating Mercury!");
            return createMercury(gl);
        case "earth":
            console.log("Creating Earth!");
            return createSun(gl);
        case "mars":
            console.log("Creating Mars!");
            return createMars(gl);
        case "jupiter":
            console.log("Creating Jupiter!");
            return createJupiter(gl);
        default:
            console.log("Unable to create " + name);
            return null;
    }
}


export { CelestialBody, create};