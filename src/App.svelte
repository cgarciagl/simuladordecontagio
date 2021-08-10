<script>
  import P5 from "p5-svelte";
  import Topcorner from "./Topcorner.svelte";
  import Numeralia from "./Numeralia.svelte";
  import { Persona } from "./Persona.js";
  import {
    poblacion,
    encuarentena,
    terminado,
    gp5,
    contadores,
    personas,
  } from "./Datos.js";

  function checarColisiones() {
    const r = new Rectangle(400, 250, 800, 500);
    const capacity = 4;
    const quadtree = new QuadTree(r, capacity);
    $personas.forEach(function (value1, i) {
      let p = new Point(value1.pos.x, value1.pos.y, value1);
      quadtree.insert(p);
    });

    $personas.forEach(function (value1, i) {
      let c = new Circle(value1.pos.x, value1.pos.y, 10);
      let puntos = quadtree.query(c);

      puntos.forEach(function (punto, i) {
        let value2 = punto.userData;
        if (value2 != value1) {
          value1.colisiona(value2);
        }
      });
    });
  }

  function actualizaContadores() {
    $contadores = {
      enfermos: 0,
      sanos: 0,
      muertos: 0,
      recuperados: 0,
    };
    $personas.forEach(function (value, index) {
      value.update();
      $contadores[value.estado + "s"]++;
    });
    if ($contadores.enfermos == 0) {
      $terminado = true;
    }
  }

  const sketch = (p5) => {
    function Inicializa() {
      for (let i = 1; i <= $poblacion; i++) {
        $personas.push(new Persona(p5.random(700), p5.random(390), p5));
      }
      $personas[0].estado = "enfermo";
      //ponemos personas en cuarentena..
      for (let i = 1; i <= ($encuarentena * $poblacion) / 100; i++) {
        $personas[i].movible = false;
      }
    }

    p5.setup = () => {
      p5.createCanvas(800, 500);
      $gp5 = p5;
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
      let prop = ($contadores.enfermos / $poblacion) * 100;
      let ult = p5.height - prop;
      p5.line(i, ult, i, p5.height);
      p5.stroke("cyan"); //lightblue
      prop = ($contadores.recuperados / $poblacion) * 100;
      p5.line(i, ult - prop, i, ult);
      ult = ult - prop;
      p5.stroke("black"); //black
      prop = ($contadores.muertos / $poblacion) * 100;
      p5.line(i, ult - prop, i, ult);
      ult = ult - prop;
      p5.stroke("lime"); //lime
      prop = ($contadores.sanos / $poblacion) * 100;
      p5.line(i, ult - prop, i, ult);
      ult = ult - prop;

      p5.strokeWeight(1);
      p5.stroke("black");
    }
  };
</script>

<div id="contenedor">
  <P5 {sketch} />
  <Numeralia />
</div>

<Topcorner />

<style>
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
</style>
