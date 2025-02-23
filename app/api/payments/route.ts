import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()

    const isPaid = formData.get("isPaid") === "true"
    const amount = formData.get("amount")
    const date = formData.get("date")
    const description = formData.get("description")
    const receipt = formData.get("receipt") as File | null

    // Here you would typically save this data to your database
    // For this example, we'll just log it
    console.log({
      isPaid,
      amount,
      date,
      description,
      receiptName: receipt ? receipt.name : null,
    })

    // If you need to process the file, you can do so here
    // For example, you might upload it to a cloud storage service

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error("Error processing payment:", error)
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 })
  }
}

