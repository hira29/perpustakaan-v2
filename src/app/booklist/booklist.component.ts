import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { BookModel} from './bookmodel';
import { NotificationService} from '../notification.service';


@Component({
  selector: 'app-booklist',
  templateUrl: './booklist.component.html',
  styleUrls: ['./booklist.component.css']
})

export class BooklistComponent implements OnInit {
  public title = 'Book List';

  deleteID: string;
  config: any;
  search: string;
  pager = {};
  pageOfItems = [];
  inputBook = new BookModel('', '', '', '', '', '', '', 1, '');
  updateBook = new BookModel('', '', '', '', '', '', '', 0, '');

  modalRef: BsModalRef;
  constructor(
    private modalService: BsModalService,
    private http: HttpClient,
    private route: ActivatedRoute,
    private toastr: NotificationService,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(x => this.loadPage(x.page || 1));
  }
  private onSearch(searchInput) {
    this.route.queryParams.subscribe(x => this.loadPage(x.page || 1), searchInput);
  }
  private openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }
  private onPageChange(event: any) {
    this.router.navigate(['/books'], {queryParams: {page: event.page}});
  }
  private onView(id: string, template: TemplateRef<any>) {
    this.http.get<any>(`http://127.0.0.1:6996/perpustakaan/api/v1/data_buku/view/` + id)
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
    this.http.delete<any>(`http://127.0.0.1:6996/perpustakaan/api/v1/data_buku/delete/` + id)
      .subscribe(x => {
        this.modalRef.hide();
        if (x.status === true) {
          this.toastr.showSuccess(x.message, 'Berhasil');
        } else {
          this.toastr.showError(x.message, 'Gagal');
        }
        setTimeout(() => {
          this.ngOnInit();
        }, 1000);
        this.deleteID = '';
      });
  }
  private onNotDelete() {
    this.deleteID = '';
    this.modalRef.hide();
  }
  private loadPage(num) {
    this.http.post<any>(`http://127.0.0.1:6996/perpustakaan/api/v1/data_buku/list`,
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
  private onSubmit(data: BookModel) {
    this.http.post<any>(`http://127.0.0.1:6996/perpustakaan/api/v1/data_buku/create`,
      data).subscribe(x => {
        console.log(x);
        this.modalRef.hide();
        if (x.status === true) {
          this.toastr.showSuccess(x.message, 'Berhasil');
        } else {
          this.toastr.showError(x.message, 'Gagal');
        }
        setTimeout(() => {
          this.ngOnInit();
          }, 1000);
    });
  }
  private onUpdate(data: BookModel) {
    this.http.put<any>(`http://127.0.0.1:6996/perpustakaan/api/v1/data_buku/update`,
      data).subscribe(x => {
      console.log(x);
      this.modalRef.hide();
      if (x.status === true) {
        this.toastr.showSuccess(x.message, 'Berhasil');
      } else {
        this.toastr.showError(x.message, 'Gagal');
      }
      setTimeout(() => {
        this.ngOnInit();
      }, 1000);
    });
  }

}
