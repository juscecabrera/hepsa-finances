'use client'

import React from "react";
import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { EditPaymentSheet } from "./EditPaymentSheet";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"


interface SortableItemProps {
  id: string;
  amount: number;
}

export const SortableItem: React.FC<SortableItemProps> = ({ id, amount }) => {
  const [openEdit, setOpenEdit] = useState(false);

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


  return (
    <>
      <div 
        // ref={setNodeRef}
        // style={style}
        // {...attributes}
        // {...listeners}
        className="my-4 text-lg bg-gray-200 p-3 rounded-md shadow-md font-medium hover:cursor-pointer flex flex-row justify-between"     
      >
        S/ {amount}
        
      <DropdownMenu>
        <DropdownMenuTrigger asChild >
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Abrir menu</span>
            <MoreHorizontal/>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className='font-inter hover:cursor-pointer z-100'>
            <DropdownMenuItem onClick={() => {
              setOpenEdit(true)
            }}>
              Ver detalles de pago
            </DropdownMenuItem>
          {/* <DropdownMenuItem>Editar</DropdownMenuItem> */}
        </DropdownMenuContent>
      </DropdownMenu>
      </div>
      
      <EditPaymentSheet item={itemData} openEdit={openEdit} setOpenEdit={setOpenEdit}/>
    </>
  )
}