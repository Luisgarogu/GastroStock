export interface StockMove {
    id: number;
    producto_id: number;
    tipo: "entrada" | "salida";
    cantidad: number;
    fecha: string;             // ISO
    usuario_id: number | null;
    proveedor_id: number | null;
  }
  