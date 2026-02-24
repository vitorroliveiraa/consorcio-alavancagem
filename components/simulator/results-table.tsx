"use client";

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp, Target, AlertTriangle, RefreshCw, Settings2 } from "lucide-react";
import type { ResultadosComparacao, ConsorcioInputs, LanceConfig, TipoParcela, TipoLance } from "@/lib/types";
import { formatarMoeda, formatarPercentual } from "@/lib/calculos";

interface ResultsTableProps {
    resultados: ResultadosComparacao;
    inputs: ConsorcioInputs;
    tipoParcela: TipoParcela;
    onTipoParcelaChange: (tipo: TipoParcela) => void;
    lanceConfig: LanceConfig;
    onLanceConfigChange: (config: LanceConfig) => void;
}

export function ResultsTable({
    resultados,
    inputs,
    tipoParcela,
    onTipoParcelaChange,
    lanceConfig,
    onLanceConfigChange,
}: ResultsTableProps) {
    const { sorteio, lancefixo, melhorRoi, melhorLucro, pontoViradaSorteio, pontoViradaLanceFixo } = resultados;

    // State for lance config dialog
    const [tempLanceConfig, setTempLanceConfig] = useState<LanceConfig>(lanceConfig);
    const [dialogOpen, setDialogOpen] = useState(false);

    const handleLanceValueChange = (valor: number) => {
        const newConfig = { ...tempLanceConfig, valorLance: valor };

        // Auto-distribute based on tipo
        if (newConfig.tipoLance === "embutido") {
            newConfig.valorEmbutido = valor;
            newConfig.valorPago = 0;
        } else if (newConfig.tipoLance === "pago") {
            newConfig.valorPago = valor;
            newConfig.valorEmbutido = 0;
        } else {
            // dividido: split 50/50
            newConfig.valorPago = valor / 2;
            newConfig.valorEmbutido = valor / 2;
        }

        setTempLanceConfig(newConfig);
    };

    const handleTipoLanceChange = (tipo: TipoLance) => {
        const newConfig = { ...tempLanceConfig, tipoLance: tipo };

        if (tipo === "embutido") {
            newConfig.valorEmbutido = newConfig.valorLance;
            newConfig.valorPago = 0;
        } else if (tipo === "pago") {
            newConfig.valorPago = newConfig.valorLance;
            newConfig.valorEmbutido = 0;
        } else {
            newConfig.valorPago = newConfig.valorLance / 2;
            newConfig.valorEmbutido = newConfig.valorLance / 2;
        }

        setTempLanceConfig(newConfig);
    };

    const handleSaveLanceConfig = () => {
        onLanceConfigChange(tempLanceConfig);
        setDialogOpen(false);
    };

    const openDialog = () => {
        setTempLanceConfig(lanceConfig);
        setDialogOpen(true);
    };

    const tipoLanceLabel = {
        embutido: "Embutido",
        pago: "Pago",
        dividido: "Dividido",
    };

    return (
        <Card>
            <CardHeader className="pb-4 px-3 sm:px-6">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-sm sm:text-base">Tabela de Resultados Mensais</CardTitle>
                        <CardDescription className="text-[10px] sm:text-sm">
                            Evolucao por mes com reajuste INCC anual
                        </CardDescription>
                    </div>
                </div>

                {/* Destaques */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 pt-3 sm:pt-4">
                    <div className="p-2 sm:p-3 rounded-lg bg-success/10 border border-success/20">
                        <div className="flex items-center gap-2 mb-1">
                            <TrendingUp className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-success" />
                            <span className="text-[10px] sm:text-xs text-muted-foreground">Melhor ROI</span>
                        </div>
                        <div className="flex items-center justify-between gap-2">
                            <span className="font-semibold text-xs sm:text-sm text-foreground">
                                {formatarPercentual(melhorRoi.valor)}
                            </span>
                            <Badge variant="secondary" className="text-[10px] sm:text-xs shrink-0">
                                {melhorRoi.modalidade === "sorteio" ? "Sorteio" : "Lance"} - Mes {melhorRoi.mes}
                            </Badge>
                        </div>
                    </div>

                    <div className="p-2 sm:p-3 rounded-lg bg-primary/10 border border-primary/20">
                        <div className="flex items-center gap-2 mb-1">
                            <Target className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />
                            <span className="text-[10px] sm:text-xs text-muted-foreground">Maior Lucro</span>
                        </div>
                        <div className="flex items-center justify-between gap-2">
                            <span className="font-semibold text-xs sm:text-sm text-foreground">
                                {formatarMoeda(melhorLucro.valor)}
                            </span>
                            <Badge variant="secondary" className="text-[10px] sm:text-xs shrink-0">
                                {melhorLucro.modalidade === "sorteio" ? "Sorteio" : "Lance"} - Mes {melhorLucro.mes}
                            </Badge>
                        </div>
                    </div>
                </div>

                {/* Pontos de Virada */}
                {(pontoViradaSorteio || pontoViradaLanceFixo) && (
                    <div className="flex flex-col sm:flex-row flex-wrap gap-1.5 sm:gap-2 pt-2 sm:pt-3">
                        {pontoViradaSorteio && (
                            <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-warning">
                                <AlertTriangle className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                                <span>Virada Sorteio: Mes {pontoViradaSorteio}</span>
                            </div>
                        )}
                        {pontoViradaLanceFixo && (
                            <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-warning">
                                <AlertTriangle className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                                <span>Virada Lance Fixo: Mes {pontoViradaLanceFixo}</span>
                            </div>
                        )}
                    </div>
                )}
            </CardHeader>

            <CardContent className="px-3 sm:px-6">
                <Tabs defaultValue="sorteio" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="sorteio">Sorteio</TabsTrigger>
                        <TabsTrigger value="lance-fixo">Lance Fixo</TabsTrigger>
                    </TabsList>

                    {/* SORTEIO TAB */}
                    <TabsContent value="sorteio" className="mt-4">
                        {/* Sorteio Controls */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 p-3 rounded-lg bg-secondary/30 border border-border">
                            <div className="flex items-center gap-2">
                                <Label className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">
                                    Parcela:
                                </Label>
                                <Select
                                    value={tipoParcela}
                                    onValueChange={(v) => onTipoParcelaChange(v as TipoParcela)}
                                >
                                    <SelectTrigger className="w-full sm:w-[160px] h-8 text-xs sm:text-sm">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="reduzida">
                                            Reduzida ({formatarMoeda(inputs.parcelaReduzida)})
                                        </SelectItem>
                                        <SelectItem value="integral">
                                            Integral ({formatarMoeda(inputs.parcelaPosContemplacao)})
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex items-center gap-2 text-[10px] sm:text-xs text-muted-foreground">
                                <RefreshCw className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                                <span>INCC: {inputs.indiceCorrecao}% a.a.</span>
                            </div>
                        </div>

                        {/* Sorteio Table */}
                        <div className="rounded-md border overflow-hidden -mx-3 sm:mx-0">
                            <div className="max-h-[400px] overflow-auto scrollbar-thin">
                                <Table>
                                    <TableHeader className="sticky top-0 bg-card z-10">
                                        <TableRow className="border-b border-border">
                                            <TableHead className="w-12 sm:w-16 text-center bg-card text-xs sm:text-sm">
                                                Mes
                                            </TableHead>
                                            <TableHead className="text-right bg-card text-xs sm:text-sm">
                                                Parcela
                                            </TableHead>
                                            <TableHead className="text-right bg-card text-xs sm:text-sm whitespace-nowrap">
                                                Tot. Investido
                                            </TableHead>
                                            <TableHead className="text-right bg-card text-xs sm:text-sm whitespace-nowrap">
                                                Cred. Liquido
                                            </TableHead>
                                            <TableHead className="text-right bg-card text-xs sm:text-sm whitespace-nowrap">
                                                Recompra
                                            </TableHead>
                                            <TableHead className="text-right bg-card text-xs sm:text-sm whitespace-nowrap">
                                                Lucro
                                            </TableHead>
                                            <TableHead className="text-right w-16 sm:w-24 bg-card text-xs sm:text-sm">
                                                ROI
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {sorteio.map((r, index) => {
                                            const isDestaque =
                                                r.mes === melhorRoi.mes && melhorRoi.modalidade === "sorteio";
                                            const isPontoVirada = r.mes === pontoViradaSorteio;
                                            const anoAtual = Math.ceil(r.mes / 12);
                                            const anoAnterior = index > 0 ? Math.ceil(sorteio[index - 1].mes / 12) : 0;
                                            const mudouAno = index > 0 && anoAtual > anoAnterior;

                                            return (
                                                <React.Fragment key={`sorteio-${r.mes}`}>
                                                    {mudouAno && (
                                                        <TableRow
                                                            key={`year-${anoAtual}`}
                                                            className="bg-accent/10 border-y-2 border-accent/30"
                                                        >
                                                            <TableCell colSpan={7} className="py-1.5 text-center">
                                                                <span className="text-xs font-semibold text-accent uppercase tracking-wider">
                                                                    Ano {anoAtual}
                                                                </span>
                                                            </TableCell>
                                                        </TableRow>
                                                    )}
                                                    <TableRow
                                                        key={r.mes}
                                                        className={
                                                            isDestaque
                                                                ? "bg-success/10"
                                                                : isPontoVirada
                                                                ? "bg-warning/10"
                                                                : r.anoReajuste
                                                                ? "bg-primary/5"
                                                                : ""
                                                        }
                                                    >
                                                        <TableCell className="text-center font-mono text-[11px] sm:text-sm">
                                                            <div className="flex items-center justify-center gap-1">
                                                                {r.mes}
                                                                {isPontoVirada && (
                                                                    <AlertTriangle className="h-3 w-3 text-warning" />
                                                                )}
                                                                {r.anoReajuste && (
                                                                    <RefreshCw className="h-3 w-3 text-primary" />
                                                                )}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="text-right font-mono text-[11px] sm:text-sm">
                                                            <span
                                                                className={
                                                                    r.anoReajuste ? "text-primary font-medium" : ""
                                                                }
                                                            >
                                                                {formatarMoeda(r.parcela)}
                                                            </span>
                                                        </TableCell>
                                                        <TableCell className="text-right font-mono text-[11px] sm:text-sm">
                                                            {formatarMoeda(r.totalInvestido)}
                                                        </TableCell>
                                                        <TableCell className="text-right font-mono text-[11px] sm:text-sm">
                                                            <span
                                                                className={
                                                                    r.anoReajuste ? "text-primary font-medium" : ""
                                                                }
                                                            >
                                                                {formatarMoeda(r.creditoLiquido)}
                                                            </span>
                                                        </TableCell>
                                                        <TableCell className="text-right font-mono text-[11px] sm:text-sm">
                                                            {formatarMoeda(r.valorRecompra)}
                                                        </TableCell>
                                                        <TableCell className="text-right font-mono text-[11px] sm:text-sm">
                                                            <span
                                                                className={
                                                                    r.lucroLiquido >= 0
                                                                        ? "text-success"
                                                                        : "text-destructive"
                                                                }
                                                            >
                                                                {formatarMoeda(r.lucroLiquido)}
                                                            </span>
                                                        </TableCell>
                                                        <TableCell className="text-right font-mono text-[11px] sm:text-sm">
                                                            <span
                                                                className={
                                                                    r.roi >= 0 ? "text-success" : "text-destructive"
                                                                }
                                                            >
                                                                {formatarPercentual(r.roi)}
                                                            </span>
                                                        </TableCell>
                                                    </TableRow>
                                                </React.Fragment>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                    </TabsContent>

                    {/* LANCE FIXO TAB */}
                    <TabsContent value="lance-fixo" className="mt-4">
                        {/* Lance Fixo Controls */}
                        <div className="flex flex-col gap-3 mb-4 p-2 sm:p-3 rounded-lg bg-secondary/30 border border-border">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3">
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <Label className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">
                                            Lance:
                                        </Label>
                                        <span className="font-semibold text-xs sm:text-base text-foreground">
                                            {formatarMoeda(lanceConfig.valorLance)}
                                        </span>
                                        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                                            <DialogTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="h-6 sm:h-7 gap-1 sm:gap-1.5 text-[10px] sm:text-xs bg-transparent"
                                                    onClick={openDialog}
                                                >
                                                    <Settings2 className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                                                    Alterar
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className="sm:max-w-md">
                                                <DialogHeader>
                                                    <DialogTitle>Configurar Lance</DialogTitle>
                                                    <DialogDescription>
                                                        Defina o valor do lance e como ele será utilizado na
                                                        contemplação.
                                                    </DialogDescription>
                                                </DialogHeader>
                                                <div className="space-y-4 py-4">
                                                    <div className="space-y-2">
                                                        <Label>Valor do Lance</Label>
                                                        <Input
                                                            type="number"
                                                            value={tempLanceConfig.valorLance}
                                                            onChange={(e) =>
                                                                handleLanceValueChange(Number(e.target.value))
                                                            }
                                                            placeholder="0,00"
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label>Tipo do Lance</Label>
                                                        <Select
                                                            value={tempLanceConfig.tipoLance}
                                                            onValueChange={(v) => handleTipoLanceChange(v as TipoLance)}
                                                        >
                                                            <SelectTrigger>
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="embutido">
                                                                    Embutido (parte do crédito)
                                                                </SelectItem>
                                                                <SelectItem value="pago">
                                                                    Pago (dinheiro próprio)
                                                                </SelectItem>
                                                                <SelectItem value="dividido">
                                                                    Dividido (ambos)
                                                                </SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>

                                                    {tempLanceConfig.tipoLance === "dividido" && (
                                                        <div className="grid grid-cols-2 gap-3">
                                                            <div className="space-y-2">
                                                                <Label className="text-sm">Valor Pago</Label>
                                                                <Input
                                                                    type="number"
                                                                    value={tempLanceConfig.valorPago}
                                                                    onChange={(e) =>
                                                                        setTempLanceConfig({
                                                                            ...tempLanceConfig,
                                                                            valorPago: Number(e.target.value),
                                                                            valorEmbutido:
                                                                                tempLanceConfig.valorLance -
                                                                                Number(e.target.value),
                                                                        })
                                                                    }
                                                                />
                                                            </div>
                                                            <div className="space-y-2">
                                                                <Label className="text-sm">Valor Embutido</Label>
                                                                <Input
                                                                    type="number"
                                                                    value={tempLanceConfig.valorEmbutido}
                                                                    onChange={(e) =>
                                                                        setTempLanceConfig({
                                                                            ...tempLanceConfig,
                                                                            valorEmbutido: Number(e.target.value),
                                                                            valorPago:
                                                                                tempLanceConfig.valorLance -
                                                                                Number(e.target.value),
                                                                        })
                                                                    }
                                                                />
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Preview */}
                                                    <div className="p-3 rounded-lg bg-muted/50 border">
                                                        <p className="text-xs text-muted-foreground mb-2">Resumo:</p>
                                                        <div className="flex flex-wrap gap-2">
                                                            {(tempLanceConfig.tipoLance === "pago" ||
                                                                tempLanceConfig.tipoLance === "dividido") &&
                                                                tempLanceConfig.valorPago > 0 && (
                                                                    <Badge className="bg-success/20 text-success border-success/30 hover:bg-success/20">
                                                                        Pago: {formatarMoeda(tempLanceConfig.valorPago)}
                                                                    </Badge>
                                                                )}
                                                            {(tempLanceConfig.tipoLance === "embutido" ||
                                                                tempLanceConfig.tipoLance === "dividido") &&
                                                                tempLanceConfig.valorEmbutido > 0 && (
                                                                    <Badge className="bg-destructive/20 text-destructive border-destructive/30 hover:bg-destructive/20">
                                                                        Emb:{" "}
                                                                        {formatarMoeda(tempLanceConfig.valorEmbutido)}
                                                                    </Badge>
                                                                )}
                                                        </div>
                                                    </div>
                                                </div>
                                                <DialogFooter>
                                                    <DialogClose asChild>
                                                        <Button variant="outline">Cancelar</Button>
                                                    </DialogClose>
                                                    <Button onClick={handleSaveLanceConfig}>Aplicar</Button>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>
                                    </div>

                                    {/* Lance badges */}
                                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                                        {(lanceConfig.tipoLance === "pago" || lanceConfig.tipoLance === "dividido") &&
                                            lanceConfig.valorPago > 0 && (
                                                <Badge className="bg-success/20 text-success border-success/30 hover:bg-success/20 text-[10px] sm:text-xs">
                                                    Pago: {formatarMoeda(lanceConfig.valorPago)}
                                                </Badge>
                                            )}
                                        {(lanceConfig.tipoLance === "embutido" ||
                                            lanceConfig.tipoLance === "dividido") &&
                                            lanceConfig.valorEmbutido > 0 && (
                                                <Badge className="bg-destructive/20 text-destructive border-destructive/30 hover:bg-destructive/20 text-[10px] sm:text-xs">
                                                    Emb: {formatarMoeda(lanceConfig.valorEmbutido)}
                                                </Badge>
                                            )}
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 text-[10px] sm:text-xs text-muted-foreground">
                                    <RefreshCw className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                                    <span>INCC: {inputs.indiceCorrecao}% a.a.</span>
                                </div>
                            </div>
                        </div>

                        {/* Lance Fixo Table */}
                        <div className="rounded-md border overflow-hidden -mx-3 sm:mx-0">
                            <div className="max-h-[400px] overflow-auto scrollbar-thin">
                                <Table>
                                    <TableHeader className="sticky top-0 bg-card z-10">
                                        <TableRow className="border-b border-border">
                                            <TableHead className="w-12 sm:w-16 text-center bg-card text-xs sm:text-sm">
                                                Mes
                                            </TableHead>
                                            <TableHead className="text-right bg-card text-xs sm:text-sm">
                                                Parcela
                                            </TableHead>
                                            <TableHead className="text-right bg-card text-xs sm:text-sm whitespace-nowrap">
                                                Tot. Investido
                                            </TableHead>
                                            <TableHead className="text-right bg-card text-xs sm:text-sm whitespace-nowrap">
                                                Cred. Liquido
                                            </TableHead>
                                            <TableHead className="text-right bg-card text-xs sm:text-sm whitespace-nowrap">
                                                Recompra
                                            </TableHead>
                                            <TableHead className="text-right bg-card text-xs sm:text-sm whitespace-nowrap">
                                                Lucro
                                            </TableHead>
                                            <TableHead className="text-right w-16 sm:w-24 bg-card text-xs sm:text-sm">
                                                ROI
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {lancefixo.map((r, index) => {
                                            const isDestaque =
                                                r.mes === melhorRoi.mes && melhorRoi.modalidade === "lance-fixo";
                                            const isPontoVirada = r.mes === pontoViradaLanceFixo;
                                            const anoAtual = Math.ceil(r.mes / 12);
                                            const anoAnterior =
                                                index > 0 ? Math.ceil(lancefixo[index - 1].mes / 12) : 0;
                                            const mudouAno = index > 0 && anoAtual > anoAnterior;

                                            return (
                                                <React.Fragment key={`lancefixo-${r.mes}`}>
                                                    {mudouAno && (
                                                        <TableRow
                                                            key={`year-lf-${anoAtual}`}
                                                            className="bg-accent/10 border-y-2 border-accent/30"
                                                        >
                                                            <TableCell colSpan={7} className="py-1.5 text-center">
                                                                <span className="text-xs font-semibold text-accent uppercase tracking-wider">
                                                                    Ano {anoAtual}
                                                                </span>
                                                            </TableCell>
                                                        </TableRow>
                                                    )}
                                                    <TableRow
                                                        key={r.mes}
                                                        className={
                                                            isDestaque
                                                                ? "bg-success/10"
                                                                : isPontoVirada
                                                                ? "bg-warning/10"
                                                                : r.anoReajuste
                                                                ? "bg-primary/5"
                                                                : ""
                                                        }
                                                    >
                                                        <TableCell className="text-center font-mono text-[11px] sm:text-sm">
                                                            <div className="flex items-center justify-center gap-1">
                                                                {r.mes}
                                                                {isPontoVirada && (
                                                                    <AlertTriangle className="h-3 w-3 text-warning" />
                                                                )}
                                                                {r.anoReajuste && (
                                                                    <RefreshCw className="h-3 w-3 text-primary" />
                                                                )}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="text-right font-mono text-[11px] sm:text-sm">
                                                            <span
                                                                className={
                                                                    r.anoReajuste ? "text-primary font-medium" : ""
                                                                }
                                                            >
                                                                {formatarMoeda(r.parcela)}
                                                            </span>
                                                        </TableCell>
                                                        <TableCell className="text-right font-mono text-[11px] sm:text-sm">
                                                            {formatarMoeda(r.totalInvestido)}
                                                        </TableCell>
                                                        <TableCell className="text-right font-mono text-[11px] sm:text-sm">
                                                            <span
                                                                className={
                                                                    r.anoReajuste ? "text-primary font-medium" : ""
                                                                }
                                                            >
                                                                {formatarMoeda(r.creditoLiquido)}
                                                            </span>
                                                        </TableCell>
                                                        <TableCell className="text-right font-mono text-[11px] sm:text-sm">
                                                            {formatarMoeda(r.valorRecompra)}
                                                        </TableCell>
                                                        <TableCell className="text-right font-mono text-[11px] sm:text-sm">
                                                            <span
                                                                className={
                                                                    r.lucroLiquido >= 0
                                                                        ? "text-success"
                                                                        : "text-destructive"
                                                                }
                                                            >
                                                                {formatarMoeda(r.lucroLiquido)}
                                                            </span>
                                                        </TableCell>
                                                        <TableCell className="text-right font-mono text-[11px] sm:text-sm">
                                                            <span
                                                                className={
                                                                    r.roi >= 0 ? "text-success" : "text-destructive"
                                                                }
                                                            >
                                                                {formatarPercentual(r.roi)}
                                                            </span>
                                                        </TableCell>
                                                    </TableRow>
                                                </React.Fragment>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
}
