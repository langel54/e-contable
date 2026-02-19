
export function numeroAFormatoContable(numero) {
    const unidades = [
        "",
        "uno",
        "dos",
        "tres",
        "cuatro",
        "cinco",
        "seis",
        "siete",
        "ocho",
        "nueve",
    ];
    const decenas = [
        "",
        "diez",
        "veinte",
        "treinta",
        "cuarenta",
        "cincuenta",
        "sesenta",
        "setenta",
        "ochenta",
        "noventa",
    ];
    const centenas = [
        "",
        "ciento",
        "doscientos",
        "trescientos",
        "cuatrocientos",
        "quinientos",
        "seiscientos",
        "setecientos",
        "ochocientos",
        "novecientos",
    ];
    const especiales = {
        10: "diez",
        11: "once",
        12: "doce",
        13: "trece",
        14: "catorce",
        15: "quince",
        16: "dieciséis",
        17: "diecisiete",
        18: "dieciocho",
        19: "diecinueve",
        20: "veinte",
    };

    const enLetras = (n, isSubunit = false) => {
        if (n === 0) return "cero";
        if (especiales[n]) return especiales[n];
        if (n < 10) return unidades[n];
        if (n < 30) {
            const base = [
                "veintiuno",
                "veintidós",
                "veintitrés",
                "veinticuatro",
                "veinticinco",
                "veintiséis",
                "veintisiete",
                "veintiocho",
                "veintinueve",
            ];
            return base[n - 21];
        }
        if (n < 100) {
            const d = Math.floor(n / 10);
            const u = n % 10;
            return decenas[d] + (u > 0 ? " y " + unidades[u] : "");
        }
        if (n < 1000) {
            if (n === 100) return "cien";
            const c = Math.floor(n / 100);
            const resto = n % 100;
            return centenas[c] + (resto > 0 ? " " + enLetras(resto, true) : "");
        }
        if (n < 1000000) {
            const miles = Math.floor(n / 1000);
            const resto = n % 1000;
            let milesTexto = "";

            if (miles === 1) {
                milesTexto = "mil";
            } else {
                let textoMiles = enLetras(miles, true);
                if (textoMiles.endsWith("uno"))
                    textoMiles = textoMiles.replace(/uno$/, "un");
                milesTexto = textoMiles + " mil";
            }

            return milesTexto + (resto > 0 ? " " + enLetras(resto, true) : "");
        }

        const millones = Math.floor(n / 1000000);
        const resto = n % 1000000;

        let millonesTexto = "";
        if (millones === 1) {
            millonesTexto = "un millón";
        } else {
            let textoMillones = enLetras(millones, true);
            if (textoMillones.endsWith("uno"))
                textoMillones = textoMillones.replace(/uno$/, "un");
            millonesTexto = textoMillones + " millones";
        }

        return millonesTexto + (resto > 0 ? " " + enLetras(resto, true) : "");
    };

    // Handling standard number input or string
    const numStr = typeof numero === 'number' ? numero.toFixed(2) : String(numero);

    const [enteroStr, decimalStr] = numStr.split(".");
    const entero = parseInt(enteroStr, 10);
    const textoEntero = enLetras(entero).toUpperCase();
    const textoDecimal = decimalStr ? `${decimalStr}/100` : "00/100";

    return `${textoEntero} CON ${textoDecimal} SOLES`;
}

export function formatearMoneda(numero) {
    if (numero === undefined || numero === null) return "0.00";
    // Convert to string formatted with 2 decimals
    const num = parseFloat(numero).toFixed(2);
    return num.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
