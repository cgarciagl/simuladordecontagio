import { writable } from "svelte/store";

export let modozombie = writable(false);

export let poblacion = writable(200);
export let encuarentena = writable(20);
export let mortalidad = writable(50);
export let tiempoenfermedad = writable(150);
export let gp5 = writable({});
export let terminado = writable(false);

export let contadores = writable({});
export let personas = writable([]);
