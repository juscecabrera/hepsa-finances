'use client'

import React from 'react'
import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"

interface RowsProps {
    number: number;
    index: number;
    paid: boolean;
    setTableRows: React.Dispatch<React.SetStateAction<{ left: number[]; right: number[] }>>;
    tableRows: {"left": number[], "right": number[]};
}

const Rows: React.FC<RowsProps> = ({ number, index, paid, setTableRows, tableRows }) => {

    const handleTransfer = (rtol: boolean) => {
        setTableRows(prev => {
            const source = rtol ? 'right' : 'left';
            const destination = rtol ? 'left' : 'right';
            
            const newSource = [...prev[source]];
            const newDestination = [...prev[destination]];
            
            const movingNumber = newSource[index];
            newSource[index] = 0; // Dejar vacía la posición en la columna de origen
            
            if (newDestination[index] === 0) {
                newDestination[index] = movingNumber;
            } else {
                newDestination.splice(index, 0, movingNumber);
            }
            
            return {
                ...prev,
                [source]: newSource.filter(num => num !== 0), // Eliminar los ceros
                [destination]: newDestination
            };
        });
    };
    
    return (
        <motion.div
            className="flex items-center justify-between p-2 bg-gray-100 rounded mb-2 h-12"
            key={index + number}
            initial={{ opacity: 0.9, x: paid ? 5 : -5, filter: "blur(1px)" }}
            animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, x: paid ? -5 : 5, filter: "blur(1px)" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
        >
            {!paid && <Button size="icon" variant="ghost" onClick={() => handleTransfer(true)}> <ChevronLeftIcon /> </Button>}
            <span>{number === 0 ? "Vacío" : `S/ ${number}`}</span>
            {paid && <Button size="icon" variant="ghost" onClick={() => handleTransfer(false)}> <ChevronRightIcon /> </Button>}
        </motion.div>
    );
}

interface Payment {
    id: number;
    amount: number;
    isPaid: number;
    personId: number;
}

interface Person {
    name: string;
    payments: Payment[];
}

interface UserActionDetailsProps {
    isModalOpen: boolean;
    setIsModalOpen: (open: boolean) => void;
    totalPaid: number;
    totalUnpaid: number;
    selectedPerson?: Person;
}


const UserActionDetails: React.FC<UserActionDetailsProps> = ({ isModalOpen, setIsModalOpen, totalPaid, totalUnpaid, selectedPerson }) => {
    // const [tableRows, setTableRows] = useState([[0, 2000, 4000], [5000, 1000, 2000]])
    const [tableRows, setTableRows] = useState({
        'left': [0, 2000, 4000],
        'right': [5000, 1000, 2000]
    })

    const addPayment = (side: 'left' | 'right') => {
        setTableRows(prev => ({
            ...prev,
            [side]: [...prev[side], 0] // Agregar un espacio vacío
        }));
    };


   function getAmounts(payments: Payment[], paid: boolean): number[] {
    if (paid) {
      return payments.filter(payment => payment.isPaid === 1).map(payment => payment.amount);
    }
    else {
      return payments.filter(payment => payment.isPaid === 0).map(payment => payment.amount);
    }
  }

  const personName = selectedPerson?.name

  const paymentsDone = getAmounts(selectedPerson?.payments || [], true)
  const paymentsNotDone = getAmounts(selectedPerson?.payments || [], false)

  return (
    <div>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogContent className='sm:max-w-[800px] font-inter'>
                <DialogHeader>
                    <DialogTitle>{personName}</DialogTitle>
                    <DialogDescription>Detalles de pagos</DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-8">
            
            {/* Columna de pagado */}
            <div>
              <h3 className="mb-2 font-semibold">Pagado</h3>
              <AnimatePresence>
              <div className="space-y-2">
                    {tableRows.left.map((number, index) => (
                        <Rows key={`left-${index}`} number={number} index={index} paid={true} setTableRows={setTableRows} tableRows={tableRows} />
                    ))}
                </div>
              </AnimatePresence>
                <Button className="my-2" onClick={() => addPayment('left')}>Agregar pago</Button>
                <h3 className="my-2 font-semibold">S/ {totalPaid}</h3>
            </div>

            {/* Columna de Por Pagar */}
            <div>
              <h3 className="mb-2 font-semibold">Por Pagar</h3>
              <AnimatePresence>
                <div className="space-y-2">
                    {tableRows.right.map((number, index) => (
                        <Rows key={`right-${index}`} number={number} index={index} paid={false} setTableRows={setTableRows} tableRows={tableRows} />
                    ))}
                </div>
              </AnimatePresence>
                <Button className="my-2" onClick={() => addPayment('right')}>Agregar pago</Button>
                <h3 className="my-2 font-semibold">S/ {totalUnpaid}</h3>
            </div>
          </div>
            </DialogContent>
        </Dialog>
    </div>
  )
}

export default UserActionDetails