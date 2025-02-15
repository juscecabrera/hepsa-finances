import type { NextApiRequest, NextApiResponse } from 'next';
import { openDb } from '@/lib/db';
import { initDb } from '@/lib/initDb';

// Inicializa la DB (se recomienda hacerlo una sola vez al inicio de la app)
initDb();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const db = await openDb();

  if (req.method === 'GET') {
    try {
      // Consulta todas las personas
      const persons = await db.all('SELECT * FROM persons');
      
      // Para cada persona, consulta sus pagos
      for (const person of persons) {
        person.payments = await db.all('SELECT * FROM payments WHERE personId = ?', person.id);
      }
      
      res.status(200).json(persons);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  if (req.method === 'POST') {
    try {
      const { name, amount, payments } = req.body;
      if (!name || amount === undefined) {
        return res.status(400).json({ error: 'Falta nombre o monto' });
      }

      // Inserta la persona
      const result = await db.run(
        'INSERT INTO persons (name, amount) VALUES (?, ?)',
        name,
        amount
      );
      const personId = result.lastID;

      // Inserta cada pago, si es que existen
      if (Array.isArray(payments)) {
        for (const payment of payments) {
          // Se espera que cada pago tenga { id, amount, isPaid }
          await db.run(
            'INSERT INTO payments (id, amount, isPaid, personId) VALUES (?, ?, ?, ?)',
            payment.id,
            payment.amount,
            payment.isPaid ? 1 : 0,
            personId
          );
        }
      }

      // Retorna la persona creada junto con sus pagos
      const newPerson = await db.get('SELECT * FROM persons WHERE id = ?', personId);
      newPerson.payments = await db.all('SELECT * FROM payments WHERE personId = ?', personId);

      res.status(201).json(newPerson);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}
