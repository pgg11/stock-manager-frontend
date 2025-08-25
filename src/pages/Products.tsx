import { useEffect, useState } from "react"
import axios from "axios"

interface Product {
  id: number
  name: string
  markup: number
  total_stock: number
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>([])
  const [name, setName] = useState("")
  const [markup, setMarkup] = useState("")
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editName, setEditName] = useState("")
  const [editMarkup, setEditMarkup] = useState("")

  const fetchProducts = async () => {
    const res = await axios.get("http://127.0.0.1:5000/products")
    setProducts(res.data)
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await axios.post("http://127.0.0.1:5000/products", {
        name,
        markup: parseFloat(markup) || 0,
      })
      setName("")
      setMarkup("")
      fetchProducts()
    } catch (err) {
      console.error("Error al agregar producto", err)
    }
  }

  const startEditing = (p: Product) => {
    setEditingId(p.id)
    setEditName(p.name)
    setEditMarkup(p.markup.toString())
  }

  const cancelEditing = () => {
    setEditingId(null)
    setEditName("")
    setEditMarkup("")
  }

  const saveEdit = async (id: number) => {
    try {
      await axios.put(`http://127.0.0.1:5000/products/${id}`, {
        name: editName,
        markup: parseFloat(editMarkup) || 0,
      })
      cancelEditing()
      fetchProducts()
    } catch (err) {
      console.error("Error al editar producto", err)
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Productos</h1>

      {/* Formulario de creación */}
      <form
        onSubmit={handleAddProduct}
        className="bg-[white] shadow p-4 rounded flex items-end space-x-4"
      >
        <div>
          <label className="block text-sm font-medium">Nombre</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border rounded px-2 py-1 w-48"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Markup (%)</label>
          <input
            type="number"
            value={markup}
            onChange={(e) => setMarkup(e.target.value)}
            className="border rounded px-2 py-1 w-24"
          />
        </div>
        <button
          type="submit"
          className="bg-[rgb(37,99,235)] text-[white] px-4 py-2 rounded hover:bg-[rgb(29,78,216)]"
        >
          Agregar
        </button>
      </form>

      {/* Tabla */}
      <table className="min-w-full bg-[white] border shadow rounded">
        <thead className="bg-[rgb(243,244,246)]">
          <tr>
            <th className="px-4 py-2 border">ID</th>
            <th className="px-4 py-2 border">Nombre</th>
            <th className="px-4 py-2 border">Ganancia (%)</th>
            <th className="px-4 py-2 border">Stock total</th>
            <th className="px-4 py-2 border">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td className="px-4 py-2 border">{p.id}</td>
              <td className="px-4 py-2 border">
                {editingId === p.id ? (
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="border rounded px-2 py-1 w-40"
                  />
                ) : (
                  p.name
                )}
              </td>
              <td className="px-4 py-2 border">
                {editingId === p.id ? (
                  <input
                    type="number"
                    value={editMarkup}
                    onChange={(e) => setEditMarkup(e.target.value)}
                    className="border rounded px-2 py-1 w-24"
                  />
                ) : (
                  p.markup
                )}
              </td>
              <td className="px-4 py-2 border">{p.total_stock} Kg</td>
              <td className="px-4 py-2 border space-x-2">
                {editingId === p.id ? (
                  <>
                    <button
                      onClick={() => saveEdit(p.id)}
                      className="bg-[green] text-[white] px-2 py-1 rounded hover:bg-[darkgreen]"
                    >
                      Guardar
                    </button>
                    <button
                      onClick={cancelEditing}
                      className="bg-[gray] text-[white] px-2 py-1 rounded hover:bg-[dimgray]"
                    >
                      Cancelar
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => startEditing(p)}
                    className="bg-[orange] text-[white] px-2 py-1 rounded hover:bg-[darkorange]"
                  >
                    Editar
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
