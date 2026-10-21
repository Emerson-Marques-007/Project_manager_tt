import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { parseCsv, lerVinculos } from '../scripts/lib/clubes-ligas.mjs';

describe('parseCsv', () => {
  test('lê vírgula, aspas, "" escapado, CRLF e BOM', () => {
    const rows = parseCsv('\uFEFFID,NOME,PAIS\r\n290,"Corinthians, SP",Brasil\r\n294,"CR ""Fla""",Brasil\r\n');
    assert.deepEqual(rows[0], ['ID', 'NOME', 'PAIS']);
    assert.deepEqual(rows[1], ['290', 'Corinthians, SP', 'Brasil']);
    assert.deepEqual(rows[2], ['294', 'CR "Fla"', 'Brasil']);
  });

  test('detecta ponto e vírgula e ignora linhas vazias', () => {
    const rows = parseCsv('ID;LIGA\n1;14\n\n2;14\n');
    assert.equal(rows.length, 3);
    assert.deepEqual(rows[2], ['2', '14']);
  });
});

describe('lerVinculos', () => {
  test('usa cabeçalhos com acento e caixa diferentes', () => {
    const r = lerVinculos('ID,Liga,Nome,País\n290,14,Corinthians,Brasil\n300,14,Palmeiras,Brasil');
    assert.equal(r.modo, 'por cabeçalho');
    assert.deepEqual(r.vinculos[0], { clubeId: '290', ligaId: '14', pais: 'Brasil' });
    assert.equal(r.vinculos.length, 2);
  });

  test('aceita ids como 290.0 e ignora linhas sem id válido', () => {
    const r = lerVinculos('ID,LIGA\n290.0,14\n,14\nabc,14\n5,\n');
    assert.deepEqual(r.vinculos, [{ clubeId: '290', ligaId: '14', pais: '' }]);
    assert.equal(r.ignoradas, 3);
  });

  test('clube repetido: vale a última linha', () => {
    const r = lerVinculos('ID,LIGA\n290,14\n290,15');
    assert.equal(r.vinculos.length, 1);
    assert.equal(r.vinculos[0].ligaId, '15');
  });

  test('sem cabeçalho usa a ordem da planilha (col. 0 = clube, 1 = liga, 26 = país)', () => {
    const linha = (id, liga, pais) => { const c = new Array(27).fill(''); c[0] = id; c[1] = liga; c[26] = pais; return c.join(','); };
    const r = lerVinculos(linha(290, 14, 'Brasil') + '\n' + linha(300, 14, 'Brasil'));
    assert.equal(r.modo, 'posicional (sem cabeçalho)');
    assert.deepEqual(r.vinculos[1], { clubeId: '300', ligaId: '14', pais: 'Brasil' });
  });

  test('erro claro quando faltam as colunas, mostrando os cabeçalhos lidos', () => {
    assert.throws(() => lerVinculos('NOME,COR\nFoo,verde'), /Cabeçalhos lidos: NOME \| COR/);
  });

  test('arquivo vazio gera erro', () => {
    assert.throws(() => lerVinculos(''), /vazio/);
  });
});
