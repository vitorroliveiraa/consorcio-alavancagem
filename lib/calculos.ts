import type {
  ConsorcioInputs,
  ResultadoMensal,
  ResultadosComparacao,
  Modalidade,
  LanceConfig,
  TipoParcela,
} from './types'

export function calcularResultadosMensaisSorteio(
  inputs: ConsorcioInputs,
  tipoParcela: TipoParcela = 'reduzida'
): ResultadoMensal[] {
  const resultados: ResultadoMensal[] = []
  const parcelaBase = tipoParcela === 'reduzida' ? inputs.parcelaReduzida : inputs.parcelaPosContemplacao
  const inccAnual = inputs.indiceCorrecao / 100

  // Aplica a taxa de administração ao valor do crédito, se preenchida
  const creditoComTaxa = inputs.taxaAdministracao > 0
    ? inputs.valorCredito * (1 + inputs.taxaAdministracao / 100)
    : inputs.valorCredito

  let totalAcumulado = 0
  let parcelaAtual = parcelaBase
  let creditoAtual = creditoComTaxa

  for (let mes = 1; mes <= inputs.prazoTotal; mes++) {
    // Reajuste INCC no primeiro mês de cada ano (a cada 12 meses)
    const anoReajuste = mes > 1 && (mes - 1) % 12 === 0
    if (anoReajuste) {
      parcelaAtual = parcelaAtual * (1 + inccAnual)
      creditoAtual = creditoAtual * (1 + inccAnual)
    }

    totalAcumulado += parcelaAtual
    const valorRecompra = creditoAtual * (inputs.percentualRecompra / 100)
    const lucroLiquido = valorRecompra - totalAcumulado
    const roi = totalAcumulado > 0 ? (lucroLiquido / totalAcumulado) * 100 : 0

    resultados.push({
      mes,
      parcela: parcelaAtual,
      totalInvestido: totalAcumulado,
      creditoLiquido: creditoAtual,
      valorRecompra,
      lucroLiquido,
      roi,
      anoReajuste,
    })
  }

  return resultados
}

export function calcularResultadosMensaisLanceFixo(
  inputs: ConsorcioInputs,
  lanceConfig: LanceConfig
): ResultadoMensal[] {
  const resultados: ResultadoMensal[] = []
  const inccAnual = inputs.indiceCorrecao / 100

  // Aplica a taxa de administração ao valor do crédito, se preenchida
  const creditoComTaxa = inputs.taxaAdministracao > 0
    ? inputs.valorCredito * (1 + inputs.taxaAdministracao / 100)
    : inputs.valorCredito

  // Calcular crédito líquido inicial baseado no tipo de lance
  let creditoInicial: number
  let investimentoInicial: number

  switch (lanceConfig.tipoLance) {
    case 'embutido':
      // Lance totalmente embutido: deduz do crédito, não investe dinheiro próprio
      creditoInicial = creditoComTaxa - lanceConfig.valorLance
      investimentoInicial = 0
      break
    case 'pago':
      // Lance pago com dinheiro próprio: crédito integral, investe o valor do lance
      creditoInicial = creditoComTaxa
      investimentoInicial = lanceConfig.valorLance
      break
    case 'dividido':
      // Lance dividido: parte embutida deduz do crédito, parte paga é investimento
      creditoInicial = creditoComTaxa - lanceConfig.valorEmbutido
      investimentoInicial = lanceConfig.valorPago
      break
  }

  let totalAcumulado = investimentoInicial
  let parcelaAtual = inputs.parcelaReduzida
  let creditoAtual = creditoInicial

  for (let mes = 1; mes <= inputs.prazoTotal; mes++) {
    // Reajuste INCC no primeiro mês de cada ano (a cada 12 meses)
    const anoReajuste = mes > 1 && (mes - 1) % 12 === 0
    if (anoReajuste) {
      parcelaAtual = parcelaAtual * (1 + inccAnual)
      creditoAtual = creditoAtual * (1 + inccAnual)
    }

    totalAcumulado += parcelaAtual
    const valorRecompra = creditoAtual * (inputs.percentualRecompra / 100)
    const lucroLiquido = valorRecompra - totalAcumulado
    const roi = totalAcumulado > 0 ? (lucroLiquido / totalAcumulado) * 100 : 0

    resultados.push({
      mes,
      parcela: parcelaAtual,
      totalInvestido: totalAcumulado,
      creditoLiquido: creditoAtual,
      valorRecompra,
      lucroLiquido,
      roi,
      anoReajuste,
    })
  }

  return resultados
}

