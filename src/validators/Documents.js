import { EnumDocuments } from "../enums/document.js";

export function isValidCPF(cpf) {
    cpf = removeNonDigits(cpf);
    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
        return false;
    }

    function calculateDigit(cpf, factor) {
        let total = 0;
        for (let i = 0; i < factor - 1; i++) {
            total += parseInt(cpf[i]) * (factor - i);
        }
        let rest = (total * 10) % 11;
        return rest === 10 ? 0 : rest;
    }

    const digit1 = calculateDigit(cpf, 10);
    const digit2 = calculateDigit(cpf.slice(0, 9) + digit1, 11);

    return cpf.endsWith(digit1.toString() + digit2.toString());
}

export function isValidCNPJ(cnpj) {
    cnpj = removeNonDigits(cnpj);
    if (cnpj.length !== 14 || /^(\d)\1{13}$/.test(cnpj)) {
        return false;
    }

    function calculateDigit(cnpj, factors) {
        let total = 0;
        for (let i = 0; i < factors.length; i++) {
            total += parseInt(cnpj[i]) * factors[i];
        }
        let rest = total % 11;
        return rest < 2 ? 0 : 11 - rest;
    }

    const factors1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    const factors2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

    const digit1 = calculateDigit(cnpj.slice(0, 12), factors1);
    const digit2 = calculateDigit(cnpj.slice(0, 12) + digit1, factors2);

    return cnpj.endsWith(digit1.toString() + digit2.toString());
}

export function validaCpfOuCnpj(numero) {
    numero = removeNonDigits(numero);
    if (numero.length === 11) {
        return isValidCPF(numero) ? EnumDocuments.cpf : false;
    } else if (numero.length === 14) {
        return isValidCNPJ(numero) ? EnumDocuments.cnpj : false;
    } else {
        return false;
    }
}

export function removeNonDigits(number) {
    return number.replace(/\D/g, '');
}
