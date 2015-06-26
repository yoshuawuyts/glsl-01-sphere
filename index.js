const orbitCamera = require('canvas-orbit-camera')
const Geometry = require('gl-geometry')
const glContext = require('gl-context')
const glShader = require('gl-shader')
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
geometry.attr('aNormal', normals.vertexNormals(bunny.cells, bunny.positions))
geometry.faces(bunny.cells)

var projection = mat4.create()
var model = mat4.create()
var view = mat4.create()
var height = null
var width = null

var shader = glShader(gl,
  glslify('./shader.vert'),
  glslify('./shader.frag')
)

// update vars before used in render loop
// null -> null
function update () {
  height = gl.drawingBufferHeight
  width = gl.drawingBufferWidth

  camera.view(view)
  camera.tick()

  var aspectRatio = gl.drawingBufferWidth / gl.drawingBufferHeight
  var fieldOfView = Math.PI / 4
  var near = 0.01
  var far = 100

  mat4.perspective(projection, fieldOfView, aspectRatio, near, far)
}

// render a new frame
// null -> null
function render () {
  update()
  gl.viewport(0, 0, width, height)
  gl.enable(gl.DEPTH_TEST)
  gl.enable(gl.CULL_FACE)
  geometry.bind(shader)
  shader.uniforms.uProjection = projection
  shader.uniforms.uView = view
  shader.uniforms.uModel = model
  geometry.draw(gl.TRIANGLES)
}
