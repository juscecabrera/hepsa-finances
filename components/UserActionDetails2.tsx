"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import {
  DndContext,
  closestCenter,
  DragOverlay,
  type DragStartEvent,
  type DragMoveEvent,
  type DragEndEvent,
} from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy, arrayMove } from "@dnd-kit/sortable"
import SortableItem from "./SortableItem"

interface Payment {
  id: number
  amount: number
  isPaid: boolean
  personId: number
}

interface Person {
  name: string
  payments: Payment[]
}

interface UserActionDetailsProps {
  isModalOpen: boolean
  setIsModalOpen: (open: boolean) => void
  totalPaid: number
  totalUnpaid: number
  selectedPerson?: Person
}

const UserActionDetails: React.FC<UserActionDetailsProps> = ({
  isModalOpen,
  setIsModalOpen,
  totalPaid,
  totalUnpaid,
  selectedPerson,
}) => {
  const [payments, setPayments] = useState<Payment[]>([])
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 })
  const [activeItem, setActiveItem] = useState<Payment | null>(null)

  useEffect(() => {
    if (selectedPerson) {
      setPayments(selectedPerson.payments)
    }
  }, [selectedPerson])

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setCursorPosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener("mousemove", updateMousePosition)
    return () => window.removeEventListener("mousemove", updateMousePosition)
  }, [])

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    setActiveItem(payments.find((payment) => payment.id === active.id) || null)
  }

  const handleDragMove = (event: DragMoveEvent) => {
    if ("clientX" in event.activatorEvent && "clientY" in event.activatorEvent) {
      setCursorPosition({
        x: (event.activatorEvent as MouseEvent).clientX,
        y: (event.activatorEvent as MouseEvent).clientY,
      })
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveItem(null)

    if (!over) return

    if (active.id !== over.id) {
      setPayments((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id)
        const newIndex = items.findIndex((item) => item.id === over.id)
        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }

  const handleTransfer = (paymentId: number) => {
    setPayments((prevPayments) =>
      prevPayments.map((payment) => (payment.id === paymentId ? { ...payment, isPaid: !payment.isPaid } : payment)),
    )
  }

  const addPayment = (isPaid: boolean) => {
    const newPayment: Payment = {
      id: Date.now(),
      amount: 0,
      isPaid: isPaid,
      personId: selectedPerson?.payments[0]?.personId || 0,
    }
    setPayments((prev) => [...prev, newPayment])
  }

  const paidPayments = payments.filter((p) => p.isPaid)
  const unpaidPayments = payments.filter((p) => !p.isPaid)

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogContent className="sm:max-w-[800px] font-inter">
        <DialogHeader>
          <DialogTitle>{selectedPerson?.name}</DialogTitle>
          <DialogDescription>Detalles de pagos</DialogDescription>
        </DialogHeader>
        <DndContext
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragMove={handleDragMove}
          onDragEnd={handleDragEnd}
        >
          <div className="grid grid-cols-2 gap-8">
            {[
              { title: "Pagado", items: paidPayments, isPaid: true },
              { title: "Por Pagar", items: unpaidPayments, isPaid: false },
            ].map(({ title, items, isPaid }) => (
              <div key={title}>
                <h3 className="mb-2 font-semibold">{title}</h3>
                <SortableContext items={items.map((p) => p.id)} strategy={verticalListSortingStrategy}>
                  <div className="space-y-2">
                    <AnimatePresence>
                      {items.map((payment) => (
                        <SortableItem
                          key={payment.id}
                          id={payment.id}
                          payment={payment}
                          onTransfer={() => handleTransfer(payment.id)}
                          isPaidColumn={isPaid}
                        />
                      ))}
                      {Array(4 - items.length)
                        .fill(null)
                        .map((_, index) => (
                          <div key={`empty-${isPaid ? "paid" : "unpaid"}-${index}`} className="h-12 mb-2" />
                        ))}
                    </AnimatePresence>
                  </div>
                </SortableContext>
                <Button className="my-2" onClick={() => addPayment(isPaid)}>
                  Agregar pago
                </Button>
                <h3 className="my-2 font-semibold">S/ {isPaid ? totalPaid : totalUnpaid}</h3>
              </div>
            ))}
          </div>
          <DragOverlay>
            {activeItem && (
              <motion.div
                animate={{
                  scale: 1.05,
                  opacity: 0.8,
                  x: cursorPosition.x,
                  y: cursorPosition.y,
                }}
                className="bg-blue-300 p-3 rounded-md shadow-lg fixed"
              >
                S/ {activeItem.amount}
              </motion.div>
            )}
          </DragOverlay>
        </DndContext>
      </DialogContent>
    </Dialog>
  )
}

export default UserActionDetails

