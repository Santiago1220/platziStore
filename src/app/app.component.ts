import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { UsersService } from './services/users.service';
import { FilesService } from './services/files.service';
import { TokenService } from './services/token.service';

@Component({
  selector: 'app-root',
  template: `<router-outlet></router-outlet>`,
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  imgParent = '';
  showImg= true;
  token = '';
  imgRta = '';

  constructor(
    private authService: AuthService,
    private userService: UsersService,
    private fileService: FilesService,
    private tokenService: TokenService
  ) { }

  onLoaded(img: string){
    console.log('log padre', img)
  }

  toggleImage(){
    this.showImg=!this.showImg;
  }

  ngOnInit(): void {
    const token = this.tokenService.getToken();
    if(token){
      this.authService.getProfile()
      .subscribe()
    }
  }

  createUser() {
    this.userService.create({
      name: 'Moni',
      email: 'moni@gmail.com',
      password: '12345',
      role: 'admin'
    })
    .subscribe(rta =>{
      console.log(rta)
    })
  }

  downloadPDF(){
    this.fileService.getFile('my.pdf', 'https://young-sands-07814.herokuapp.com/api/files/dummy.pdf', 'application/pdf')
    .subscribe()
  }

  onUpload(event: Event) {
    const element = event.target as HTMLInputElement;
    const file = element.files?.item(0);
    if (file) {
      this.fileService.uploadFile(file)
      .subscribe(rta => {
        this.imgRta = rta.location;
      })
    }
  }



}
