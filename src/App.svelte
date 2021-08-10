<script>
  import Topcorner from "./Topcorner.svelte";
  import Numeralia from "./Numeralia.svelte";
  import DataViz from "./DataViz.svelte";
</script>

<div id="contenedor">
  <DataViz />
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
