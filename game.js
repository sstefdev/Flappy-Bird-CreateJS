let stage, loader;

const init = () => {
  stage = new createjs.StageGL("gameCanvas");

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

  stage.update();

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
    stage.addChild(clouds[i]);
  }

  stage.update();
};
