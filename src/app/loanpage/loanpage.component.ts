import {Component, OnInit, TemplateRef} from '@angular/core';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute, Router} from '@angular/router';
import {NotificationService} from '../notification.service';

@Component({
  selector: 'app-loanpage',
  templateUrl: './loanpage.component.html',
  styleUrls: ['./loanpage.component.css']
})
export class LoanpageComponent implements OnInit {
  config: any;
  search: string;
  pager = {};
  pageOfItems = [];
  loading = true;
  modalRef: BsModalRef;
  infoReturn: any;
  infoTime: string;
  lateTime: boolean;
  peminjamanId: string;
  unhide = false;

  constructor(
    private modalService: BsModalService,
    private http: HttpClient,
    private route: ActivatedRoute,
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
    this.route.queryParams.subscribe(x => this.loadPage(x.page || 1));
    setTimeout(() => {
      this.loading = false;
    }, 200);
  }
  private loadPage(num) {
    this.http.post<any>(`http://127.0.0.1:6996/perpustakaan/api/v1/data_mhs/list`,
      {search: this.search, page: +num, size : 10}).subscribe(x => {
      this.pager = x.data;
      this.pageOfItems = x.data.records;
      this.config = {
        itemsPerPage: x.data.limit,
        currentPage: x.data.page,
        totalItems: x.data.total_record
      };
    });
  }
  private onSearch(searchInput) {
    this.route.queryParams.subscribe(x => this.loadPage(x.page || 1));
  }
  private openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }
  private closeModal(Template: TemplateRef<any>) {
    this.modalRef.hide();
    this.peminjamanId = '';
    this.unhide = false;
  }
  private getData(id: any) {
    if (id === '') {
      this.unhide = false;
      this.infoReturn = null;
    } else {
      this.http.get<any>('http://localhost:6996/perpustakaan/api/v1/peminjaman/view/' + id)
        .subscribe(x => {
          console.log(x);
          if (x.status === true) {
            this.unhide = true;
            this.infoReturn = x.data;
            const Today = new Date();
            const startDate = new Date(x.data.data_peminjaman.tanggal_peminjaman);
            const endDate = new Date(x.data.data_peminjaman.tanggal_pengembalian);
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
              this.toastr.showWarning('ID ' + ' terlambat ' + time + ' Hari', 'Warning!');
            }
          } else {
            this.unhide = false;
            this.infoReturn = null;
          }
        });
    }
  }
  onSubmitReturn(id: string) {
    this.http.post<any>('http://localhost:6996/perpustakaan/api/v1/peminjaman/kembali',
      {id_peminjaman: id } )
      .subscribe(x => {
        this.modalRef.hide();
        if (x.status === true) {
          this.toastr.showSuccess(x.message, 'Berhasil');
          this.unhide = false;
          this.infoReturn = null;
        } else {
          this.toastr.showError(x.message, 'Gagal');
        }
        this.ngOnInit();
      });
  }
  private onPageChange(event: any) {
    this.router.navigate(['/loans' ], {queryParams: {page: event.page}});
  }

}
