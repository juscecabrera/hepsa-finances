"use client"


import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import AddUserDialog from "@/components/AddUserDialog"
import UserActionDetails3 from "@/components/UserActionDetails3"
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

// const getTotalPaid = (person: Person | null, paid: boolean): number => {
//   if (!person) return 0;
//   if (paid) {
//     return person.payments.reduce((sum, payment) => 
//       payment.isPaid ? sum + payment.amount : sum,
//     0);
//   } else {
//     return person.payments.reduce((sum, payment) => 
//       !(payment.isPaid) ? sum + payment.amount : sum,
//     0);
//   }
// };

interface MoneyTableProps {
  company: string
}

export const MoneyTable: React.FC<MoneyTableProps> = ( { company } ) => {
  const [people, setPeople] = useState<Person[]>([])
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isModalEditOpen, setIsModalEditOpen] = useState(false)
  const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false)
  
  const loadData = async () => {
    try {
      const res = await fetch('/api/workers')
      
      if (res.ok) {
        const createdPerson = await res.json();
        setPeople(createdPerson)
        console.log('Succeed', createdPerson)
      } else {
        const errorData = await res.json();
        console.log(errorData)
      }
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    loadData()
  }, [isModalOpen, isModalEditOpen, isModalDeleteOpen])

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
    <div className={`container mx-auto py-10 font-inter`}>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">{company}</CardTitle>
          <CardDescription>Resumen de los pagos por hacer a trabajadores de {company}</CardDescription>
        </CardHeader>
        <CardContent>
          <AddUserDialog />
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Por Pagar Total</TableHead>
                <TableHead>Semana Regular</TableHead>
                <TableHead>CTS</TableHead>
                <TableHead>Gratificaciones</TableHead>
                <TableHead>Horas Extra</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {people.map((person) => (
                <TableRow key={person.id} className="font-inter">
                  <TableCell className="font-medium font-inter">{person.name}</TableCell>
                  <TableCell className="font-inter font-bold">S/ {person.amount.toLocaleString()}</TableCell>
                  <TableCell className="font-inter font-medium">S/ {person.amount.toLocaleString()}</TableCell>
                  <TableCell className="font-inter font-medium">S/ {person.amount.toLocaleString()}</TableCell>
                  <TableCell className="font-inter font-medium">S/ {person.amount.toLocaleString()}</TableCell>
                  <TableCell className="font-inter font-medium">S/ {person.amount.toLocaleString()}</TableCell>
                  <TableCell className="text-right font-inter">
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

      <UserActionDetails3 isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} selectedPerson={selectedPerson} />

      <UserActionEdit isModalOpen={isModalEditOpen} setIsModalOpen={setIsModalEditOpen}  selectedPerson={selectedPerson} />
      <UserActionDelete isModalOpen={isModalDeleteOpen} setIsModalOpen={setIsModalDeleteOpen} selectedPerson={selectedPerson} />
    </div>
  )
}

