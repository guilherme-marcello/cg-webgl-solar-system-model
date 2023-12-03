import * as webgl from "../twgl.js/dist/5.x/twgl-full.js";

const m4 = twgl.m4;

class PathPart {
    constructor(gl, translationMatrix, thickness) {
        this.buffer = twgl.primitives.createCubeBufferInfo(gl, thickness);;
        this.worldMatrix = m4.multiply(twgl.m4.identity(), translationMatrix);
    }
}

class CelestialBody {
    constructor(name, buffer, texture, rotationFunction, translationFunction, rotationPeriod, translationPeriod, parent = null) {
        this.name = name;
        this.parent = parent;
        this.path = null;

        this.rotationPeriod = rotationPeriod;
        this.translationPeriod = translationPeriod;
        this.rotationFunction = rotationFunction;
        this.translationFunction = translationFunction;

        this.buffer = buffer;
        
        this.worldMatrix = m4.identity();
        this.texture = texture;

    }

    createOrbitPath(gl, n_points) {
        this.path = [];
        console.log("Creating orbit path for " + this.name);
        const thickness = 0.05;
        for (let i = 0; i <= n_points; i++) {
            const time = (i / n_points) * this.translationPeriod;
            const translationMatrix = (this.parent) ? 
                m4.multiply(this.parent.worldMatrix, this.translationFunction(time)) : this.translationFunction(time);
            const part = new PathPart(gl, translationMatrix, thickness);
            this.path.push(part);
        }
    }

    updateWorldMatrix(time) {
        const rotation = this.rotationFunction(time);
        const translation = this.translationFunction(time);
        this.worldMatrix = (this.parent) ? 
            m4.multiply(this.parent.worldMatrix, translation, rotation) : m4.multiply(translation, rotation);
    }

