var camera;
var controls;
var renderer;
var scene;

var SCREEN_WIDTH = window.innerWidth;
var SCREEN_HEIGHT = window.innerHeight;

var mercuryCoord;
var venusCoord;
var earthCoord;
var marsCoord;
var jupiterCoord;
var uranusCoord;
var saturnCoord;
var plutoCoord;

var following;
var followingMesh;
function main()
{
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
  camera.position.set(125,5,125);

  window.addEventListener('resize', onWindowResize);
  //Give new camera orbit controls
  controls = new THREE.OrbitControls(camera, canvas);
  controls.target.set(0,0,0);


  //Initialize Scene
  scene = new THREE.Scene();

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
  const corona = cubeLoader.load([
    "assets/corona_ft.png", 
    "assets/corona_bk.png",
    "assets/corona_up.png",
    "assets/corona_dn.png",
    "assets/corona_rt.png",
    "assets/corona_lf.png"
]);
const redEclipse = cubeLoader.load([
  "assets/redeclipse_ft.png", 
  "assets/redeclipse_bk.png",
  "assets/redeclipse_up.png",
  "assets/redeclipse_dn.png",
  "assets/redeclipse_rt.png",
  "assets/redeclipse_lf.png"
]);
const skyboxBlue = cubeLoader.load([
  "assets/skybox1/1.png", 
  "assets/skybox1/2.png",
  "assets/skybox1/3.png",
  "assets/skybox1/4.png",
  "assets/skybox1/5.png",
  "assets/skybox1/6.png"
]);

  scene.background = corona;
//add GUI to allow changing of skybox
  var skyboxFolder = gui.addFolder("skyboxes");
  settings = {
    'corona' : function(){
      switchSkybox(corona, scene);
    },
    'red eclipse' : function(){
      switchSkybox(redEclipse, scene);
    },
    'skybox blue' : function(){
      switchSkybox(skyboxBlue, scene);
    },
    'skybox red' : function(){
      switchSkybox(skyboxRed, scene);
    }
  }
  skyboxFolder.add(settings, 'corona');
  skyboxFolder.add(settings, 'red eclipse');
  skyboxFolder.add(settings, 'skybox blue');



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
  const sunGroup = new THREE.Group();
  const sunMesh = new THREE.Mesh(geometry, sunMat);
  createPlanet(scene, sunMesh, sunGroup, 0, 109);

//Planet size is based off the scalar of Earth being 1 and the rest off
//their real live realative sizes to Earth distances are not relative
//to make them visible all in one viewport
  
  //Mercury
  const mercuryGroup = new THREE.Group();
  const mercuryMesh = new THREE.Mesh(geometry, mercuryMat);
  createPlanet(scene, mercuryMesh, mercuryGroup, 260, .38);

  //Venus
  const venusGroup = new THREE.Group();
  const venusMesh = new THREE.Mesh(geometry, venusMat);
  createPlanet(scene, venusMesh, venusGroup, 292, .95);

  //Earth
  const earthGroup = new THREE.Group();
  const earthMesh = new THREE.Mesh(geometry, earthMat);
  createPlanet(scene, earthMesh, earthGroup, 330, 1);

  //Mars
  const marsGroup = new THREE.Group();
  const marsMesh = new THREE.Mesh(geometry, marsMat);
  createPlanet(scene, marsMesh, marsGroup, 360, .53);
  
  //Jupiter
  const jupiterGroup = new THREE.Group();
  const jupiterMesh = new THREE.Mesh(geometry, jupiterMat);
  createPlanet(scene, jupiterMesh, jupiterGroup, 480, 11.2);

  //Saturn
  const saturnGroup = new THREE.Group();
  const saturnMesh = new THREE.Mesh(geometry, saturnMat);
  createPlanet(scene, saturnMesh, saturnGroup, 600, 9.45);

  //Uranus
  const uranusGroup = new THREE.Group();
  const uranusMesh = new THREE.Mesh(geometry, uranusMat);
  createPlanet(scene, uranusMesh, uranusGroup, 700, 4);

  //Neptune
  const neptuneGroup = new THREE.Group();
  const neptuneMesh = new THREE.Mesh(geometry, neptuneMat);
  createPlanet(scene, neptuneMesh, neptuneGroup, 800, 3.88);

  //Pluto
  const plutoGroup = new THREE.Group();
  const plutoMesh = new THREE.Mesh(geometry, plutoMat);
  createPlanet(scene, plutoMesh, plutoGroup, 850, 0.2);

  var planetFolder = gui.addFolder("Planets");
  settings = {
    'sun' : function(){
      sunGroup.add(camera);
      following = false;
      camera.position.set(125,5,125);
      camera.lookAt(0,0,0);
      controls.target.set(0,0,0);
    },
    'mercury' : function(){
      following = true;
      followingMesh = mercuryMesh;
    },
    'venus' : function(){
      following = true;
      followingMesh = venusMesh;
    },
    'earth' : function(){
      following = true;
      followingMesh = earthMesh;
    },
    'mars' : function(){
      following = true;
      followingMesh = marsMesh;
    },
    'jupiter' : function(){
      following = true;
      followingMesh = jupiterMesh;
    },
    'saturn' : function(){
      following = true;
      followingMesh = saturnMesh;
    },
    'uranus' : function(){
      following = true;
      followingMesh = uranusMesh;
    },
    'neptune' : function(){
      following = true;
      followingMesh = neptuneMesh;
    },
    'pluto' : function(){
      following = true;
      followingMesh = plutoMesh;
    }
  }
  planetFolder.add(settings, 'sun');
  planetFolder.add(settings, 'mercury');
  planetFolder.add(settings, 'venus');
  planetFolder.add(settings, 'earth');
  planetFolder.add(settings, 'mars');
  planetFolder.add(settings, 'jupiter');
  planetFolder.add(settings, 'saturn');
  planetFolder.add(settings, 'uranus');
  planetFolder.add(settings, 'neptune');
  planetFolder.add(settings, 'pluto');


  //Initialize Lighting
  const light = new THREE.PointLight("white", 1);
  light.position.set(0,0,0);
  scene.add(light);

  //Call addspotlight to illuminate sun mesh
  addSpotLight(scene);
  
  //tilt earth 23.5 degrees or 0.4101524 radian as it is tilted this way 
  //in real life

  earthMesh.rotateZ(0.4101524);
  var animate=function() {
/*Using earth as a baseline animation I've calculated the other 
planets rotation and orbital speed based on their real life differences
orbital speeds being round to 3 decimal places and rotational speed to 5
decimal places*/
    sunMesh.rotateY(.0001*speed.time);

    earthGroup.rotation. y += .002 * speed.time;
    earthMesh.rotateY(.1 * speed.time);
    earthCoord = calculateCoordinates(earthMesh.position.x, earthGroup.rotation.y);
    

    mercuryGroup.rotation.y += .0032 * speed.time;
    mercuryMesh.rotateY(.00069 * speed.time);
    mercuryCoord = calculateCoordinates(mercuryMesh.position.x, mercuryGroup.rotation.y);

    venusGroup.rotation.y += .0024 * speed.time;
    venusMesh.rotateY(.00069 * speed.time);
    venusCoord = calculateCoordinates(venusMesh.position.x, venusGroup.rotation.y);

    marsGroup.rotation.y += .0016 * speed.time;
    marsMesh.rotateY(.05502 * speed.time);
    marsCoord = calculateCoordinates(marsMesh.position.x, marsGroup.rotation.y);

    jupiterGroup.rotation.y += .0009 * speed.time;
    jupiterMesh.rotateY(2.896 * speed.time);
    jupiterCoord = calculateCoordinates(jupiterMesh.position.x, jupiterGroup.rotation.y);

    saturnGroup.rotation.y += .0007 * speed.time;
    saturnMesh.rotateY(2.34053 * speed.time);
    saturnCoord = calculateCoordinates(saturnMesh.position.x, saturnGroup.rotation.y);

    uranusGroup.rotation.y += .0005 * speed.time;
    uranusMesh.rotateY(.9399 * speed.time);
    uranusCoord = calculateCoordinates(uranusMesh.position.x, uranusGroup.rotation.y);

    neptuneGroup.rotation.y += .0004 * speed.time;
    neptuneMesh.rotateY(.61747 * speed.time);
    neptuneCoord = calculateCoordinates(neptuneMesh.position.x, neptuneGroup.rotation.y);

    plutoGroup.rotation.y += .0003 * speed.time;
    plutoMesh.rotateY(.003 * speed.time);
    plutoCoord = calculateCoordinates(plutoMesh.position.x, plutoGroup.rotation.y);
    if(following){
      switch(followingMesh){
        case mercuryMesh:
          moveCamera(mercuryMesh, mercuryCoord[0], mercuryCoord[1]);
          break;
        case venusMesh:
          moveCamera(venusMesh, venusCoord[0], venusCoord[1]);
          break;
        case earthMesh:
          moveCamera(earthMesh, earthCoord[0], earthCoord[1]);
          break;
        case marsMesh:
          moveCamera(marsMesh, marsCoord[0], marsCoord[1]);
          break;
        case jupiterMesh:
          moveCamera(jupiterMesh, jupiterCoord[0], jupiterCoord[1]);
          break;
        case saturnMesh:
          moveCamera(saturnMesh, saturnCoord[0], saturnCoord[1]);
          break;
        case uranusMesh:
          moveCamera(uranusMesh, uranusCoord[0], uranusCoord[1]);
          break;
        case neptuneMesh:
          moveCamera(neptuneMesh, neptuneCoord[0], neptuneCoord[1]);
          break;
        case plutoMesh:
          moveCamera(plutoMesh, plutoCoord[0], plutoCoord[1]);
          break;
      }
    }


    renderer.render(scene, camera);

    requestAnimationFrame( animate );

    
  };
  animate();
};

function calculateCoordinates(r, rotation){
  var z = r * Math.cos(rotation + Math.PI/2);
  var x = r * Math.sin(rotation + Math.PI/2);
  
  var coord = [x,z];
  return coord;
}

function moveCamera(mesh,x,z){
  camera.position.x = x + mesh.scale.x;
  camera.position.z = z + mesh.scale.x;
  
  controls.target.set(x,1,z);
  controls.update();
}

function createPlanet(scene, mesh, group, x, scale){
  mesh.position.set(x,0,0);
  mesh.scale.setScalar(scale);
  group.add(mesh);
  scene.add(group);
}

function addSpotLight(scene){
  var colour = 0xFFFFFF;
  var intensity = 5;
  var distance = 250;
  var angle = Math.PI/7;

  new Array(6).fill('').forEach((item, i) => {
    var spotlight = new THREE.SpotLight(colour, intensity, distance, angle);
    var value = i % 2 === 0 ? 250 : -250;
    spotlight.position.set(i<2?value:0, i>=2&&i<4?value:0, i>=4?value:0);
    scene.add(spotlight);
  });
}



function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );

}

function switchSkybox(skyBox, scene){
  scene.background = skyBox;
}