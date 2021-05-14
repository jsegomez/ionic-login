import { Component, OnInit } from '@angular/core';
import { UsuariosService } from '../../services/usuarios.service';
import { User } from '../../Interfaces/datalogin.interface';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit{

  constructor(
    private usuariosService: UsuariosService
  ) {}

  
  ngOnInit(): void {
    this.getusuarios();
  }

  usuarios: User[];

  getusuarios(){
    this.usuariosService.getListaUsuarios().subscribe(
      (response: any) => {
        this.usuarios = response.users;
        console.log(this.usuarios)
      }
    )
  }

  logout(){
    this.usuariosService.logOut();
  }

}
