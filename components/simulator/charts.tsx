'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import type { ResultadosComparacao } from '@/lib/types'
import { formatarMoeda, formatarPercentual } from '@/lib/calculos'

interface ChartsProps {
  resultados: ResultadosComparacao
}

// Colors computed in JS for Recharts
const CHART_COLORS = {
  sorteio: '#3b9eff',      // primary blue
  lancefixo: '#4ade80',    // accent green
  invested: '#f59e0b',     // warning amber
  recompra: '#a855f7',     // chart purple
}

export function Charts({ resultados }: ChartsProps) {
  const { sorteio, lancefixo, pontoViradaSorteio, pontoViradaLanceFixo } = resultados

  // Prepare combined data for comparison charts
  const combinedData = sorteio.map((s, i) => ({
    mes: s.mes,
    roiSorteio: s.roi,
    roiLanceFixo: lancefixo[i]?.roi || 0,
    lucroSorteio: s.lucroLiquido,
    lucroLanceFixo: lancefixo[i]?.lucroLiquido || 0,
    investidoSorteio: s.totalInvestido,
    investidoLanceFixo: lancefixo[i]?.totalInvestido || 0,
    recompraSorteio: s.valorRecompra,
    recompraLanceFixo: lancefixo[i]?.valorRecompra || 0,
  }))

  const chartConfig = {
    roiSorteio: {
      label: 'ROI Sorteio',
      color: CHART_COLORS.sorteio,
    },
    roiLanceFixo: {
      label: 'ROI Lance Fixo',
      color: CHART_COLORS.lancefixo,
    },
    lucroSorteio: {
      label: 'Lucro Sorteio',
      color: CHART_COLORS.sorteio,
    },
    lucroLanceFixo: {
      label: 'Lucro Lance Fixo',
      color: CHART_COLORS.lancefixo,
    },
    investidoSorteio: {
      label: 'Investido Sorteio',
      color: CHART_COLORS.invested,
    },
    recompraSorteio: {
      label: 'Recompra Sorteio',
      color: CHART_COLORS.recompra,
    },
    investidoLanceFixo: {
      label: 'Investido Lance Fixo',
      color: CHART_COLORS.invested,
    },
    recompraLanceFixo: {
      label: 'Recompra Lance Fixo',
      color: CHART_COLORS.recompra,
    },
  }

  const formatYAxisMoeda = (value: number) => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`
    if (value >= 1000) return `${(value / 1000).toFixed(0)}k`
    return value.toString()
  }

  const formatYAxisPercent = (value: number) => `${value.toFixed(0)}%`

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border bg-card p-3 shadow-lg">
          <p className="font-semibold text-sm mb-2">Mês {label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 text-xs">
              <div
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-muted-foreground">{entry.name}:</span>
              <span className="font-mono font-medium">
                {entry.dataKey.includes('roi')
                  ? formatarPercentual(entry.value)
                  : formatarMoeda(entry.value)}
              </span>
            </div>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <Card>
      <CardHeader className="pb-4 px-3 sm:px-6">
        <CardTitle className="text-sm sm:text-base">Graficos de Analise</CardTitle>
        <CardDescription className="text-[10px] sm:text-sm">Visualizacao comparativa entre modalidades</CardDescription>
      </CardHeader>
      <CardContent className="px-3 sm:px-6">
        <Tabs defaultValue="roi" className="w-full">
          <TabsList className="grid w-full grid-cols-3 h-auto">
            <TabsTrigger value="roi" className="text-xs sm:text-sm px-1 sm:px-3">ROI (%)</TabsTrigger>
            <TabsTrigger value="lucro" className="text-xs sm:text-sm px-1 sm:px-3">Lucro Liquido</TabsTrigger>
            <TabsTrigger value="investimento" className="text-xs sm:text-sm px-1 sm:px-3">Invest. vs Recomp.</TabsTrigger>
          </TabsList>

          {/* ROI Chart */}
          <TabsContent value="roi" className="mt-4">
            <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
              <ChartContainer config={chartConfig} className="h-[280px] sm:h-[350px] w-full min-w-[350px] sm:min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={combinedData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
                    <XAxis
                      dataKey="mes"
                      tickLine={false}
                      axisLine={false}
                      tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                      label={{
                        value: 'Mês',
                        position: 'insideBottomRight',
                        offset: -5,
                        fill: 'hsl(var(--muted-foreground))',
                        fontSize: 11,
                      }}
                    />
                    <YAxis
                      tickFormatter={formatYAxisPercent}
                      tickLine={false}
                      axisLine={false}
                      tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                      wrapperStyle={{ paddingTop: '20px' }}
                      iconType="circle"
                      iconSize={8}
                    />
                    {pontoViradaSorteio && (
                      <ReferenceLine
                        x={pontoViradaSorteio}
                        stroke={CHART_COLORS.sorteio}
                        strokeDasharray="5 5"
                        strokeOpacity={0.5}
                      />
                    )}
                    {pontoViradaLanceFixo && (
                      <ReferenceLine
                        x={pontoViradaLanceFixo}
                        stroke={CHART_COLORS.lancefixo}
                        strokeDasharray="5 5"
                        strokeOpacity={0.5}
                      />
                    )}
                    <Line
                      type="monotone"
                      dataKey="roiSorteio"
                      name="ROI Sorteio"
                      stroke={CHART_COLORS.sorteio}
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 4 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="roiLanceFixo"
                      name="ROI Lance Fixo"
                      stroke={CHART_COLORS.lancefixo}
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </TabsContent>

          {/* Lucro Chart */}
          <TabsContent value="lucro" className="mt-4">
            <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
              <ChartContainer config={chartConfig} className="h-[280px] sm:h-[350px] w-full min-w-[350px] sm:min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={combinedData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
                    <XAxis
                      dataKey="mes"
                      tickLine={false}
                      axisLine={false}
                      tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                      label={{
                        value: 'Mês',
                        position: 'insideBottomRight',
                        offset: -5,
                        fill: 'hsl(var(--muted-foreground))',
                        fontSize: 11,
                      }}
                    />
                    <YAxis
                      tickFormatter={formatYAxisMoeda}
                      tickLine={false}
                      axisLine={false}
                      tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                      wrapperStyle={{ paddingTop: '20px' }}
                      iconType="circle"
                      iconSize={8}
                    />
                    <Area
                      type="monotone"
                      dataKey="lucroSorteio"
                      name="Lucro Sorteio"
                      stroke={CHART_COLORS.sorteio}
                      fill={CHART_COLORS.sorteio}
                      fillOpacity={0.2}
                      strokeWidth={2}
                    />
                    <Area
                      type="monotone"
                      dataKey="lucroLanceFixo"
                      name="Lucro Lance Fixo"
                      stroke={CHART_COLORS.lancefixo}
                      fill={CHART_COLORS.lancefixo}
                      fillOpacity={0.2}
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </TabsContent>

          {/* Investimento vs Recompra */}
          <TabsContent value="investimento" className="mt-4">
            <Tabs defaultValue="sorteio-inv" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="sorteio-inv">Sorteio</TabsTrigger>
                <TabsTrigger value="lancefixo-inv">Lance Fixo</TabsTrigger>
              </TabsList>

              <TabsContent value="sorteio-inv">
                <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
                  <ChartContainer config={chartConfig} className="h-[250px] sm:h-[300px] w-full min-w-[350px] sm:min-w-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={combinedData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
                        <XAxis
                          dataKey="mes"
                          tickLine={false}
                          axisLine={false}
                          tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                        />
                        <YAxis
                          tickFormatter={formatYAxisMoeda}
                          tickLine={false}
                          axisLine={false}
                          tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend
                          wrapperStyle={{ paddingTop: '20px' }}
                          iconType="circle"
                          iconSize={8}
                        />
                        <Area
                          type="monotone"
                          dataKey="investidoSorteio"
                          name="Total Investido"
                          stroke={CHART_COLORS.invested}
                          fill={CHART_COLORS.invested}
                          fillOpacity={0.3}
                          strokeWidth={2}
                        />
                        <Area
                          type="monotone"
                          dataKey="recompraSorteio"
                          name="Valor Recompra"
                          stroke={CHART_COLORS.recompra}
                          fill={CHART_COLORS.recompra}
                          fillOpacity={0.3}
                          strokeWidth={2}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </TabsContent>

              <TabsContent value="lancefixo-inv">
                <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
                  <ChartContainer config={chartConfig} className="h-[250px] sm:h-[300px] w-full min-w-[350px] sm:min-w-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={combinedData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
                        <XAxis
                          dataKey="mes"
                          tickLine={false}
                          axisLine={false}
                          tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                        />
                        <YAxis
                          tickFormatter={formatYAxisMoeda}
                          tickLine={false}
                          axisLine={false}
                          tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend
                          wrapperStyle={{ paddingTop: '20px' }}
                          iconType="circle"
                          iconSize={8}
                        />
                        <Area
                          type="monotone"
                          dataKey="investidoLanceFixo"
                          name="Total Investido"
                          stroke={CHART_COLORS.invested}
                          fill={CHART_COLORS.invested}
                          fillOpacity={0.3}
                          strokeWidth={2}
                        />
                        <Area
                          type="monotone"
                          dataKey="recompraLanceFixo"
                          name="Valor Recompra"
                          stroke={CHART_COLORS.recompra}
                          fill={CHART_COLORS.recompra}
                          fillOpacity={0.3}
                          strokeWidth={2}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </TabsContent>
            </Tabs>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
