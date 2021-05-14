import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { User } from 'src/app/Interfaces/datalogin.interface';
import { UsuariosService } from '../../services/usuarios.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(
    private formBuilder: FormBuilder,    
    private navController: NavController,
    private usuariosService: UsuariosService
  ) { }

  ngOnInit() {
  }

  public formLogin = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  validarCampo(campo: string) {    
    return  this.formLogin.controls[campo].errors &&
            this.formLogin.controls[campo].touched;
  }

  login(){
    if(this.formLogin.invalid){
      this.formLogin.markAllAsTouched();
      return;
    }
    
    const data = this.formLogin.value;    
    
    this.usuariosService.login(data).subscribe(
      response => {
        this.usuariosService.guardarToken(response.token);        
        this.usuariosService.guardarUsuario(response.user);
        this.navController.navigateRoot('/main/tabs/tab1',{
          animated: true
        });
      }
    );
  }
}
