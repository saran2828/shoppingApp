import { Component, EventEmitter, Input, NgZone, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { InventoryService } from '../services/inventory.service';
declare var $: any ;


@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.css']
})
export class ProductEditComponent implements OnInit,OnChanges {

  submitted = false;
  editForm!: FormGroup;
  categories: any = ['Electronics', 'Books', 'Toys'];

  @Input()
  productId: any;

  @Output()
  reloadEvent= new EventEmitter();

  constructor(private fb: FormBuilder,
    private apiService:InventoryService) {
      
     }
  ngOnChanges(changes: SimpleChanges): void {
    this.getProduct(this.productId);
  }

  ngOnInit(): void {
    this.editForm = this.fb.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      quantity: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      category: ['', [Validators.required]],
      price: ['', [Validators.required, Validators.pattern('^[0-9]+$')]]
    });
  }

  get myProductForm() {
    return this.editForm.controls;
  }

  getProduct(id:number) {
    this.apiService.getProduct(id).subscribe(data => {
      this.editForm.setValue({
        name: data['name'],
        description: data['description'],
        quantity: data['quantity'],
        category: data['category'],
        price: data['price'],
      });
    });
  }


  onSubmit() {
    this.submitted = true;
    if (!this.editForm.valid) {
      this.submitted = false;
    } else {
        this.apiService.updateProduct(this.productId, this.editForm.value)
          .subscribe(res => {
            $("#productModal").modal('hide');
            this.editForm.markAsPristine();
            this.reloadEvent.emit();
            console.log('Product updated successfully!')
          }, (error) => {
            console.log(error)
          })
    }
  }


}
