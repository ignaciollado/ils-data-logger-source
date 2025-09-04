import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Chapter, Subchapter, Item } from '../Models/residuesRepository.dto';
import { SharedService } from './shared.service';

@Injectable({
  providedIn: 'root'
})
export class ResiduesRepositoryService {
  private chapters: Chapter[] = [];
  private subchapters: Subchapter[] = [];
  private items: Item[] = [];

  private chapters$ = new BehaviorSubject<Chapter[]>(this.chapters);
  private subchapters$ = new BehaviorSubject<Subchapter[]>(this.subchapters);
  private items$ = new BehaviorSubject<Item[]>(this.items);

  private apiUrl: string

  constructor(private http: HttpClient, private sharedService: SharedService) {  
      this.apiUrl = 'https://tramits.idi.es/public/index.php/api';
    }
  

  // ---------- CHAPTER ----------
/*   getChapters(): Observable<Chapter[]> {
    return this.chapters$.asObservable();
  }
 */
  getChapters(): Observable<Chapter[]> {
    return this.http.get<Chapter[]>(`${this.apiUrl}/ilsresiduechapters`)
  }

  addChapter(chapter: Chapter) {
    this.chapters.push(chapter);
    this.chapters$.next(this.chapters);
  }

  updateChapter(chapter: Chapter) {
    const index = this.chapters.findIndex(c => c.chapterKey === chapter.chapterKey);
    if (index > -1) this.chapters[index] = chapter;
    this.chapters$.next(this.chapters);
  }

  deleteChapter(chapterKey: string) {
    this.chapters = this.chapters.filter(c => c.chapterKey !== chapterKey);
    this.chapters$.next(this.chapters);
  }

  // ---------- SUBCHAPTER ----------
  getSubchapters(chapterKey?: string): Observable<Subchapter[]> {
    return this.http.get<Subchapter[]>(`${this.apiUrl}/ilsresiduesubchapters/${chapterKey}`)
  }

  addSubchapter(subchapter: Subchapter) {
    this.subchapters.push(subchapter);
    this.subchapters$.next(this.subchapters);
  }

  updateSubchapter(subchapter: Subchapter) {
    const index = this.subchapters.findIndex(sc => sc.subchapterId === subchapter.subchapterId);
    if (index > -1) this.subchapters[index] = subchapter;
    this.subchapters$.next(this.subchapters);
  }

  deleteSubchapter(subchapterId: string) {
    this.subchapters = this.subchapters.filter(sc => sc.subchapterId !== subchapterId);
    this.subchapters$.next(this.subchapters);
  }

  // ---------- ITEM ----------
  getItems(subchapterId?: string): Observable<Item[]> {
    return this.http.get<Item[]>(`${this.apiUrl}/ilsresidueitem/${subchapterId}`)
  }

  addItem(item: Item) {
    this.items.push(item);
    this.items$.next(this.items);
  }

  updateItem(item: Item) {
    const index = this.items.findIndex(i => i.itemId === item.itemId);
    if (index > -1) this.items[index] = item;
    this.items$.next(this.items);
  }

  deleteItem(itemId: string) {
    this.items = this.items.filter(i => i.itemId !== itemId);
    this.items$.next(this.items);
  }
}
