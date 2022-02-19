import { InventoryService } from './../services/inventory.service';
import { Component, NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';
declare var $: any ;

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products: any = [];
  isEdit = false;
  productId=0;

  constructor(private apiService: InventoryService,
    private router: Router,
    private ngZone: NgZone) {
  }

  showConfirmation(id:number){
    this.productId=id;
    $("#confirmModal").modal("show");
  }
  deleteProduct(id: number) {
    $("#confirmModal").modal("hide");
      this.apiService.deleteProduct(id).subscribe((data) => {
        this.ngOnInit();
      }
        , (error) => {
          console.log(error);
        }
      )
  }
  ngOnInit(): void {
    this.apiService.getProducts().subscribe((data) => {
      this.products = data;
    });
  }

  showFilteredList(data: any) {
    this.products = data;
  }
  reloadList(event:any){
    this.ngOnInit();
  }

  showEditOvly(id:any){
    this.isEdit=true;
    this.productId = id;
    //fetch data for the product
    $("#productModal").modal('show');
  }

  showAddOvly(num:any){
    if(num==0){
      this.isEdit=false;
      $("#productModal").modal('show');
    }
  }

}
