import { InventoryService } from './../services/inventory.service';
import { Product } from './../modal/product';
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
  action :number=0;
  modalTitle='Add Product';
  productId=0;

  constructor(private apiService: InventoryService,
    private router: Router,
    private ngZone: NgZone) {
    console.log(this.router);
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
  reloadList(){
    this.ngOnInit();
  }

  showEditOvly(id:any){
    this.action=1;
    this.modalTitle='Edit Product';
    this.productId = id;
    //fetch data for the product
    $("#productModal").modal('show');
  }

  showAddOvly(num:any){
    if(num==0){
      this.action=0;
      this.modalTitle='Add Product';
      $("#productModal").modal('show');
    }
  }

}
