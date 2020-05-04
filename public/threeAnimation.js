import {visibleHeightAtZDepth, visibleWidthAtZDepth, lerp} from "../utils.js"
import {nextSlide} from "../main.js"
import {previousSlide} from "../main.js"

const raycaster = new THREE.Raycaster()
const raycasterBack = new THREE.Raycaster()

const objLoader = new THREE.OBJLoader()
const objLoaderBack = new THREE.OBJLoader()
let arrowBox = null
let arrowBoxBack = null;
let arrowBoxRotation = 0
let arrowBoxRotationBack = 0


const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight)

const sceneBack = new THREE.Scene()
const cameraBack = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight)

const renderer = new THREE.WebGLRenderer({antialias: true, alpha: true})
const rendererBack = new THREE.WebGLRenderer({antialias: true, alpha: true})

renderer.setSize(window.innerWidth, window.innerHeight)
renderer.render(scene, camera)


document.body.append(renderer.domElement)

objLoader.load(
    'models/cube.obj',
    ({children}) => {
      const screenBorderRight = visibleWidthAtZDepth(-10, camera) / 2
      const screenBottom = -visibleHeightAtZDepth(-10, camera) / 2

      addCube(children[0], nextSlide, screenBorderRight - 1.5, screenBottom + 1)
      animate()
    }
)

objLoaderBack.load(
    'models/cube.obj',
    ({children}) => {
      const screenBorderRight = visibleWidthAtZDepth(-10, camera) / 2
      const screenBottom = -visibleHeightAtZDepth(-10, camera) / 2

      addCubeBack(children[0], previousSlide, screenBorderRight - 3, screenBottom + 1)
      animateBack()
    }
)

const addCube = (object, callbackFn, x, y) => {
  const cubeMesh = object.clone()

  cubeMesh.scale.setScalar(.3)
  cubeMesh.rotation.set(THREE.Math.degToRad(90), 0, 0)

  const boundingBox = new THREE.Mesh(
      new THREE.BoxGeometry(.7, .7, .7),
      new THREE.MeshBasicMaterial({transparent: true, opacity: 0})
  )

  boundingBox.position.x = x
  boundingBox.position.y = y
  boundingBox.position.z = -10

  boundingBox.add(cubeMesh)

  boundingBox.callbackFn = callbackFn

  arrowBox = boundingBox
  scene.add(boundingBox)
}

const addCubeBack = (object, callbackFn, x, y) => {
  const cubeMesh = object.clone()

  cubeMesh.scale.setScalar(.3)
  cubeMesh.rotation.set(THREE.Math.degToRad(270), 0, 0)

  const boundingBox = new THREE.Mesh(
      new THREE.BoxGeometry(.7, .7, .7),
      new THREE.MeshBasicMaterial({transparent: true, opacity: 0})
  )


  boundingBox.position.x = x
  boundingBox.position.y = y
  boundingBox.position.z = -10

  boundingBox.add(cubeMesh)

  boundingBox.callbackFn = callbackFn

  arrowBoxBack = boundingBox
  scene.add(boundingBox)
}

const animate = () => {
  arrowBoxRotation = lerp(arrowBoxRotation, 0, .07)
  arrowBox.rotation.set(THREE.Math.degToRad(arrowBoxRotation), 0, 0)

  renderer.render(scene, camera)
  requestAnimationFrame(animate)
}

const animateBack = () => {
  arrowBoxRotationBack = lerp(arrowBoxRotationBack, 0, .07)
  arrowBoxBack.rotation.set(THREE.Math.degToRad(arrowBoxRotationBack), 0, 0)

  rendererBack.render(sceneBack, cameraBack)
  requestAnimationFrame(animateBack)
}

export const handleThreeAnimation = () => {
  arrowBoxRotation = 360
}

export const handleThreeAnimationBack = () => {
  arrowBoxRotationBack = -360
}

window.addEventListener('click', () => {
  const mousePosition = new THREE.Vector2()
  mousePosition.x = (event.clientX / window.innerWidth) * 2 - 1
  mousePosition.y = -(event.clientY / window.innerHeight) * 2 + 1

  raycaster.setFromCamera(mousePosition, camera)

  const interesctedObjects = raycaster.intersectObjects([arrowBox])

  interesctedObjects.length && interesctedObjects[0].object.callbackFn()
})

window.addEventListener('click', () => {
  const mousePosition = new THREE.Vector2()
  mousePosition.x = (event.clientX / window.innerWidth) * 2 - 1
  mousePosition.y = -(event.clientY / window.innerHeight) * 2 + 1

  raycasterBack.setFromCamera(mousePosition, camera)

  const interesctedObjects = raycasterBack.intersectObjects([arrowBoxBack])

  interesctedObjects.length && interesctedObjects[0].object.callbackFn()
  console.log("dup")
})