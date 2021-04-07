var camera;
var renderer;

function main()
{
  var SCREEN_WIDTH = window.innerWidth;
  var SCREEN_HEIGHT = window.innerHeight;
  canvas = document.getElementById("canvas");
  canvas.width = SCREEN_WIDTH;
  canvas.height = SCREEN_HEIGHT;

  //Initialize WebGL Renderer
  renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true
  });
  renderer.setClearColor("#121212", 1);

  //Initialize Camera
  camera = new THREE.PerspectiveCamera(100, SCREEN_WIDTH/SCREEN_HEIGHT, 1, 1000);
  camera.position.set(30,5,35);

  window.addEventListener('resize', onWindowResize);
  //Give new camera orbit controls
  const controls = new THREE.OrbitControls(camera, canvas);
  controls.target.set(30,0,0);


  //Initialize Scene
  const scene = new THREE.Scene();

  var speed = {time : 1};
  

  //GUI to change speed
  const gui = new dat.GUI({autoPlace: true});
  gui.add(speed, 'time', 0, 25, .2).name('speed of planets');


  //Load Textures for Planets
  const loader = new THREE.TextureLoader();

  const earthTexture = loader.load("assets/earth.jpg");
  const JupiterTexture = loader.load("assets/jupiter.jpg");
  const marsTexture = loader.load("assets/mars.jpg");
  const mercuryTexture = loader.load("assets/mercury.jpg");
  const moonTexture = loader.load("assets/moon.jpg");
  const neptuneTexture = loader.load("assets/neptune.jpg");
  const plutoTexture = loader.load("assets/pluto.jpeg");
  const saturnTexture = loader.load("assets/saturn.jpg");
  const sunTexture = loader.load("assets/sun.jpg");
  const uranusTexture = loader.load("assets/uranus.jpg");
  const venusTexture = loader.load("assets/venus.jpg");

  //Load Textures for skybox
  const cubeLoader = new THREE.CubeTextureLoader();
  const texture = cubeLoader.load([
    "assets/corona_ft.png", 
    "assets/corona_bk.png",
    "assets/corona_up.png",
    "assets/corona_dn.png",
    "assets/corona_rt.png",
    "assets/corona_lf.png"
]);
  scene.background = texture;

  //Convert loaded images to materials
  const earthMat = new THREE.MeshStandardMaterial({map:earthTexture});
  const jupiterMat = new THREE.MeshStandardMaterial({map:JupiterTexture});
  const marsMat = new THREE.MeshStandardMaterial({map:marsTexture});
  const mercuryMat = new THREE.MeshStandardMaterial({map:mercuryTexture});
  const moonMat = new THREE.MeshStandardMaterial({map:moonTexture});
  const neptuneMat = new THREE.MeshStandardMaterial({map:neptuneTexture});
  const plutoMat = new THREE.MeshStandardMaterial({map:plutoTexture});
  const saturnMat = new THREE.MeshStandardMaterial({map:saturnTexture});
  const sunMat = new THREE.MeshStandardMaterial({map:sunTexture});
  const uranusMat = new THREE.MeshStandardMaterial({map:uranusTexture});
  const venusMat = new THREE.MeshStandardMaterial({map:venusTexture});


  //Create spheres geometry to base each planet size from
  const geometry = new THREE.SphereGeometry(1,32,16);
  //Sun
  const sunMesh = new THREE.Mesh(geometry, sunMat);
  sunMesh.position.set(0,0,0);
  sunMesh.scale.setScalar(10);
  scene.add(sunMesh);

