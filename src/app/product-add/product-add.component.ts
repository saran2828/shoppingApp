import { InventoryService } from './../services/inventory.service';
import { Component, NgZone, OnInit, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
declare var $: any ;


@Component({
  selector: 'app-product-add',
  templateUrl: './product-add.component.html',
  styleUrls: ['./product-add.component.css']
})
export class ProductAddComponent implements OnInit,OnChanges {
  submitted = false;
  productForm!: FormGroup;
  categories: any = ['Electronics', 'Books', 'Toys'];
  @Output()
  reloadEvent= new EventEmitter();

  constructor(private fb: FormBuilder,
    private apiService:InventoryService) { }

  ngOnChanges(changes: SimpleChanges): void {
    this.productForm.markAsPristine();
  }

  ngOnInit(): void {
    this.productForm = this.fb.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      quantity: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      category: ['', [Validators.required]],
      price: ['', [Validators.required, Validators.pattern('^[0-9]+$')]]
    })
  }
  get myProductForm() {
    return this.productForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    if (!this.productForm.valid) {
      this.submitted =false;
    } else {
      this.apiService.addProduct(this.productForm.value).subscribe(
        (res) => {
          console.log('Product successfully added!');
          $("#productModal").modal('hide');
          this.reloadEvent.emit();
        }, (error) => {
          console.log(error);
        });
    }
  }
  selectCategory(e: any){
    console.log(e);
  }
  }
