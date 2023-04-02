import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-providers-list',
  templateUrl: './providers-list.component.html',
  styleUrls: ['./providers-list.component.css']
})
export class ProvidersListComponent implements OnInit {

  providers: any;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
  }

  async ngOnInit() {
    await this.getProviders();
  }

  async getProviders() {
    this.providers = await this.http.get("http://localhost:3000/providers", { withCredentials: true }).toPromise();
  }

  editProvider(providerID: any) {
    console.log("editar provider con id", providerID);
    this.router.navigate(['/provider', providerID]);
  }

  newProvider() {
    this.router.navigate(['/register']);
  }

  async deleteProvider(providerID: any) {
    let confirmar = confirm("Are you sure to delete this provider?");
    if (confirmar) {
      await this.http.delete("http://localhost:3000/deleteprovider/" + providerID).toPromise();
      await this.getProviders();
    }

  }

}
