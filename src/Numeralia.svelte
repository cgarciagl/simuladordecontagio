<script>
  import { slide } from "svelte/transition";
  import { Persona } from "./Persona.js";
  import {
    modozombie,
    poblacion,
    mortalidad,
    tiempoenfermedad,
    encuarentena,
    terminado,
    contadores,
    personas,
    gp5,
  } from "./Datos.js";

  function Reinicia() {
    if ($gp5) {
      while ($personas.length > 0) {
        $personas.pop();
      }
      for (let i = 1; i <= $poblacion; i++) {
        $personas.push(
          new Persona($gp5.random($gp5.width - 10), $gp5.random(390), $gp5)
        );
      }
      $personas[0].estado = "enfermo";
      //ponemos personas en cuarentena..
      for (let i = 1; i <= ($encuarentena * $poblacion) / 100; i++) {
        $personas[i].movible = false;
      }
    }
    $terminado = false;
  }
</script>

<div class="numeralia">
  <span>😀 Sanos: <strong>{$contadores.sanos}</strong></span>
  <span>🤒 Enfermos: <strong>{$contadores.enfermos}</strong></span>
  <span>😷 Recuperados: <strong>{$contadores.recuperados}</strong></span>
  <span>💀 Fallecidos: <strong>{$contadores.muertos}</strong></span>
</div>

{#if $terminado}
  <div id="panel" transition:slide>
    <h2>Simulación terminada 💻</h2>
    <div id="rangos">
      <label>
        Población: <br /><input
          type="range"
          min="50"
          max="700"
          step="1"
          bind:value={$poblacion}
        /><br />
        👨‍👩‍👧‍👦 {$poblacion} Personas
      </label>

      <label>
        En Cuarentena: <br />
        <input
          type="range"
          min="0"
          max="90"
          step="1"
          bind:value={$encuarentena}
        /><br />
        🏡 {$encuarentena} %
      </label>
      <label>
        Mortalidad: <br />
        <input
          type="range"
          min="0"
          max="100"
          step="1"
          bind:value={$mortalidad}
        /><br />
        ☠ {$mortalidad} %
      </label>
      <label>
        Tiempo Enfermo: <br />
        <input
          type="range"
          min="100"
          max="1000"
          step="1"
          bind:value={$tiempoenfermedad}
        /><br />
        🔁 {$tiempoenfermedad} ciclos
      </label>

      <label class="clsmodozombie">
        <input type="checkbox" bind:checked={$modozombie} />
        🧟‍♂️ modo zombie
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
    <span>👨‍👨‍👧‍👦 Población: <strong>{$poblacion} personas </strong></span>
    <span>🏡 En cuarentena: <strong>{$encuarentena}% </strong></span>
    <span>☠ Mortalidad: <strong>{$mortalidad}% </strong></span>
    <span>🔁 Tiempo Enfermo: <strong>{$tiempoenfermedad} ciclos </strong></span>
    {#if $modozombie}
      <span style="color:red;"><strong>Modo Zombie Activo 🧟‍♂️</strong></span>
    {/if}
  </div>
{/if}

<style>
  #panel {
    display: flex;
    flex-direction: column;
    max-width: 800px;
    width: 95%;
    background-color: #e63946;
    padding: 10px;
    border: 1px solid #fb8500;
    border-radius: 10px;
    margin-top: 20px;
    color: lightyellow;
  }

  #rangos {
    display: flex;
    justify-content: space-between;
  }

  #panel label {
    text-align: center;
    font-size: medium;
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
    max-width: 800px;
    width: 100%;
    justify-content: space-between;
    margin-top: 20px;
  }
  .numeralia span {
    background-color: #001219;
    color: #e9d8a6;
    padding: 5px;
    border-radius: 5px;
  }

  button {
    font-family: inherit;
    font-size: inherit;
    -webkit-padding: 0.4em 0;
    padding: 0.4em;
    margin: 0 0 0.5em 0;
    box-sizing: border-box;
    border: 1px solid #ccc;
    border-radius: 2px;
  }

  button {
    color: #333;
    background-color: #f4f4f4;
    outline: none;
  }

  @media (max-width: 800px) {
    #rangos,
    .numeralia {
      flex-direction: column;
    }

    #rangos label {
      font-size: small;
    }

    #rangos label br {
      display: none;
    }

    #rangos label input {
      vertical-align: middle;
    }
  }
</style>
