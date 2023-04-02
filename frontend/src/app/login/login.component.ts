import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpParams, HttpHeaders, HttpHandler, HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  frmUsuario: FormGroup;
  mensaje: string = null;
  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) { }

  ngOnInit() {
    this.frmUsuario = this.formBuilder.group(
      {
        usuario: "",
        password: ""
      });
  }

  async validarUsuarioAsync() {
    console.log("inicio");
    this.mensaje = "Validando datos....";
    let usuario: string = this.frmUsuario.controls["usuario"].value;
    let password: string = this.frmUsuario.controls["password"].value;
    let body = { "id": usuario, "contraseña": password };
    let url = "http://localhost:3000/login";
    let datos: any = await this.http.post(url, body, {}).toPromise();
    document["cookie"] = `aqq=${datos.token}`;
    console.log("después de validar", datos);
    console.log("fin");
    if (datos && datos.message) {
      this.mensaje = "Datos validados con éxito!!";
      setTimeout(() => {
        this.router.navigate(['/home']);
      }, 2000);


    } else {
      this.mensaje = "Credenciales incorrectas";
    }

  }

  validarUsuario() {
    console.log("inicio");
    let usuario: string = this.frmUsuario.controls["usuario"].value;
    let password: string = this.frmUsuario.controls["password"].value;
    let body = { "id": usuario, "contraseña": password };
    let url = "http://localhost:3000/login";
    let datos: any = this.http.post(url, body, {}).subscribe(
      response => {
        console.log("después de validar!!");
        console.log("reponse", response);
      },
      error => {
        console.log("error", error);
      },
      () => {

      });
    console.log("fin");
  }

}
