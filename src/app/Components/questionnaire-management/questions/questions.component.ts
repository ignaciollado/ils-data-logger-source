import { Component, inject, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { questionColumns, QuestionDTO } from 'src/app/Models/new-question.dto';
import { VectorDTO } from 'src/app/Models/vector.dto';
import { QuestionsService } from 'src/app/Services/questions.service';
import { SharedService } from 'src/app/Services/shared.service';
import { VectorsService } from 'src/app/Services/vectors.service';

@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.scss']
})

export class QuestionsComponent {

  vectorId?: number;

  private formBuilder = inject(FormBuilder);
  questionForm!: FormGroup;

  isElevated: boolean = true;

  vectors!: any;

  columnsDisplayed: string[] = questionColumns.map((col) => col.key);
  dataSource = new MatTableDataSource<QuestionDTO>();
  columnsSchema: any = questionColumns;

  questions!: QuestionDTO[];

  vectorName!: string;


  @ViewChild('questionSort') questionSort = new MatSort();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  constructor(
    private route: ActivatedRoute,
    private questionService: QuestionsService,
    private sharedService: SharedService,
    private vectorService: VectorsService
  ) {
    this.questionForm = this.formBuilder.group({
      vector_id: new FormControl('', [Validators.required]),
      type: new FormControl('', [Validators.required]),
      question_text_es: new FormControl('', [Validators.required]),
      question_text_ca: new FormControl('', [Validators.required]),
      tooltip_text_es: new FormControl('', [Validators.required]),
      tooltip_text_ca: new FormControl('', [Validators.required]),
      link: new FormControl('', []),
      doc_1: new FormControl('', []),
      doc_2: new FormControl('', [])
    })
  }


  // Parámetro opcional
  // ngOnInit() {
  //   this.route.queryParams.subscribe(params => {
  //     this.vectorId = params['vectorId'];
  //     console.log(this.vectorId);
  //   })
  // }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.vectorId = params['vectorId']
    })
    this.loadVectors();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.questionSort;
  }

  private loadQuestions() {
    if (this.vectorId) {
      this.questionService.getAllQuestionsByVector(this.vectorId).subscribe({
        next: (questions: any[]) => {
          this.transformQuestionInfo(questions)
        }
      })
    } else {
      this.questionService.getAllQuestions().subscribe({
        next: (questions: any[]) => {
          this.transformQuestionInfo(questions)
        }
      })
    }
  }

  private transformQuestionInfo(questions: any[]): void {
    this.questions = questions;
    
    const transformedQuestions = questions.map(question => {
      return {
        ...question,
        vector_name: this.vectors.find(v => v.id == question.vector_id)?.name_es,
        radio_type: question.type === "radio" ? "Sí o no" : "Múltiple",
      }   
    })

    this.dataSource = new MatTableDataSource(transformedQuestions);
    this.dataSource.sort = this.questionSort;
    this.dataSource.paginator = this.paginator;
  }

  private loadVectors(): void {
    this.vectorService.getAll().subscribe({
      next: (vectors: VectorDTO[]) => {
        this.vectors = vectors;
        this.loadQuestions();
      },
      error: (error: any) => {
        this.sharedService.showSnackBar(`Error cargando los vectores: ${error}`)
      }
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  // Crear nueva pregunta con formulario
  createQuestion(): void {
    const newQuestion = this.questionForm.value;

    this.questionService.createQuestion(newQuestion).subscribe({
      next: () => {
        this.sharedService.showSnackBar('Se ha creado la nueva pregunta correctamente');
        // Reseteo el formulario para poder crear otra pregunta. Además, evito que aparezcan los errores al reiniciarlo
        this.questionForm.reset();

        this.questionForm.markAsPristine();
        this.questionForm.markAsUntouched();

        this.questions = [...this.questions, newQuestion];

        this.transformQuestionInfo(this.questions);

      },
      error: (error: any) => {
        this.sharedService.showSnackBar(`Ha ocurrido un error creando la pregunta: ${error.error}`)
      }
    })
  }

  // Actualización desde la tabla
  updateQuestion(question: any): void {
    if (question) {
      this.questionService.updateQuestion(question.id, question).subscribe({
        next: () => {
          question.isEdit = !question.isEdit;
          this.sharedService.showSnackBar(`Pregunta ${question.question_text_es} actualizada correctamente`);

          this.questions = this.questions.map(q => q.id === question.id ? question : q);

          this.transformQuestionInfo(this.questions);
        },
        error: (error: any) => {
          this.sharedService.showSnackBar(`Error intentando actualizar pregunta ${question.question_text_es}: ${error.error}`)
        }
      })
    }
  }

  removeRow(id: any) {

    if (id) {
      const confirmed = window.confirm('¿Seguro que quieres borrar la pregunta?');
      if (!confirmed) {
        return;
      }

      this.questionService.deleteQuestion(id).subscribe({
        next: () => {
          this.sharedService.showSnackBar(`Se ha borrado la pregunta con la id ${id} correctamente`);

          this.questions = this.questions.filter(q => q.id !== id);

          this.transformQuestionInfo(this.questions);
        },
        error: (error: any) => {
          this.sharedService.showSnackBar(`Ha ocurrido un error intentando borrar la pregunta con el ${id}: ${error.error}`)
        }
      })
    }
  }
}
