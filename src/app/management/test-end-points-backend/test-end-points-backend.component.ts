import { Component, OnInit } from '@angular/core';
import { VectorsService } from 'src/app/Services/vectors.service';
import { QuestionsService } from 'src/app/Services/questions.service';
import { AnswersService } from 'src/app/Services/answers.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from "@angular/material/button";
import { VectorDTO } from 'src/app/Models/vector.dto';
import { QuestionDTO } from 'src/app/Models/new-question.dto';
import { AnswerDTO } from 'src/app/Models/new-answer.dto';

@Component({
  selector: 'app-test-end-points-backend',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './test-end-points-backend.component.html',
  styleUrls: ['./test-end-points-backend.component.scss']
})
export class TestEndPointsBackendComponent {
  vectors: any[] = [];
  questions: any[] = [];
  answers: any[] = [];
  errorMessage: string = '';
  succesfullMessage: string = '';

  constructor(
    private vectorsService: VectorsService,
    private questionsService: QuestionsService,
    private answersService: AnswersService
  ) { }

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
    this.questionsService.getAllQuestions().subscribe({
      next: data => this.questions = data,
      error: err => this.errorMessage = err.message
    });
  }

  loadAnswers() {
    this.answersService.getAllAnswers().subscribe({
      next: data => this.answers = data,
      error: err => this.errorMessage = err.message
    });
  }
}
