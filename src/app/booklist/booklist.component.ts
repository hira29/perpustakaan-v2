import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import {HttpClient, HttpParams} from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { BookModel} from './bookmodel';
import { NotificationService} from '../notification.service';
import { NgOption } from '@ng-select/ng-select';
import {Observable} from "rxjs";
import * as svg from 'save-svg-as-png';


@Component({
  selector: 'app-booklist',
  templateUrl: './booklist.component.html',
  styleUrls: ['./booklist.component.css']
})

export class BooklistComponent implements OnInit {
  public title = 'Book List';
  uri = 'https://lib-ws-mdb.herokuapp.com/';
  // uri = 'http://localhost:6996/';
  loadingDL: boolean;
  inputCategory: string;
  selectedCategory: string;
  getKategori: string;
  data: any;
  deleteID: string;
  config: any;
  search: string;
  pager = {};
  pageOfItems = [];
  Category: NgOption[];
  inputBook = new BookModel('', '', '', '', '', '', '', '', '', '', '', '', 1, '');
  updateBook = new BookModel('', '', '', '', '', '', '', '', '', '', '', '', 0, '');
  loading = true;
  nodata = false;
  barcode: string;
  barcodeTitle: string;

  modalRef: BsModalRef;
  constructor(
    private modalService: BsModalService,
    private http: HttpClient,
    private route: ActivatedRoute,
    private toastr: NotificationService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loading = true;
    this.config = {
      itemsPerPage: 10,
      currentPage: 1,
      totalItems: 0
    };
    this.route.queryParams.subscribe(x => this.loadPage(x.page || 1));
    this.http.get(this.uri + 'perpustakaan/api/v1/kategori/list')
      .subscribe(x => {
        this.data = x;
        this.Category = this.data.data;
      });
  }
  private onCategoryChange($event) {
    this.route.queryParams.subscribe(x => this.loadPage(x.page || 1));
  }
  private onChange($event) {
  }
  private onSearch(searchInput) {
    this.route.queryParams.subscribe(x => this.loadPage(x.page || 1));
  }
  private openModal(template: TemplateRef<any>) {
    this.inputCategory = '';
    this.getKategori = null;
    this.inputBook.judul = '';
    this.inputBook.edisi = '';
    this.inputBook.penerbit = '';
    this.inputBook.tahun_terbit = '';
    this.inputBook.deskripsi = '';
    this.inputBook.pengarang = '';
    this.inputBook.umum_res = '';
    this.inputBook.bahasa = '';
    this.inputBook.isbn = '';
    this.inputBook.lokasi = '';
    this.inputBook.kota_terbit = '';
    this.inputBook.gambar = '';
    this.inputBook.klasifikasi = '';
    this.modalRef = this.modalService.show(template);
  }
  private onPageChange(event: any) {
    this.router.navigate(['/books'], {queryParams: {page: event.page}});
  }
  private onView(id: string, template: TemplateRef<any>) {
    this.http.get<any>(this.uri + 'perpustakaan/api/v1/data_buku/view/' + id)
      .subscribe(x => {
        this.updateBook = x.data;
      });
    this.modalRef = this.modalService.show(template);
  }
  private onModalDelete(id: string, template: TemplateRef<any>) {
    this.deleteID = id;
    this.modalRef = this.modalService.show(template);
  }

