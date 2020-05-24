export class BookModel {
  constructor(
    // tslint:disable-next-line:variable-name
    public buku_id: string,
    public judul: string,
    public penulis: string,
    public penerbit: string,
    public kategori: string,
    // tslint:disable-next-line:variable-name
    public jumlah_eksemplar: string,
    // tslint:disable-next-line:variable-name
    public letak_buku: string,
    public stok: number,
    public gambar: string
  ) {
  }
}
