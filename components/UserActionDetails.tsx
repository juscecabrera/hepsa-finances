import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"

interface RowsProps {
    number: number;
    index: number;
    paid: boolean;
}



const Rows: React.FC<RowsProps> = ({ number, index, paid }) => {
    return (
        <div className="flex items-center justify-between p-2 bg-gray-100 rounded mb-2 h-12" key={index + number}>
                { !paid ? 
                <Button size="icon" variant="ghost"> <ChevronLeftIcon /> </Button>
                : ""
                }
            <motion.div
            className="flex items-center justify-between w-full"
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
                type: "spring",
                stiffness: 500,
                damping: 50,
            }}
            style={{
                filter: "blur(0px)",
            }}
            whileHover={{
                filter: "blur(0px)",
            }}
            whileTap={{
                filter: "blur(0px)",
            }}
            whileInView={{
                filter: "blur(0px)",
            }}
            >
                <span>S/ {number}</span>
                { paid ? 
                <Button size="icon" variant="ghost"> <ChevronRightIcon /> </Button>
                : ""
                }
            </motion.div>

        </div>
    )
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

interface UserActionProps {
    isModalOpen: boolean;
    setIsModalOpen: (open: boolean) => void;
    totalPaid: number;
    totalUnpaid: number;
    selectedPerson?: Person;
}


const UserAction: React.FC<UserActionProps> = ({ isModalOpen, setIsModalOpen, totalPaid, totalUnpaid, selectedPerson }) => {

  
   function getAmounts(payments: { id: number; amount: number; isPaid: number; personId: number }[], paid: boolean): number[] {
    if (paid) {
      return payments
        .filter(payment => payment.isPaid === 1)
        .map(payment => payment.amount);
    }
    else {
      return payments
        .filter(payment => payment.isPaid === 0)
        .map(payment => payment.amount);
    }
  }

  const personName = selectedPerson?.name

  const paymentsDone = getAmounts(selectedPerson?.payments || [], true)
  const paymentsNotDone = getAmounts(selectedPerson?.payments || [], false)

  return (
    <div>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            {/* {JSON.stringify(selectedPerson)} */}
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
                    {/* Aqui van las filas */}
                    {paymentsDone.map((number, index) => {
                        return (
                            <Rows number={number} index={index} paid={true} />
                        )
                    })}
                </div>
              </AnimatePresence>
              <Button className="my-2">Agregar pago</Button>
              <h3 className="my-2 font-semibold">S/ {totalPaid}</h3>
            </div>

            {/* Columna de Por Pagar */}
            <div>
              <h3 className="mb-2 font-semibold">Por Pagar</h3>
              <AnimatePresence>
                <div className="space-y-2">
                    {/* Aqui van las filas */}
                    {paymentsNotDone.map((number, index) => {
                        return (
                            <Rows number={number} index={index} paid={false} />
                        )
                    })}
                </div>
              </AnimatePresence>
                <Button className="my-2">Agregar pago</Button>
                <h3 className="my-2 font-semibold">S/ {totalUnpaid}</h3>
            </div>
          </div>
            </DialogContent>
        </Dialog>
    </div>
  )
}

export default UserAction