let stage, loader, flappy;
let started = false;
let polygon;

const init = () => {
  stage = new createjs.Stage("gameCanvas");

  createjs.Ticker.timingMode = createjs.Ticker.RAF_SYNCED;
  createjs.Ticker.framerate = 120;
  createjs.Ticker.addEventListener("tick", stage);

  const background = new createjs.Shape();
  background.graphics
    .beginLinearGradientFill(
      ["#2573BB", "#6CB8DA", "#567A32"],
      [0, 0.85, 1],
      0,
      0,
      0,
      480
    )
    .drawRect(0, 0, 320, 480);
  background.x = 0;
  background.y = 0;
  background.name = "background";
  background.cache(0, 0, 320, 480);

  stage.addChild(background);

  const manifest = [
    { src: "cloud.png", id: "cloud" },
    { src: "flappy.png", id: "flappy" },
    { src: "pipe.png", id: "pipe" },
  ];

  loader = new createjs.LoadQueue(true);
  loader.addEventListener("complete", handleComplete);
  loader.loadManifest(manifest, true, "./assets/");
};

const handleComplete = () => {
  createClouds();
  createFlappy();
  stage.on("stagemousedown", jumpFlappy);
  createjs.Ticker.addEventListener("tick", checkCollision);
  polygon = new createjs.Shape();
  stage.addChild(polygon);
};

const createClouds = () => {
  let clouds = [];
  for (let i = 0; i < 3; i++) {
    clouds.push(new createjs.Bitmap(loader.getResult("cloud")));
  }

  clouds[0].scaleX = 0.08;
  clouds[0].scaleY = 0.08;
  clouds[0].x = 10;
  clouds[0].y = 20;
  clouds[1].scaleX = 0.08;
  clouds[1].scaleY = 0.08;
  clouds[1].x = 180;
  clouds[1].y = 75;
  clouds[2].scaleX = 0.08;
  clouds[2].scaleY = 0.08;
  clouds[2].x = 70;
  clouds[2].y = 130;

  for (let i = 0; i < 3; i++) {
    let directionMultiplier = i % 2 == 0 ? -1 : 1;
    let originalX = clouds[i].x;
    createjs.Tween.get(clouds[i], { loop: true })
      .to(
        { x: clouds[i].x - 200 * directionMultiplier },
        2500,
        createjs.Ease.getPowInOut(1.5)
      )
      .to({ x: originalX }, 3000, createjs.Ease.getPowInOut(1.5));
    stage.addChild(clouds[i]);
  }
};

const flappySize = (flappy) => {
  flappy.scaleX = 0.07;
  flappy.scaleY = 0.07;
};

const createFlappy = () => {
  flappy = new createjs.Bitmap(loader.getResult("flappy"));
  flappy.regX = flappy.image.width / 2;
  flappy.regY = flappy.image.height / 2;
  flappy.x = stage.canvas.width / 2;
  flappy.y = stage.canvas.height / 2;
  //   flappySize(flappy);
  stage.addChild(flappy);
};

const jumpFlappy = () => {
  if (!started) {
    startGame();
  }
  createjs.Tween.get(flappy, { override: true })
    .to(
      {
        y: flappy.y - 60,
        rotation: -10,
      },
      500,
      createjs.Ease.getPowOut(2)
    )
    .to(
      { y: stage.canvas.height + flappy.image.width / 2, rotation: 30 },
      1500,
      createjs.Ease.getPowIn(2)
    )
    .call(gameOver);
};

const pipeSize = (botPipe, topPipe) => {
  botPipe.scaleX = 0.35;
  botPipe.scaleY = 0.35;
  topPipe.scaleX = 0.35;
  topPipe.scaleY = 0.35;
};

const createPipes = () => {
  let topPipe, bottomPipe;
  let position = Math.floor(Math.random() * 280 + 100);

  topPipe = new createjs.Bitmap(loader.getResult("pipe"));
  topPipe.y = position - 75;
  topPipe.x = stage.canvas.width + topPipe.image.width / 2;
  topPipe.rotation = 180;
  topPipe.skewY = 180;
  topPipe.name = "pipe";

  bottomPipe = new createjs.Bitmap(loader.getResult("pipe"));
  bottomPipe.y = position + 75;
  bottomPipe.x = stage.canvas.width + bottomPipe.image.width / 2;
  bottomPipe.name = "pipe";

  topPipe.regX = bottomPipe.regX = topPipe.image.width / 2;

  createjs.Tween.get(topPipe)
    .to({ x: 0 - topPipe.image.width }, 15000)
    .call(() => removePipe(topPipe));

  createjs.Tween.get(bottomPipe)
    .to({ x: 0 - bottomPipe.image.width }, 15000)
    .call(() => removePipe(bottomPipe));

  pipeSize(bottomPipe, topPipe);

  stage.addChild(bottomPipe, topPipe);
};

const removePipe = (pipe) => {
  stage.removeChild(pipe);
};

const startGame = () => {
  started = true;
  createPipes();
  setInterval(createPipes, 2000);
};

const checkCollision = () => {
  let leftX = flappy.x - flappy.regX + 5;
  let leftY = flappy.y - flappy.regY + 5;
  let points = [
    new createjs.Point(leftX, leftY),
    new createjs.Point(leftX + flappy.image.width - 10, leftY),
    new createjs.Point(leftX, leftY + flappy.image.height - 10),
    new createjs.Point(
      leftX + flappy.image.width - 10,
      leftY + flappy.image.height - 10
    ),
  ];

  polygon.graphics.clear().beginStroke("black");
  polygon.graphics
    .moveTo(points[0].x, points[0].y)
    .lineTo(points[2].x, points[2].y)
    .lineTo(points[3].x, points[3].y)
    .lineTo(points[1].x, points[1].y)
    .lineTo(points[0].x, points[0].y);

  for (let i = 0; i < points.length; i++) {
    let objects = stage.getObjectsUnderPoint(points[i].x, points[i].y);
    if (objects.filter((object) => object.name === "pipe").length > 0) {
      gameOver();
      return;
    }
  }
};

const gameOver = () => {
  createjs.Tween.removeAllTweens();
};
