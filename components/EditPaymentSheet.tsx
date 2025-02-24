"use client"

import React from "react"
// import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { DatePicker } from "@/components/ui/date-picker"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  // SheetTrigger,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { toast } from "sonner"

interface EditPaymentSheetProps {
    item: { id: string, amount: number } | null;
    openEdit: boolean
    setOpenEdit: (openEdit: boolean) => void
}

export const EditPaymentSheet:React.FC<EditPaymentSheetProps> = ({ openEdit, setOpenEdit, item }) => {
  const [isPaid, setIsPaid] = useState(false)
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [file, setFile] = useState<File | null>(null)
  const [amount, setAmount] = useState("1000")
  const [description, setDescription] = useState("Lorem")
  const [isSubmitting, setIsSubmitting] = useState(false)
    /*
    Este componente tiene que recibir la data del item al que le demos click y
    tenerla al inicio como read only
    Tiene que tener un boton que me permita entrar a 'Edit Mode' y poder editar lo que queramos
    Luego tenemos que poder presionar Guardar Cambios y que se haga el post
    */


    console.log(item)


  const formatDate = (date: Date | undefined) => {
    if (!date) return ""
    return format(date, "EEEE, d 'de' MMMM 'de' yyyy", { locale: es })
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    setFile(selectedFile || null)
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    const formData = new FormData()
    formData.append("isPaid", isPaid.toString())
    formData.append("amount", amount)
    formData.append("date", date ? date.toISOString() : "")
    formData.append("description", description)
    if (file) {
      formData.append("receipt", file)
    }

    toast.promise(
      fetch("/api/payments", {
        method: "POST",
        body: formData,
      }),
      {
        loading: "Agregando pago...",
        success: (response) => {
          if (!response.ok) throw new Error("Error al enviar el pago")
          // Reset form fields here
          setIsPaid(false)
          setDate(new Date())
          setFile(null)
          setAmount("1000")
          setDescription("")
          setIsSubmitting(false)
          return "El pago se ha agregado correctamente."
        },
        error: "Hubo un problema al agregar el pago. Por favor, inténtalo de nuevo.",
      },
    )
  }

  return (
    <Sheet open={openEdit} onOpenChange={setOpenEdit}>
        {/* <SheetTrigger>
          {children}
        </SheetTrigger> */}
      <SheetContent className="font-inter space-y-3">
        <SheetHeader>
          <SheetTitle className="text-xl font-bold space-y-0 pb-4">Editar Detalles de Pago</SheetTitle>
        </SheetHeader>

        <div className="flex items-center space-x-2 pb-4">
          <Label htmlFor="paid-status">Pagado</Label>
          <Switch id="paid-status" checked={isPaid} onCheckedChange={setIsPaid} />
          <span className="text-sm text-muted-foreground">Por Pagar</span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Cantidad</Label>
            <Input id="amount" type="number" className="bg-muted" value={amount} onChange={(e) => setAmount(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="receipt">Boleta</Label>
            <div className="relative">
              <input type="file" id="receipt" className="sr-only" onChange={handleFileChange} />
              <label
                htmlFor="receipt"
                className={cn(
                  "flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 bg-muted border border-gray-300 rounded-md shadow-sm hover:bg-muted/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer",
                  file && "text-indigo-600",
                )}
              >
                {file ? file.name : "Seleccionar archivo"}
              </label>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="date">Fecha de Pago</Label>
          <DatePicker date={date} setDate={setDate} formatDate={formatDate} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Descripción</Label>
          <Textarea
            id="description"
            placeholder="Descripción"
            className="bg-muted resize-none pb-10"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <SheetFooter>
          <SheetClose asChild>
            <Button variant="secondary" className="w-full bg-muted hover:bg-muted/80">
              Cancelar
            </Button>
          </SheetClose>
          <Button type="submit" onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Enviando..." : "Guardar Cambios"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

