
import * as readline from "readline";
import { Tarea, obtenerEstado, obtenerDificultad } from "./Tarea";

export const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});


export let tareas: Tarea[] = [
  new Tarea("Aprender HTML", "Es el primer paso en el camino a convertirme en web dev.", 0, 2, "30/06/2023", "07/06/2023", "07/06/2023"),
  new Tarea("Aprender CSS", "", 0),
  new Tarea("Aprender JavaScript", "", 1),
  new Tarea("Aprender React", "", 1),
  new Tarea("Revisar roadmap.sh", "", 2)
];


export function mostrarMenu() {
  console.log("\nHola Olivia!\n");
  console.log("Que deseas hacer?\n");
  console.log("[1] Ver Mis Tareas.");
  console.log("[2] Buscar una Tarea.");
  console.log("[3] Agregar una Tarea.");
  console.log("[0] Salir.\n");
}

export function mostrarMenuVerTareas() {
  console.log("\nQue tareas deseas ver?\n");
  console.log("[1] Todas");
  console.log("[2] Pendientes");
  console.log("[3] En curso");
  console.log("[4] Terminadas");
  console.log("[0] Volver\n");
}

export function mostrarListadoTareas(lista: Tarea[], callback: () => void) {
  if (lista.length === 0) {
    console.log("\nNo hay tareas para mostrar.");
    return callback();
  }

  console.log("\nEstas son tus tareas:\n");
  lista.forEach((t, i) => console.log(`[${i + 1}] ${t.titulo}`));

  rl.question("\nDeseas ver los detalles de alguna? (0 para volver)\n> ", (op) => {
    let n = parseInt(op);
    if (n === 0) return callback();
    if (n > 0 && n <= lista.length) {
      mostrarDetallesTarea(lista[n - 1], callback);
    } else {
      console.log("Numero fuera de rango.");
      mostrarListadoTareas(lista, callback);
    }
  });
}

export function mostrarDetallesTarea(tarea: Tarea, callback: () => void) {
  console.log(`\nTarea seleccionada:\n`);
  console.log(`  ${tarea.titulo}`);
  console.log(`  ${tarea.descripcion || "[Sin descripcion]"}`);
  console.log(`  Estado: ${obtenerEstado(tarea.estado)}`);
  console.log(`  Dificultad: ${obtenerDificultad(tarea.dificultad)}`);
  console.log(`  Vencimiento: ${tarea.vencimiento || "Sin Datos"}`);
  console.log(`  Creacion: ${tarea.creacion || "Sin Datos"}`);
  console.log(`  Ultima edicion: ${tarea.ultimaEdicion || "Sin Datos"}`);

  rl.question("\nEditar (E) o volver (0)?\n> ", (op) => {
    if (op.toLowerCase() === "e") editarTarea(tarea, callback);
    else callback();
  });
}

export function editarTarea(tarea: Tarea, callback: () => void) {
  console.log(`\nEditando tarea: ${tarea.titulo}\n`);
  console.log("- Deja en blanco para mantener.");
  console.log("- Escribe un solo espacio para vaciar el campo.\n");

  rl.question("1. Descripcion:\n> ", (desc) => {
    if (desc.length > 0) {
      tarea.descripcion = (desc === " ") ? "" : desc;
    }

    rl.question("2. Estado ([P]/[E]/[T]/[C]):\n> ", (estado) => {
      if (estado) {
        let e = estado.toLowerCase();
        if (e === "p") tarea.estado = 0;
        else if (e === "e") tarea.estado = 1;
        else if (e === "t") tarea.estado = 2;
        else if (e === "c") tarea.estado = 3;
      }

      rl.question("3. Dificultad (1-3):\n> ", (dif) => {
        let d = parseInt(dif);
        if (d >= 1 && d <= 3) tarea.dificultad = d;

        rl.question("4. Vencimiento (dd/mm/aaaa):\n> ", (venc) => {
          if (venc.length > 0) {
            tarea.vencimiento = (venc === " ") ? "" : venc;
          }
          tarea.ultimaEdicion = new Date().toLocaleDateString("es-AR");
          console.log("\nDatos guardados!");
          callback();
        });
      });
    });
  });
}

export function verMisTareas(callback: () => void) {
  mostrarMenuVerTareas();
  rl.question("> ", (op) => {
    switch (op) {
      case "1":
        mostrarListadoTareas(tareas, () => verMisTareas(callback));
        break;
      case "2":
        mostrarListadoTareas(tareas.filter(t => t.estado === 0), () => verMisTareas(callback));
        break;
      case "3":
        mostrarListadoTareas(tareas.filter(t => t.estado === 1), () => verMisTareas(callback));
        break;
      case "4":
        mostrarListadoTareas(tareas.filter(t => t.estado === 2), () => verMisTareas(callback));
        break;
      case "0":
        callback();
        break;
      default:
        console.log("Opcion invalida.");
        verMisTareas(callback);
    }
  });
}

export function buscarTareaPorTitulo(callback: () => void) {
  rl.question("\nBuscar titulo:\n> ", (clave) => {
    let resultados = tareas.filter(t => t.titulo.toLowerCase().includes(clave.toLowerCase()));
    if (resultados.length === 0) {
      console.log("\nNo hay coincidencias.");
      return callback();
    }
    mostrarListadoTareas(resultados, callback);
  });
}

export function agregarTarea(callback: () => void) {
  let nueva = new Tarea("");
  rl.question("1. Titulo: ", (titulo) => {
    nueva.titulo = titulo;

    rl.question("2. Descripcion: ", (desc) => {
      nueva.descripcion = desc;

      rl.question("3. Estado ([P]/[E]/[T]/[C]): ", (estado) => {
        nueva.estado = { p: 0, e: 1, t: 2, c: 3 }[estado.toLowerCase()] ?? 0;

        rl.question("4. Dificultad (1-3): ", (dif) => {
          let d = parseInt(dif);
          nueva.dificultad = (d >= 1 && d <= 3) ? d : 1;

          rl.question("5. Vencimiento (dd/mm/aaaa): ", (venc) => {
            nueva.vencimiento = venc;
            let hoy = new Date().toLocaleDateString("es-AR");
            nueva.creacion = hoy;
            nueva.ultimaEdicion = hoy;

            if (tareas.length < 100) {
              tareas.push(nueva);
              console.log("\nDatos guardados!");
            } else {
              console.log("\nNo se pueden agregar mas tareas.");
            }
            callback();
          });
        });
      });
    });
  });
}


export function loopMenu() {
  mostrarMenu();
  rl.question("> ", (op) => {
    switch (op) {
      case "1":
        verMisTareas(loopMenu);
        break;
      case "2":
        buscarTareaPorTitulo(loopMenu);
        break;
      case "3":
        agregarTarea(loopMenu);
        break;
      case "0":
        console.log("Saliendo...");
        rl.close();
        break;
      default:
        console.log("Opcion invalida.");
        loopMenu();
    }
  });
}
