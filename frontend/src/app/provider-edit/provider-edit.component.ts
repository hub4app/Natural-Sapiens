import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-provider-edit',
  templateUrl: './provider-edit.component.html',
  styleUrls: ['./provider-edit.component.css']
})
export class ProviderEditComponent implements OnInit {
  providerID: number;

  frmActualizarProveedor: FormGroup;
  mensaje: string = null;
  guardando: boolean;
  guardadoOK: boolean;
  categorias: any;
  productos: any;
  datosProvider: any;

  constructor(private activatedRoute: ActivatedRoute, private formBuilder: FormBuilder,
    private http: HttpClient, private router: Router) {
    this.activatedRoute.params.subscribe(params => {
      this.providerID = +params.id;
      console.log("recibido this.providerID", this.providerID);
    });
  }

  async ngOnInit() {

    this.frmActualizarProveedor = this.formBuilder.group(
      {
        nombre: "",
        localidad: "",
        telefono: "",
        mail: "",
        contraseña: "",
        productoID: "",
        categoria: ""
      });
    await this.getCategorias();
    await this.getProviderByID();
    await this.getProductosPorCategoria(this.datosProvider.categoria_id)
    console.log("this.datosProvider", this.datosProvider);

    this.frmActualizarProveedor.controls["nombre"].setValue(this.datosProvider.Nombre);
    this.frmActualizarProveedor.controls["localidad"].setValue(this.datosProvider.Localidad);
    this.frmActualizarProveedor.controls["mail"].setValue(this.datosProvider.Mail);
    this.frmActualizarProveedor.controls["telefono"].setValue(this.datosProvider.Telefono);
    this.frmActualizarProveedor.controls["categoria"].setValue(this.datosProvider.categoria_id);
    this.frmActualizarProveedor.controls["productoID"].setValue(this.datosProvider.producto_id);



  }

  async getProviderByID() {
    this.datosProvider = await this.http.get("http://localhost:3000/provider/" + this.providerID, { withCredentials: true }).toPromise();
  }

  async getCategorias() {
    this.categorias = await this.http.get("http://localhost:3000/categorias", { withCredentials: true }).toPromise();
  }

  async guardarProveedor() {
    this.guardando = true;
    console.log("guardando...");
    this.mensaje = "Validando datos....";
    let nombre: string = this.frmActualizarProveedor.controls["nombre"].value;
    let localidad: string = this.frmActualizarProveedor.controls["localidad"].value;
    let telefono: string = this.frmActualizarProveedor.controls["telefono"].value;
    let mail: string = this.frmActualizarProveedor.controls["mail"].value;
    let contraseña: string = this.frmActualizarProveedor.controls["contraseña"].value;
    let productoID: string = this.frmActualizarProveedor.controls["productoID"].value;
    let body = {
      "id": this.datosProvider.id,
      "nombre": nombre,
      "localidad": localidad,
      "telefono": telefono,
      "mail": mail,
      "contraseña": contraseña,
      "fecha_inscripcion": "01/01/2020",
      "producto_id": productoID,
      "hash": ""
    };

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'my-auth-token',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, PUT, POST, DELETE, OPTIONS',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true',
        'Allow': 'GET, POST, OPTIONS, PUT, DELETE'
      }), widthCredentials: true
    };

    let url = "http://localhost:3000/updateProvider";
    let datos: any = await this.http.put(url, body, httpOptions).toPromise();
    console.log("fin", datos);

    if (datos && datos.message) {
      this.guardadoOK = true;
      this.mensaje = "Datos actualizados con éxito!!";
      setTimeout(() => {
        this.volverAlListado();
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

  volverAlListado() {
    this.router.navigate(["/providers"]);
  }

}
