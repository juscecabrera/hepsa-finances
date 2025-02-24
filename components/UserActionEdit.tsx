'use client'

import React from 'react'
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"


// interface Payment {
//   id: number;
//   amount: number;
//   isPaid: number;
//   personId: number;
// }

interface Person {
  id: number;
  name: string;
  // payments: Payment[]; // Lo comento para que en money-table no me de error
}

interface UserActionEditProps {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  selectedPerson: Person | null;
}


const UserActionEdit: React.FC<UserActionEditProps> = ({ isModalOpen, setIsModalOpen, selectedPerson }) => {
  const personName = selectedPerson?.name
  const personId = selectedPerson?.id

  const [edits, setEdits] = useState({
    "newName" : personName
  })
  
  const handleUserEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    const newName = edits.newName
    try {
      const response = await fetch("/api/workers", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({personId, newName}),
      })
      if (response.ok) {
        alert("User edited successfully!")
        setIsModalOpen(false)
      } else {
        alert("Failed to edit user")
      }
    } catch (error) {
      console.error("Error:", error)
      alert("An error occurred")
    } 
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogContent className="sm:max-w-[425px] font-inter">
        <DialogHeader>
          <DialogTitle>Editar perfil</DialogTitle>
          <DialogDescription>
            Haz cambios a la informacion del trabajador. Haz click en guardar cuando hayas terminado. 
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleUserEdit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right"> 
                Nombre
              </Label>
              <Input 
                id="name" 
                placeholder={personName}
                type='text'
                onChange={(e) => {setEdits({...edits, newName: e.target.value})}} 
                className="col-span-3" 
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Guardar cambios</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default UserActionEdit
