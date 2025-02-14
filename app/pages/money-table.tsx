"use client"
import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { inter } from "./fonts"

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

const initialPeople: Person[] = [
  {
    id: 1,
    name: "Alice Johnson",
    amount: 5000,
    payments: [
      { id: "a1", amount: 1000, isPaid: true },
      { id: "a2", amount: 2000, isPaid: true },
      { id: "a3", amount: 1000, isPaid: false },
      { id: "a4", amount: 1000, isPaid: false },
    ],
  },
  {
    id: 2,
    name: "Bob Smith",
    amount: 7500,
    payments: [
      { id: "b1", amount: 3000, isPaid: true },
      { id: "b2", amount: 2000, isPaid: true },
      { id: "b3", amount: 1500, isPaid: false },
      { id: "b4", amount: 1000, isPaid: false },
    ],
  },
  {
    id: 3,
    name: "Charlie Brown",
    amount: 3200,
    payments: [
      { id: "c1", amount: 1000, isPaid: true },
      { id: "c2", amount: 1200, isPaid: false },
      { id: "c3", amount: 1000, isPaid: false },
    ],
  },
  {
    id: 4,
    name: "Diana Martinez",
    amount: 9800,
    payments: [
      { id: "d1", amount: 5000, isPaid: true },
      { id: "d2", amount: 3000, isPaid: true },
      { id: "d3", amount: 1800, isPaid: false },
    ],
  },
  {
    id: 5,
    name: "Ethan Lee",
    amount: 6400,
    payments: [
      { id: "e1", amount: 2000, isPaid: true },
      { id: "e2", amount: 2000, isPaid: true },
      { id: "e3", amount: 1400, isPaid: false },
      { id: "e4", amount: 1000, isPaid: false },
    ],
  },
]

export default function MoneyTable() {
  const [people, setPeople] = useState<Person[]>(initialPeople)
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

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

  const renderPaymentRow = (payment: Payment | null, index: number, isPaidColumn: boolean) => (
    <div
      key={payment?.id || `empty-${isPaidColumn ? "paid" : "unpaid"}-${index}`}
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
          <span>${payment.amount.toLocaleString()}</span>
          <Button onClick={() => handleTransfer(payment.id)} size="icon" variant="ghost">
            {isPaidColumn ? <ChevronRightIcon className="h-4 w-4" /> : <ChevronLeftIcon className="h-4 w-4" />}
          </Button>
        </motion.div>
      ) : (
        <span className="text-gray-400">Empty</span>
      )}
    </div>
  )

  return (
    <div className={`container mx-auto py-10 ${inter.className}`}>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Financial Overview</CardTitle>
          <CardDescription>A summary of people and their financial status</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {people.map((person) => (
                <TableRow key={person.id}>
                  <TableCell className="font-medium">{person.name}</TableCell>
                  <TableCell>${person.amount.toLocaleString()}</TableCell>
                  <TableCell className="text-right">
                    <Button onClick={() => handleSeeMore(person)}>See more</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[800px] font-inter">
          <DialogHeader>
            <DialogTitle>{selectedPerson?.name}</DialogTitle>
            <DialogDescription>Financial details and payment management</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h3 className="mb-2 font-semibold">Pagado</h3>
              <AnimatePresence>
                <div className="space-y-2">
                  {Array.from({ length: 4 }).map((_, index) => {
                    const payment = selectedPerson?.payments.find((p) => p.isPaid && p.id.endsWith(String(index + 1)))
                    return renderPaymentRow(payment || null, index, true)
                  })}
                </div>
              </AnimatePresence>
            </div>
            <div>
              <h3 className="mb-2 font-semibold">Por Pagar</h3>
              <AnimatePresence>
                <div className="space-y-2">
                  {Array.from({ length: 4 }).map((_, index) => {
                    const payment = selectedPerson?.payments.find((p) => !p.isPaid && p.id.endsWith(String(index + 1)))
                    return renderPaymentRow(payment || null, index, false)
                  })}
                </div>
              </AnimatePresence>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

