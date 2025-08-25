import { useEffect, useMemo, useState } from "react"
import axios from "axios"
import { formatCurrency, formatDateTime } from "../utils/format"

interface Batch { id: number; cost: number; quantity: number, date: string }
interface Product {
  id: number
  name: string
  markup: number
  total_stock: number
  batches: Batch[]
}

interface Sale {
  id: number
  date: string
  product_id: number
  quantity: number
  price_at_sale: number
}

interface Sales {
  id: number,
  date: string,
  items: Sale[],
  total: number
}

type ItemDraft = { product_id: number; quantity: string } // quantity como string para controlar input

const API = "http://127.0.0.1:5000"

export default function Sales() {
  const [products, setProducts] = useState<Product[]>([])
  const [sales, setSales] = useState<Sales[]>([])

  // constructor de venta
  const [selectedProductId, setSelectedProductId] = useState<string>("")
  const [selectedQty, setSelectedQty] = useState<string>("")
  const [items, setItems] = useState<ItemDraft[]>([])

  const chosenIds = useMemo(() => new Set(items.map(i => i.product_id)), [items])

  const fetchProducts = async () => {
    const res = await axios.get(`${API}/products`)
    setProducts(res.data)
  }

  const fetchSales = async () => {
    const res = await axios.get(`${API}/sales`)
    setSales(res.data)
  }

  useEffect(() => {
    fetchProducts()
    fetchSales()
  }, [])

  const productById = (id: number) => products.find(p => p.id === id)

  const currentUnitPrice = (p: Product | undefined) => {
    if (!p || !p.batches?.length) return null
    const highest = Math.max(...p.batches.map(b => b.cost))
    return highest * (1 + (p.markup || 0) / 100)
  }

  const addItem = () => {
    const pid = parseInt(selectedProductId)
    const qty = parseFloat(selectedQty)

    if (!pid || isNaN(qty) || qty <= 0) {
      alert("Seleccioná un producto y una cantidad válida (> 0).")
      return
    }
    if (chosenIds.has(pid)) {
      alert("Ese producto ya está en la lista.")
      return
    }

    setItems(prev => [...prev, { product_id: pid, quantity: selectedQty }])
    setSelectedProductId("")
    setSelectedQty("")
  }

  const updateItemQty = (pid: number, qtyStr: string) => {
    setItems(prev => prev.map(i => (i.product_id === pid ? { ...i, quantity: qtyStr } : i)))
  }

  const removeItem = (pid: number) => {
    setItems(prev => prev.filter(i => i.product_id !== pid))
  }

  const estimatedTotal = useMemo(() => {
    return items.reduce((acc, it) => {
      const p = productById(it.product_id)
      const price = currentUnitPrice(p)
      const qty = parseFloat(it.quantity)
      if (!price || isNaN(qty) || qty <= 0) return acc
      return acc + price * qty
    }, 0)
  }, [items, products])

  const finalizeSale = async () => {
    if (items.length === 0) {
      alert("Agregá al menos un producto.")
      return
    }
    // validar cantidades
    for (const it of items) {
      const q = parseFloat(it.quantity)
      if (isNaN(q) || q <= 0) {
        alert("Hay cantidades inválidas en la lista.")
        return
      }
    }

    try {
      await axios.post(`${API}/sales`, {
        items: items.map(it => ({
          product_id: it.product_id,
          quantity: parseFloat(it.quantity),
        })),
      })
      setItems([])
      await fetchSales()
      await fetchProducts() // refresca stock mostrado en productos si la misma vista lo usa luego
      alert("Venta registrada con éxito.")
    } catch (err: any) {
      console.error(err)
      alert(err.response?.data?.error || "No se pudo registrar la venta.")
    }
  }

  const deleteSale = async (id: number) => {
    if (!confirm("¿Seguro querés anular esta venta?")) return
    try {
      await axios.delete(`${API}/sales/${id}`)
      await fetchSales()
      await fetchProducts()
    } catch (err: any) {
      console.error(err)
      alert(err.response?.data?.error || "No se pudo anular la venta.")
    }
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Ventas</h1>

      {/* Constructor de venta */}
      <div className="bg-[white] shadow p-4 rounded space-y-4">
        <h2 className="text-xl font-semibold">Nueva venta</h2>

        <div className="flex flex-wrap items-end gap-4">
          <div>
            <label className="block text-sm font-medium">Producto</label>
            <select
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              className="border rounded px-2 py-1 w-64"
            >
              <option value="">-- Seleccionar --</option>
              {products.map(p => (
                <option
                  key={p.id}
                  value={p.id}
                  disabled={chosenIds.has(p.id)}
                >
                  {p.name} {chosenIds.has(p.id) ? "(ya agregado)" : ""}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium">Cantidad (kg)</label>
            <input
              type="number"
              step="0.01"
              value={selectedQty}
              onChange={(e) => setSelectedQty(e.target.value)}
              className="border rounded px-2 py-1 w-32"
            />
          </div>

          <button
            onClick={addItem}
            className="bg-[rgb(37,99,235)] text-[white] px-4 py-2 rounded hover:bg-[rgb(29,78,216)]"
          >
            Agregar producto
          </button>
        </div>

        {/* Lista de items */}
        {items.length > 0 && (
          <div className="space-y-3">
            <table className="min-w-full bg-[white] border shadow rounded">
              <thead className="bg-[rgb(243,244,246)]">
                <tr>
                  <th className="px-4 py-2 border">Producto</th>
                  <th className="px-4 py-2 border">Precio unit. (estimado)</th>
                  <th className="px-4 py-2 border">Cantidad (kg)</th>
                  <th className="px-4 py-2 border">Subtotal (est.)</th>
                  <th className="px-4 py-2 border">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {items.map(it => {
                  const p = productById(it.product_id)
                  const price = currentUnitPrice(p)
                  const qty = parseFloat(it.quantity)
                  const subtotal = price && !isNaN(qty) && qty > 0 ? (price) * qty : null
                  const lowStock = p && !isNaN(qty) && qty > (p.total_stock || 0)

                  return (
                    <tr key={it.product_id}>
                      <td className="px-4 py-2 border">
                        {p?.name || `#${it.product_id}`}
                      </td>
                      <td className="px-4 py-2 border">
                        {price ? formatCurrency(price) : "—"}
                      </td>
                      <td className="px-4 py-2 border">
                        <input
                          type="number"
                          step="0.01"
                          value={it.quantity}
                          onChange={(e) => updateItemQty(it.product_id, e.target.value)}
                          className={`border rounded px-2 py-1 w-28 ${lowStock ? "border-[red]" : ""}`}
                          title={lowStock ? "Cantidad supera el stock disponible" : ""}
                        />
                        {lowStock && (
                          <div className="text-[red] text-xs mt-1">
                            Supera stock ({p?.total_stock ?? 0} kg)
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-2 border">
                        {subtotal ? formatCurrency(subtotal) : "—"}
                      </td>
                      <td className="px-4 py-2 border">
                        <button
                          onClick={() => removeItem(it.product_id)}
                          className="bg-[red] text-[white] px-2 py-1 rounded hover:bg-[darkred]"
                        >
                          Quitar
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>

            <div className="flex justify-end">
              <div className="text-right">
                <div className="text-sm">Total estimado</div>
                <div className="text-xl font-semibold">
                  {formatCurrency(estimatedTotal)}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setItems([])}
                className="bg-[gray] text-[white] px-4 py-2 rounded hover:bg-[dimgray]"
              >
                Limpiar
              </button>
              <button
                onClick={finalizeSale}
                className="bg-[green] text-[white] px-4 py-2 rounded hover:bg-[darkgreen]"
              >
                Finalizar venta
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Historial de ventas */}
      <div className="bg-[white] shadow p-4 rounded">
        <h2 className="text-xl font-semibold mb-3">Historial</h2>
        <table className="min-w-full bg-[white] border shadow rounded">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border">ID</th>
              <th className="px-4 py-2 border">Fecha</th>
              <th className="px-4 py-2 border">Productos</th>
              <th className="px-4 py-2 border">Total</th>
              <th className="px-4 py-2 border">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {sales.map((s) => {
              const total = s.items.reduce(
                (acc: number, it: any) => acc + it.quantity * it.price_at_sale,
                0
              )

              return (
                <tr key={s.id}>
                  <td className="px-4 py-2 border">{s.id}</td>
                  <td className="px-4 py-2 border">
                    {formatDateTime(s.date)}
                  </td>
                  <td className="px-4 py-2 border">
                    <ul className="list-disc pl-4 space-y-1">
                      {s.items.map((it: any) => {
                        const p = productById(it.product_id)
                        return (
                          <li key={it.product_id}>
                            {p?.name || `#${it.product_id}`} –{" "}
                            <span className="font-medium">{it.quantity} kg</span> @{" "}
                            <span className="text-gray-700">{formatCurrency(it.price_at_sale)}</span>
                          </li>
                        )
                      })}
                    </ul>
                  </td>
                  <td className="px-4 py-2 border font-semibold">{formatCurrency(total)}</td>
                  <td className="px-4 py-2 border">
                    <button
                      onClick={() => deleteSale(s.id)}
                      className="bg-[red] text-[white] px-2 py-1 rounded hover:bg-[darkred]"
                    >
                      Anular
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}