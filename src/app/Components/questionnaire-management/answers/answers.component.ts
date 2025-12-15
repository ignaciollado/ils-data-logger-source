import { Component, inject, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { AnswerDTO, answersColumns } from 'src/app/Models/new-answer.dto';
import { NormativeTextDTO } from 'src/app/Models/normativeText.dto';
import { VectorDTO } from 'src/app/Models/vector.dto';
import { AnswersService } from 'src/app/Services/answers.service';
import { NormativeTextService } from 'src/app/Services/normativeText.service';
import { QuestionsService } from 'src/app/Services/questions.service';
import { SharedService } from 'src/app/Services/shared.service';
import { VectorsService } from 'src/app/Services/vectors.service';

@Component({
  selector: 'app-answers',
  templateUrl: './answers.component.html',
  styleUrls: ['./answers.component.scss']
})
export class AnswersComponent {

  questionId?: number;

  private formBuilder = inject(FormBuilder);
  answerForm!: FormGroup;

  isElevated: boolean = true;

  questions!: any;
  vectors!: any;
  normativeTexts!: any

  columnsDisplayed: string[] = answersColumns.map((col) => col.key)
  dataSource = new MatTableDataSource<AnswerDTO>();
  columnsSchema: any = answersColumns;

  answers!: AnswerDTO[];

  questionText!: string;

  groupedQuestions!: any; // Servirá para el select de preguntas, que estarán agrupados por vectores

  questionType!: string; // Servirá para indicar que tipo de respuesta debe haber en la pregunta seleccionada

  @ViewChild('answerSort') answerSort = new MatSort();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  constructor(
    private route: ActivatedRoute,
    private answerService: AnswersService,
    private sharedService: SharedService,
    private questionService: QuestionsService,
    private vectorService: VectorsService,
    private normativaService: NormativeTextService
  ) {
    this.answerForm = this.formBuilder.group({
      question_id: new FormControl('', [Validators.required]),
      text_es: new FormControl('', [Validators.required]),
      text_ca: new FormControl('', [Validators.required]),
      tooltip_text_es: new FormControl('', [Validators.required]),
      tooltip_text_ca: new FormControl('', [Validators.required]),
      image_1: new FormControl('', []),
      image_2: new FormControl('', []),
      regulations: new FormControl([], [])
    })
  }

  ngOnInit(): void {

    this.route.queryParams.subscribe(params => {
      this.questionId = params['questionId']
    });

    if (this.questionId) {
      this.answerForm.get('question_id').setValue(this.questionId);
      this.answerForm.get('question_id').disable({ emitEvent: false });
    }

    this.answerForm.get('question_id').valueChanges.subscribe(value => {
      if (value) { this.questionType = this.questions.find(q => q.id === value).type }
    })

    this.loadVectors();
    this.loadNormativeText();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.answerSort;
  }

  // Carga de regulaciones
  private loadNormativeText(): void {
    this.normativaService.getAllNormativeText().subscribe({
      next: (normativeTexts: NormativeTextDTO[]) => {
        this.normativeTexts = normativeTexts;
      }
    })
  }

  // Carga de respuestas. Si se detecta questionId (parámetro opcional), solo cargará las respuestas enlazadas a la pregunta
  private loadAnswers() {
    if (this.questionId) {
      this.answerService.getAllAnswersByQuestion(this.questionId).subscribe({
        next: (answers: any[]) => {
          this.transformAnswerInfo(answers);
        }
      })
    } else {
      this.answerService.getAllAnswers().subscribe({
        next: (answers: any[]) => {
          this.transformAnswerInfo(answers);
        }
      })
    }

  }

  private transformAnswerInfo(answers: any[]): void {
    this.answers = answers;
    const transformedAnswers = answers.map(answer => {

      const regulationsIds = typeof answer.regulations === 'string'
      ? answer.regulations.split(',').filter(Boolean)
      : Array.isArray(answer.regulations) ? answer.regulations : [];

      if (!Array.isArray(answer.regulations)) {
        answer.regulations = answer.regulations.split(',');
      }

      return {
        ...answer,
        regulations: regulationsIds,
        question_text: this.questions.find(q => q.id === answer.question_id)?.question_text_es,
        regulations_text: this.normativeTexts.filter(n => answer.regulations.includes(n.idNormativa))?.map(n => n.regId)
      }
    })

    this.dataSource = new MatTableDataSource(transformedAnswers);
    this.dataSource.sort = this.answerSort;
    this.dataSource.paginator = this.paginator;

  }

  // Carga de todas las preguntas para el select
  private loadQuestions() {
    this.questionService.getAllQuestions().subscribe({
      next: (questions: any[]) => {
        this.questions = questions;

        if (this.questionId) {
          this.questionText = this.questions.find(q => q.id === this.questionId).question_text_es
        }
        this.loadAnswers(); // Evito errores
        this.buildGroupedQuestions();

      },
      error: (error: any) => {
        this.sharedService.showSnackBar(`Error cargando preguntas: ${error.error}`)
      }
    })
  }

  // Cargo los vectores para agrupar las preguntas posteriormente
  private loadVectors() {
    this.vectorService.getAll().subscribe({
      next: (vectors: VectorDTO[]) => {
        this.vectors = vectors;
        this.loadQuestions(); // Evito errores
      },
      error: (error: any) => {
        this.sharedService.showSnackBar(`Error cargando vectores: ${error.error}`)
      }
    })
  }

  // Encapsulo esta lógica. Construyo un objeto que agrupa las preguntas en vectores
  private buildGroupedQuestions(): void {
    this.groupedQuestions = this.vectors.map(vector => ({
      vectorName: vector.name_es,
      questions: this.questions.filter(q => q.vector_id === vector.id)
    })).filter(group => group.questions.length > 0) // Solo aquellos vectores con preguntas
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  // Crear respuesta con el formulario
  createAnswer(): void {
    const newAnswer = this.answerForm.getRawValue();

    const payload = {
      ...newAnswer,
      regulations: newAnswer.regulations.join(',')
    }

    this.answerService.createAnswer(payload).subscribe({
      next: () => {
        this.sharedService.showSnackBar('Se ha creado la nueva respuesta correctamente');

        // Reseteo de esta forma para no "borrar" question_id
        this.answerForm.reset({
          question_id: this.questionId ?? '',
          text_es: '',
          text_ca: '',
          tooltip_text_es: '',
          tooltip_text_ca: '',
          image_1: '',
          image_2: '',
          regulations: []
        });

        this.answers = [...this.answers, payload];

        console.log(this.answers);

        this.transformAnswerInfo(this.answers);
      },
      error: (error: any) => {
        this.sharedService.showSnackBar(`Ha ocurrido un error creando la respuesta: ${error.error}`)
      }
    })

  }

  // Actualizar desde la tabla
  updateAnswer(answer: any): void {
    if (answer) {
      const payload = {
        ...answer,
        regulations: answer.regulations.join(',')
      }

      // Limpio el payload. Mantengo answer para poder desactivar el edit
      delete payload.isEdit;
      delete payload.regulations_text;
      delete payload.question_text;

      this.answerService.updateAnswer(answer.id, payload).subscribe({
        next: () => {
          answer.isEdit = !answer.isEdit;
          this.sharedService.showSnackBar(`Respuesta ${answer.text_es} actualizada correctamente`);

          this.answers = this.answers.map(a => a.id === answer.id ? payload : a);

          this.transformAnswerInfo(this.answers);

        },
        error: (error: any) => {
          this.sharedService.showSnackBar(`Error intentando actualizar respuesta ${answer.text_es}: ${error.error}`)
        }
      })
    }

  }

  // Borrado desde tabla
  removeRow(id: any) {
    if (id) {
      const confirmed = window.confirm('¿Seguro que quieres borrar la respuesta?');
      if (!confirmed) {
        return;
      }

      this.answerService.deleteAnswer(id).subscribe({
        next: () => {
          this.sharedService.showSnackBar(`Se ha borrado la respuesta con la id ${id} correctamente`);

          this.answers = this.answers.filter(a => a.id !== id);

          this.transformAnswerInfo(this.answers);
        },
        error: (error: any) => {
          this.sharedService.showSnackBar(`Ha ocurrido un error intentando borrar la respuesta con el id ${id}: ${error.error}`)
        }
      })
    }


  }
}
