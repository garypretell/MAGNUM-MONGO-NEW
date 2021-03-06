import { Component, OnInit, HostListener, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { base64ToFile, Dimensions, ImageCroppedEvent, ImageTransform } from 'ngx-image-cropper';
import { map, switchMap } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { ElectronService } from '../../core/services';
import Swal from 'sweetalert2';
import { DragScrollComponent } from 'ngx-drag-scroll';
import panzoom from "panzoom";
declare const jQuery: any;
declare const $;
import * as _ from 'underscore';
import { FolderService } from '../../core/services/folder/folder.service';
import { CropService } from '../../core/services/crop/crop.service';
import { FolderImageService } from '../../core/services/folder_image/folder_image.service';

@Component({
  selector: 'app-folder',
  templateUrl: './folder.component.html',
  styleUrls: ['./folder.component.scss']
})
export class FolderComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('scene') scene: ElementRef;
  panZoomController;
  zoomLevels: number[];

  currentZoomLevel: number;

  @ViewChild('nav', { read: DragScrollComponent }) ds: DragScrollComponent;
  welcomeMessage = false;
  private unsubscribe$ = new Subject();
  showCropper = false;
  image: any;
  cropper: any = {};
  microp;
  base64Image;
  dataUrl;
  listPath: any = [];
  listLength;
  folderPath;
  document;
  name;

  user;
  folderId;
  folder;
  cropList;

  constructor(
    public formBuilder: FormBuilder,
    private router: Router,
    private activatedroute: ActivatedRoute,
    private _location: Location,
    private electronService: ElectronService,
    public folderService: FolderService,
    public cropService: CropService,
    public folder_imageService: FolderImageService,
  ) {  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === 'F12') {
      if (this.microp) {
        this.takePhoto();
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Select a crop from List...!',
        })
        // alert('seleccione crop');
      }
    }
  }

  sub;
  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('user'));
    this.sub = this.activatedroute.paramMap.pipe(map(async params => {
      this.folderId = params.get('f');
       this.folder = await this.folderService.findFolderbyId(this.folderId);
      this.folderPath = this.folder.pathname;
      this.document = this.folder.document;
      this.name = this.folder.name;
      this.listPath = await this.folder_imageService.LisFolderImage({folderId: this.folderId});
      this.listLength = await this.folder_imageService.countFolderImage({folderId: this.folderId});
      this.cropList = await this.cropService.cropsbyUid(this.user.uid);
    })).subscribe();
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  selectCrop() {
  }

  async takePhoto() {
    if (!this.electronService.fs.existsSync('M:/camera.bat')) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'You need to configure your computer, contact the administrator',
      })
    }else {
      this.dataUrl = null;
      const { waitFile } = require('wait-file');
      var dir = `${this.folderId}/${this.name}/${Date.now()}.jpg`;
      var child = require('child_process').exec;
      var executablePath = `M:/camera.bat ${dir}`;
      child(executablePath, (err, data) => {
      })
      const opts = {
        resources: [`M:/Magnum-Camera/Photos/${dir}`],
        delay: 0, // initial delay in ms, default 0ms
        interval: 100, // poll interval in ms, default 250ms
        log: false, // outputs to stdout, remaining resources waited on and when complete or errored, default false
        reverse: false, // resources being NOT available, default false
        timeout: 30000, // timeout in ms, default Infinity
        verbose: false, // optional flag which outputs debug output, default false
        window: 1000, // stabilization time in ms, default 750ms
      };
      try {
        await waitFile(opts);
        var preview: any = document.getElementById('scene');
        var imageClipper = require('image-clipper');
        this.welcomeMessage = true;
        const x = this.microp.x11;
        const y = this.microp.y11;
        const w = this.microp.x22 - this.microp.x11;
        const h = this.microp.y22 - this.microp.y11;
        imageClipper(`M:/Magnum-Camera/Photos/${dir}`, function () {
          this.crop(x, y, w, h)
            .toDataURL(function (dataUrl) {
              console.log('cropped!');
              preview.src = dataUrl;
            });
        });
        this.cropImage(`M:/Magnum-Camera/Photos/${dir}`);
      } catch (err) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Camera not found',
        })
        console.error(err);
      }
    };
    
  }

  async cropImage(path) {
    const { waitFile } = require('wait-file');
    var Clipper = require('image-clipper');
    const x = this.microp.x11;
    const y = this.microp.y11;
    const w = this.microp.x22 - this.microp.x11;
    const h = this.microp.y22 - this.microp.y11;
    const filePath = `M:/Imagenes/${this.document}_${this.name}/${this.name}/${Date.now()}.jpg`
    Clipper(path, function () {
      this.crop(x, y, w, h)
        .quality(100)
        .toFile(filePath, function () {
          console.log('saved!');
        });
    });
    const opts = {
      resources: [filePath],
      delay: 0, // initial delay in ms, default 0ms
      interval: 100, // poll interval in ms, default 250ms
      log: false, // outputs to stdout, remaining resources waited on and when complete or errored, default false
      reverse: false, // resources being NOT available, default false
      timeout: 30000, // timeout in ms, default Infinity
      verbose: false, // optional flag which outputs debug output, default false
      window: 1000, // stabilization time in ms, default 750ms
    };
    try {
      var fs = require('fs');
      await waitFile(opts);
      this.deleteFile(path);
      const data: any = {
        filePath,
        folderId: this.folderId,
        createdAt: Date.now()
      };
      await this.folder_imageService.createFolderImage(data);
      this.updateData();
      this.moveTo(this.listLength);
    } catch (err) {
      console.error(err);
    }
  }

  deleteFile(filePath) {
    var fs = require('fs');
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    } else {
      console.log('does not')
    }
  }

  moveTo(index) {
    this.ds.moveTo(index);
  }

  async updateData() {
    this.listPath = await this.folder_imageService.LisFolderImage({folderId: this.folderId});
    this.listLength = await this.folder_imageService.countFolderImage({folderId: this.folderId});
  }

  base64_encode(file) {
    var fs = require('fs');
    var bitmap = fs.readFileSync(file);
    return Buffer.from(bitmap).toString('base64');
  }

  loadImage(path) {
    // console.log(path);
  }

  backClicked() {
    this._location.back();
  }

  goHome() {
    this.router.navigate(['/detail']);
  }

  goCrop() {
    this.router.navigate(['/capture', this.folderId, 'crop']);
  }

  deleteCrop() {
    if (this.microp) {
      Swal.fire({
        title: 'Are you sure to delete this crop?',
        text: 'You won\'t be able to revert this!',
        icon: 'warning',
        showCancelButton: true,
        cancelButtonText: 'Cancel',
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, Delete!'
      }).then(async (result) => {
        if (result.value) {
          await this.cropService.deleteCrop(this.microp._id);
          this.cropList = await this.cropService.cropsbyUid(this.user.uid);
           this.microp = null;
          Swal.fire(
            'Deleted!',
            'The folder has been deleted.',
            'success'
          );
        }
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Select a crop from List...!',
      })
    }
  }

  moveLeft() {
    this.ds.moveLeft();
  }

  moveRight() {
    var title = $('img').attr('title');
    $('img').before(title);
    this.ds.moveRight();
  }

  ngAfterViewInit() {
    // Starting ngx-drag-scroll from specified index(3)
    setTimeout(() => {
      this.zoomLevels = [0.1, 0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 2.5, 3];
      this.currentZoomLevel = this.zoomLevels[4];
      // panzoom(document.querySelector('#scene'));
      this.panZoomController = panzoom(this.scene.nativeElement);
    }, 4000);
  }

  clickIndex(e) {
    console.log(e);
  }

  gotoListCamera(): void {
    window.open("http://www.gphoto.org/proj/libgphoto2/support.php", "_blank");
  }

}
