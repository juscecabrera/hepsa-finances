'use client'

import React from "react";
import { useState } from "react";
// import { useSortable } from "@dnd-kit/sortable";
// import { CSS } from "@dnd-kit/utilities";
import { EditPaymentSheet } from "./EditPaymentSheet";

import {
  DropdownMenu,
  // DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  // DropdownMenuLabel,
  // DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"

// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
// } from "@/components/ui/alert-dialog"
import DeletePaymentAlert from "./DeletePaymentAlert";


interface SortableItemProps {
  id: string;
  amount: number;
}

export const SortableItem: React.FC<SortableItemProps> = ({ id, amount }) => {
  const [openEdit, setOpenEdit] = useState<boolean>(false);
  const [deletePaymentOpen, setDeletePaymentOpen] = useState<boolean>(false)

  /*
  Esto es para tener el drag. Para activarlo, solo tengo que descomentar esto y lo comentado dentro del div del return. Lo estoy quitando porque no me permitia hacer el click en el Dropdown para abrir el sheet de Ver Detalles de Pago
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id }) 


  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  */

  const itemData = {
    id: id,
    amount: amount
  }


  const paymentDescription = 'Semana Regular 20'

  // Esto es temporal hasta hacer el back
  const paymentId = 100;

  return (
    <>
      <div 
        // ref={setNodeRef}
        // style={style}
        // {...attributes}
        // {...listeners}
        className="my-4 text-lg bg-gray-200 p-3 rounded-md shadow-md font-medium hover:cursor-pointer flex flex-row justify-between items-center"     
      >
        <p>S/ {amount}</p>
        <p className="text-gray-600 text-base">{paymentDescription}</p>
        <p>24/01/2025</p>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Abrir menu</span>
            <MoreHorizontal/>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className='font-inter hover:cursor-pointer'>
          <DropdownMenuItem onClick={() => {setOpenEdit(true)}}>Ver detalles de pago</DropdownMenuItem>
          <DropdownMenuItem onClick={() => {setOpenEdit(true)}}>Editar</DropdownMenuItem>
          <DropdownMenuItem className="bg-red-600 hover:!bg-red-700 hover:!text-white text-white" onClick={() => setDeletePaymentOpen(true)}>Eliminar</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      </div>
      
      <DeletePaymentAlert isModalOpen={deletePaymentOpen} setIsModalOpen={setDeletePaymentOpen} paymentId={paymentId} />
      <EditPaymentSheet item={itemData} openEdit={openEdit} setOpenEdit={setOpenEdit}/>
    </>
  )
}