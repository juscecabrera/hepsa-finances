import React from 'react'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"


interface Payment {
  id: number;
  amount: number;
  isPaid: number;
  personId: number;
}

interface Person {
  id: number;
  name: string;
  payments: Payment[];
}

interface UserActionDeleteProps {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  selectedPerson?: Person;
}

const UserActionDelete: React.FC<UserActionDeleteProps> = ({ isModalOpen, setIsModalOpen, selectedPerson }) => {

  const personName = selectedPerson?.name
  const personId = selectedPerson?.id

  const handleDelete = async () => {
    try {
      const response = await fetch("/api/workers", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ personId }),
      })
      if (response.ok) {
        alert("User deleted successfully!")
        setIsModalOpen(false)
      } else {
        alert("Failed to delete user")
      }
    } catch (error) {
      console.error("Error:", error)
      alert("An error occurred")
    }
  }

  return (
    <div>
      <AlertDialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <AlertDialogContent className='font-inter'>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro que quieres eliminar al trabajador {personName}?</AlertDialogTitle>
            <AlertDialogDescription>
              Está accion no se puede deshacer. Esto eliminará permanentemente la información del trabajador.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={() => handleDelete()}>Eliminar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  )
}

export default UserActionDelete