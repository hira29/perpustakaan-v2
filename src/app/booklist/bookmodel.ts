export class BookModel {
  constructor(
    // tslint:disable-next-line:variable-name
    public judul: string,
    public edisi: string,
    public pengarang: string,
    // tslint:disable-next-line:variable-name
    public kota_terbit: string,
    public penerbit: string,
    public tahun_terbit: string,
    public isbn: string,
    public klasifikasi: string,
    public umum_res: string,
    // tslint:disable-next-line:variable-name
    public bahasa: string,
    // tslint:disable-next-line:variable-name
    public lokasi: string,
    public deskripsi: string,
    public stok: number,
    public gambar: string
  ) {
  }
}
