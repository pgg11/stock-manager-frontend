export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

export const translatePurchaseAction = (action: string): string => {
  switch (action) {
    case "add_batch":
      return "Nuevo lote"
    case "consolidate":
      return "Consolidación de stock"
    default:
      return action
  }
}

export const formatDateTime = (isoDate: string): string => {
  const date = new Date(isoDate)
  // Ajustar -3 horas a mano
  date.setHours(date.getHours() - 3)

  return new Intl.DateTimeFormat("es-AR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date)
}