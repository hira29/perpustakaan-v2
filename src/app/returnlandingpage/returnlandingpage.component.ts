import {Component, OnInit, TemplateRef} from '@angular/core';
import {_app_config} from "@app-config/app.config";
import {HttpClient} from "@angular/common/http";
import {ActivatedRoute, Router} from "@angular/router";
import {NotificationService} from "../notification.service";
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";

@Component({
  selector: 'app-returnlandingpage',
  templateUrl: './returnlandingpage.component.html',
  styleUrls: ['./returnlandingpage.component.css']
})
export class ReturnlandingpageComponent implements OnInit {
  uri = 'https://lib-ws-mdb.herokuapp.com/';
  // uri = this.uri + '';
  input = {idMhs: '', idBuku: '' };
  object = { mhs_id: '', buku_id: ''};
  modalRef: BsModalRef;
  infoReturn: any;
  infoTime: string;
  lateTime: boolean;
  constructor(
    private modalService: BsModalService,
    private http: HttpClient,
    private route: ActivatedRoute,
    private toastr: NotificationService,
    private router: Router
  ) { }

  ngOnInit() {
    this.input.idMhs = '';
    this.input.idBuku = '';
    if (localStorage.getItem(_app_config.localstorage_prefix + 'user')) {
      this.router.navigate(['/dashboard']);
    }
  }
  onInput(template: TemplateRef<any>) {
    this.http.post<any>(this.uri + 'perpustakaan/api/v1/pengembalian/get',
      {id_mhs: this.object.mhs_id, id_buku: this.object.buku_id })
      .subscribe(x => {
          this.infoReturn = x.data;
          if (x.status === true) {
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
              this.toastr.showWarning('ID ' + this.infoReturn.detail_mhs.mhs_id + ' terlambat ' + time + ' Hari', 'Warning!');
            }
            this.toastr.showSuccess(x.message, 'Berhasil');
            this.modalRef = this.modalService.show(template);
          } else {
            this.toastr.showWarning(x.message, 'Perhatian!');
            this.ngOnInit();
          }
      });
  }
  getMhsId(value) {
    this.object.mhs_id = value;
  }
  getBukuId(value) {
    this.object.buku_id = value;
  }
  keyDownFunction(event, template: TemplateRef<any>) {
    if (event.key === 'Enter') {
      this.onInput(template);
    }
  }
  onSubmitReturn(id: string) {
    this.http.post<any>(this.uri + 'perpustakaan/api/v1/pengembalian/set',
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

}
