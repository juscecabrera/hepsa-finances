"use client"

import { useState } from "react"
import { Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"

export default function PaymentForm() {
  const [isPaid, setIsPaid] = useState(false)

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-xl font-bold">Añadir Pago</CardTitle>
        <button
          className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          aria-label="Close"
        >
          X
        </button>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center space-x-2">
          <Label htmlFor="paid-status">Pagado</Label>
          <Switch id="paid-status" checked={isPaid} onCheckedChange={setIsPaid} />
          <span className="text-sm text-muted-foreground">Por Pagar</span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Cantidad</Label>
            <Input id="amount" defaultValue="S/ 1000" className="bg-muted" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="receipt">Boleta</Label>
            <Button variant="secondary" className="w-full bg-muted hover:bg-muted/80">
              Seleccionar archivo
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="date">Fecha de Pago</Label>
          <div className="relative">
            <Input type="text" id="date" defaultValue="24/01/2002" className="bg-muted pl-10" />
            <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Descripción</Label>
          <Textarea id="description" placeholder="Lorem ipsum" className="bg-muted resize-none" />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between gap-4">
        <Button variant="secondary" className="w-full bg-muted hover:bg-muted/80">
          Cancelar
        </Button>
        <Button className="w-full bg-black text-white hover:bg-black/90">Confirmar</Button>
      </CardFooter>
    </Card>
  )
}

