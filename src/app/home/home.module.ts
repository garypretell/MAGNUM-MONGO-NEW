import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';

import { HomeComponent } from './home.component';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { AdminGuard } from './guards/admin.guard';
import { AuthGuard } from './guards/auth.guard';
import { EditorGuard } from './guards/editor.guard';
import { RequireAuthGuard } from './guards/require-auth.guard';
import { RequireUnauthGuard } from './guards/require-unauth.guard';
import { SuperGuard } from './guards/super.guard';
import { AccountComponent } from './account/account.component';

@NgModule({
  declarations: [HomeComponent, AccountComponent],
  imports: [SharedModule, HomeRoutingModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxChartsModule],
  providers: [
    RequireAuthGuard,
    RequireUnauthGuard,
    AdminGuard,
    EditorGuard,
    AuthGuard,
    SuperGuard
  ]
})
export class HomeModule { }