let player;
let items = [];
let score = 0;
let stage = "campo"; // Começa no campo
let transition = 0;

function setup() {
  createCanvas(800, 400);
  player = new Player();
}

function draw() {
  background(135, 206, 235); // Cor do céu (começa como campo)
  
  // Desenha o cenário
  if (stage === "campo") {
    drawCampo();
  } else if (stage === "cidade") {
    drawCidade();
  }
  
  // Move e desenha o player
  player.update();
  player.display();
  
  // Atualiza e desenha itens
  for (let item of items) {
    item.update();
    item.display();
    if (player.collects(item)) {
      score++;
      items.splice(items.indexOf(item), 1);
    }
  }
  
  // Mostrar o score
  fill(0);
  textSize(24);
  text("Pontos: " + score, 20, 30);

  // Transição entre campo e cidade
  if (transition > 0 && transition < 255) {
    transition += 5;
  }
}

// Função para desenhar o campo
function drawCampo() {
  fill(34, 139, 34); // Cor do solo
  rect(0, height / 2, width, height / 2); // Solo

  // Adicionando maçãs ao campo
  if (frameCount % 60 === 0) { // Cria uma maçã a cada 60 frames
    items.push(new Apple());
  }

  // Fazendo a transição para a cidade
  if (player.x > width - 50) {
    stage = "cidade";
    transition = 0;
    items = []; // Reseta os itens
  }
}

// Função para desenhar a cidade
function drawCidade() {
  background(70, 130, 180); // Céu da cidade (mais escuro)
  
  fill(169, 169, 169); // Cor dos prédios
  for (let i = 0; i < 5; i++) {
    rect(100 + i * 140, height / 2 - 150, 100, 150); // Prédios
  }
  
  // Adicionando prédios à cidade
  if (frameCount % 60 === 0) { // Cria um prédio a cada 60 frames
    items.push(new Building());
  }
  
  // Fazendo a transição de volta para o campo (se quiser uma mecânica reversa)
  if (player.x > width - 50) {
    stage = "campo";
    transition = 0;
    items = []; // Reseta os itens
  }
}

// Classe do jogador
class Player {
  constructor() {
    this.x = 50;
    this.y = height / 2 + 10;
    this.width = 40;
    this.height = 40;
    this.speed = 5;
  }
  
  update() {
    if (keyIsDown(LEFT_ARROW) && this.x > 0) {
      this.x -= this.speed;
    }
    if (keyIsDown(RIGHT_ARROW) && this.x < width - this.width) {
      this.x += this.speed;
    }
    if (keyIsDown(UP_ARROW) && this.y > height / 2) {
      this.y -= this.speed;
    }
    if (keyIsDown(DOWN_ARROW) && this.y < height - this.height) {
      this.y += this.speed;
    }
  }
  
  display() {
    fill(255, 0, 0); // Cor do personagem (vermelho)
    rect(this.x, this.y, this.width, this.height);
  }
  
  collects(item) {
    // Verifica se o personagem colidiu com o item
    return (this.x < item.x + item.size &&
            this.x + this.width > item.x &&
            this.y < item.y + item.size &&
            this.y + this.height > item.y);
  }
}

// Classe para as maçãs no campo
class Apple {
  constructor() {
    this.x = random(width / 2 - 100);
    this.y = random(height / 2 - 50, height / 2 - 150);
    this.size = 20;
  }
  
  update() {
    // Apenas caindo com o tempo (para um efeito mais dinâmico)
    this.y += 2;
  }
  
  display() {
    fill(255, 0, 0); // Cor da maçã (vermelha)
    ellipse(this.x, this.y, this.size);
  }
}

// Classe para os prédios na cidade
class Building {
  constructor() {
    this.x = random(width / 2 + 50, width - 50);
    this.y = random(height / 2 - 150, height / 2 - 300);
    this.size = 30;
  }
  
  update() {
    // Os prédios não precisam se mover, só caem com a transição
    this.y += 0;
  }
  
  display() {
    fill(169, 169, 169); // Cor dos prédios (cinza)
    rect(this.x, this.y, this.size, 60);
  }
}

