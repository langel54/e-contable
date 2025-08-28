function formatearMoneda(numero) {
  console.log("🚀 ~ formatearMoneda ~ numero:", numero);
  return numero.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
module.exports = formatearMoneda;
