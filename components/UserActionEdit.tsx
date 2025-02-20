import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"

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

interface UserActionEditProps {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  selectedPerson?: Person;
  // totalPaid: number;
  // totalUnpaid: number;
}

const UserActionEdit: React.FC<UserActionEditProps> = ({ isModalOpen, setIsModalOpen, selectedPerson }) => {

  const personName = selectedPerson?.name

  return (
    <div>
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className='font-inter'>
          <DialogHeader>
            <DialogTitle>Editar {personName}</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default UserActionEdit