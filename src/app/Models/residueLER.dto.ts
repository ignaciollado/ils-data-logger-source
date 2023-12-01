export class ResidueLERDTO {
    key:     string;
    chapterTitle: string;
    chapters:  Chapter[];
}

export interface Chapter {
    chapterId:    string;
    chapterName:  string;
    chapterItems: ChapterItem[];
}

export interface ChapterItem {
    chapterItemId:   string;
    chapterItemName: string;
}