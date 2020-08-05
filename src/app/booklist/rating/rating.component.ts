import {Component, OnInit, TemplateRef} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {NotificationService} from '../../notification.service';

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.css']
})
export class RatingComponent implements OnInit {
  deleteID: string;
  loadingDL: boolean;
  loading: boolean;
  BookId: string;
  config: any;
  uri = 'https://lib-ws-mdb.herokuapp.com/';
  // uri = 'http://localhost:6996/';
  BookInfo: any;
  pageOfItems = [];
  nodata = false;
  pager = {};
  modalRef: BsModalRef;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private modalService: BsModalService,
    private toastr: NotificationService,
    private router: Router
  ) { }

  ngOnInit() {
    this.loading = true;
    this.BookId = this.route.snapshot.paramMap.get('id');
    this.getBookInfo(this.BookId);
    this.config = {
      itemsPerPage: 10,
      currentPage: 1,
      totalItems: 0
    };
    this.route.queryParams.subscribe(x => this.getRatingInfo(x.page || 1));
  }
  getRatingInfo(num) {
    this.http.post<any>(this.uri + 'perpustakaan/api/v1/data_buku/rating/list',
      {id_buku: this.BookId, page: +num, size: 10 })
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
  getBookInfo(id) {
    this.http.get<any>(this.uri + 'perpustakaan/api/v1/data_buku/view/' + id)
      .subscribe(x => {
        this.BookInfo = x.data;
      });
  }
  private onPageChange(event: any) {
    this.router.navigate(['/book/rating/' + this.BookId ], {queryParams: {page: event.page}});
  }
  private onModalDelete(id: string, template: TemplateRef<any>) {
    this.deleteID = id;
    this.modalRef = this.modalService.show(template);
  }
  private onDelete(id: string) {
    this.http.delete<any>(this.uri + 'perpustakaan/api/v1/data_buku/rating/delete/' + id)
      .subscribe(x => {
        this.modalRef.hide();
        if (x.data === 1) {
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
  returnBlob(res): Blob {
    return new Blob([res], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
  }

  private onDownload() {
    this.http.get(this.uri + 'perpustakaan/api/v1/data_buku/rating/download', {responseType: 'blob'})
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

    this.http.post<any>(this.uri + 'perpustakaan/api/v1/data_buku/rating/createlistrating',
      {id_buku: this.BookId, page: 1, size : this.config.totalItems})
      .subscribe(x => {
        console.log(x);
        if (x.status === true) {
          setTimeout(() => {
            this.loadingDL = false;
          }, 1000);
          this.toastr.showSuccess('Data berhasil didapat', 'Berhasil');
        } else {
          this.modalRef.hide();
          this.toastr.showError('Data gagal Diolah', 'Gagal');
        }
      });
  }

}
