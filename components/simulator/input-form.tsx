'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { AlertCircle } from 'lucide-react'
import type { ConsorcioInputs } from '@/lib/types'

interface InputFormProps {
  inputs: ConsorcioInputs
  onChange: (inputs: ConsorcioInputs) => void
}

// Formata número para moeda brasileira em tempo real
// Os dois últimos dígitos são sempre centavos
// Ex: 8498400 -> "84.984,00"
function formatCurrencyLive(value: string): string {
  // Remove tudo que não é dígito
  const digits = value.replace(/\D/g, '')
  
  if (!digits) return ''
  
  // Converte para número (centavos)
  const cents = parseInt(digits, 10)
  
  // Divide por 100 para obter o valor real
  const reais = cents / 100
  
  // Formata com separadores brasileiros
  return reais.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

// Formata número para moeda brasileira (ex: 300000 -> "300.000,00")
function formatCurrency(value: number): string {
  if (!value) return ''
  return value.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

// Parseia string formatada para número (ex: "84.984,00" -> 84984)
function parseCurrencyToNumber(value: string): number {
  if (!value) return 0
  // Remove pontos de milhar e substitui vírgula por ponto
  const cleaned = value.replace(/\./g, '').replace(',', '.')
  return parseFloat(cleaned) || 0
}

export function InputForm({ inputs, onChange }: InputFormProps) {
  const handleChange = (field: keyof ConsorcioInputs, value: string | number) => {
    const numValue = typeof value === 'string' ? parseFloat(value) || 0 : value
    onChange({ ...inputs, [field]: numValue })
  }

  const handleCurrencyChange = (field: keyof ConsorcioInputs, value: string) => {
    // Formata em tempo real e atualiza o estado
    const formatted = formatCurrencyLive(value)
    const numValue = parseCurrencyToNumber(formatted)
    onChange({ ...inputs, [field]: numValue })
  }

  const getCurrencyDisplayValue = (field: keyof ConsorcioInputs): string => {
    const value = inputs[field] as number
    return value ? formatCurrency(value) : ''
  }

  return (
    <div className="space-y-4">
      {/* Dados do Consórcio */}
      <Card>
        <CardHeader className="pb-3 sm:pb-4 px-3 sm:px-6">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm sm:text-base">Dados do Consorcio</CardTitle>
            <Badge variant="outline" className="text-[10px] sm:text-xs">
              Fonte: CRM
            </Badge>
          </div>
          <CardDescription className="text-[10px] sm:text-sm">Valores vindos do sistema da administradora</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 sm:space-y-4 px-3 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="valorCredito">Valor do Crédito</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                  R$
                </span>
                <Input
                  id="valorCredito"
                  type="text"
                  inputMode="numeric"
                  className="pl-9"
                  value={getCurrencyDisplayValue('valorCredito')}
                  onChange={(e) => handleCurrencyChange('valorCredito', e.target.value)}
                  placeholder="0,00"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="prazoTotal">Prazo Total</Label>
              <div className="relative">
                <Input
                  id="prazoTotal"
                  type="number"
                  value={inputs.prazoTotal || ''}
                  onChange={(e) => handleChange('prazoTotal', e.target.value)}
                  placeholder="0"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                  meses
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="parcelaReduzida">Parcela Pré</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                  R$
                </span>
                <Input
                  id="parcelaReduzida"
                  type="text"
                  inputMode="numeric"
                  className="pl-9"
                  value={getCurrencyDisplayValue('parcelaReduzida')}
                  onChange={(e) => handleCurrencyChange('parcelaReduzida', e.target.value)}
                  placeholder="0,00"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="parcelaPosContemplacao">Parcela Pós</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                  R$
                </span>
                <Input
                  id="parcelaPosContemplacao"
                  type="text"
                  inputMode="numeric"
                  className="pl-9"
                  value={getCurrencyDisplayValue('parcelaPosContemplacao')}
                  onChange={(e) => handleCurrencyChange('parcelaPosContemplacao', e.target.value)}
                  placeholder="0,00"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="taxaAdministracao">
                Taxa Adm
              </Label>
              <div className="relative">
                <Input
                  id="taxaAdministracao"
                  type="number"
                  step="0.1"
                  value={inputs.taxaAdministracao || ''}
                  onChange={(e) => handleChange('taxaAdministracao', e.target.value)}
                  placeholder="0,0"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                  %
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="indiceCorrecao">
                Correção INCC
              </Label>
              <div className="relative">
                <Input
                  id="indiceCorrecao"
                  type="number"
                  step="0.1"
                  value={inputs.indiceCorrecao || ''}
                  onChange={(e) => handleChange('indiceCorrecao', e.target.value)}
                  placeholder="0,0"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                  %
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="percentualRecompra">Percentual de Recompra</Label>
            <div className="relative">
              <Input
                id="percentualRecompra"
                type="number"
                step="1"
                value={inputs.percentualRecompra || ''}
                onChange={(e) => handleChange('percentualRecompra', e.target.value)}
                placeholder="30"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                %
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alert de Projeção */}
      <Card className="border-warning/30 bg-warning/5">
        <CardContent className="flex items-start gap-2 sm:gap-3 pt-3 sm:pt-4 px-3 sm:px-6">
          <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-warning mt-0.5 shrink-0" />
          <p className="text-[10px] sm:text-xs text-muted-foreground">
            Resultados são projeções matemáticas determinísticas, não garantias. Baseados nos valores informados.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
