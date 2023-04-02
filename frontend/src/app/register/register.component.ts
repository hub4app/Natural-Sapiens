import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  frmRegistrarProducto: FormGroup;
  mensaje: string = null;
  guardando: boolean;
  guardadoOK: boolean;
  categorias: any;
  productos: any;
  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) { }

  async ngOnInit() {

    this.frmRegistrarProducto = this.formBuilder.group(
      {
        nombre: "",
        localidad: "",
        telefono: "",
        mail: "",
        contraseña: "",
        productoID: ""
      });
    await this.getCategorias();
  }

  async getCategorias() {
    this.categorias = await this.http.get("http://localhost:3000/categorias", { withCredentials: true }).toPromise();
  }

  async guardarProveedor() {
    this.guardando = true;
    console.log("guardando...");
    this.mensaje = "Validando datos....";
    let nombre: string = this.frmRegistrarProducto.controls["nombre"].value;
    let localidad: string = this.frmRegistrarProducto.controls["localidad"].value;
    let telefono: string = this.frmRegistrarProducto.controls["telefono"].value;
    let mail: string = this.frmRegistrarProducto.controls["mail"].value;
    let contraseña: string = this.frmRegistrarProducto.controls["contraseña"].value;
    let productoID: string = this.frmRegistrarProducto.controls["productoID"].value;
    let body = {
      "nombre": nombre,
      "localidad": localidad,
      "telefono": telefono,
      "mail": mail,
      "contraseña": contraseña,
      "fecha_inscripcion": "01/01/2020",
      "producto_id": productoID
    };
    let url = "http://localhost:3000/newProvider";
    let datos: any = await this.http.post(url, body, {}).toPromise();
    console.log("fin");

    if (datos && datos.message && datos.ID) {
      this.guardadoOK = true;
      this.mensaje = "Datos guardados con éxito!!";
      setTimeout(() => {
        this.router.navigate(['/providers']);
      }, 2000);
    } else {
      this.guardadoOK = false;
      this.mensaje = "Error guardando";
    }
    this.guardando = false;


  }

  async getProductosPorCategoria(categoriaSeleccionada: any) {
    //console.log("categoriaSeleccionada", categoriaSeleccionada);
    this.productos = await this.http.get("http://localhost:3000/productosPorCategoria?categoryid=" + categoriaSeleccionada, { withCredentials: true }).toPromise();
    //console.log("productos", this.productos);
  }



}
