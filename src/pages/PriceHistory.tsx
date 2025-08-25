import { useEffect, useState } from "react"
import axios from "axios"
import { formatCurrency, formatDateTime } from "../utils/format"

interface Product {
  id: number
  name: string
}

interface PriceHistoryItem {
  id: number
  product_id: number
  cost: number
  price: number
  date: string
}

export default function PriceHistory() {
  const [products, setProducts] = useState<Product[]>([])
  const [selectedId, setSelectedId] = useState<number | "">("")
  const [history, setHistory] = useState<PriceHistoryItem[]>([])

  // traer lista de productos
  useEffect(() => {
    axios
      .get("http://127.0.0.1:5000/products")
      .then((res) => setProducts(res.data))
      .catch((err) => console.error("Error cargando productos", err))
  }, [])

  // traer historial cuando cambia el producto seleccionado
  useEffect(() => {
    if (!selectedId) return
    axios
      .get(`http://127.0.0.1:5000/price-history/${selectedId}`)
      .then((res) => setHistory(res.data))
      .catch((err) => console.error("Error cargando historial", err))
  }, [selectedId])

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Historial de Precios</h1>

      {/* Selector de producto */}
      <div>
        <label className="mr-2 font-medium">Producto:</label>
        <select
          value={selectedId}
          onChange={(e) => setSelectedId(Number(e.target.value))}
          className="border px-2 py-1 rounded"
        >
          <option value="">-- Selecciona un producto --</option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      {/* Tabla de historial */}
      {history.length > 0 ? (
        <table className="min-w-full bg-white border shadow rounded">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border">Fecha</th>
              <th className="px-4 py-2 border">Costo</th>
              <th className="px-4 py-2 border">Precio Venta</th>
            </tr>
          </thead>
          <tbody>
            {history.map((h) => (
              <tr key={h.id}>
                <td className="px-4 py-2 border">
                  {formatDateTime(h.date)}
                </td>
                <td className="px-4 py-2 border">{formatCurrency(h.cost)}</td>
                <td className="px-4 py-2 border font-semibold">{formatCurrency(h.price)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        selectedId && <p>No hay historial cargado para este producto.</p>
      )}
    </div>
  )
}