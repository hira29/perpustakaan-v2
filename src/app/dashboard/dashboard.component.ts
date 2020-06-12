import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  public title = 'dashboard';
  pageOfItemsPeminjaman: any;
  pageOfItemsPengembalian: any;
  countBook: any;
  countLoan: any;
  countReturn: any;
  loading: boolean;

  constructor(
    private http: HttpClient,
  ) { }

  ngOnInit() {
    this.loading = true;
    this.getPeminjaman();
    this.getPengembalian();
    this.getBooksCount();
    this.getLoanCount();
    this.getRetunrCount();
    setTimeout(() => {
      this.loading = false;
    }, 300);
  }
  getPeminjaman() {
    this.http.post<any>('http://localhost:6996/perpustakaan/api/v1/peminjaman/berlangsung',
      {page: 1, size: 5 })
      .subscribe(x => {
        this.pageOfItemsPeminjaman = x.data.records;
      });
  }
  getPengembalian() {
    this.http.post<any>('http://localhost:6996/perpustakaan/api/v1/peminjaman/riwayat',
      {page: 1, size: 5 })
      .subscribe(x => {
        this.pageOfItemsPengembalian = x.data.records;
      });
  }
  getBooksCount() {
    this.http.get<any>('http://localhost:6996/perpustakaan/api/v1/summary/buku')
      .subscribe(x => {
        this.countBook = x.data;
      });
  }
  getLoanCount() {
    this.http.get<any>('http://localhost:6996/perpustakaan/api/v1/summary/peminjaman')
      .subscribe(x => {
        this.countLoan = x.data;
      });
  }
  getRetunrCount() {
    this.http.get<any>('http://localhost:6996/perpustakaan/api/v1/summary/pengembalian')
      .subscribe(x => {
        this.countReturn = x.data;
      });
  }

}
