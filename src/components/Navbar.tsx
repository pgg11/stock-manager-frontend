import { Link, useLocation } from "react-router-dom"

export default function Navbar() {
  const location = useLocation()

  const links = [
    { to: "/", label: "Productos" },
    { to: "/purchases", label: "Compras" },
    { to: "/sales", label: "Ventas" },
    { to: "/price-history", label: "Historial" },
    { to: "/profits", label: "Ganancias" },
  ]

  return (
    <nav className="bg-[rgb(37,99,235)] shadow-md"> {/* azul personalizado */}
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-14">
          {/* Logo */}
          <div className="text-white font-bold text-lg">Stock Manager</div>

          {/* Links */}
          <ul className="flex space-x-6">
                {links.map((link) => (
                    <li key={link.to}>
                    <Link
                        to={link.to}
                        className={`${
                        location.pathname === link.to
                            ? "text-[rgb(253,224,71)] font-semibold"   // amarillo
                            : "text-[white] hover:text-[rgb(253,224,71)]"
                        } transition-colors`}
                    >
                        {link.label}
                    </Link>
                    </li>
                ))}
            </ul>
        </div>
      </div>
    </nav>
  )
}