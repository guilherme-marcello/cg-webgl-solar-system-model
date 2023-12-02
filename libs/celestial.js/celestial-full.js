import * as webgl from "../twgl.js/dist/5.x/twgl-full.js";

const m4 = twgl.m4;

class PathPart {
    constructor(gl, translationMatrix, thickness) {
        this.buffer = twgl.primitives.createCubeBufferInfo(gl, thickness);;
        this.worldMatrix = m4.multiply(twgl.m4.identity(), translationMatrix);
    }
}

class CelestialBody {
    constructor(name, buffer, texture, rotationFunction, translationFunction, rotationPeriod, translationPeriod) {
        this.name = name;
        this.path = [];

        this.rotationPeriod = rotationPeriod;
        this.translationPeriod = translationPeriod;
        this.rotationFunction = rotationFunction;
        this.translationFunction = translationFunction;

        this.buffer = buffer;
        
        this.worldMatrix = m4.identity();
        this.texture = texture;

    }

    createOrbitPath(gl, n_points) {
        const thickness = 0.05;
        for (let i = 0; i <= n_points; i++) {
            const time = (i / n_points) * this.translationPeriod;
            const translationMatrix = this.translationFunction(time);
            const part = new PathPart(gl, translationMatrix, thickness);
            this.path.push(part);
        }
    }

    updateWorldMatrix(time) {
        const rotation = this.rotationFunction(time);
        const translation = this.translationFunction(time);
        this.worldMatrix = twgl.m4.multiply(translation, rotation);
    }
}

function createSun(gl, timescale) {
    // texture src: https://svs.gsfc.nasa.gov/30362
    let name = "Sun";
    let dayPeriod = 27;

    let buffer = twgl.primitives.createSphereBufferInfo(gl, 2.5, 50, 50);
    let texture = twgl.createTexture(gl, { src: 'textures/sun.jpeg' });

    let rotationPeriod = timescale * dayPeriod;
    let rotationAngularSpeed = 2*Math.PI / rotationPeriod;
    let rotationF = (time) => m4.rotationY(rotationAngularSpeed * time);

    let translationF = (time) => m4.translation([0, 0, 0]);

    return new CelestialBody(
        name,
        buffer, 
        texture, 
        rotationF,
        translationF,
        rotationPeriod,
        null
    );
}

function createMercury(gl, timescale) {
    // texture src: https://svs.gsfc.nasa.gov/11197
    let name =  "Mercury";
    let yearPeriod = 88; 
    let dayPeriod = 176;

    let buffer = twgl.primitives.createSphereBufferInfo(gl, 0.1, 20, 20);
    let texture = twgl.createTexture(gl, { src: 'textures/mercury.jpeg' });


    let rotationPeriod = timescale * dayPeriod;
    let rotationAngularSpeed = 2*Math.PI / rotationPeriod;
    let rotationF = (time) => m4.rotationY(rotationAngularSpeed * time);

    let translationPeriod = timescale * yearPeriod;
    let translationAngularSpeed = 2*Math.PI / translationPeriod;
    let translationF = (time) => {
        const a = 6; // semi-major axis
        const b = 5; // semi-minor axis

        const x = a * Math.cos(translationAngularSpeed * time);
        const y = -b * Math.sin(translationAngularSpeed * time);
    
        return twgl.m4.translation([x, 0, y]);
    };

    const body = new CelestialBody(
        name,
        buffer, 
        texture, 
        rotationF,
        translationF,
        rotationPeriod,
        translationPeriod
    );

    body.createOrbitPath(gl, 50);
    return body;
}

