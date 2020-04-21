import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-look-img',
  templateUrl: './look-img.component.html',
  styleUrls: ['./look-img.component.scss']
})
export class LookImgComponent implements OnInit {

  @Input() imgList = [];
  carouselStyle = {};
  carouselIndex = 0;
  carouselWidth = 952;
  constructor() { }

  ngOnInit() {
    this.setCarouselStyle();
  }
  setCarouselStyle() {
    this.carouselStyle = {
      width: this.carouselWidth * this.imgList.length,
      transform: `translate3d(-${this.carouselIndex * this.carouselWidth}px, 0px, 0px)`
    };
  }
  next() {
    this.carouselIndex = this.carouselIndex >= this.imgList.length - 1 ? 0 : this.carouselIndex + 1;
    this.setCarouselStyle();
  }
  prev() {
    this.carouselIndex = this.carouselIndex <= 0 ? 0 : this.carouselIndex - 1;
    this.setCarouselStyle();
  }
  sele(index) {
    this.carouselIndex = index;
    this.setCarouselStyle();
  }
}
