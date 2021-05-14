import { Component, OnInit } from '@angular/core';
import { User } from '../../Interfaces/datalogin.interface';
import { UsuariosService } from '../../services/usuarios.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit{

  constructor(
    private usuarioService: UsuariosService
  ) {}

  ngOnInit(): void {
    this.getUser();
  }

  user: User;

  async getUser(){
    this.user = await this.usuarioService.getUsuario()
  }
  
  logout(){
    this.usuarioService.logOut();
  }
}
