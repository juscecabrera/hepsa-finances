"use client"
// import { Input } from "@/components/ui/input"
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
// import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
// import { motion, AnimatePresence } from "framer-motion"
// import { Label } from "@radix-ui/react-label"
import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { inter } from "./fonts"
import AddUserDialog from "@/components/AddUserDialog"
import UserActionDetails from "@/components/UserActionDetails"
import UserActionEdit from "@/components/UserActionEdit"
import UserActionDelete from "@/components/UserActionDelete"

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
  const [isModalEditOpen, setIsModalEditOpen] = useState(false)
  const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false)
  
  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetch('/api/persons')
        
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

  const handleEditUser = (person: Person) => {
    setSelectedPerson(person)
    setIsModalEditOpen(true)
  }

  const handleDeleteUser = (person: Person) => {
    setSelectedPerson(person)
    setIsModalDeleteOpen(true)
  }

  return (
    <div className={`container mx-auto py-10 ${inter.className}`}>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Finanzas Trabajadores Hepsa</CardTitle>
          <CardDescription>Resumen de los pagos por hacer a trabajadores de Hepsa</CardDescription>
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
                    <Button onClick={() => handleSeeMore(person)} className="mr-5">Ver más</Button>
                    <Button onClick={() => handleEditUser(person)} className="mr-5">Editar</Button>
                    <Button onClick={() => handleDeleteUser(person)} className="bg-red-600 hover:bg-red-700">Eliminar</Button>

                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <UserActionDetails isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} selectedPerson={selectedPerson} totalPaid={getTotalPaid(selectedPerson, true)} totalUnpaid={getTotalPaid(selectedPerson, false)}/>

      <UserActionEdit isModalOpen={isModalEditOpen} setIsModalOpen={setIsModalEditOpen}  selectedPerson={selectedPerson} />
      <UserActionDelete isModalOpen={isModalDeleteOpen} setIsModalOpen={setIsModalDeleteOpen} selectedPerson={selectedPerson} />
    </div>
  )
}

