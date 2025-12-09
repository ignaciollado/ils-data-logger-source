import { Component, OnInit } from '@angular/core';
import { VectorsService } from 'src/app/Services/vectors.service';
import { QuestionsService } from 'src/app/Services/questions.service';
import { AnswersService } from 'src/app/Services/answers.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-test-end-points-backend',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './test-end-points-backend.component.html',
  styleUrls: ['./test-end-points-backend.component.scss']
})
export class TestEndPointsBackendComponent {
  vectors: any[] = [];
  questions: any[] = [];
  answers: any[] = [];
  errorMessage: string = '';

   constructor(
    private vectorsService: VectorsService,
    private questionsService: QuestionsService,
    private answersService: AnswersService
  ) {}

  ngOnInit(): void {
    this.loadVectors();
    this.loadQuestions();
    this.loadAnswers();
  }

  loadVectors() {
    this.vectorsService.getAll().subscribe({
      next: data => this.vectors = data,
      error: err => this.errorMessage = err.message
    });
  }

  loadQuestions() {
    this.questionsService.getAll().subscribe({
      next: data => this.questions = data,
      error: err => this.errorMessage = err.message
    });
  }

  loadAnswers() {
    this.answersService.getAll().subscribe({
      next: data => this.answers = data,
      error: err => this.errorMessage = err.message
    });
  }
}
