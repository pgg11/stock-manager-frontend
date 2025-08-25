# Stock Manager Frontend

Frontend de la aplicación de gestión de stock, compras y ventas para el emprendimiento de frutos secos.  
Construido con **React + TypeScript + Vite**, usando **TailwindCSS** para los estilos.

## 🚀 Características

- Gestión de **productos** (alta, listado, edición).
- Registro y anulación de **compras** (con reglas de consolidación de stock).
- Registro y anulación de **ventas** (con reposición de stock en caso de anulación).
- Consulta de **historial de precios** de cada producto.
- Consulta de **ganancias** en un rango de fechas, con detalle por venta y total.
- Todas las fechas se muestran en **hora Argentina (UTC-3)**.
- Todos los montos se muestran en **ARS ($)**.

## 🛠️ Tecnologías utilizadas

- **React 18 + TypeScript**
- **Vite**
- **TailwindCSS**
- **Axios** (para comunicación con el backend)
- **React Router DOM**

## 📂 Estructura del proyecto

src/
├── components/ # Navbar, tablas reutilizables, etc.
├── pages/ # Páginas principales (Productos, Compras, Ventas, Precios, Ganancias)
├── utils/ # Helpers (formatCurrency, formatDateTime, etc.)
├── App.tsx # Definición de rutas
└── main.tsx # Punto de entrada

## ⚙️ Instalación y ejecución

1. Clonar el repositorio:
   ```bash
   git clone git@github.com:pgg11/stock-manager-frontend.git
   cd stock-manager-frontend

2. Instalar dependencias:

  `npm install`

3. Ejecutar en modo desarrollo:

  `npm run dev`

La app estará disponible en http://localhost:5173.

🔗 Backend

Este frontend se conecta con el backend desarrollado en Flask + SQLite.

Repositorio del backend: [stock-manager-backend](https://github.com/pgg11/stock-manager-backend)

📌 Pendientes / To-Do

* Mejorar manejo de errores en formularios.
* Validaciones más detalladas en frontend.
* Pruebas automáticas.
* Despliegue.