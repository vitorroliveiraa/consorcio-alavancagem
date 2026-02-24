'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, Target, Clock, ArrowUpRight } from 'lucide-react'
import type { ResultadosComparacao } from '@/lib/types'
import { formatarMoeda, formatarPercentual } from '@/lib/calculos'

interface SummaryCardsProps {
  resultados: ResultadosComparacao
}

export function SummaryCards({ resultados }: SummaryCardsProps) {
  const { melhorRoi, melhorLucro, sorteio, lancefixo } = resultados

  // Average ROI over first 12 months
  const avgRoiSorteio =
    sorteio.slice(0, 12).reduce((acc, r) => acc + r.roi, 0) / Math.min(12, sorteio.length)
  const avgRoiLanceFixo =
    lancefixo.slice(0, 12).reduce((acc, r) => acc + r.roi, 0) / Math.min(12, lancefixo.length)

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
      {/* Melhor ROI */}
      <Card>
        <CardContent className="pt-3 sm:pt-4 px-3 sm:px-6">
          <div className="flex items-center gap-2 mb-1.5 sm:mb-2">
            <div className="p-1 sm:p-1.5 rounded-md bg-success/10">
              <TrendingUp className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-success" />
            </div>
            <span className="text-[10px] sm:text-xs text-muted-foreground">Melhor ROI</span>
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-base sm:text-lg font-semibold text-success font-mono">
              {formatarPercentual(melhorRoi.valor)}
            </p>
            <ArrowUpRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-success" />
          </div>
          <Badge variant="secondary" className="mt-1 text-[10px] sm:text-xs">
            {melhorRoi.modalidade === 'sorteio' ? 'Sorteio' : 'Lance Fixo'} - Mes {melhorRoi.mes}
          </Badge>
        </CardContent>
      </Card>

      {/* Maior Lucro */}
      <Card>
        <CardContent className="pt-3 sm:pt-4 px-3 sm:px-6">
          <div className="flex items-center gap-2 mb-1.5 sm:mb-2">
            <div className="p-1 sm:p-1.5 rounded-md bg-primary/10">
              <Target className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />
            </div>
            <span className="text-[10px] sm:text-xs text-muted-foreground">Maior Lucro</span>
          </div>
          <p className="text-base sm:text-lg font-semibold text-foreground font-mono">
            {formatarMoeda(melhorLucro.valor)}
          </p>
          <Badge variant="secondary" className="mt-1 text-[10px] sm:text-xs">
            {melhorLucro.modalidade === 'sorteio' ? 'Sorteio' : 'Lance Fixo'} - Mes {melhorLucro.mes}
          </Badge>
        </CardContent>
      </Card>

      {/* ROI Medio 12 meses */}
      <Card>
        <CardContent className="pt-3 sm:pt-4 px-3 sm:px-6">
          <div className="flex items-center gap-2 mb-1.5 sm:mb-2">
            <div className="p-1 sm:p-1.5 rounded-md bg-warning/10">
              <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-warning" />
            </div>
            <span className="text-[10px] sm:text-xs text-muted-foreground">ROI Medio (12m)</span>
          </div>
          <div className="flex items-center gap-3">
            <div>
              <p className="text-xs sm:text-sm font-semibold text-foreground font-mono">
                {formatarPercentual(avgRoiSorteio)}
              </p>
              <p className="text-[10px] sm:text-xs text-muted-foreground">Sorteio</p>
            </div>
            <div className="w-px h-6 sm:h-8 bg-border" />
            <div>
              <p className="text-xs sm:text-sm font-semibold text-foreground font-mono">
                {formatarPercentual(avgRoiLanceFixo)}
              </p>
              <p className="text-[10px] sm:text-xs text-muted-foreground">Lance Fixo</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
