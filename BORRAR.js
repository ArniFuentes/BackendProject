const test = "hola_que_tal";

// Encontrar la posición del segundo guion bajo '_'
const primerGuionBajoIndex = test.indexOf('_');
const segundoGuionBajoIndex = test.indexOf('_', primerGuionBajoIndex + 1);

// Obtener las dos partes de la cadena
const primeraParte = test.substring(0, segundoGuionBajoIndex); // Excluyendo el segundo guion bajo '_'
const segundaParte = test.substring(segundoGuionBajoIndex + 1);

console.log(primeraParte); // Esto imprimirá "hola_que"
console.log(segundaParte); // Esto imprimirá "tal"
