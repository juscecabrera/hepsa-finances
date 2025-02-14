// pages/acceso-denegado.tsx
export default function AccesoDenegado() {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="text-center">
              <h2 className="text-3xl font-extrabold text-gray-900 mb-4">
                Acceso Denegado
              </h2>
              <p className="text-gray-600">
                Esta aplicación solo es accesible desde la red local.
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }