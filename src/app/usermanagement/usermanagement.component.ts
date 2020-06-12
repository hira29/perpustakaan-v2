import {Component, OnInit, TemplateRef} from '@angular/core';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute, Router} from '@angular/router';
import {NotificationService} from '../notification.service';
import {UserModel} from './usermodel';
import {NgOption} from '@ng-select/ng-select';
import {BookModel} from '../booklist/bookmodel';
import {_app_config} from '@app-config/app.config';
import {dataDecryption} from '../shared/security.helper';

@Component({
  selector: 'app-usermanagement',
  templateUrl: './usermanagement.component.html',
  styleUrls: ['./usermanagement.component.css']
})
export class UsermanagementComponent implements OnInit {
  getRole: string;
  config: any;
  search: string;
  pager = {};
  pageOfItems = [];
  loading = true;
  modalRef: BsModalRef;
  Role: NgOption[];
  infoReturn: any;
  infoTime: string;
  lateTime: boolean;
  peminjamanId: string;
  unhide = false;
  deleteID = '';
  inputUser = new UserModel('', '', '', '', '', '');
  updateUser = new UserModel('', '', '', '', '', '');
  LoginDetails: any;

  constructor(
    private modalService: BsModalService,
    private http: HttpClient,
    private route: ActivatedRoute,
    private toastr: NotificationService,
    private router: Router
  ) {}

  ngOnInit() {

    const acc = localStorage.getItem(_app_config.localstorage_prefix + 'user');
    if (acc) {
      this.LoginDetails = dataDecryption(acc);
    }
    if (this.LoginDetails.role === 'superadmin') {
      this.Role = [
        {id: '2', name: 'user'},
        {id: '1', name: 'superadmin'}
      ];
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
    } else {
      this.toastr.showWarning('Anda tidak memiliki akses untuk laman manajemen', 'Perhatian!');
      this.router.navigate(['/dashboard']);
    }
  }
  private loadPage(num) {
    this.http.post<any>(`http://127.0.0.1:6996/perpustakaan/api/v1/usermanagement/list`,
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
    this.getRole = 'user';
    this.inputUser.nama = '';
    this.inputUser.username = '';
    this.inputUser.password = '';
    this.inputUser.role = 'user';
    this.inputUser.email = '';
    this.inputUser.Phone = '';
    this.modalRef = this.modalService.show(template);
  }
  private onChange($event) {
    this.inputUser.role = this.getRole;
    this.updateUser.role = this.getRole;
  }
  private onSubmit(data: UserModel) {
    if (this.inputUser.nama === '' &&
      this.inputUser.username === '' &&
      this.inputUser.password === '' &&
      this.inputUser.role === ' ' &&
      this.inputUser.email === '' &&
      this.inputUser.Phone === '') {
      this.toastr.showError('Data yang dibutuhkan Kosong!', 'Gagal');
    } else {
      this.http.post<any>(`http://127.0.0.1:6996/perpustakaan/api/v1/usermanagement/create`,
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
  }
  private onView(item: any, template: TemplateRef<any>) {
    this.updateUser = item;
    this.getRole = item.role;
    this.modalRef = this.modalService.show(template);
  }

  private onUpdate(data: UserModel) {
    this.http.put<any>(`http://127.0.0.1:6996/perpustakaan/api/v1/usermanagement/update`,
      data).subscribe(x => {
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

  private onModalDelete(id: string, template: TemplateRef<any>) {
    this.deleteID = id;
    this.modalRef = this.modalService.show(template);
  }
  private onDelete(id: string) {
    this.http.delete<any>(`http://127.0.0.1:6996/perpustakaan/api/v1/usermanagement/delete/` + id)
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

}
