function formatearFecha(fechaObj: Date | string | number | null | undefined): string {
  // Acepta Date, string (parseable) o timestamp. Devuelve cadena vacía si la fecha no es válida.
  if (fechaObj === null || fechaObj === undefined) return '';

  const fecha = fechaObj instanceof Date ? fechaObj : new Date(fechaObj);
  if (isNaN(fecha.getTime())) return '';

  const anio = fecha.getFullYear();
  const mes = ('0' + (fecha.getMonth() + 1)).slice(-2);
  const dia = ('0' + fecha.getDate()).slice(-2);
  const hora = ('0' + fecha.getHours()).slice(-2);
  const minutos = ('0' + fecha.getMinutes()).slice(-2);

  return `${anio}-${mes}-${dia}T${hora}:${minutos}`;
}
function ahora(): Date {
  return new Date();
}

export { formatearFecha, ahora };
