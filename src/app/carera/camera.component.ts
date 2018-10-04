import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';

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
  public video: any;
  public picImageDisplay: string;
  public displayVideo: string;
  public displayCanvas: string;

  constructor() {}

  ngOnInit() {
    this.picImageDisplay = 'none';
    this.displayVideo = 'none';
    this.cameraPolyfills();
    this.video = this.videoElement.nativeElement;
  }

  ngOnDestroy() {
    this.picImageDisplay = 'none';
    this.displayVideo = 'none';
    this.displayCanvas = 'none';
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

    browser.mediaDevices
      .getUserMedia({ video: { facingMode: { exact: 'environment' } } })
      .then(stream => {
        this.video.srcObject = stream;
        this.displayVideo = 'block';
      })
      .catch(error => {
        this.picImageDisplay = 'block';
        console.log('*** no camera.');
      });
  }
}
