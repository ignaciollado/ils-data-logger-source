import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Chapter, Subchapter, Item  } from '../../../Models/residuesRepository.dto';
import { ResiduesRepositoryService } from '../../../Services/residues-repository.service';
import { ChapterFormComponent } from '../chapter-form/chapter-form.component';
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder, FormGroup } from '@angular/forms';
import { map, Observable } from 'rxjs';


@Component({
  selector: 'app-chapter-list',
  templateUrl: './chapter-list.component.html',
  styleUrls: ['./chapter-list.component.scss']
})

export class ChapterListComponent implements OnInit {
  displayedColumns = ['chapterKey', 'chapterTitle', 'actions'];
  chapters: Chapter[] = [];
  subchapters: Subchapter[] = [];
  items: Item[] = [];
  dataSource = new MatTableDataSource<Chapter>()
  itemColumns: string[] = ['itemId', 'itemName', 'actions'];

  constructor(private service: ResiduesRepositoryService, private dialog: MatDialog, private fb: FormBuilder) {}

  ngOnInit() {
    this.service.getChapters().subscribe((data:Chapter[]) => {
          this.chapters = data;
    });
  }

   // --- Capítulos ---
  addChapter() {
    this.dialog.open(ChapterFormComponent).afterClosed().subscribe(result => {
      if(result) this.service.addChapter(result);
    });
  }
  editChapter(chapter: Chapter) {
    this.dialog.open(ChapterFormComponent, { data: chapter }).afterClosed().subscribe(result => {
      if(result) this.service.updateChapter(result);
    });
  }
  deleteChapter(chapterKey: string) {
    this.chapters = this.chapters.filter(c => c.chapterKey !== chapterKey);
    this.subchapters = this.subchapters.filter(sc => sc.chapterKey !== chapterKey);
    this.items = this.items.filter(i => this.subchapters.some(sc => sc.subchapterId === i.subchapterId));
  }

  // --- Subcapítulos ---
  addSubchapter(chapter: any) { /* Lógica */ }
  editSubchapter(subchapter: any) { /* Lógica */ }
  deleteSubchapter(subchapterId: string) { /* Lógica */ }
  getSubchapters(chapterKey: string) {
    console.log ("chapterKey", chapterKey)
    this.service.getSubchapters(chapterKey)
      .subscribe((subchapters: Subchapter[])=> {
        this.subchapters = subchapters
      })
  }


  // --- Items ---
  addItem(subchapter: Subchapter) { /* Lógica con Reactive Form */ }
  editItem(item: Item) { /* Lógica con Reactive Form */ }
  deleteItem(itemId: string) {
    this.items = this.items.filter(i => i.itemId !== itemId);
  }
  getItems(subchapterId: string) {
    console.log(subchapterId)
    this.service.getItems(subchapterId)
      .subscribe((items:Item[]) => {
        this.items = items
      })
    return this.items.filter(i => i.subchapterId === subchapterId);
  }
}
