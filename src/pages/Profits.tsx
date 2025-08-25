import { useState } from "react"
import axios from "axios"
import { formatCurrency } from "../utils/format"

interface SaleItem {
  product_name: string
  quantity: number
  unit_price: number
  subtotal: number
}

interface Sale {
  sale_id: number
  date: string
  items: SaleItem[]
  total: number
  profit: number
}

interface ProfitResponse {
  sales: Sale[]
  total_profit: number
}

export default function Profits() {
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [profits, setProfits] = useState<ProfitResponse | null>(null)

  const fetchProfits = async () => {
    if (!startDate || !endDate) return
    try {
      const res = await axios.get("http://127.0.0.1:5000/profits", {
        params: {
          start_date: startDate,
          end_date: endDate,
        },
      })
      setProfits(res.data)
    } catch (err) {
      console.error("Error al obtener ganancias", err)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    fetchProfits()
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Ganancias</h1>

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="flex space-x-4">
        <div>
          <label className="block text-sm font-medium">Desde</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border px-2 py-1 rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Hasta</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border px-2 py-1 rounded"
          />
        </div>
        <button
          type="submit"
          className="self-end bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Calcular
        </button>
      </form>

      {/* Resultados */}
      {profits && (
        <div>
          <table className="min-w-full bg-white border shadow rounded mb-4">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 border">N° Venta</th>
                <th className="px-4 py-2 border">Fecha</th>
                <th className="px-4 py-2 border">Productos</th>
                <th className="px-4 py-2 border">Monto Venta</th>
                <th className="px-4 py-2 border">Ganancia</th>
              </tr>
            </thead>
            <tbody>
              {profits.sales.map((s) => (
                <tr key={s.sale_id}>
                  <td className="px-4 py-2 border">{s.sale_id}</td>
                  <td className="px-4 py-2 border">
                    {new Date(s.date).toLocaleString()}
                  </td>
                  <td className="px-4 py-2 border">
                    <ul className="list-disc ml-4">
                      {s.items.map((it, i) => (
                        <li key={i}>
                          {it.product_name} — {it.quantity} × {formatCurrency(it.unit_price)} ={" "}
                          {formatCurrency(it.subtotal)}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="px-4 py-2 border">{s.total}</td>
                  <td className="px-4 py-2 border font-semibold">
                    {formatCurrency(s.profit)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <h2 className="text-lg font-bold">
            Ganancia Total: {formatCurrency(profits.total_profit)}
          </h2>
        </div>
      )}
    </div>
  )
}