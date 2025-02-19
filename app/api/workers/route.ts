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

export async function GET() {
    try {
      const db = await openDb()
  
      // Fetch all users from the database
      const users = await db.all("SELECT * FROM workers")
  
      await db.close()
  
      return NextResponse.json(users)
    } catch (error) {
      console.error("Error:", error)
      return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
    }
  }


export async function POST(request: Request) {
  try {
    const { name, amount } = await request.json()

    const db = await openDb()

    // Create the users table if it doesn't exist
    await db.exec(`
      CREATE TABLE IF NOT EXISTS workers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        amount REAL
      )
    `)

    // Insert the new user
    const result = await db.run("INSERT INTO workers (name, amount) VALUES (?, ?)", [name, amount])

    await db.close()

    return NextResponse.json({ success: true, id: result.lastID }, { status: 201 })
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json({ success: false, error: "Failed to add user" }, { status: 500 })
  }
}

