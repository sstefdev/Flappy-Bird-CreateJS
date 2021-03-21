let stage, loader, flappy;

const init = () => {
  stage = new createjs.StageGL("gameCanvas");

  createjs.Ticker.timingMode = createjs.Ticker.RAF_SYNCED;
  createjs.Ticker.framerate = 60;
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
  //   createPipes();
  stage.on("stagemousedown", jumpFlappy);
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
  flappySize(flappy);
  stage.addChild(flappy);
};

const jumpFlappy = () => {
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

// const createPipes = () => {
//     let topPipe, bottomPipe;
//     let
// }

const gameOver = () => {
  console.log("GAME OVER!");
};
