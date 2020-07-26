import {Component, OnInit, TemplateRef} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {NotificationService} from '../notification.service';

@Component({
  selector: 'app-returnpage',
  templateUrl: './returnpage.component.html',
  styleUrls: ['./returnpage.component.css']
})
export class ReturnpageComponent implements OnInit {
  config: any;
  pager = {};
  pageOfItems = [];
  nodata = false;
  loading: boolean;
  modalRef: BsModalRef;
  infoReturn: any;
  infoTime: string;
  lateTime: boolean;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private modalService: BsModalService,
    private toastr: NotificationService,
    private router: Router
  ) { }

  ngOnInit() {
    this.loading = true;
    this.config = {
      itemsPerPage: 10,
      currentPage: 1,
      totalItems: 0
    };
    this.route.queryParams.subscribe(x => this.getReturnApproval(x.page || 1));
    setTimeout(() => {
      this.loading = false;
    }, 300);
  }

  getReturnApproval(num) {
    this.http.post<any>('http://localhost:6996/perpustakaan/api/v1/pengembalian/adminlist',
      {id: '', search: '', page: +num, size: 10})
      .subscribe(x => {
        if (x.data.records === null) {
          this.nodata = true;
        } else {
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
      this.toastr.showWarning('ID ' + this.infoReturn.detail_mhs.mhs_id + ' terlambat ' + time + ' Hari', 'Warning!');
    }
    this.modalRef = this.modalService.show(template);
  }

  onSubmitReturn(id: string) {
    this.http.post<any>('http://localhost:6996/perpustakaan/api/v1/pengembalian/admin',
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
    this.router.navigate(['/return_approval'], {queryParams: {page: event.page}});
  }

}
