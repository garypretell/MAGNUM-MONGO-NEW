import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.scss']
})
export class PageNotFoundComponent implements OnInit {
  constructor(private route: ActivatedRoute, public router: Router) {}

  ngOnInit(): void {}

  goHome() {
    this.router.navigate(['']);
  }

}
