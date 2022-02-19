import { InventoryService } from './../services/inventory.service';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from '../modal/product';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  categorySearched:string='';

  @Output()
  searchEvent:EventEmitter<Product[]>=new EventEmitter<Product[]>();

  @Output()
  addEvent:EventEmitter<any>=new EventEmitter<any>();

  constructor(private apiService:InventoryService,
    private router: Router) { }

  ngOnInit(): void {
  }

  showAddOvly() {
    this.addEvent.emit(0);
  }


  searchByCategory(){
      this.apiService.getProductsByCategory(this.categorySearched).subscribe((data)=>{
        this.searchEvent.emit(data);
      })
  }
  reset(){
    this.categorySearched ='';
    this.apiService.getProducts().subscribe((data)=>{
       this.searchEvent.emit(data);
    })
  }

}
