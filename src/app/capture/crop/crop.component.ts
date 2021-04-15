import { AfterViewInit, Component, HostListener, OnDestroy, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { ImageTransform, ImageCroppedEvent, base64ToFile, Dimensions } from 'ngx-image-cropper';
import { ElectronService } from '../../core/services';
import { of, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import * as _ from 'underscore';
import Swal from 'sweetalert2';
import { CropService } from '../../core/services/crop/crop.service';

@Component({
  selector: 'app-crop',
  templateUrl: './crop.component.html',
  styleUrls: ['./crop.component.scss']
})
export class CropComponent implements OnInit {
  user;
  imageChangedEvent: any = '';
  croppedImage: any = '';
  canvasRotation = 0;
  rotation = 0;
  scale = 1;
  showCropper = false;
  containWithinAspectRatio = false;
  transform: ImageTransform = {};
  image;
  imageBase64String;
  cropper: any = {};
  originalImage;
  public addCropForm: FormGroup;
  constructor(
    public formBuilder: FormBuilder,
    private router: Router,
    private activatedroute: ActivatedRoute,
    private _location: Location,
    private electronService: ElectronService,
    public cropService: CropService,
  ) {
    this.addCropForm = this.formBuilder.group({
      nombre: ['', [Validators.required]],
      estado: [''],
      usuarioid: [''],
      x1: [''],
      y1: [''],
      x2: [''],
      y2: [''],
      x11: [''],
      y11: [''],
      x22: [''],
      y22: [''],
    });
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === 'F12') {
      this.takePhoto();
    }
  }
  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('user'));
    // this.takePhoto();
  }

  async saveCrop() {

    this.addCropForm.value.x1 = this.cropper.x1;
    this.addCropForm.value.y1 = this.cropper.y1;
    this.addCropForm.value.x2 = this.cropper.x2;
    this.addCropForm.value.y2 = this.cropper.y2;
    this.addCropForm.value.x11 = this.originalImage.x1;
    this.addCropForm.value.y11 = this.originalImage.y1;
    this.addCropForm.value.x22 = this.originalImage.x2;
    this.addCropForm.value.y22 = this.originalImage.y2;
    this.addCropForm.value.estado = true;
    this.addCropForm.value.uid = this.user.uid;
    await this.cropService.createCrop(this.addCropForm.value);
    this.addCropForm.reset();
    this.backClicked();

  }

  takePhoto() {
    if (!this.electronService.fs.existsSync('M:/crop.bat')) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'You need to configure your computer, contact the administrator',
      })
    } else {
      this.deleteFile();
      var child = require('child_process').exec;
      var executablePath = `M:/crop.bat`;
      var dir = 'M:/Magnum-Camera/Crop/crop.jpg';
      child(executablePath, (err, data) => {
      })
      this.getFile(dir, 500);
    }

  }

  getFile(path, timeout) {
    var fs = require('fs');
    const tiempo = setInterval(() => {
      const file = path;
      const fileExists = fs.existsSync(file);
      if (fileExists) {
        clearInterval(tiempo);
        this.loadImage();
        return;
      }
    }, timeout);
  };

  deleteFile() {
    var fs = require('fs');
    var filePath = 'M:/Magnum-Camera/Crop/crop.jpg';
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    } else {
      console.log('does not')
    }
  }

  ngOnDestroy(): void {
    this.deleteFile();
  }

  loadImage() {
    this.image = this.electronService.fs.readFileSync('M:/Magnum-Camera/Crop/crop.jpg').toString('base64');
    this.imageBase64String = 'data:image/jpg;base64,' + this.image;
  }

  reloadImage() {
    this.loadImage();
  }

  backClicked() {
    this._location.back();
  }

  async goFolder() {
    this.router.navigate(['/capture']);
  }

  goHome() {
    this.router.navigate(['/detail']);
  }

  imageCropped(event: ImageCroppedEvent) {
    // this.cropper = event.imagePosition;
    // console.log(event.imagePosition);
    this.originalImage = event.imagePosition;
    this.croppedImage = event.base64;
    // console.log(this.croppedImage);

  }

  imageLoaded() {
    this.showCropper = true;
    // console.log('Image loaded');
  }

  cropperReady(sourceImageDimensions: Dimensions) {
    // console.log('Cropper ready', sourceImageDimensions);
  }

  loadImageFailed() {
    console.log('Load failed');
  }

  rotateLeft() {
    this.canvasRotation--;
    this.flipAfterRotate();
  }

  rotateRight() {
    this.canvasRotation++;
    this.flipAfterRotate();
  }

  private flipAfterRotate() {
    const flippedH = this.transform.flipH;
    const flippedV = this.transform.flipV;
    this.transform = {
      ...this.transform,
      flipH: flippedV,
      flipV: flippedH
    };
  }

  flipHorizontal() {
    this.transform = {
      ...this.transform,
      flipH: !this.transform.flipH
    };
  }

  flipVertical() {
    this.transform = {
      ...this.transform,
      flipV: !this.transform.flipV
    };
  }

  resetImage() {
    this.scale = 1;
    this.rotation = 0;
    this.canvasRotation = 0;
    this.transform = {};
  }

  zoomOut() {
    this.scale -= .1;
    this.transform = {
      ...this.transform,
      scale: this.scale
    };
  }

  zoomIn() {
    this.scale += .1;
    this.transform = {
      ...this.transform,
      scale: this.scale
    };
  }

  toggleContainWithinAspectRatio() {
    this.containWithinAspectRatio = !this.containWithinAspectRatio;
  }

  updateRotation() {
    this.transform = {
      ...this.transform,
      rotate: this.rotation
    };
  }

}
