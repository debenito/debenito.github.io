import { Component, OnInit } from '@angular/core';
import { Route, Router, RouterModule } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { JWT } from '../model/jwt.model';
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable, catchError, map } from 'rxjs';
import { error } from 'console';
import { RoleService } from '../service/role.service';
import { UserJWT } from '../model/user-jwt.model';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-inicio-sesion',
  templateUrl: './inicio-sesion.page.html',
  styleUrls: ['./inicio-sesion.page.scss'],
})
export class InicioSesionPage implements OnInit {

  name: string = '';
  password: string = '';
  jwt: any;

  constructor(private modalCtrl: ModalController, private router: Router, private http: HttpClient,
    private role: RoleService,private  alertcontroller:AlertController) {
  }

  ngOnInit() {
  }


  cancel() {
    if (this.role.isRoleAdmin())
      this.router.navigateByUrl("/admin/registro").then(() => { window.location.reload() });
    else
      this.router.navigateByUrl("/home").then(() => { window.location.reload() });
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  confirm() {
    this.loginApi(new JWT(this.name, this.password)).subscribe(
      data => {
        localStorage.setItem("role", data.roles[0]);
        localStorage.setItem("token", data.token);

        if (data.roles[0] == "ROLE_ADMIN")
          this.router.navigateByUrl("/admin/registro").then(() => { window.location.reload() });
        return this.modalCtrl.dismiss(this.name + this.password, 'confirm');

      },
      error => {
        this.alertError();
        localStorage.clear();
        //this.router.navigateByUrl("/home").then(() => { window.location.reload() });


      });
  }
  loginApi(jwt: JWT): Observable<UserJWT> {
    let queryParams = new HttpParams();
    queryParams = queryParams.append("username", jwt.username);
    queryParams = queryParams.append("password", jwt.password);
    return this.http.get<UserJWT>(environment.API_URL+'/api/login', { params: queryParams });

  }

  async alertError(){

    const alert = await this.alertcontroller.create({
      header:"Error de Usuario",
      subHeader:"El usuario no existe",
      message:"El usuario introducido o la contraseña es incorrecta",
      buttons:["Acepto"]
    });
    await alert.present(); 
  }


}
