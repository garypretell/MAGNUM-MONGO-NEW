import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../../core/services/user/user.service';
import Swal from 'sweetalert2';
const bcrypt = require('bcryptjs');

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent implements OnInit, OnDestroy {
  updateForm: FormGroup;
  user: any = {};
  userObject: any = {};
  userId;
  constructor(
    public formBuilder: FormBuilder,
    public router: Router,
    public userService: UserService,
    private activatedroute: ActivatedRoute,
  ) {
    this.updateForm = this.formBuilder.group({
      pass: ['', [Validators.required]],
      new_pass: ['', [Validators.required]],
      repeat_pass: ['', [Validators.required]],
    });
  }

  sub;
  async ngOnInit() {
    this.sub = this.activatedroute.paramMap.subscribe(async params => {
      this.userId = params.get('u');
      this.user = await this.userService.findUserbyUid(params.get('u'));
      this.userObject = this.user;
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  async updatePassword() {

    if (this.updateForm.value.new_pass === this.updateForm.value.repeat_pass) {
      const isSame = await bcrypt.compare(this.updateForm.value.pass, this.user.password);
      if (isSame) {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(this.updateForm.value.new_pass, salt);
      await this.userService.updateUser(this.user._id, {password: hash});
      this.updateForm.reset();
      Swal.fire({
        icon: 'success',
        title: 'Succes.',
        text: 'Password has been updated!',
      })
      }else {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Password incorrect!',
        })
      }

      
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Passwords do not match!',
      })
    }

  }

}
