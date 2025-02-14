// pages/index.tsx
import { GetServerSideProps } from 'next'
import { useState, useEffect } from 'react'
import os from 'os'


interface Props {
  serverIP: string
}

interface NetworkInterfaceInfo {
    address: string;
    netmask: string;
    family: string;
    mac: string;
    internal: boolean;
    cidr: string | null;
    scopeid?: number;
  }
  

export default function Home({ serverIP }: Props) {
  const [clientIP, setClientIP] = useState<string>('')

  useEffect(() => {
    // Obtener la IP del cliente desde una API
    fetch('/api/get-ip')
      .then(res => res.json())
      .then(data => setClientIP(data.ip))
  }, [])

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <div className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <h1 className="text-2xl font-bold mb-8">Aplicación Local NextJS</h1>
                <p className="mb-4">Esta aplicación solo es accesible desde la red local.</p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p><strong>Tu IP:</strong> {clientIP}</p>
                  <p><strong>IP del Servidor:</strong> {serverIP}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const networkInterfaces = os.networkInterfaces();
    let serverIP = 'No encontrada';

    // Iterar sobre todas las interfaces de red
    for (const interfaces of Object.values(networkInterfaces)) {
      if (!interfaces) continue;

      // Usar type assertion para TypeScript
      const interfacesList = interfaces as NetworkInterfaceInfo[];
      
      // Buscar la primera interfaz IPv4 no interna
      const localInterface = interfacesList.find(inter => 
        inter.family === 'IPv4' && 
        !inter.internal &&
        inter.address !== '127.0.0.1'
      );

      if (localInterface) {
        serverIP = localInterface.address;
        break;
      }
    }

    return {
      props: {
        serverIP,
      },
    }
  } catch (error) {
    console.error('Error al obtener la IP del servidor:', error);
    return {
      props: {
        serverIP: 'Error al obtener IP',
      },
    }
  }
}