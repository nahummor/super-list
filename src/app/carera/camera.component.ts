import { SuperListService } from './../super-list/super-list.service';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { Router } from '@angular/router';

@Component({
  selector: 'nm-camera',
  templateUrl: './camera.component.html',
  styleUrls: ['./camera.component.scss']
})
export class CameraComponent implements OnInit, OnDestroy {
  @ViewChild('videoElement')
  videoElement: any;
  @ViewChild('pickImage')
  pickImage: HTMLElement;
  // @ViewChild('canvasElement')
  canvasElement: HTMLCanvasElement;

  public video: any;
  public picImageDisplay: string;
  public displayVideo: string;
  public displayCanvas: string;
  private picture: Blob;
  private haveCamera: boolean;
  public progressBarValue: number;
  public doneLoadingPic: boolean;
  public startLoadingPic: boolean;

  constructor(
    private superListService: SuperListService,
    private storage: AngularFireStorage,
    private router: Router
  ) {}

  ngOnInit() {
    this.doneLoadingPic = false;
    this.startLoadingPic = false;
    this.progressBarValue = 0;
    this.picImageDisplay = 'none';
    this.displayVideo = 'none';
    this.displayCanvas = 'none';
    this.cameraPolyfills();
    this.video = this.videoElement.nativeElement;
    this.canvasElement = document.querySelector('#canvas');
    this.haveCamera = true;
  }

  ngOnDestroy() {
    this.picImageDisplay = 'none';
    this.displayVideo = 'none';
    this.displayCanvas = 'none';
    if (this.haveCamera) {
      // close all camera tracks
      this.video.srcObject.getVideoTracks().forEach(track => {
        track.stop();
      });
    }
  }

  public onGoBack() {
    this.router.navigate(['main']);
  }

  public onSelectPicture(event) {
    this.picImageDisplay = 'none';
    this.displayCanvas = 'block';

    const img = new Image();
    img.src = URL.createObjectURL(event.target.files[0]);
    const context = this.canvasElement.getContext('2d');
    img.onload = () => {
      context.drawImage(
        img,
        0,
        0,
        this.canvasElement.width,
        this.canvasElement.height
      );
    };

    this.savePictureToServer(event.target.files[0]);
  }

  public onTakePicture() {
    this.startLoadingPic = true;
    this.displayCanvas = 'block';
    this.displayVideo = 'none';

    const context = this.canvasElement.getContext('2d');
    context.drawImage(
      this.video,
      0,
      0,
      this.canvasElement.width,
      this.canvasElement.height
    );
    // context.drawImage(
    //   this.video,
    //   0,
    //   0,
    //   this.canvasElement.width,
    //   this.video.videoHeight /
    //     (this.video.videoWidth / this.canvasElement.width)
    // );
    // close all camera tracks
    this.video.srcObject.getVideoTracks().forEach(track => {
      track.stop();
    });

    this.picture = this.dataURLtoBlob(this.canvasElement.toDataURL());
    this.savePictureToServer(this.picture);
  }

  public savePictureToServer(picture: Blob) {
    console.log('Start uploading picture.....');
    // const file = event.target.files[0];
    const filePath = 'users-pictures/pic-' + new Date().toISOString() + '.jpg';
    const ref = this.storage.ref(filePath);
    const task = ref.put(picture);
    task.then(data => {
      console.log(data);
      ref.getDownloadURL().subscribe(url => {
        console.log('Pic Url: ', url);
        this.startLoadingPic = false;
        this.doneLoadingPic = true;
      });
    });

    task.percentageChanges().subscribe(p => {
      console.log('Uploading: ', p);
      this.progressBarValue = p;
    });
  }

  private cameraPolyfills() {
    const browser = <any>navigator;

    if (!('mediaDevices' in navigator)) {
      browser.mediaDevices = {};
    }

    if (!('getUserMedia' in browser.mediaDevices)) {
      browser.mediaDevices.getUserMedia = constraints => {
        const getUserMedia =
          browser.webkitGetUserMedia || browser.mozGetUserMedia;

        if (!getUserMedia) {
          return Promise.reject(new Error('getUserMedia is not implemented'));
        }

        return new Promise((resolve, reject) => {
          getUserMedia.call(navigator, constraints, resolve, reject);
        });
      };
    }

    if (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      )
    ) {
      // Mobile Device
      browser.mediaDevices
        .getUserMedia({
          video: {
            facingMode: { exact: 'environment' }
          }
        })
        .then(stream => {
          this.video.srcObject = stream;
          this.displayVideo = 'block';
        })
        .catch(error => {
          this.picImageDisplay = 'flex';
          console.log('*** no camera. ', error);
          this.haveCamera = false;
        });
    } else {
      // Desktop PC
      browser.mediaDevices
        .getUserMedia({
          video: true
        })
        .then(stream => {
          this.video.srcObject = stream;
          this.displayVideo = 'block';
        })
        .catch(error => {
          this.picImageDisplay = 'flex';
          console.log('*** no camera.');
          this.haveCamera = false;
        });
    }
  }

  private dataURLtoBlob(dataURI): Blob {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI
      .split(',')[0]
      .split(':')[1]
      .split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([ab], { type: mimeString });
    return blob;
  }
}
