import {Component, OnInit, TemplateRef} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {NotificationService} from '../../notification.service';

@Component({
  selector: 'app-historyloan',
  templateUrl: './historyloan.component.html',
  styleUrls: ['./historyloan.component.css']
})
export class HistoryloanComponent implements OnInit {
  uri = 'https://lib-ws-mdb.herokuapp.com/';
  // uri = this.uri + '';
  loadingDL: boolean;
  MhsId: any;
  dataMhs: any;
  config: any;
  search: string;
  pager = {};
  pageOfItems = [];
  modalRef: BsModalRef;
  infoReturn: any;
  infoTime: string;
  lateTime: boolean;
  loading = true;
  nodata = false;
  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private modalService: BsModalService,
    private toastr: NotificationService,
    private router: Router
  ) { }

  ngOnInit() {
    this.loading = true;
    this.MhsId = this.route.snapshot.paramMap.get('id');
    this.getMhsInfo();
    this.config = {
      itemsPerPage: 10,
      currentPage: 1,
      totalItems: 0
    };
    this.route.queryParams.subscribe(x => this.getLoanInfo(x.page || 1));
  }
  getMhsInfo() {
    this.http.get<any>(this.uri + 'perpustakaan/api/v1/data_mhs/view/'
      + this.MhsId).subscribe( x => {
      this.dataMhs = x.data;
      console.log(x);
    });
  }
  getLoanInfo(num) {
    this.http.post<any>(this.uri + 'perpustakaan/api/v1/peminjaman/riwayat',
      {id: this.MhsId, search: this.search, page: +num, size: 10 })
      .subscribe(x => {
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
  private onSearch(searchInput) {
    this.route.queryParams.subscribe(x => this.getLoanInfo(x.page || 1));
  }
  private openModal(template: TemplateRef<any>, data: any) {
    this.infoReturn = data;
    const Today = new Date(data.data_peminjaman.tanggal_kembali);
    const startDate = new Date(data.data_peminjaman.tanggal_peminjaman);
    const endDate = new Date(data.data_peminjaman.tanggal_pengembalian);
    const acc = endDate.getTime() - startDate.getTime();
    const set = Today.getTime() - startDate.getTime();
    let time = set - acc;
    time = time / 1000;
    time = time / 60;
    time = time / 60;
    time = time / 24;
    time = Math.round(time);
    if (time <= 0) {
      this.infoTime = 'Tidak Terlambat' ;
      this.lateTime = false;
    } else {
      this.infoTime = 'Terlambat ' + time + ' Hari';
      this.lateTime = true;
      this.toastr.showWarning('ID ' + this.MhsId + ' terlambat ' + time + ' Hari', 'Warning!');
    }
    this.modalRef = this.modalService.show(template);
  }
  private onPageChange(event: any) {
    this.router.navigate(['/loans/history/' + this.MhsId ], {queryParams: {page: event.page}});
  }

  returnBlob(res): Blob {
    return new Blob([res], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
  }

  private onDownload() {
    this.http.get(this.uri + 'perpustakaan/api/v1/peminjaman/downloadriwayat', {responseType: 'blob'})
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

    this.http.post<any>(this.uri + 'perpustakaan/api/v1/peminjaman/createlistriwayat',
      {id: this.MhsId, search: this.search, page: 1, size : this.config.totalItems})
      .subscribe(x => {
        console.log(x);
        if (x.status === true) {
          if (this.nodata === false) {
            setTimeout(() => {
              this.loadingDL = false;
            }, 1000);
            this.toastr.showSuccess('Data berhasil didapat', 'Berhasil');
          } else {
            this.modalRef.hide();
            this.toastr.showError('Data Tidak bisa Diolah', 'Tidak ditemukan data');
          }
        } else {
          this.toastr.showError('Data gagal Diolah', 'Gagal');
        }
      });
  }
}
