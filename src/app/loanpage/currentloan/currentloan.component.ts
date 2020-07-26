import {Component, OnInit, TemplateRef} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {NotificationService} from '../../notification.service';

@Component({
  selector: 'app-currentloan',
  templateUrl: './currentloan.component.html',
  styleUrls: ['./currentloan.component.css']
})
export class CurrentloanComponent implements OnInit {
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
    this.MhsId = this.route.snapshot.paramMap.get('id');
    this.getMhsInfo();
    this.config = {
      itemsPerPage: 10,
      currentPage: 1,
      totalItems: 0
    };
    this.route.queryParams.subscribe(x => this.getLoanInfo(x.page || 1));
    this.loading = true;
    setTimeout(() => {
      this.loading = false;
    }, 300);
  }
  getMhsInfo() {
    this.http.get<any>('http://localhost:6996/perpustakaan/api/v1/data_mhs/view/'
      + this.MhsId).subscribe( x => {
        this.dataMhs = x.data;
    });
  }
  getLoanInfo(num) {
    this.http.post<any>('http://localhost:6996/perpustakaan/api/v1/peminjaman/berlangsung',
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
      });
  }
  private onSearch(searchInput) {
    this.route.queryParams.subscribe(x => this.getLoanInfo(x.page || 1));
  }
  private openModal(template: TemplateRef<any>, data: any) {
    this.infoReturn = data;
    const Today = new Date();
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
  onSubmitReturn(id: string) {
    this.http.post<any>('http://localhost:6996/perpustakaan/api/v1/peminjaman/kembali',
      {id_peminjaman: id } )
      .subscribe(x => {
        this.modalRef.hide();
        if (x.status === true) {
          this.toastr.showSuccess(x.message, 'Berhasil');
        } else {
          this.toastr.showError(x.message, 'Gagal');
        }
        this.ngOnInit();
      });
  }
  private onPageChange(event: any) {
    this.router.navigate(['/loans/current/' + this.MhsId], {queryParams: {page: event.page}});
  }
}
