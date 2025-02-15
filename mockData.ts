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
  
export const initialPeople: Person[] = [
    {
      id: 1,
      name: "Obrero 1",
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
  ];
