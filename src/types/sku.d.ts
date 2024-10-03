interface SKUType {
  id: string;
  name: string;
  apCode: string; // ap_code
  apName: string;
  img?: string;
  catCode: string;
  catName: string;
  brnCode: string;
  brnName: string;
  goods: GoodsType[];
  barcodes: string[];
}

interface GoodsType {
  code: string;
  utqName: string;
  utqQty: number;
  price0: number; // ราคาตาราง 0
  price8: number; // ราคาตาราง 8
}
