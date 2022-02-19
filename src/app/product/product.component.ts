import { Component, EventEmitter, Input, OnInit, Output, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

import { InventoryService } from '../services/inventory.service';
declare var $: any;

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit, OnChanges {

  @Input()
  isEdit: boolean = false;

  @Output()
  reloadEvent = new EventEmitter();

 
  sub! : Subscription;

  submitted = false;
  @Input()
  productId = 0;
  modalTitle='Add Product';
  productForm!: FormGroup;
  product = {
    "name": "",
    "category": "",
    "description": "",
    "price": '',
    "quantity": ''
  };
  categories: any = ['Electronics', 'Books', 'Toys'];
  btnText = "Add";

  constructor(private fb: FormBuilder,
    private apiService: InventoryService) { }


  ngOnChanges(changes: SimpleChanges): void {
    if (this.isEdit) {
      this.getProduct(this.productId);
      this.btnText = "Edit";
      this.modalTitle = "Edit Product";
    }
    else if (changes['productId'].currentValue == 0) {
      this.productId = 0;
      this.btnText = "Add";
      this.modalTitle = "Add Product";
      this.productForm.reset();
    }
    else {
      this.productId = 0;
      this.btnText = "Add";
      this.modalTitle = "Add Product";
    }
  }
  close() {
  }

  ngOnInit(): void {
    this.productForm = new FormGroup({
      name: new FormControl(this.product.name, [
        Validators.required
      ]),
      description: new FormControl(this.product.description, [
      ]),
      category: new FormControl(this.product.category, [
        Validators.required
      ]),
      quantity: new FormControl(this.product.quantity, [
        Validators.required,
        Validators.min(1), Validators.max(100)
      ]),
      price: new FormControl(this.product.price, [
        Validators.required,
        Validators.min(1)
      ])
    });
  }

  get name() { return this.productForm.get('name')!; }

  get description() { return this.productForm.get('description')!; }

  get category() { return this.productForm.get('category')!; }

  get price() { return this.productForm.get('price')!; }

  get quantity() { return this.productForm.get('quantity')!; }

  get myProductForm() {
    return this.productForm.controls;
  }

  getProduct(id: number) {
    this.sub = this.apiService.getProduct(id).subscribe(data => {
      this.productForm.setValue({
        name: data['name'],
        description: data['description'],
        quantity: data['quantity'],
        category: data['category'],
        price: data['price'],
      });
    });
  }
  onSubmit(isEdit: boolean) {
    this.submitted = true;
    if (!this.productForm.valid) {
      this.submitted = false;
    } else {
      if (!this.isEdit) {
        //add flow
        this.sub = this.apiService.addProduct(this.productForm.value).subscribe(
          (res) => {
            console.log('Product successfully added!');
            $("#productModal").modal('hide');
            this.reloadEvent.emit();
          }, (error) => {
            console.log(error);
          });
      } else {
        this.sub = this.apiService.updateProduct(this.productId, this.productForm.value)
          .subscribe(res => {
            console.log('Product updated successfully!')
            $("#productModal").modal('hide');
            this.reloadEvent.emit();

          }, (error) => {
            console.log(error)
          })
      }

    }
  }


  ngOnDestroy() {
    this.sub.unsubscribe()
  }
}

