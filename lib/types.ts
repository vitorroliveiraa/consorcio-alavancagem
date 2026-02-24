export type Modalidade = 'sorteio' | 'lance-fixo'
export type TipoLance = 'embutido' | 'pago' | 'dividido'
export type TipoParcela = 'reduzida' | 'integral'

export interface ConsorcioInputs {
  valorCredito: number
  parcelaReduzida: number
  parcelaPosContemplacao: number
  prazoTotal: number
  taxaAdministracao: number
  indiceCorrecao: number
  percentualRecompra: number
  modalidade: Modalidade
  parcelasEmbutidas: number
  percentualDescontoLance: number
}

export interface LanceConfig {
  valorLance: number
  tipoLance: TipoLance
  valorPago: number
  valorEmbutido: number
}

export interface ResultadoMensal {
  mes: number
  parcela: number
  totalInvestido: number
  creditoLiquido: number
  valorRecompra: number
  lucroLiquido: number
  roi: number
  anoReajuste?: boolean
}

export interface ResultadosComparacao {
  sorteio: ResultadoMensal[]
  lancefixo: ResultadoMensal[]
  melhorRoi: {
    modalidade: Modalidade
    mes: number
    valor: number
  }
  melhorLucro: {
    modalidade: Modalidade
    mes: number
    valor: number
  }
  pontoViradaSorteio: number | null
  pontoViradaLanceFixo: number | null
}
