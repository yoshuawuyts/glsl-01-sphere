const orbitCamera = require('canvas-orbit-camera')
const Geometry = require('gl-geometry')
const glContext = require('gl-context')
const glslify = require('glslify')
const normals = require('normals')
const fit = require('canvas-fit')
const mat4 = require('gl-mat4')
const bunny = require('bunny')

const canvas = document.body.appendChild(document.createElement('canvas'))
const gl = glContext(canvas, render)
const camera = orbitCamera(canvas)

// always make the canvas fit the window
window.addEventListener('resize', fit(canvas), false)

const geometry = Geometry(gl)
geometry.attr('aPosition', bunny.positions)
geometry.attr('aNormal', normals.vertexNormal(bunny.cells, bunny.positions))
geometry.faces(bunny.cells)

function render () {
}
