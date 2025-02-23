'use client'

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { X, Check } from "lucide-react"
import { AddPaymentSheet } from './AddPaymentSheet'

import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
  useSortable
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

interface Payment {
  id: string;
  amount: number;
}

interface Person {
    name: string;
}


interface UserActionDetailsProps {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  selectedPerson: Person;
}

interface SortableItemProps {
  id: string;
  amount: number;
}

const SortableItem: React.FC<SortableItemProps> = ({ id, amount }) => {
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

  return (
    <div 
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="my-4 text-lg bg-gray-200 p-3 rounded-md shadow-md font-medium cursor-move"
      
    >
      S/ {amount}
    </div>
  )
}

const UserActionDetails3: React.FC<UserActionDetailsProps> = ({
  isModalOpen,
  setIsModalOpen,
  selectedPerson
}) => {
  const [tableRows, setTableRows] = useState<{
    left: Payment[],
    right: Payment[]
  }>({
    left: [
      { id: 'l-1', amount: 0 },
      { id: 'l-2', amount: 2000 },
      { id: 'l-3', amount: 4000 }
    ],
    right: [
      { id: 'r-1', amount: 5000 },
      { id: 'r-2', amount: 1000 },
      { id: 'r-3', amount: 2000 }
    ]
  })

  // Estados para el input temporal en cada columna
  const [newPaymentLeft, setNewPaymentLeft] = useState<string | null>(null)
  const [newPaymentRight, setNewPaymentRight] = useState<string | null>(null)
  const [showAddPaymentModal, setshowAddPaymentModal] = useState<boolean>(false)

  // Estado interno para manejar la animación del modal
  const [showModal, setShowModal] = useState(isModalOpen)

  useEffect(() => {
    if (isModalOpen) {
      setShowModal(true)
    } else {
      // Esperamos 300ms para que la animación de fade-out termine antes de desmontar el modal
      const timeout = setTimeout(() => setShowModal(false), 300)
      return () => clearTimeout(timeout)
    }
  }, [isModalOpen])

  // Función para agregar un pago confirmado
  const confirmPayment = (side: "left" | "right", value: string) => {
    const parsed = parseFloat(value)
    if (!isNaN(parsed)) {
      setTableRows(prev => ({
        ...prev,
        [side]: [
          ...prev[side],
          { id: `${side}-${Date.now()}`, amount: parsed }
        ]
      }))
    }
    if (side === 'left') setNewPaymentLeft(null)
    else setNewPaymentRight(null)
  }

  // Función que maneja el final del drag para cada lista.
  const handleDragEnd = (side: "left" | "right") => (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    setTableRows(prev => {
      const currentList = prev[side]
      const oldIndex = currentList.findIndex(item => item.id === active.id)
      const newIndex = currentList.findIndex(item => item.id === over.id)
      return {
        ...prev,
        [side]: arrayMove(currentList, oldIndex, newIndex)
      }
    })
  }

  const addPayment = (side: 'left' | 'right') => {
    setshowAddPaymentModal(true)
  }

  const personName = selectedPerson?.name

  return (
    <>
      {showModal && (
        <div className={`fixed inset-0 flex items-center justify-center text-lg bg-black bg-opacity-50 transition-opacity duration-300 ${isModalOpen ? 'opacity-100' : 'opacity-0'}`}>
          <div className="sm:max-w-[800px] bg-white p-6 rounded-2xl shadow-xl w-full max-w-md">
            {/* Header del Modal */}
            <div className="flex w-full justify-end">
              <button onClick={() => setIsModalOpen(false)}><X /></button>
            </div>
            <div className="flex flex-col space-y-1.5 text-center sm:text-left">
              <h2 className="text-2xl font-semibold leading-none tracking-tight">{personName}</h2>
              <p className="text-sm text-muted-foreground">Descripcion de los pagos</p>
            </div>
            <div className='flex flex-row w-full justify-end'>
              <AddPaymentSheet />

            </div>


            <div className="grid grid-cols-2 gap-8 mt-3">
              {/* Columna Izquierda */}
              <div>
                <h3 className="text-lg mb-2 font-semibold">Por Pagar</h3>
                <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd('left')}>
                  <SortableContext items={tableRows.left.map(item => item.id)} strategy={verticalListSortingStrategy}>
                    {tableRows.left.map(item => (
                      <SortableItem key={item.id} id={item.id} amount={item.amount} />
                    ))}
                  </SortableContext>
                </DndContext>
                <h2>S/ 4000</h2>
              </div>

              {/* Columna Derecha */}
              <div>
                <h3 className="text-lg mb-2 font-semibold">Pagado</h3>
                <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd('right')}>
                  <SortableContext items={tableRows.right.map(item => item.id)} strategy={verticalListSortingStrategy}>
                    {tableRows.right.map(item => (
                      <SortableItem key={item.id} id={item.id} amount={item.amount} />
                    ))}
                  </SortableContext>
                </DndContext>
                <h2>S/ 4000</h2>


              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default UserActionDetails3
