"use client"
import { Input } from "@/components/ui/input"
import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { inter } from "./fonts"
import { initialPeople } from "@/mockData" 
import { Label } from "@radix-ui/react-label"
import AddUserDialog from "@/components/AddUserDialog"

type Payment = {
  id: string
  amount: number
  isPaid: boolean
}

type Person = {
  id: number
  name: string
  amount: number
  payments: Payment[]
}

const getTotalPaid = (person: Person | null, paid: boolean): number => {
  if (!person) return 0;
  
  if (paid) {
    return person.payments.reduce((sum, payment) => 
      payment.isPaid ? sum + payment.amount : sum,
    0);
  } else {
    return person.payments.reduce((sum, payment) => 
      !(payment.isPaid) ? sum + payment.amount : sum,
    0);
  }

  
};


export default function MoneyTable() {
  const [people, setPeople] = useState<Person[]>([])
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  
  useEffect(() => {
    const loadData = async () => {
      try {
        //esto es POST
        // const res = await fetch('/api/persons', {
        //   method: 'POST',
        //   body: JSON.stringify(initialPeople[0])
        // });

        //esto es GET con persons

        const res = await fetch('/api/persons')
        
        //esto es GET con workers (testing nueva ruta)
        
        // const res = await fetch('/api/workers')
        
        if (res.ok) {
          const createdPerson = await res.json();
          setPeople(createdPerson)
          console.log('Succeed', createdPerson)
        } else {
          const errorData = await res.json();
          console.log(errorData)
        }
      } catch (error: any) {
        console.error(error.message)
      }
    }

    loadData()
    
  }, [])

  const handleSeeMore = (person: Person) => {
    setSelectedPerson(person)
    setIsModalOpen(true)
  }

  const handleTransfer = (paymentId: string) => {
    if (selectedPerson) {
      const updatedPerson = { ...selectedPerson }
      const paymentIndex = updatedPerson.payments.findIndex((p) => p.id === paymentId)
      if (paymentIndex !== -1) {
        updatedPerson.payments[paymentIndex].isPaid = !updatedPerson.payments[paymentIndex].isPaid
      }

      setPeople(people.map((p) => (p.id === updatedPerson.id ? updatedPerson : p)))
      setSelectedPerson(updatedPerson)
    }
  }

  const renderPaymentRow = (payment: number | null, index: number, isPaidColumn: boolean) => (
    <div
      key={payment || `empty-${isPaidColumn ? "paid" : "unpaid"}-${index}`}
      className="flex items-center justify-between p-2 bg-gray-100 rounded mb-2 h-12"
    >
      {payment ? (
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
          <span>S/ {payment.toLocaleString()}</span>
          <Button onClick={() => handleTransfer(payment)} size="icon" variant="ghost">
            {isPaidColumn ? <ChevronRightIcon className="h-4 w-4" /> : <ChevronLeftIcon className="h-4 w-4" />}
          </Button>
        </motion.div>
      ) : (
        <span className="text-gray-400">Empty</span>
      )}
    </div>
  )

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

  return (
    <div className={`container mx-auto py-10 ${inter.className}`}>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Financial Overview</CardTitle>
          <CardDescription>A summary of people and their financial status</CardDescription>
        </CardHeader>
        <CardContent>
          <AddUserDialog />
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Cantidad</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {people.map((person) => (
                <TableRow key={person.id}>
                  <TableCell className="font-medium">{person.name}</TableCell>
                  <TableCell>${person.amount.toLocaleString()}</TableCell>
                  <TableCell className="text-right">
                    <Button onClick={() => handleSeeMore(person)}>Ver más</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Modal  */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[800px] font-inter">
          <DialogHeader>
            <DialogTitle>{selectedPerson?.name}</DialogTitle>
            <DialogDescription>Detalles de pagos</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-8">
            
            {/* Columna de pagado */}
            <div>
              <h3 className="mb-2 font-semibold">Pagado</h3>
              <AnimatePresence>
                <div className="space-y-2">
                  {(getAmounts(selectedPerson?.payments || [], true)).map((amount, index) => {
                    return renderPaymentRow(amount, index, true)
                  })}
                </div>
              </AnimatePresence>
              <Button className="my-2" onClick={() => {selectedPerson?.payments.push({ id: "a5", amount: 1000, isPaid: true })}}>Agregar pago</Button>
              <h3 className="my-2 font-semibold">S/ {getTotalPaid(selectedPerson, true)}</h3>
            </div>

            {/* Columna de Por Pagar */}
            <div>
              <h3 className="mb-2 font-semibold">Por Pagar</h3>
              <AnimatePresence>
                <div className="space-y-2">
                  {(getAmounts(selectedPerson?.payments || [], false)).map((amount, index) => {
                    return renderPaymentRow(amount, index, true)
                  })}
                </div>
              </AnimatePresence>
                <Button className="my-2">Agregar pago</Button>
                <h3 className="my-2 font-semibold">S/ {getTotalPaid(selectedPerson, false)}</h3>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