  private onDelete(id: string) {
    this.http.delete<any>(this.uri + 'perpustakaan/api/v1/data_buku/delete/' + id)
      .subscribe(x => {
        this.modalRef.hide();
        if (x.status === true) {
          this.toastr.showSuccess(x.message, 'Berhasil');
        } else {
          this.toastr.showError(x.message, 'Gagal');
        }
        this.ngOnInit();
        this.deleteID = '';
      });
  }
  private onNotDelete() {
    this.deleteID = '';
    this.modalRef.hide();
  }
  private loadPage(num) {
    if (this.selectedCategory === '') {
      this.selectedCategory = 'All';
    }
    this.http.post<any>(this.uri + 'perpustakaan/api/v1/data_buku/list',
      {category: this.selectedCategory, search: this.search, page: +num, size : 10})
      .subscribe(x => {
        console.log(x);
        if (x.data.total_record === 0) {
          this.nodata = true;
        } else {
          this.nodata = false;
          this.pager = x.data;
          this.pageOfItems = x.data.records;
          this.config = {
            itemsPerPage: x.data.limit,
            currentPage: x.data.page,
            totalItems: x.data.total_record
          };
        }
        this.loading = false;
    });
  }
  private onSubmit(data: BookModel, template: TemplateRef<any>) {
    if (this.inputBook.judul === '' &&
        this.inputBook.edisi === '' &&
        this.inputBook.penerbit === '' &&
        this.inputBook.tahun_terbit === '' &&
        this.inputBook.deskripsi === '' &&
        this.inputBook.pengarang === '' &&
        this.inputBook.umum_res === '' &&
        this.inputBook.bahasa === '' &&
        this.inputBook.isbn === '' &&
        this.inputBook.lokasi === '' &&
        this.inputBook.kota_terbit === '' &&
        this.inputBook.gambar === '' &&
        this.inputBook.klasifikasi === '' ) {
      this.toastr.showError('Data yang dibutuhkan Kosong!', 'Gagal');
    } else {
      this.http.post<any>(this.uri + 'perpustakaan/api/v1/data_buku/create',
        data).subscribe(x => {
        this.modalRef.hide();
        if (x.status === true) {
          this.toastr.showSuccess(x.message, 'Berhasil');
        } else {
          this.toastr.showError(x.message, 'Gagal');
        }
        console.log(x);
        this.ngOnInit();
        this.onModalBarcode(x.data.buku_id, x.data.judul, template);
      });
    }
  }
  private onUpdate(data: BookModel) {
    this.http.put<any>(this.uri + 'perpustakaan/api/v1/data_buku/update',
      data).subscribe(x => {
      this.modalRef.hide();
      if (x.status === true) {
        this.toastr.showSuccess(x.message, 'Berhasil');
      } else {
        this.toastr.showError(x.message, 'Gagal');
      }
      this.ngOnInit();
    });
  }
  private onSubmitCategory(input) {
    this.http.get<any>(this.uri + 'perpustakaan/api/v1/kategori/tambah/' + input)
      .subscribe(x => {
      console.log(x);
      this.modalRef.hide();
      if (x.status === true) {
        this.toastr.showSuccess(x.message, 'Berhasil');
      } else {
        this.toastr.showError(x.message, 'Gagal');
      }
      this.ngOnInit();
    });
  }
  private onDeleteCategory(CategoryName) {
    this.http.delete<any>(this.uri + 'perpustakaan/api/v1/kategori/hapus/' + CategoryName)
      .subscribe(x => {
        console.log(x);
        if (x.status === true) {
          this.toastr.showSuccess(x.message, 'Berhasil');
        } else {
          this.toastr.showError(x.message, 'Gagal');
        }
        this.http.get(this.uri + 'perpustakaan/api/v1/kategori/list')
          .subscribe(dataset => {
            this.data = dataset;
            this.Category = this.data.data;
          });
      });
  }
  returnBlob(res): Blob {
    return new Blob([res], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
  }

  private onDownload() {
    this.http.get(this.uri + 'perpustakaan/api/v1/data_buku/download', {responseType: 'blob'})
      .subscribe(res => {
      if (res) {
        const url = window.URL.createObjectURL(this.returnBlob(res));
        window.open(url);
      }
    });
  }

  openDownloadModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
    this.loadingDL = true;

    this.http.post<any>(this.uri + 'perpustakaan/api/v1/data_buku/createlistbuku',
      {category: this.selectedCategory, search: this.search, page: 1, size : this.config.totalItems})
      .subscribe(x => {
        console.log(x);
        if (x.status === true) {
          setTimeout(() => {
            this.loadingDL = false;
          }, 1000);
          this.toastr.showSuccess('Data berhasil didapat', 'Berhasil');
        } else {
          this.toastr.showError('Data gagal Diolah', 'Gagal');
        }
      });
  }
  setBlobBarcode(base64Data: string, sliceSize= 512) {
    const split = base64Data.split(',', 2);
    const byteCharacters = atob(split[1]);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
    }
    return new Blob(byteArrays, {type: 'image/png'});
  }
  private onDownloadBarcode() {
    svg.svgAsPngUri(document.getElementsByTagName('svg')[0], {}, (uri) => {
      const url = window.URL.createObjectURL(this.setBlobBarcode(uri));
      window.open(url);
    });
  }
  private onModalBarcode(id: string, judul: string, template: TemplateRef<any>) {
    this.barcode = id;
    this.barcodeTitle = judul;
    this.modalRef = this.modalService.show(template);
  }
}
