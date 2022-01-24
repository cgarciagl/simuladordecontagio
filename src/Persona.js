import { modozombie, tiempoenfermedad, mortalidad } from "./Datos";
import { get } from "svelte/store";

let colorEstado = {
  sano: "lime",
  enfermo: "orange",
  recuperado: "cyan",
  muerto: "black",
};

export class Persona {
  constructor(x, y, p5) {
    this.pos = p5.createVector(x, y);
    this.vel = p5.createVector(p5.random(-3, 3), p5.random(-3, 3));
    this.radio = 3;
    this.estado = "sano";
    this.tiempoenfermo = 0;
    this.movible = true;
    this.p5 = p5;
  }

  dibuja() {
    this.p5.fill(colorEstado[this.estado]);
    this.p5.stroke("black");
    this.p5.ellipse(this.pos.x, this.pos.y, this.radio * 2, this.radio * 2);
  }

  update() {
    if (this.movible) {
      this.pos.add(this.vel);
      this.rebotarConParedes();
    }

    if (this.estado == "enfermo") {
      this.tiempoenfermo++;
    }

    if (
      this.estado == "enfermo" &&
      this.tiempoenfermo > get(tiempoenfermedad)
    ) {
      this.muerto();
    }

    this.dibuja();
  }

  muerto() {
    if (this.p5.random(1, 100) <= get(mortalidad)) {
      this.estado = "muerto";
      this.movible = false;
      if (get(modozombie)) {
        this.movible = true;
      }
    } else {
      this.estado = "recuperado";
      if (get(modozombie)) {
        this.estado = "muerto";
        this.movible = true;
      }
    }
  }

  rebotarConParedes() {
    if (
      this.pos.x - this.radio < 0 ||
      this.pos.y - this.radio < 0 ||
      this.pos.x + this.radio > this.p5.width ||
      this.pos.y + this.radio > this.p5.height - 100
    ) {
      this.vel.rotate(this.p5.HALF_PI);
      this.pos.x = this.p5.constrain(
        this.pos.x,
        this.radio,
        this.p5.width - this.radio
      );
      this.pos.y = this.p5.constrain(
        this.pos.y,
        this.radio,
        this.p5.height - this.radio - 100
      );
    }
  }

  colisiona(p) {
    if (
      this.p5.dist(this.pos.x, this.pos.y, p.pos.x, p.pos.y) <=
      this.radio * 2
    ) {
      if (this.estado == "enfermo" || p.estado == "enfermo") {
        this.contagiado();
      }

      if (get(modozombie)) {
        if (this.estado == "muerto" || p.estado == "muerto") {
          this.contagiado();
        }
      }

      this.vel.rotate(this.p5.random(this.p5.HALF_PI));
    }
  }

  contagiado() {
    if (this.estado == "sano") {
      this.estado = "enfermo";
    }
  }
}
