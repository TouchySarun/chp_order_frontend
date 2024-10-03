interface APType {
  id?: string;
  code: string;
  name: string;
  remark: string;
}
interface UserType {
  id?: string;
  username: string;
  name: string;
  password?: string;
  role: string;
  branch: string;
  ap: string[]; // user that ap = [] then my employee
  rack: string;
}
interface UserRegisterType {
  username: string;
  password: string;
}

// roles
// dc: พนักงานคลังสินค้า (จัดของ),
// ldc: หัวหน้าพนักงานคลังสินค้า (ดูรายงาน, ดึงข้อมูล, รันโปรแกรมต่าง ๆ),
// ac: บัญชี (ดูรายงาน),
// pc: พีซี (จัดของ),
// br: สาขา (สั่งของ),
