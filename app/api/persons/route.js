import { openDb } from '@/lib/db';
import { initDb } from '@/lib/initDb';

// Inicializa la DB (se recomienda hacerlo una sola vez al inicio de la app)
// initDb();
const db = await openDb();

export const GET = async (req, res) => {
    try {
        const persons = await db.all('SELECT * FROM persons');
      
        // Para cada persona, consulta sus pagos
        for (const person of persons) {
            person.payments = await db.all('SELECT * FROM payments WHERE personId = ?', person.id);
        }
    
        return new Response(JSON.stringify(persons), { status: 200 })
    } catch (error) {
        return new Response("Failed to create a new prompt", { status: 500 });
  }
}

export const POST = async (req) => {

    try {
        // const { name, amount, payments } = await req.json();
        const body = await req.json();
        
        const name = body.name
        const amount = body.amount 
        const payments = body.payments
        
        if (!name || amount === undefined) {
            return res.status(400).json({ error: 'Falta nombre o monto' });
        }

        // Inserta la persona
        const result = await new Promise((resolve, reject) => {
            db.run(
            'INSERT INTO persons (name, amount) VALUES (?, ?)',
            [name, amount],
            function (err) {
                if (err) reject(err);
                else resolve(this.lastID);
            }
            );
        });
        const personId = result;
        
        // Inserta cada pago, si es que existen
        if (Array.isArray(payments)) {
            for (const payment of payments) {
            console.log('payment', payment);
        
            await new Promise((resolve, reject) => {
                db.run(
                'INSERT INTO payments (id, amount, isPaid, personId) VALUES (?, ?, ?, ?)',
                [payment.id, payment.amount, payment.isPaid ? 1 : 0, personId],
                function (err) {
                    if (err) reject(err);
                    else resolve();
                }
                );
            });
            }
        }
        
        // Retorna la persona creada junto con sus pagos
        const newPerson = await new Promise((resolve, reject) => {
            db.get('SELECT * FROM persons WHERE id = ?', [personId], (err, row) => {
            if (err) reject(err);
            else resolve(row);
            });
        });
        
        newPerson.payments = await new Promise((resolve, reject) => {
            db.all('SELECT * FROM payments WHERE personId = ?', [personId], (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
            });
        });

        return new Response(JSON.stringify(newPerson), { status: 201 })
    } catch (error) {
        return new Response("Failed to create a new prompt", { status: 500 });
    }
}
