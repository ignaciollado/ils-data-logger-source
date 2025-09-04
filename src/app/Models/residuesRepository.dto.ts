export interface Chapter {
  chapterKey: string;
  chapterTitle: string;
}

export interface Subchapter {
  subchapterId: string;
  chapterKey: string;
  subchapterName: string;
}

export interface Item {
  itemId: string;
  subchapterId: string;
  itemName: string;
}
