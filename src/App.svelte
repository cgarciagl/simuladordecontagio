<script>
  import { fade } from "svelte/transition";
  import P5 from "p5-svelte";

  let poblacion = 200;
  let encuarentena = 20;
  let mortalidad = 50;
  let tiempoenfermedad = 100;
  let gp5 = {};
  let terminado = false;
  let modozombie = false;

  let personas = [];

  let colorEstado = {
    sano: "lime",
    enfermo: "orange",
    recuperado: "cyan",
    muerto: "black",
  };
  let contadores = {};

  class Persona {
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

      if (this.estado == "enfermo" && this.tiempoenfermo > tiempoenfermedad) {
        if (this.p5.random(1, 100) <= mortalidad) {
          this.estado = "muerto";
          this.movible = false;
          if (modozombie) {
            this.movible = true;
          }
        } else {
          this.estado = "recuperado";
          if (modozombie) {
            this.estado = "muerto";
            this.movible = true;
          }
        }
      }

      this.dibuja();
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

        if (modozombie) {
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

  function checarColisiones() {
    personas.forEach(function (value1, index1) {
      personas.forEach(function (value2, index2) {
        if (index1 != index2) {
          value1.colisiona(value2);
        }
      });
    });
  }

  function actualizaContadores() {
    contadores = {
      enfermos: 0,
      sanos: 0,
      muertos: 0,
      recuperados: 0,
    };
    personas.forEach(function (value, index) {
      value.update();
      contadores[value.estado + "s"]++;
    });
    if (contadores.enfermos == 0) {
      terminado = true;
    }
  }

  const sketch = (p5) => {
    function Inicializa() {
      for (let i = 1; i <= poblacion; i++) {
        personas.push(new Persona(p5.random(700), p5.random(390), p5));
      }
      personas[0].estado = "enfermo";
      //ponemos personas en cuarentena..
      for (let i = 1; i <= (encuarentena * poblacion) / 100; i++) {
        personas[i].movible = false;
      }
    }

    p5.setup = () => {
      p5.createCanvas(800, 500);
      gp5 = p5;
      Inicializa();
    };

    p5.draw = () => {
      p5.fill("#EAEAEA");
      p5.rect(0, 0, p5.width, p5.height - 100);

      checarColisiones();
      actualizaContadores();
      mostrarChart();
    };

    function mostrarChart() {
      let i = p5.frameCount % p5.width;
      p5.strokeWeight(2);

      p5.stroke("orange");
      let prop = (contadores.enfermos / poblacion) * 100;
      let ult = p5.height - prop;
      p5.line(i, ult, i, p5.height);
      p5.stroke("cyan"); //lightblue
      prop = (contadores.recuperados / poblacion) * 100;
      p5.line(i, ult - prop, i, ult);
      ult = ult - prop;
      p5.stroke("black"); //black
      prop = (contadores.muertos / poblacion) * 100;
      p5.line(i, ult - prop, i, ult);
      ult = ult - prop;
      p5.stroke("lime"); //lime
      prop = (contadores.sanos / poblacion) * 100;
      p5.line(i, ult - prop, i, ult);
      ult = ult - prop;

      p5.strokeWeight(1);
      p5.stroke("black");
    }
  };

  function Reinicia() {
    if (gp5) {
      while (personas.length > 0) {
        personas.pop();
      }
      for (let i = 1; i <= poblacion; i++) {
        personas.push(new Persona(gp5.random(700), gp5.random(390), gp5));
      }
      personas[0].estado = "enfermo";
      //ponemos personas en cuarentena..
      for (let i = 1; i <= (encuarentena * poblacion) / 100; i++) {
        personas[i].movible = false;
      }
    }
    terminado = false;
    console.log("denuevo");
  }
</script>

<div id="contenedor">
  <P5 {sketch} />

  <div class="numeralia">
    <span>Sanos: <strong>{contadores.sanos}</strong></span>
    <span>Enfermos: <strong>{contadores.enfermos}</strong></span>
    <span>Recuperados: <strong>{contadores.recuperados}</strong></span>
    <span>Fallecidos: <strong>{contadores.muertos}</strong></span>
  </div>

  {#if terminado}
    <div id="panel" transition:fade>
      <h2>Simulación terminada</h2>
      <div id="rangos">
        <label>
          Población: <br /><input
            type="range"
            min="50"
            max="400"
            step="1"
            bind:value={poblacion}
          /><br />
          {poblacion} Personas
        </label>

        <label>
          En Cuarentena: <br />
          <input
            type="range"
            min="0"
            max="90"
            step="1"
            bind:value={encuarentena}
          /><br />
          {encuarentena} %
        </label>
        <label>
          Mortalidad: <br />
          <input
            type="range"
            min="0"
            max="100"
            step="1"
            bind:value={mortalidad}
          /><br />
          {mortalidad} %
        </label>
        <label>
          Tiempo Enfermo: <br />
          <input
            type="range"
            min="100"
            max="1000"
            step="1"
            bind:value={tiempoenfermedad}
          /><br />
          {tiempoenfermedad} ciclos
        </label>

        <label class="clsmodozombie">
          <input type="checkbox" bind:checked={modozombie} />
          modo zombie
        </label>
      </div>
      <button
        id="btnReinicia"
        on:click={() => {
          Reinicia();
        }}>Re-inicializa</button
      >
    </div>
  {:else}
    <div class="numeralia numeralia2">
      <span>Población: <strong>{poblacion} personas</strong></span>
      <span>En cuarentena: <strong>{encuarentena} %</strong></span>
      <span>Mortalidad: <strong>{mortalidad} %</strong></span>
      <span> Tiempo Enfermo:: <strong>{tiempoenfermedad} ciclos</strong></span>
      {#if modozombie}
        <span style="color:red;"><strong>Modo Zombie Activo</strong></span>
      {/if}
    </div>
  {/if}
</div>

<div class="topcorner">
  <h2>Simulador de contagios</h2>
  <p>
    En cada simulación se puede seleccionar: la población de individuos, el
    porcentaje de estos que se mantendrán en cuarentena (no se moverán), la tasa
    de mortalidad de la enfermedad y el tiempo que se mantendrán enfermos los
    individuos antes de recuperarse o morir
  </p>

  <h3>Código de colores:</h3>
  <div class="spans">
    <span>
      <div class="circulo" style="background-color:lime" />
      Sanos
    </span>
    <span>
      <div class="circulo" style="background-color:orange" />
      Enfermos
    </span>
    <span>
      <div class="circulo" style="background-color:cyan" />
      Recuperados &nbsp;<span style="font-size:x-small">
        (enfermaron y sobrevivieron)</span
      >
    </span>
    <span>
      <div class="circulo" style="background-color:black" />
      Muertos
    </span>
  </div>
  <h4>
    En el modo zombie los muertos se mueven y contagian a otros individuos
  </h4>
</div>

<style>
  .circulo {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    border: 1px solid;
    display: inline-block;
  }

  .topcorner {
    position: absolute;
    top: 0;
    right: 0;
    margin-top: 12px;
    margin-right: 12px;
    width: 250px;
    min-height: 250px;
    background-color: whitesmoke;
    color: black;
    border: 2px solid tomato;
    border-radius: 25px;
    padding: 15px;
    text-align: justify;
  }

  .spans {
    display: flex;
    flex-direction: column;
  }

  .topcorner h2,
  h3 {
    text-align: center;
  }

  #contenedor {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    border: 2px solid #001219;
    padding: 10px;
    border-radius: 15px;
  }

  #panel {
    display: flex;
    flex-direction: column;
    width: 800px;
    background-color: #e63946;
    padding: 10px;
    border: 1px solid #fb8500;
    border-radius: 10px;
    font-size: x-small;
    margin-top: 20px;
    color: lightyellow;
  }

  #rangos {
    display: flex;
    justify-content: space-between;
  }

  #panel label {
    text-align: center;
  }

  .clsmodozombie {
    padding-top: 20px;
  }

  #btnReinicia {
    background-color: #fb8500;
    color: lightyellow;
    font-size: medium;
    border-radius: 25px;
    margin-top: 15px;
  }

  .numeralia {
    display: flex;
    width: 800px;
    justify-content: space-between;
    margin-top: 20px;
  }
  .numeralia span {
    background-color: #001219;
    color: #e9d8a6;
    padding: 5px;
    border-radius: 5px;
  }

  .numeralia2 {
    font-size: smaller;
  }
</style>