export function encontrarPontoVirada(resultados: ResultadoMensal[]): number | null {
  let roiMaximo = -Infinity
  let mesPico = 0

  for (let i = 0; i < resultados.length; i++) {
    if (resultados[i].roi > roiMaximo) {
      roiMaximo = resultados[i].roi
      mesPico = resultados[i].mes
    }
  }

  for (let i = mesPico; i < resultados.length; i++) {
    const quedaPercentual = ((roiMaximo - resultados[i].roi) / roiMaximo) * 100
    if (quedaPercentual > 10 && resultados[i].roi < roiMaximo) {
      return mesPico
    }
  }

  return mesPico > 0 ? mesPico : null
}

export function calcularComparacao(
  inputs: ConsorcioInputs,
  tipoParcela: TipoParcela = 'reduzida',
  lanceConfig: LanceConfig
): ResultadosComparacao {
  const resultadosSorteio = calcularResultadosMensaisSorteio(inputs, tipoParcela)
  const resultadosLanceFixo = calcularResultadosMensaisLanceFixo(inputs, lanceConfig)

  let melhorRoiSorteio = { mes: 0, valor: -Infinity }
  let melhorRoiLanceFixo = { mes: 0, valor: -Infinity }
  let melhorLucroSorteio = { mes: 0, valor: -Infinity }
  let melhorLucroLanceFixo = { mes: 0, valor: -Infinity }

  for (const r of resultadosSorteio) {
    if (r.roi > melhorRoiSorteio.valor) {
      melhorRoiSorteio = { mes: r.mes, valor: r.roi }
    }
    if (r.lucroLiquido > melhorLucroSorteio.valor) {
      melhorLucroSorteio = { mes: r.mes, valor: r.lucroLiquido }
    }
  }

  for (const r of resultadosLanceFixo) {
    if (r.roi > melhorRoiLanceFixo.valor) {
      melhorRoiLanceFixo = { mes: r.mes, valor: r.roi }
    }
    if (r.lucroLiquido > melhorLucroLanceFixo.valor) {
      melhorLucroLanceFixo = { mes: r.mes, valor: r.lucroLiquido }
    }
  }

  const melhorRoi =
    melhorRoiSorteio.valor >= melhorRoiLanceFixo.valor
      ? { modalidade: 'sorteio' as Modalidade, ...melhorRoiSorteio }
      : { modalidade: 'lance-fixo' as Modalidade, ...melhorRoiLanceFixo }

  const melhorLucro =
    melhorLucroSorteio.valor >= melhorLucroLanceFixo.valor
      ? { modalidade: 'sorteio' as Modalidade, ...melhorLucroSorteio }
      : { modalidade: 'lance-fixo' as Modalidade, ...melhorLucroLanceFixo }

  return {
    sorteio: resultadosSorteio,
    lancefixo: resultadosLanceFixo,
    melhorRoi,
    melhorLucro,
    pontoViradaSorteio: encontrarPontoVirada(resultadosSorteio),
    pontoViradaLanceFixo: encontrarPontoVirada(resultadosLanceFixo),
  }
}

export function formatarMoeda(valor: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(valor)
}

export function formatarPercentual(valor: number): string {
  return `${valor.toFixed(2)}%`
}
