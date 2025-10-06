
export class Tarea {
  titulo: string;
  descripcion: string;
  estado: number;
  dificultad: number;
  vencimiento: string;
  creacion: string;
  ultimaEdicion: string;

  constructor(
    titulo: string,
    descripcion = "",
    estado = 0,
    dificultad = 1,
    vencimiento = "",
    creacion = "",
    ultimaEdicion = ""
  ) {
    this.titulo = titulo;
    this.descripcion = descripcion;
    this.estado = estado;
    this.dificultad = dificultad;
    this.vencimiento = vencimiento;
    this.creacion = creacion;
    this.ultimaEdicion = ultimaEdicion;
  }
}


export function obtenerEstado(estado: number): string {
  return ["Pendiente", "En curso", "Terminada", "Cancelada"][estado] || "Sin Datos";
}

export function obtenerDificultad(dificultad: number): string {
  return { 1: "⭐", 2: "⭐⭐", 3: "⭐⭐⭐" }[dificultad] || "Sin Datos";
}
