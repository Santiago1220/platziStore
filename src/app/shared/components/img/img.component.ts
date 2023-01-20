import { Component, OnInit, Input, Output, EventEmitter, OnChanges, AfterViewInit, OnDestroy, SimpleChanges} from '@angular/core';

@Component({
  selector: 'app-img',
  templateUrl: './img.component.html',
  styleUrls: ['./img.component.scss']
})
export class ImgComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {

  img: string = ''
  @Input('img')
  set changeImge(newImg: string){
    this.img = newImg;
    // console.log('change just img', this.img)
  }
  @Output() loaded = new EventEmitter<string>();
  imageDefault = "./assets/images/No_Image_Available.jpg"
  // counter = 0;
  // counterFn: number | undefined;
  constructor() {
    //Before render
    //No async -- once time
    // console.log('Constructor'), 'imgValue =>', this.img;
  }

  ngOnChanges(changes: SimpleChanges): void {
    //Before render - during render
    //Cambios en los inputs
    // console.log('ngOnchanges'), 'imgValue =>', this.img;
    // console.log(changes);
  }

  ngOnInit(): void {
    //Before render
    //Si async fetch susbcribe once time
    // console.log('ngOnInit'), 'imgValue =>', this.img;
    // this.counterFn = window.setInterval(()=>{
    //   this.counter += 1;
    //   console.log('run counter');
    // },1000)
  }

  ngAfterViewInit(): void {
    //After render
    //Handles children
    // console.log('ngAfterViewInit'), 'imgValue =>', this.img;
  }

  ngOnDestroy(): void {
    //delete render
    //Handles children
    // console.log('ngOnDestroy');
    // window.clearInterval(this.counterFn);
  }

  imgError(){
    this.img = this.imageDefault;
  }

  imgLoaded(){
    // console.log('loaded hijo');
    this.loaded.emit(this.img);
  }

}
