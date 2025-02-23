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

interface UserActionDeleteProps {
    isModalOpen: boolean;
    setIsModalOpen: (open: boolean) => void;
    paymentId: number
}

const DeletePaymentAlert:React.FC<UserActionDeleteProps> = ({ isModalOpen, setIsModalOpen, paymentId }) => {

    const handleDelete = async () => {
        try {
            //Falta hacer el endpoint para eliminar pagos


        //   const response = await fetch("/api/payments", {
        //     method: "DELETE",
        //     headers: {
        //       "Content-Type": "application/json",
        //     },
        //     body: JSON.stringify({ paymentId }),
        //   })
        //   if (response.ok) {
        //     alert("User deleted successfully!")
        //     setIsModalOpen(false)
        //   } else {
        //     alert("Failed to delete user")
        //   }
            return
        } catch (error) {
          console.error("Error:", error)
        }
    }


    return (
        <div> 
            <AlertDialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <AlertDialogContent className='font-inter'>
                  <AlertDialogHeader>
                    <AlertDialogTitle>¿Estás seguro que quieres eliminar el pago y todos sus detalles?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Está accion no se puede deshacer. Esto eliminará permanentemente la información del pago.
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

export default DeletePaymentAlert