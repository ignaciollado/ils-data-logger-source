import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Chapter } from '../../../Models/residuesRepository.dto';

@Component({
  selector: 'app-chapter-form',
  templateUrl: './chapter-form.component.html'
})
export class ChapterFormComponent implements OnInit {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ChapterFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Chapter
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      chapterKey: [this.data?.chapterKey || '', Validators.required],
      chapterTitle: [this.data?.chapterTitle || '', Validators.required]
    });
  }

  save() {
    if(this.form.valid) this.dialogRef.close(this.form.value);
  }

  close() {
    this.dialogRef.close();
  }
}
