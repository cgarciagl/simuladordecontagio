<script>
  import { slide } from "svelte/transition";
  let muestra = true;
</script>

<div class="topcorner">
  <span
    class="btncierra"
    on:click={() => {
      muestra = !muestra;
    }}
  >
    📕
  </span>
  {#if muestra}
    <div transition:slide>
      <h2>Simulador de contagios</h2>
      <p>
        En cada simulación se puede seleccionar: la población de individuos, el
        porcentaje de estos que se mantendrán en cuarentena (no se moverán), la
        tasa de mortalidad de la enfermedad y el tiempo que se mantendrán
        enfermos los individuos antes de recuperarse o morir
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
          Fallecidos
        </span>
      </div>
      <h4>
        En el modo zombie los muertos se mueven y contagian a otros individuos
      </h4>
    </div>
  {/if}
</div>

<style>
  .btncierra {
    float: right;
    cursor: pointer;
  }

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
    max-width: 250px;
    min-height: 25px;
    background-color: whitesmoke;
    color: black;
    border: 2px solid tomato;
    border-radius: 25px;
    padding: 15px;
    text-align: justify;
  }
  h2,
  h3 {
    text-align: center;
  }
  .spans {
    display: flex;
    flex-direction: column;
  }
</style>
