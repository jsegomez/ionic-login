import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { environment } from '../../environments/environment';
import { catchError, map } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { Datalogin, User } from '../Interfaces/datalogin.interface';
import { DataRegistro } from '../Interfaces/data-registro.interface';
import { AlertController, NavController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService{

  constructor(
    private http: HttpClient,
    private storage: Storage,
    private navController: NavController,
    private alertController: AlertController
  ) {
    this.init();
  }

  // Propieades del servicio
  token: string = null;  
  user: User = null;
  private urlAuth = environment.urlAuth;
  private urlUser = environment.urlUser;
  private _storage: Storage | null = null;
  private httpHeaders = new HttpHeaders({'Content-Type': 'application/json'})


  // Funciones para almacenamiento Storage
  async init() {    
    const storage = await this.storage.create();
    this._storage = storage;
    this.cargarToken();
    this.getUsuario();
  }

  async cargarToken(){
    this.token = await this.storage.get('tokenINC');
  }

  // Funciones de inicio de sesión y registro
  login(data: any): Observable<Datalogin>{        
    return this.http.post<Datalogin>(`${this.urlAuth}/login`, data).pipe(
      map(response => {
        this.token = response.token;        
        return response;
      }),
      catchError( e => {
        if(e.status == 404){
          this.presentAlert('Usuario o contraseña incorrectos');
        }
        this.token = null;
        this.storage.clear();
        return throwError(e);
      })
    );
  }

  registroUsuario(data: DataRegistro): Observable<Datalogin>{
    return this.http.post<Datalogin>(`${this.urlAuth}/singin`, data).pipe(
      map(response => {
        this.token = response.token;
        return response;
      }),
      catchError( e => {        
        if(e.status == 400){
          this.presentAlert('Favor completar todos los campos')
        }
        if(e.status == 406){
          this.presentAlert('Correo electronico ya se encuentra registrado');
        }        
        return throwError(e);
      })
    )
  }

  getListaUsuarios():Observable<User[]>{    
    const token = this.token;
    const headers = this.httpHeaders.append('x-token', token);
    return this.http.get<User[]>(this.urlUser, {headers})
  }

  async guardarToken(token: string){
    this.token = token;
    await this.storage.set('tokenINC', this.token);
  }

  async guardarUsuario(user: User){
    this.user = user;
    await this.storage.set('user', this.user)
  }
  
  async getUsuario(){
    const user = await this.storage.get('user');
    this.user = user;
    return this.user;
  }



  logOut(){
    this.presentAlertConfirm();
  }
  
  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Desea cerrar sesión!',
      // message: 'Message <strong>text</strong>!!!',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            
          }
        }, {
          text: 'Aceptar',
          handler: () => {
            this.token = null;
            this.storage.clear();
            this.navController.navigateRoot('/',{
              animated: true
            });
          }
        }
      ]
    });

    await alert.present();
  }

  async presentAlert(text: string) {
    const alert = await this.alertController.create({                  
      message: text,
      buttons: ['OK']
    });

    await alert.present();
  }

  async validarToken(){
    await this.cargarToken();    
    const token = this.token;

    if(!token){
      return Promise.resolve(false);
    }

    const headers = this.httpHeaders.append('x-token', token); 

    return new Promise<boolean>(resolve => {
      this.http.get(`${this.urlAuth}/verify-token`, {headers}).subscribe(
        (response: any) => {
          if(response.ok == true){
            resolve(true)
          }else{
            resolve(false)
          }
        }
      )
    });
  }
}
