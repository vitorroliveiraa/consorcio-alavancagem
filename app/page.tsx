'use client'

import { useState, useMemo } from 'react'
import { InputForm } from '@/components/simulator/input-form'
import { ResultsTable } from '@/components/simulator/results-table'
import { Charts } from '@/components/simulator/charts'
import { SummaryCards } from '@/components/simulator/summary-cards'
import { calcularComparacao } from '@/lib/calculos'
import type { ConsorcioInputs, LanceConfig, TipoParcela } from '@/lib/types'
import { Calculator, BarChart3 } from 'lucide-react'

const defaultInputs: ConsorcioInputs = {
  valorCredito: 300000,
  parcelaReduzida: 1500,
  parcelaPosContemplacao: 3500,
  prazoTotal: 200,
  taxaAdministracao: 15,
  indiceCorrecao: 5,
  percentualRecompra: 30,
  modalidade: 'sorteio',
  parcelasEmbutidas: 24,
  percentualDescontoLance: 10,
}

const defaultLanceConfig: LanceConfig = {
  valorLance: 21110.03,
  tipoLance: 'dividido',
  valorPago: 10555.01,
  valorEmbutido: 10555.02,
}

export default function SimuladorPage() {
  const [inputs, setInputs] = useState<ConsorcioInputs>(defaultInputs)
  const [tipoParcela, setTipoParcela] = useState<TipoParcela>('reduzida')
  const [lanceConfig, setLanceConfig] = useState<LanceConfig>(defaultLanceConfig)

  const resultados = useMemo(() => {
    if (
      inputs.valorCredito > 0 &&
      inputs.parcelaReduzida > 0 &&
      inputs.prazoTotal > 0 &&
      inputs.percentualRecompra > 0
    ) {
      return calcularComparacao(inputs, tipoParcela, lanceConfig)
    }
    return null
  }, [inputs, tipoParcela, lanceConfig])

  const hasValidInputs = resultados !== null

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 rounded-lg bg-primary/10">
                <Calculator className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              </div>
              <div>
                <h1 className="text-sm sm:text-lg font-semibold text-foreground">Simulador de Consorcio</h1>
                <p className="text-[10px] sm:text-xs text-muted-foreground">Analise de cenarios e alavancagem</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="hidden md:flex items-center gap-1.5 text-xs text-muted-foreground bg-secondary/50 px-3 py-1.5 rounded-full">
                <BarChart3 className="h-3.5 w-3.5" />
                <span>Projecao Deterministica</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-[1600px] mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
        <div className="grid lg:grid-cols-[380px_1fr] gap-4 sm:gap-6 items-start">
          {/* Left Column - Inputs (sticky on desktop only) */}
          <aside className="lg:sticky lg:top-[97px]">
            <InputForm inputs={inputs} onChange={setInputs} />
          </aside>

          {/* Right Column - Results */}
          <section className="space-y-4 sm:space-y-6 min-w-0">
            {hasValidInputs ? (
              <>
                {/* Summary Cards */}
                <SummaryCards resultados={resultados} />

                {/* Charts */}
                <Charts resultados={resultados} />

                {/* Data Table */}
                <ResultsTable
                  resultados={resultados}
                  inputs={inputs}
                  tipoParcela={tipoParcela}
                  onTipoParcelaChange={setTipoParcela}
                  lanceConfig={lanceConfig}
                  onLanceConfigChange={setLanceConfig}
                />
              </>
            ) : (
              <div className="flex items-center justify-center h-[400px] rounded-lg border border-dashed border-border bg-card/50">
                <div className="text-center space-y-2">
                  <Calculator className="h-12 w-12 text-muted-foreground/30 mx-auto" />
                  <p className="text-sm text-muted-foreground">
                    Preencha os dados do consorcio para visualizar os resultados
                  </p>
                  <p className="text-xs text-muted-foreground/70">
                    Valores necessarios: Credito, Parcela Reduzida, Prazo e % Recompra
                  </p>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border bg-card/30 mt-auto">
        <div className="max-w-[1600px] mx-auto px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
          <p className="text-[10px] sm:text-xs text-muted-foreground text-center">
            Este simulador apresenta cenarios de forma deterministica. Os resultados sao projecoes
            matematicas baseadas nos inputs fornecidos, nao garantias de retorno.
          </p>
        </div>
      </footer>
    </main>
  )
}