    extractCoordinates() {
        return [this.worldMatrix[12], this.worldMatrix[13], this.worldMatrix[14]]
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

function createVenus(gl, timescale) {
    // texture src: https://nasa3d.arc.nasa.gov/detail/ven0aaa2
    let name = "Venus";
    let yearPeriod = 225;
    let dayPeriod = 243;

    let buffer = twgl.primitives.createSphereBufferInfo(gl, 0.4, 20, 20);
    let texture = twgl.createTexture(gl, { src: 'textures/venus.jpeg' });

    let rotationPeriod = timescale * dayPeriod;
    let rotationAngularSpeed = 2 * Math.PI / rotationPeriod;
    let rotationF = (time) => m4.rotationY(rotationAngularSpeed * time);

    let translationPeriod = timescale * yearPeriod;
    let translationAngularSpeed = 2 * Math.PI / translationPeriod;
    let translationF = (time) => {
        const a = 7; // semi-major axis
        const b = 8; // semi-minor axis

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

function createMoon(gl, timescale, earth) {
    // texture src: https://svs.gsfc.nasa.gov/cgi-bin/details.cgi?aid=4720
    let name =  "Moon";
    let yearPeriod = 27.322; // 27.322 days over Earth
    let dayPeriod = 27.322; // same as year 

    let buffer = twgl.primitives.createSphereBufferInfo(gl, 0.2, 20, 20);
    let texture = twgl.createTexture(gl, { src: 'textures/moon.jpeg' });

    let rotationPeriod = timescale * dayPeriod;
    let rotationAngularSpeed = 2*Math.PI / rotationPeriod;
    let rotationF = (time) => m4.rotationY(rotationAngularSpeed * time);

    let translationPeriod = timescale * yearPeriod;
    let translationAngularSpeed = 2*Math.PI / translationPeriod;
    let translationF = (time) => {
        const a = 1.5; // semi-major axis
        const b = 1.5; // semi-minor axis

        const x = a * Math.cos(translationAngularSpeed * time);
        const y = -b * Math.sin(translationAngularSpeed * time);
    
        return twgl.m4.translation([x, 0.5*Math.cos(time), y]);
    };

    return new CelestialBody(
        name,
        buffer, 
        texture, 
        rotationF,
        translationF,
        rotationPeriod,
        translationPeriod,
        earth
    );
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

function createJupiterMoon(gl, timescale, jupiter, name) {
    let moon = {};
    switch (name.toLowerCase()) {
        case "io":
            // texture src: https://www.space.com/14977-jupiter-moon-io-global-map-photos.html
            moon = { radius: 0.1, textureSrc: 'textures/io.jpeg', orbitRadius: 1, rotationPeriod: 1.769138, translationPeriod: 1.769138 };
            break;
        case "europa":
            // texture src: https://www.deviantart.com/askaniy/art/Europa-Texture-Map-20K-769790967
            moon = { radius: 0.15, textureSrc: 'textures/europa.jpeg', orbitRadius: 1.5, rotationPeriod: 3.551181, translationPeriod: 3.551181 };
            break;
        case "ganymede":
            // texture src: https://commons.wikimedia.org/wiki/File:Map_of_Ganymede_by_Bj%C3%B6rn_J%C3%B3nsson.jpg
            moon = { radius: 0.2, textureSrc: 'textures/ganymede.jpeg', orbitRadius: 2, rotationPeriod: 7.155, translationPeriod: 7.155 };
            break;
        case "callisto":
            // texture src: https://bjj.mmedia.is/data/callisto/index.html
            moon = { radius: 0.18, textureSrc: 'textures/callisto.jpg', orbitRadius: 2.5, rotationPeriod: 16.689, translationPeriod: 16.689 };
            break;
        default:
            console.log("Invalid moon name");
            return null;
    }

    let buffer = twgl.primitives.createSphereBufferInfo(gl, moon.radius, 20, 20);
    let texture = twgl.createTexture(gl, { src: moon.textureSrc });

    let rotationPeriod = timescale * moon.rotationPeriod;
    let rotationAngularSpeed = 2*Math.PI / rotationPeriod;
    let rotationF = (time) => m4.rotationY(rotationAngularSpeed * time);

    let translationPeriod = timescale * moon.translationPeriod;
    let translationAngularSpeed = 2*Math.PI / translationPeriod;
    let translationF = (time) => {
        const x = moon.orbitRadius * Math.cos(translationAngularSpeed * time);
        const y = moon.orbitRadius * Math.sin(translationAngularSpeed * time);

        return twgl.m4.translation([x, Math.cos(time), y]);
    };

    return new CelestialBody(
        name,
        buffer, 
        texture, 
        rotationF,
        translationF,
        rotationPeriod,
        translationPeriod,
        jupiter
    );
}

function createSaturn(gl, timescale) {
    // texture src: https://nasa3d.arc.nasa.gov/detail/sat0fds1
    let name = "Saturn";
    let yearPeriod = 10759; 
    let dayPeriod = 0.44;

    let buffer = twgl.primitives.createSphereBufferInfo(gl, 0.9, 20, 20);
    let texture = twgl.createTexture(gl, { src: 'textures/saturn.jpeg' });

    let rotationPeriod = timescale * dayPeriod;
    let rotationAngularSpeed = 2 * Math.PI / rotationPeriod;
    let rotationF = (time) => m4.rotationY(rotationAngularSpeed * time);

    let translationPeriod = timescale * yearPeriod;
    let translationAngularSpeed = 2 * Math.PI / translationPeriod;
    let translationF = (time) => {
        const a = 29; // semi-major axis
        const b = 28; // semi-minor axis

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

function createSaturnMoonTitan(gl, timescale, saturn) {
    // texture src: https://www.go-astronomy.com/planets/saturn-moon-titan.htm
    let name = "Titan";
    let yearPeriod = 15.945; // orbital around Saturn
    let dayPeriod = 15.945; // same as year (synchronous rotation)

    let buffer = twgl.primitives.createSphereBufferInfo(gl, 0.15, 20, 20);
    let texture = twgl.createTexture(gl, { src: 'textures/titan.jpeg' });

    let rotationPeriod = timescale * dayPeriod;
    let rotationAngularSpeed = 2 * Math.PI / rotationPeriod;
    let rotationF = (time) => m4.rotationY(rotationAngularSpeed * time);

    let translationPeriod = timescale * yearPeriod;
    let translationAngularSpeed = 2 * Math.PI / translationPeriod;
    let translationF = (time) => {
        const a = 2; // semi-major axis
        const b = 1; // semi-minor axis

        const x = a * Math.cos(translationAngularSpeed * time);
        const y = -b * Math.sin(translationAngularSpeed * time);

        return twgl.m4.translation([x, Math.cos(time), y]);
    };

    return new CelestialBody(
        name,
        buffer,
        texture,
        rotationF,
        translationF,
        rotationPeriod,
        translationPeriod,
        saturn
    );
}

function createUranus(gl, timescale) {
    // texture src: https://planetpixelemporium.com/uranus.html
    let name = "Uranus";
    let yearPeriod = 30687; 
    let dayPeriod = 0.72;

    let buffer = twgl.primitives.createSphereBufferInfo(gl, 0.7, 20, 20);
    let texture = twgl.createTexture(gl, { src: 'textures/uranus.jpeg' });

    let rotationPeriod = timescale * dayPeriod;
    let rotationAngularSpeed = 2 * Math.PI / rotationPeriod;
    let rotationF = (time) => m4.rotationY(rotationAngularSpeed * time);

    let translationPeriod = timescale * yearPeriod;
    let translationAngularSpeed = 2 * Math.PI / translationPeriod;
    let translationF = (time) => {
        const a = 34; // semi-major axis
        const b = 33; // semi-minor axis

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

function createNeptune(gl, timescale) {
    // texture src: https://nasa3d.arc.nasa.gov/detail/nep0fds1
    let name = "Neptune";
    let yearPeriod = 60190; 
    let dayPeriod = 0.67;

    let buffer = twgl.primitives.createSphereBufferInfo(gl, 0.7, 20, 20);
    let texture = twgl.createTexture(gl, { src: 'textures/neptune.jpeg' });

    let rotationPeriod = timescale * dayPeriod;
    let rotationAngularSpeed = 2 * Math.PI / rotationPeriod;
    let rotationF = (time) => m4.rotationY(rotationAngularSpeed * time);

    let translationPeriod = timescale * yearPeriod;
    let translationAngularSpeed = 2 * Math.PI / translationPeriod;
    let translationF = (time) => {
        const a = 56; // semi-major axis
        const b = 55; // semi-minor axis

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

function createNeptuneMoonTriton(gl, timescale, neptune) {
    // texture src: https://science.nasa.gov/neptune/moons/triton/
    let name = "Triton";
    let yearPeriod = 5.876854; // 5.87685 days over Neptune
    let dayPeriod = 5.876854; // same as year (synchronous rotation)

    let buffer = twgl.primitives.createSphereBufferInfo(gl, 0.12, 20, 20);
    let texture = twgl.createTexture(gl, { src: 'textures/triton.webp' });

    let rotationPeriod = timescale * dayPeriod;
    let rotationAngularSpeed = 2 * Math.PI / rotationPeriod;
    let rotationF = (time) => m4.rotationY(rotationAngularSpeed * time);

    let translationPeriod = timescale * yearPeriod;
    let translationAngularSpeed = 2 * Math.PI / translationPeriod;
    let translationF = (time) => {
        const a = 1.5; // semi-major axis
        const b = 1; // semi-minor axis

        const x = a * Math.cos(translationAngularSpeed * time);
        const y = -b * Math.sin(translationAngularSpeed * time);

        return twgl.m4.translation([x, 0.35*Math.cos(time), y]);
    };

    return new CelestialBody(
        name,
        buffer,
        texture,
        rotationF,
        translationF,
        rotationPeriod,
        translationPeriod,
        neptune
    );
}

function createPluto(gl, timescale) {
    // texture src: https://en.wikipedia.org/wiki/Template:GeoTemplate/pluto
    let name = "Pluto";
    let yearPeriod = 90560; 
    let dayPeriod = 6.3872;

    let buffer = twgl.primitives.createSphereBufferInfo(gl, 0.1, 20, 20);
    let texture = twgl.createTexture(gl, { src: 'textures/pluto.jpeg' });

    let rotationPeriod = timescale * dayPeriod;
    let rotationAngularSpeed = 2 * Math.PI / rotationPeriod;
    let rotationF = (time) => m4.rotationY(rotationAngularSpeed * time);

    let translationPeriod = timescale * yearPeriod;
    let translationAngularSpeed = 2 * Math.PI / translationPeriod;
    let translationF = (time) => {
        const a = 39.5; // semi-major axis
        const b = 29.7; // semi-minor axis

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
        case "venus":
            console.log("Creating Venus!");
            return createVenus(gl, timescale);
        case "earth":
            console.log("Creating Earth!");
            return createEarth(gl, timescale);
        case "mars":
            console.log("Creating Mars!");
            return createMars(gl, timescale);
        case "jupiter":
            console.log("Creating Jupiter!");
            return createJupiter(gl, timescale);
        case "saturn":
            console.log("Creating Saturn!");
            return createSaturn(gl, timescale);
        case "uranus":
            console.log("Creating Uranus!");
            return createUranus(gl, timescale);
        case "neptune":
            console.log("Creating Neptune!");
            return createNeptune(gl, timescale);
        case "pluto":
            console.log("Creating Pluto!");
            return createPluto(gl, timescale);
        default:
            console.log("Unable to create " + name);
            return null;
    }
}


export { create, createMoon, createNeptuneMoonTriton, createSaturnMoonTitan, createJupiterMoon};