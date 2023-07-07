import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
/* import { CategoryDTO } from 'src/app/Models/category.dto'; */
import { EnergyDTO } from 'src/app/Models/energy.dto';
import {
  CategoryService,
  deleteResponse,
} from 'src/app/Services/category.service';
import { EnergyService } from 'src/app/Services/energy.service';
import { LocalStorageService } from 'src/app/Services/local-storage.service';
import { SharedService } from 'src/app/Services/shared.service';

@Component({
  selector: 'app-categories-list',
  templateUrl: './categories-list.component.html',
  styleUrls: ['./categories-list.component.scss']
})
export class CategoriesListComponent {
/*   categories!: CategoryDTO[]; */
  energies!: EnergyDTO[];

  isGridView: boolean = false
  columnsDisplayed = ['energyId', 'aspect', 'nameES', 'nameCA', 'unit', 'pci', 'ACTIONS'];

  constructor(
   /*  private categoryService: CategoryService, */
    private energyService: EnergyService,

    private router: Router,
    private localStorageService: LocalStorageService,
    private sharedService: SharedService
  ) {
    this.loadCategories();
  }

  private loadCategories(): void {
    let errorResponse: any;
    const userId = this.localStorageService.get('user_id');
    if (userId) {
      /* this.categoryService.getCategoriesByUserId(userId).subscribe( */
      this.energyService.getAllFuelsFromMySQL().subscribe(
        (fuels: EnergyDTO[]) => {
          console.log (fuels)
          this.energies = fuels;
        },
        (error: HttpErrorResponse) => {
          errorResponse = error.error;
          this.sharedService.errorLog(errorResponse);
        }
      );
    }
  }

  createCategory(): void {
    this.router.navigateByUrl('/user/category/');
  }

  updateCategory(categoryId: string): void {
    this.router.navigateByUrl('/user/category/' + categoryId);
  }

  deleteCategory(categoryId: string): void {
    let errorResponse: any;

    // show confirmation popup
    let result = confirm(
      'Confirm delete category with id: ' + categoryId + ' .'
    );
    if (result) {
      this.energyService.deleteFuel(categoryId).subscribe(
        (rowsAffected: deleteResponse) => {
          if (rowsAffected.affected > 0) {
            this.loadCategories();
          }
        },
        (error: HttpErrorResponse) => {
          errorResponse = error.error;
          this.sharedService.errorLog(errorResponse);
        }
      );
    }
  }

  gridViewType(isGrid: boolean) {
    this.isGridView = isGrid
  }
}