function createEarth(gl, timescale) {
    // texture src: https://visibleearth.nasa.gov/images/73580/january-blue-marble-next-generation-w-topography-and-bathymetry
    let name =  "Earth";
    let yearPeriod = 365; 
    let dayPeriod = 1;

    let buffer = twgl.primitives.createSphereBufferInfo(gl, 0.5, 20, 20);
    let texture = twgl.createTexture(gl, { src: 'textures/earth.jpg' });

    let rotationPeriod = timescale * dayPeriod;
    let rotationAngularSpeed = 2*Math.PI / rotationPeriod;
    let rotationF = (time) => m4.rotationY(rotationAngularSpeed * time);

    let translationPeriod = timescale * yearPeriod;
    let translationAngularSpeed = 2*Math.PI / translationPeriod;
    let translationF = (time) => {
        const a = 11; // semi-major axis
        const b = 10; // semi-minor axis

        const x = a * Math.cos(translationAngularSpeed * time);
        const y = -b * Math.sin(translationAngularSpeed * time);
    
        return twgl.m4.translation([x, 0, y]);
    };

    const body = new CelestialBody(
        name,
        buffer, 
        texture, 
        rotationF,
        translationF,
        rotationPeriod,
        translationPeriod
    );

    body.createOrbitPath(gl, 50);
    return body;
}

function createMars(gl, timescale) {
    // texture src: https://nasa3d.arc.nasa.gov/detail/mar0kuu2
    let name =  "Mars";
    let yearPeriod = 687; 
    let dayPeriod = 1.025;

    let buffer = twgl.primitives.createSphereBufferInfo(gl, 0.6, 20, 20);
    let texture = twgl.createTexture(gl, { src: 'textures/mars.jpeg' });

    let rotationPeriod = timescale * dayPeriod;
    let rotationAngularSpeed = 2*Math.PI / rotationPeriod;
    let rotationF = (time) => m4.rotationY(rotationAngularSpeed * time);

    let translationPeriod = timescale * yearPeriod;
    let translationAngularSpeed = 2*Math.PI / translationPeriod;
    let translationF = (time) => {
        const a = 16; // semi-major axis
        const b = 15; // semi-minor axis

        const x = a * Math.cos(translationAngularSpeed * time);
        const y = -b * Math.sin(translationAngularSpeed * time);
    
        return twgl.m4.translation([x, 0, y]);
    };

    const body = new CelestialBody(
        name,
        buffer, 
        texture, 
        rotationF,
        translationF,
        rotationPeriod,
        translationPeriod
    );

    body.createOrbitPath(gl, 50);
    return body;
}

function createJupiter(gl, timescale) {
    // texture src: https://svs.gsfc.nasa.gov/12021
    let name =  "Jupiter";
    let yearPeriod = 4333; 
    let dayPeriod = 0.4167;

    let buffer = twgl.primitives.createSphereBufferInfo(gl, 1, 20, 20);
    let texture = twgl.createTexture(gl, { src: 'textures/jupiter.jpeg' });

    let rotationPeriod = timescale * dayPeriod;
    let rotationAngularSpeed = 2*Math.PI / rotationPeriod;
    let rotationF = (time) => m4.rotationY(rotationAngularSpeed * time);

    let translationPeriod = timescale * yearPeriod;
    let translationAngularSpeed = 2*Math.PI / translationPeriod;
    let translationF = (time) => {
        const a = 21; // semi-major axis
        const b = 20; // semi-minor axis

        const x = a * Math.cos(translationAngularSpeed * time);
        const y = -b * Math.sin(translationAngularSpeed * time);
    
        return twgl.m4.translation([x, 0, y]);
    };

    const body = new CelestialBody(
        name,
        buffer, 
        texture, 
        rotationF,
        translationF,
        rotationPeriod,
        translationPeriod
    );

    body.createOrbitPath(gl, 50);
    return body;
}

function create(gl, timescale, name) {
    switch (name.toLowerCase()) {
        case "sun":
            console.log("Creating Sun!");
            return createSun(gl, timescale);
        case "mercury":
            console.log("Creating Mercury!");
            return createMercury(gl, timescale);
        case "earth":
            console.log("Creating Earth!");
            return createEarth(gl, timescale);
        case "mars":
            console.log("Creating Mars!");
            return createMars(gl, timescale);
        case "jupiter":
            console.log("Creating Jupiter!");
            return createJupiter(gl, timescale);
        default:
            console.log("Unable to create " + name);
            return null;
    }
}


export { create};