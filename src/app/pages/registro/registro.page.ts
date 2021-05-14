import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { UsuariosService } from '../../services/usuarios.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {

  constructor(
    private formBuilder: FormBuilder,
    private navController: NavController,
    private usuariosService: UsuariosService    
  ) { }

  ngOnInit() { }


  public formRegistro = this.formBuilder.group({
    name: ['', [Validators.required, Validators.minLength(5)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  validarCampo(campo: string) {    
    return  this.formRegistro.controls[campo].errors &&
            this.formRegistro.controls[campo].touched;
  }

  registroUsuario(){
    if(this.formRegistro.invalid){
      this.formRegistro.markAllAsTouched();
      return;
    }

    const data = this.formRegistro.value;

    this.usuariosService.registroUsuario(data).subscribe(
      (response: any) => {
        console.log(response);
        this.usuariosService.guardarToken(response.token);
        this.usuariosService.guardarUsuario(response.newUser);
        this.navController.navigateRoot('/main/tabs/tab1',{
          animated: true
        });
      }
    );
    
  }

}
