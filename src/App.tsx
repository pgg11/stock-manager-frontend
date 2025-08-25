import Navbar from "./components/Navbar"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Products from "./pages/Products"
import Purchases from "./pages/Purchases"
import Sales from "./pages/Sales"
import PriceHistory from "./pages/PriceHistory"
import Profits from "./pages/Profits"

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[rgb(243,244,246)]"> {/* fondo gris claro */}
        <Navbar />
        <main className="p-6">
          <Routes>
            <Route path="/" element={<Products />} />
            <Route path="/purchases" element={<Purchases />} />
            <Route path="/sales" element={<Sales />} />
            <Route path="/price-history" element={<PriceHistory />} />
            <Route path="/profits" element={<Profits />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App