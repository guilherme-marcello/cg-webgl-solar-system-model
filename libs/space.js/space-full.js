import * as webgl from "../twgl.js/dist/5.x/twgl-full.js";

const m4 = twgl.m4;

class SpatialHandlingUtils {
    static handleWheel(event, state) {
        const zoomSpeed = 0.1;
        const delta = event.deltaY;
    
        // Atualiza a posição da câmera na dimensão Z
        const zoomDelta =(delta * zoomSpeed)/15;
        if (state.eye[0] >= 0) {
          state.eye[0] += zoomDelta;
        }
        else{
          state.eye[0] -= zoomDelta;
        }
        if (state.eye[1] >= 0) {
          state.eye[1] += zoomDelta;
        }
        else{
          state.eye[1] -= zoomDelta;
        }
        if (state.eye[2] >= 0) {
          state.eye[2] += zoomDelta;
        }
        else{
          state.eye[2] -= zoomDelta;
        }
    }
    
    static handleMouseDown(event, interactions) {
        interactions.isDragging = true;
        interactions.lastX = event.clientX;
        interactions.lastY = event.clientY;
    }
    
    static handleMouseMove(event, interactions, state) {
        if (interactions.isDragging) {
          
          const deltaX = event.clientX - interactions.lastX;
          const deltaY = event.clientY - interactions.lastY;
    
          const sensitivity = 0.01;
    
          // Rotations
          const rotationMatrixX = m4.rotationY(deltaX * sensitivity);
          const rotationMatrixY = m4.rotationX(deltaY * sensitivity);
    
          // Refresh the new cam and target positions
          state.eye = m4.transformPoint(rotationMatrixX, state.eye);
          state.target = m4.transformPoint(rotationMatrixX, state.target);
          state.eye = m4.transformPoint(rotationMatrixY, state.eye);
          state.target = m4.transformPoint(rotationMatrixY, state.target);
    
          interactions.lastX = event.clientX;
          interactions.lastY = event.clientY;
        }
    }
    
    static handleMouseUp(interactions) {
        interactions.isDragging = false;
    }
    
    static handleKeyDown(event, state, uniforms, interactions, earth, sun) {
        const keyCode = event.keyCode;
        const rotationSpeed = 0.02;
        const moveSpeed = 0.02;

        switch (keyCode) {
            case 87: // 'w'
                this.moveEyeVertical(moveSpeed, state);
                break;
            case 65: // 'a'
                this.moveEyeHorizontal(moveSpeed, state);
                break;
            case 83: // 's'
                this.moveEyeVertical(-moveSpeed, state);
                break;
            case 68: // 'd'
                this.moveEyeHorizontal(-moveSpeed, state);
                break;
            case 37: // Left Arrow
                this.rotateTargetHorizontal(-rotationSpeed, state);
                break;
            case 39: // Right Arrow
                this.rotateTargetHorizontal(rotationSpeed, state);
                break;
            case 38: // Up Arrow
                this.rotateTargetVertical(rotationSpeed, state);
                break;
            case 40: // Down Arrow
                this.rotateTargetVertical(-rotationSpeed, state);
                break;
            case 66: // 'b'
                interactions.shading_selection = 1 - interactions.shading_selection; // 1 => 1 - 1 = 0; 0 => 1 - 0 = 1
                break;
            case 79: // 'o'
                interactions.enable_draw_orbits = 1 - interactions.enable_draw_orbits;
                break;
            case 49: // '1'
                state.target = earth.extractCoordinates();
                break;
            case 50: // '2'
                state.target = sun.extractCoordinates();
                break;
            case 32: // space or enter
            case 13:
                interactions.paused = !interactions.paused;
                console.log("Paused? " + interactions.paused);
                break;
            case 90: // 'z'
                console.log("Decreasing speed! Current speedFactor is " + interactions.speedFactor);
                interactions.speedFactor = Math.max(interactions.speedFactor / 10, 0.001);
                console.log("New speedFactor is " + interactions.speedFactor);
                break;
            case 88: // 'x'
                console.log("Increasing speed! Current speedFactor is " + interactions.speedFactor);
                interactions.speedFactor = Math.min(interactions.speedFactor * 10, 1000);
                console.log("New speedFactor is " + interactions.speedFactor);
                break;
            case 77: // 'm'
                interactions.enable_draw_moons = 1 - interactions.enable_draw_moons;
                break;
            case 55: // '7'
                uniforms.u_ambient_enabled = 1 - uniforms.u_ambient_enabled;
                console.log("Ambient component is now " + ((uniforms.u_ambient_enabled == 1 ? "enabled" : "disabled")));
                break;
            case 56: // '8'
                uniforms.u_diffuse_enabled = 1 - uniforms.u_diffuse_enabled;
                console.log("Diffuse component is now " + ((uniforms.u_diffuse_enabled == 1 ? "enabled" : "disabled")));
                break;
            case 57: // '9'
                uniforms.u_specular_enabled = 1 - uniforms.u_specular_enabled;
                console.log("Specular component is now " + ((uniforms.u_specular_enabled == 1 ? "enabled" : "disabled")));
                break;
        }
    }

    static moveEyeHorizontal(angle, state) {
        const deltaX = state.eye[0] - state.target[0];
        const deltaY = state.eye[2] - state.target[2];
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    
        const currentAngle = Math.atan2(deltaY, deltaX);
        const newAngle = currentAngle + angle;
    
        state.eye[0] = state.target[0] + distance * Math.cos(newAngle);
        state.eye[2] = state.target[2] + distance * Math.sin(newAngle);
    }
    
    static moveEyeVertical(angle, state) {
        const deltaY = state.eye[2] - state.target[2];
        const deltaZ = state.eye[1] - state.target[1];
        const distance = Math.sqrt(deltaY * deltaY + deltaZ * deltaZ);
    
        const currentAngle = Math.atan2(deltaZ, deltaY);
        const newAngle = currentAngle + angle;
    
        state.eye[1] = state.target[1] + distance * Math.sin(newAngle);
        state.eye[2] = state.target[2] + distance * Math.cos(newAngle);
    }
    
        
    static rotateTargetHorizontal(angle, state) {
        const deltaX = state.target[0] - state.eye[0];
        const deltaY = state.target[2] - state.eye[2];
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

        const currentAngle = Math.atan2(deltaY, deltaX);
        const newAngle = currentAngle + angle;

        state.target[0] = state.eye[0] + distance * Math.cos(newAngle);
        state.target[2] = state.eye[2] + distance * Math.sin(newAngle);
    }
    
    static rotateTargetVertical(angle, state) {
        const deltaX = state.target[1] - state.eye[1];
        const deltaY = state.target[2] - state.eye[2];
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

        const currentAngle = Math.atan2(deltaY, deltaX);
        const newAngle = currentAngle + angle;

        state.target[1] = state.eye[1] + distance * Math.cos(newAngle);
        state.target[2] = state.eye[2] + distance * Math.sin(newAngle);
    }
}



export { SpatialHandlingUtils };