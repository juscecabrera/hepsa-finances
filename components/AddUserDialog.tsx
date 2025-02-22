"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { PlusCircle } from "lucide-react"

export default function AddUserDialog() {
  const [name, setName] = useState("")
  const [amount, setAmount] = useState({
    'Paid': 0,
    'NotPaid': 0
  })
  const [open, setOpen] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch("/api/workers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, amount }),
      })
      if (response.ok) {
        alert("User added successfully!")
        setName("")
        setAmount({
          'Paid': 0,
          'NotPaid': 0
        })
        setOpen(false)
      } else {
        alert("Failed to add user")
      }
    } catch (error) {
      console.error("Error:", error)
      alert("An error occurred")
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen} >
      <DialogTrigger asChild className="font-inter">
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Agregar Trabajador
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-inter">Agregar Trabajador</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 font-inter">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          {/* Fila de Inputs */}
          <div className="flex flex-row gap-5">
            <div className="space-y-2">
              <Label htmlFor="amount">Pagado</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                value={amount.Paid}
                onChange={(e) => setAmount({...amount, Paid: Number.parseFloat(e.target.value)})}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Por Pagar</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                value={amount.NotPaid}
                onChange={(e) => setAmount({...amount, NotPaid: Number.parseFloat(e.target.value)})}
                required
              />
            </div>

          </div>
          <DialogFooter>
            <div className="flex flex-row justify-between w-full">
              <Button variant="outline" onClick={() => {setOpen(false)}}>Cancelar</Button>
              <Button type="submit">Agregar</Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