//Planet size is based off the scalar of Earth being 1
  
  //Mercury
  const mercuryGroup = new THREE.Group();
  const mercuryMesh = new THREE.Mesh(geometry, mercuryMat);
  createPlanet(scene, mercuryMesh, mercuryGroup, 25, .38);

  //Venus
  const venusGroup = new THREE.Group();
  const venusMesh = new THREE.Mesh(geometry, venusMat);
  createPlanet(scene, venusMesh, venusGroup, 28, .95);

  //Earth
  const earthGroup = new THREE.Group();
  const earthMesh = new THREE.Mesh(geometry, earthMat);
  createPlanet(scene, earthMesh, earthGroup, 31, 1);

  //Mars
  const marsGroup = new THREE.Group();
  const marsMesh = new THREE.Mesh(geometry, marsMat);
  createPlanet(scene, marsMesh, marsGroup, 34, .53);
  
  //Jupiter
  const jupiterGroup = new THREE.Group();
  const jupiterMesh = new THREE.Mesh(geometry, jupiterMat);
  createPlanet(scene, jupiterMesh, jupiterGroup, 46, 11.2);

  //Saturn
  const saturnGroup = new THREE.Group();
  const saturnMesh = new THREE.Mesh(geometry, saturnMat);
  createPlanet(scene, saturnMesh, saturnGroup, 67, 9.45);

  //Uranus
  const uranusGroup = new THREE.Group();
  const uranusMesh = new THREE.Mesh(geometry, uranusMat);
  createPlanet(scene, uranusMesh, uranusGroup, 80, 4);

  //Neptune
  const neptuneGroup = new THREE.Group();
  const neptuneMesh = new THREE.Mesh(geometry, neptuneMat);
  createPlanet(scene, neptuneMesh, neptuneGroup, 88, 3.88);

  //Pluto
  const plutoGroup = new THREE.Group();
  const plutoMesh = new THREE.Mesh(geometry, plutoMat);
  createPlanet(scene, plutoMesh, plutoGroup, 93, 0.2);


  //Initialize Lighting
  const light = new THREE.PointLight("white", 1.25);
  light.position.set(0,0,0);
  scene.add(light);

  //Call addspotlight to illuminate sun mesh
  addSpotLight(scene);
  
  var animate=function() {
/*Using earth as a baseline animation I've calculated the other 
planets rotation and orbital speed based on their real life differences
orbital speeds being round to 3 decimal places and rotational speed to 5
decimal places*/
    sunMesh.rotateY(.0001*speed.time);

    earthGroup.rotateY(.002 * speed.time);
    earthMesh.rotateY(.1 * speed.time);

    mercuryGroup.rotateY(.0032 * speed.time);
    mercuryMesh.rotateY(.00069 * speed.time);

    venusGroup.rotateY(.0024 * speed.time);
    venusMesh.rotateY(.00041 * speed.time);
    
    marsGroup.rotateY(.0016 * speed.time);
    marsMesh.rotateY(.05502 * speed.time);

    jupiterGroup.rotateY(.0009 * speed.time);
    jupiterMesh.rotateY(2.896 * speed.time);

    saturnGroup.rotateY(.0007 * speed.time);
    saturnMesh.rotateY(2.34053 * speed.time);

    uranusGroup.rotateY(.0005 * speed.time);
    uranusMesh.rotateY(.9399 * speed.time);

    neptuneGroup.rotateY(.0004 * speed.time);
    neptuneMesh.rotateY(.61747 * speed.time);

    plutoGroup.rotateY(.0003 * speed.time);
    plutoMesh.rotateY(.003 * speed.time);
  
    renderer.render(scene, camera);

    requestAnimationFrame( animate );
  };
  animate();
};

function createPlanet(scene, mesh, group, x, scale){
  mesh.position.set(x,0,0);
  mesh.scale.setScalar(scale);
  group.add(mesh);
  scene.add(group);
  console.log("added planet");
}

function addSpotLight(scene){
  var colour = 0xFFFFFF;
  var intensity = 5;
  var distance = 25;
  var angle = Math.PI/7;

  new Array(6).fill('').forEach((item, i) => {
    var spotlight = new THREE.SpotLight(colour, intensity, distance, angle);
    var value = i % 2 === 0 ? 25 : -25;
    spotlight.position.set(i<2?value:0, i>=2&&i<4?value:0, i>=4?value:0);
    scene.add(spotlight);
  });
}

function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );

}
