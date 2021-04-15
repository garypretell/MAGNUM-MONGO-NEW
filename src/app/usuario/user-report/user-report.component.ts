import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map, takeUntil, groupBy, flatMap, mergeMap, toArray, switchMap, switchMapTo } from 'rxjs/operators';
import { Observable, Subject, of } from 'rxjs';
import Swal from 'sweetalert2';
import * as _ from 'underscore';
import { UserService } from '../../core/services/user/user.service';
import { RecordService } from '../../core/services/record/record.service';
declare var jQuery: any;
declare const $;


@Component({
  selector: 'app-user-report',
  templateUrl: './user-report.component.html',
  styleUrls: ['./user-report.component.scss']
})
export class UserReportComponent implements OnInit, OnDestroy {
  user: any = {};
  userId;
  records: any = [];
  data;

  fechaActual = true;
  nomFecha = 'Now';
  max = new Date().toISOString().substring(0, 10);
  hoyF = new Date().toISOString().substring(0, 10);
  today = new Date().toISOString().substring(0, 10);
  desde = new Date().toISOString().substring(0, 10);
  hasta = new Date().toISOString().substring(0, 10);

  view: any[];

  // options
  showDataLabel = true;
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'DOCUMENTS';
  showYAxisLabel = true;
  yAxisLabel = 'RECORDS';
  constructor(
    public router: Router,
    public userService: UserService,
    public recordService: RecordService,
    private activatedroute: ActivatedRoute,
  ) {
    this.view = [innerWidth / 1.8, innerHeight / 1.9];
  }

  sub;
  async ngOnInit() {
    this.sub = this.activatedroute.paramMap.subscribe(async params => {
      this.userId = params.get('u');
      this.user = await this.userService.findUserbyUid(params.get('u'));
      this.records = await this.recordService.searchRecord({ usuarioid: this.user.uid });
      this.getFecha();
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  getFecha() {
    var counts = _.countBy(this.records, 'documento');
    var data = _.map(counts, function (value, key) {
      return {
        name: key,
        value: value
      };
    });
    this.data = data;
  }

  async getBetween(desde, hasta) {
    const temp = await this.recordService.searchRecord({ createdAt: { $gte: desde,  $lte: hasta }, usuarioid : this.user.uid});
    var counts = _.countBy(temp, 'documento');
    var data = _.map(counts, function (value, key) {
      return {
        name: key,
        value: value
      };
    });
    this.data = data;
  }

  changeBetween() {
    const desde = Date.parse(this.desde);
    const hasta = Date.parse(this.hasta);
    this.getBetween(desde, hasta);
  }

  onResize(event) {
    this.view = [event.target.innerWidth / 1.8, event.target.innerHeight / 1.9];
  }

  onSelect(event) {
    // console.log(event);
  }

  hoy() {
    this.today = new Date().toISOString().substring(0, 10);
    this.nomFecha = 'Now';
    this.fechaActual = true;
    return this.getFecha();
  }

  rango() {
    this.nomFecha = 'Date Range';
    this.fechaActual = false;
    this.changeBetween();
  }

  changeActual(today) {
    const mifecha = Date.parse(today);
    this.getFecha();
  }

  trackByFn(index, item) {
    return item._id;
  }

}
