'use client'

import React, { useState, useEffect } from 'react'
// import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { AddPaymentSheet } from './AddPaymentSheet'
// import { EditPaymentSheet } from './EditPaymentSheet'
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable'
import { SortableItem } from './SortableItem'

interface Payment {
  id: string
  amount: number
  description: string
  dateOfPayment: string | null
  dateOfPromise: string
}
  
interface Person {
  name: string;
}

interface UserActionDetailsProps {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  selectedPerson: Person | null;
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
      { id: 'l-1', amount: 1000, description: 'Semana Regular 10', dateOfPayment: '20/01/2025', dateOfPromise: '' },
      { id: 'l-2', amount: 2000, description: 'Semana Regular 10', dateOfPayment: '', dateOfPromise: '' },
      { id: 'l-3', amount: 4000, description: 'Semana Regular 10', dateOfPayment: '', dateOfPromise: '' }
    ],
    right: [
      { id: 'r-1', amount: 5000, description: 'Semana Regular 10', dateOfPayment: '', dateOfPromise: ''  },
      { id: 'r-2', amount: 1000, description: 'Semana Regular 10', dateOfPayment: '', dateOfPromise: ''  },
      { id: 'r-3', amount: 2000, description: 'Semana Regular 10', dateOfPayment: '', dateOfPromise: ''  }
    ]
  })

  // Estados para el input temporal en cada columna
  // const [selectedItem, setSelectedItem] = useState<{ id: string, amount: string } | null>(null);

  // Estado interno para manejar la animación del modal
  const [showModal, setShowModal] = useState(isModalOpen)

  const [fecha, setFecha] = useState('');

  useEffect(() => {
    const actualizarFecha = () => {
      const fechaActual = new Date();
      setFecha(fechaActual.toLocaleDateString('es-ES', {
        weekday: "long", 
        year: "numeric", 
        month: "long", 
        day: "numeric", 
        hour: "2-digit", 
        minute: "2-digit", 
        second: "2-digit"
      }));
    };

    // Actualiza la fecha inmediatamente y luego cada segundo
    actualizarFecha();
    const intervalo = setInterval(actualizarFecha, 1000);

    // Limpieza del intervalo al desmontar el componente
    return () => clearInterval(intervalo);
  }, []);


  useEffect(() => {
    if (isModalOpen) {
      setShowModal(true)
    } else {
      // Esperamos 300ms para que la animación de fade-out termine antes de desmontar el modal
      const timeout = setTimeout(() => setShowModal(false), 300)
      return () => clearTimeout(timeout)
    }
  }, [isModalOpen])

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

  const personName = selectedPerson?.name


  return (
    <>
      {showModal && (
        <div className={`fixed z-50 inset-0 flex items-center justify-center text-lg bg-black bg-opacity-50 transition-opacity duration-300 ${isModalOpen ? 'opacity-100' : 'opacity-0'}`}>
          <div className="sm:max-w-[1100px] bg-white p-10 rounded-2xl shadow-xl w-full max-w-md">
            {/* Header del Modal */}
            <div className="flex w-full justify-end">
              <button onClick={() => setIsModalOpen(false)}><X /></button>
            </div>
            <div className="flex flex-col space-y-1.5 text-center sm:text-left">
              <h2>{fecha}</h2>
              <h2 className="text-2xl font-semibold leading-none tracking-tight">{personName}</h2>
              <p className="text-sm text-muted-foreground">Descripcion de los pagos</p>
            </div>
            <div className='flex flex-row justify-end'>
              <AddPaymentSheet />

            </div>


            <div className="grid grid-cols-2 gap-8 mt-3">
              {/* Columna Izquierda */}
              <div>
                <div className='flex flex-row justify-between'>
                  <h3 className="text-lg mb-2 font-semibold">Por Pagar</h3>
                  <h3 className="text-lg mb-2 font-semibold">Motivo</h3>
                  <h3 className="text-lg mb-2 font-semibold">Fecha de pago</h3>

                </div>
                <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd('left')}>
                  <SortableContext items={tableRows.left.map(item => item.id)} strategy={verticalListSortingStrategy}>
                    {tableRows.left.map(item => (
                      <>
                        {/* Darle click al SortableItem tiene que ser el trigger del EditPaymentSheet */}
                          <SortableItem 
                            key={item.amount} 
                            id={item.id} 
                            amount={item.amount} 
                          />
                      </>
                      
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
                      <SortableItem 
                        key={item.amount} 
                        id={item.id} 
                        amount={item.amount} 
                      />
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
