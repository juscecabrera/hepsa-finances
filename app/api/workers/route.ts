import { NextResponse } from "next/server"
import sqlite3 from "sqlite3"
import { open } from "sqlite"

// Initialize the database
async function openDb() {
  return open({
    filename: "./database.sqlite",
    driver: sqlite3.Database,
  })
}

export async function GET(request: Request) {
    try {
      const db = await openDb()
  
      // Fetch all users from the database
      const persons = await db.all("SELECT * FROM persons")
  
      for (const person of persons) {
        person.payments = await db.all('SELECT * FROM payments WHERE personId = ?', person.id);
      }

      await db.close()
  
      return NextResponse.json(persons)
    } catch (error) {
      console.error("Error:", error)
      return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
    }
  }


export async function POST(request: Request) {
  try {
    const { name, amount } = await request.json()

    const db = await openDb()
    
    //Verificar con floats, decimales, etc. 
    const totalAmount = Number(amount.Paid + amount.NotPaid)
    
    const paidAmount = amount.Paid
    const notPaidAmount = amount.NotPaid
    
    // Insert the new user
    const result = await db.run("INSERT INTO persons (name, amount) VALUES (?, ?)", [name, totalAmount])

    const personId = result.lastID

    //Falta ingresar los pagos en payments
    
    const paymentsInsertPaid = await db.run("INSERT INTO payments (amount, isPaid, personId) VALUES (?, ?, ?)", [paidAmount, 1, personId])
    
    const paymentsInsertNotPaid = await db.run("INSERT INTO payments (amount, isPaid, personId) VALUES (?, ?, ?)", [notPaidAmount, 0, personId])

    // if (Array.isArray(payments)) {
    //     for (const payment of payments) {
    //     console.log('payment', payment);
    
    //     await new Promise((resolve, reject) => {
    //         db.run(
    //         'INSERT INTO payments (id, amount, isPaid, personId) VALUES (?, ?, ?, ?)',
    //         [payment.id, payment.amount, payment.isPaid ? 1 : 0, personId],
    //         function (err) {
    //             if (err) reject(err);
    //             else resolve();
    //         }
    //         );
    //     });
    //     }
    // }

    
    await db.close()

    return NextResponse.json({ success: true, id: result.lastID }, { status: 201 })
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json({ success: false, error: "Failed to add user" }, { status: 500 })
  }
}

export async function PUT (request: Request) {
  try {
    const db = await openDb()
    
    const { personId, newName } = await request.json()

    const result = await db.run(`UPDATE persons SET name = ? WHERE id = ?`, [newName, personId])
    
    await db.close()

    return NextResponse.json({ success: true, id: result.lastID }, { status: 200 })
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json({ success: false, error: "Failed to edit user" }, { status: 500 })
  }
}

export async function DELETE (request: Request) {
  try {
    const db = await openDb()

    const { personId } = await request.json()

    const result = await db.run('DELETE FROM persons WHERE id = ?', personId)
    
    await db.close()

    return NextResponse.json({ success: true, id: result.lastID }, { status: 200 })
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json({ success: false, error: "Failed to delete user" }, { status: 500 })
  }
}
