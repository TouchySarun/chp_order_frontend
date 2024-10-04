interface SKUType {
  id: string;
  name: string;
  ap: string; // ap_code
  img?: string;
  cat: string;
  bnd: string;
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
