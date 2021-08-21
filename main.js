kaboom({
  global: true,
  fullscreen: true,
  scale: 2,
});

loadRoot("./img/")
loadSprite("mario", "mario.png")
loadSprite("bg", "bg1.png")
loadSprite("over", "game-over.png")
loadSprite("corona", "corona5.png")

scene("main", () => {
  layers([
    "game",
    "ui",
  ], "game")

  new Audio("./sounds/start.wav").play()

  //add bacground
  add([
    sprite("bg"),
    scale(2),
    origin("topleft")
  ])

  add([
    sprite("bg"),
    scale(2),
    pos(width() / 2, 0),
    origin("topleft")
  ])

  //caharacter mario
  const mario = add([
    sprite("mario"),
    pos(80, 80),
    scale(0.01),
    body()
  ])

  //add action JUMP 
  const JUMP_FORCE = 300

  keyPress("space", () => {
    new Audio("./sounds/jump.wav").play()
    mario.jump(JUMP_FORCE)
  })

  //add action when pos mario >= heiht game will restarted
  mario.action(_ => {
    if (mario.pos.y >= height()) {
      go("gameOver", score.value)
    }
  })

  //if mario position collides the virus
  mario.collides("corona", _ => {
    go("gameOver", score.value)
  })

  //add VIRUS
  const CORONA_OPEN = 110
  const CORONA_SPEED = 90

  //loop to add new viruses to the scane every 1.5 sec
  loop(1.5, () => {
    const coronaPos = rand(0, height() - CORONA_OPEN)

    add([
      sprite("corona"),
      origin("bot"),
      pos(width(), coronaPos),
      "corona"
    ]);

    add([
      sprite("corona"),
      scale(1, -1),
      pos(width(), coronaPos + CORONA_OPEN),
      origin("bot"),
      "corona",
      {
        passed: false
      }
    ])
  })

  //add action move the coronas
  action("corona", corona => {
    corona.move(-CORONA_SPEED, 0)

    if (corona.pos.x + corona.width <= mario.pos.x && !corona.passed) {
      score.value++
      score.text = score.value
      corona.passed = true
    }

    if (corona.pos.x + corona.width < 0) {
      destroy(corona);
    }
  })

  //add score
  const score = add([
    pos(15, 18),
    layer("ui"),
    text("0", 30),
    {
      value: 0
    },
  ])

  add([
    text("Press SPACE to Jump", 8),
    pos(10, 5)
  ])

  add([
    text("@sigit_ari_prasetyo"),
    pos(width() - 20, height() - 20),
    origin("botright"),
    layer("ui")
  ])
})

scene("gameOver", score => {
  (new Audio("./sounds/lose1.wav").play())

  //add bacground
  add([
    sprite("bg"),
    scale(2),
    origin("topleft")
  ])

  add([
    sprite("bg"),
    scale(2),
    pos(width() / 2, 0),
    origin("topleft")
  ])

  add([
    sprite("over"),
    scale(0.055),
    pos(width() / 2, height() / 2 - 40),
    origin("center")
  ])

  add([
    text(`Score: ${score}`, 16),
    pos(width() / 2, height() / 2 - 20),
    origin("center")
  ])

  add([
    text("Press SPACE to RESTART", 8),
    pos(width() / 2, height() / 2),
    origin("center")
  ])

  keyPress("space", _ => {
    go("main")
  })
})

start("main")