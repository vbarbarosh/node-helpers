const assert = require('assert');
const sanitize_dash_name = require('./sanitize_dash_name');

const items = [
    ['', ''],
    ['', '.'],
    ['', 'привет'],
    ['1-2-3', '1-2-3'],
    ['1-2-3', '1.2.3'],
    ['1000-stories', '1000 Stories'],
    ['1800', '1800'],
    ['3-a', '3-A'],
    ['43', '43'],
    ['600-d', '600+D'],
    ['9-lives', '9 Lives'],
    ['a-c-d', 'A, C, D'],
    ['a-f', 'A F'],
    ['accua-aseptic-solucion', 'Accua Aséptic Solución'],
    ['acido-acetilsalicilico', 'Ácido Acetilsalicílico'],
    ['acido-nalidixico-fenazopiridina', 'Ácido Nalidixico-Fenazopiridina'],
    ['aeropostale', 'Aéropostale'],
    ['arnica-nartex', 'Árnica Nártex'],
    ['art-n-chef', 'Art \'n Chef'],
    ['b-a-r-t-e-r', 'B.A.R.T.E.R.'],
    ['b-oost', 'b:oost'],
    ['betametasona-clotrimazol-gentamicina', 'Betametasona - Clotrimazol - Gentamicina'],
    ['black-decker', 'Black & Decker'],
    ['black-decker', 'Black + Decker'],
    ['black-panther', 'Black Panther'],
    ['black-white', 'Black & White'],
    ['blanca-nieves', 'Blanca Nieves'],
    ['de-rancho', 'de Rancho'],
    ['del-valle', 'del Valle'],
    ['exportacion-selecto', 'Exportación Selecto'],
    ['extra', 'Extra'],
    ['ezetimiba-simvastatina', 'Ezetimiba Simvastatina'],
    ['facicam-gel-90g', 'FACICAM GEL 90G'],
    ['folios', 'FOLIOS'],
    ['fresh-garden', 'FRESH GARDEN'],
    ['gi-valproato-de-magnesio', '(GI) Valproato de Magnesio'],
    ['itrac-100mg-c-f-15c', 'ITRAC 100MG C/F 15C'],
    ['m-m-s', 'M&M\'s'],
    ['m-m-s', 'M&M´s'],
    ['meticel-0-5', 'Meticel 0.5 %'],
    ['meticel-2', 'Meticel 2%'],
    ['opera-prima', 'Ópera Prima'],
    ['oxido-de-zinc', 'Óxido de Zinc'],
    ['r-u-m-b-a', 'r u m b a'],
    ['r-u-m-b-a', 'r_u_m_b_a'],
    ['ssh-authorized-keys', '~/.\u0000ssh/authorized_keys";\n'],
];

describe('sanitize_dash_name', function () {
    items.forEach(function ([expected, input],) {
        it(`${input} → ${expected}`, function () {
            assert.deepStrictEqual(sanitize_dash_name(input), expected);
        });
    });
});
