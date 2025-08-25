import { useEffect, useState } from "react"
import axios from "axios"
import { formatCurrency, translatePurchaseAction, formatDateTime } from "../utils/format"

interface Product {
  id: number
  name: string
}

interface Purchase {
  id: number
  date: string
  product_id: number
  action: string
  unit_cost: number
  quantity: number
  created_batch_id: number
}

export default function Purchases() {
  const [products, setProducts] = useState<Product[]>([])
  const [purchases, setPurchases] = useState<Purchase[]>([])
  const [productId, setProductId] = useState("")
  const [unitCost, setUnitCost] = useState("")
  const [quantity, setQuantity] = useState("")

  const fetchProducts = async () => {
    const res = await axios.get("http://127.0.0.1:5000/products")
    setProducts(res.data)
  }

  const fetchPurchases = async () => {
    const res = await axios.get("http://127.0.0.1:5000/purchases")
    setPurchases(res.data)
  }

  useEffect(() => {
    fetchProducts()
    fetchPurchases()
  }, [])

  const handleAddPurchase = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await axios.post("http://127.0.0.1:5000/purchases", {
        product_id: parseInt(productId),
        unit_cost: parseFloat(unitCost),
        quantity: parseFloat(quantity),
      })
      setProductId("")
      setUnitCost("")
      setQuantity("")
      fetchPurchases()
    } catch (err) {
      console.error("Error al registrar compra", err)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("¿Seguro que quieres eliminar esta compra?")) return
    try {
      await axios.delete(`http://127.0.0.1:5000/purchases/${id}`)
      fetchPurchases()
    } catch (err: any) {
      console.error("Error al eliminar compra", err)
      alert("No se pudo eliminar la compra. " + (err.response?.data?.error || ""))
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Compras</h1>

      {/* Formulario */}
      <form
        onSubmit={handleAddPurchase}
        className="bg-[white] shadow p-4 rounded flex items-end space-x-4"
      >
        <div>
          <label className="block text-sm font-medium">Producto</label>
          <select
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            className="border rounded px-2 py-1 w-48"
            required
          >
            <option value="">-- Seleccionar --</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium">Costo unitario</label>
          <input
            type="number"
            value={unitCost}
            onChange={(e) => setUnitCost(e.target.value)}
            className="border rounded px-2 py-1 w-32"
            step="0.01"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Cantidad (kg)</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="border rounded px-2 py-1 w-32"
            step="0.01"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-[green] text-[white] px-4 py-2 rounded hover:bg-[darkgreen]"
        >
          Registrar
        </button>
      </form>

      {/* Tabla */}
      <table className="min-w-full bg-[white] border shadow rounded">
        <thead className="bg-[rgb(243,244,246)]">
          <tr>
            <th className="px-4 py-2 border">ID</th>
            <th className="px-4 py-2 border">Fecha</th>
            <th className="px-4 py-2 border">Producto</th>
            <th className="px-4 py-2 border">Acción</th>
            <th className="px-4 py-2 border">Costo x Kg</th>
            <th className="px-4 py-2 border">Cantidad</th>
            <th className="px-4 py-2 border">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {purchases.map((p) => (
            <tr key={p.id}>
              <td className="px-4 py-2 border">{p.id}</td>
              <td className="px-4 py-2 border">
                {formatDateTime(p.date)}
              </td>
              <td className="px-4 py-2 border">
                {products.find((pr) => pr.id === p.product_id)?.name || "-"}
              </td>
              <td className="px-4 py-2 border">{translatePurchaseAction(p.action)}</td>
              <td className="px-4 py-2 border">{formatCurrency(p.unit_cost)}</td>
              <td className="px-4 py-2 border">{p.quantity}</td>
              <td className="px-4 py-2 border">
                <button
                  onClick={() => handleDelete(p.id)}
                  className="bg-[red] text-[white] px-2 py-1 rounded hover:bg-[darkred]"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}