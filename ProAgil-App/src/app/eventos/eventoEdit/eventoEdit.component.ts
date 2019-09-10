import { Component, OnInit } from '@angular/core';
import { EventoService } from 'src/app/_services/evento.service';
import { BsModalService, BsLocaleService } from 'ngx-bootstrap';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Evento } from 'src/app/_models/Evento';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-eventoEdit',
  templateUrl: './eventoEdit.component.html',
  styleUrls: ['./eventoEdit.component.css']
})
export class EventoEditComponent implements OnInit {

  titulo = 'Editar Evento';
  evento: Evento = new Evento();
  imagemURL = 'assets/img/uploadImage.png';
  registerForm: FormGroup;
  file: File;
  fileNameToUpdate: string;
  dataAtual: '';

  get lotes(): FormArray {
    return <FormArray>this.registerForm.get('lotes');
  }

  get redesSociais(): FormArray {
    return <FormArray>this.registerForm.get('redesSociais');
  }

  constructor(
    private eventoService: EventoService,
    // Removido para utilizar o ActivateRouter
    // private modalService: BsModalService,
    private router: ActivatedRoute,
    private fb: FormBuilder,
    private localeService: BsLocaleService,
    private toastr: ToastrService
  ) {
    this.localeService.use('pt-br');
  }

  ngOnInit() {
    this.validation();
    this.carregarEvento();
  }

  carregarEvento() {
    // O + na frente do this converte para numerico
    const idEvento = +this.router.snapshot.paramMap.get('id');
    this.eventoService.getEventoById(idEvento).subscribe(
      (evento: Evento) => {
      this.evento = Object.assign({}, evento);
      this.fileNameToUpdate = evento.imagemURL.toString();
      this.imagemURL = `http://localhost:5000/resources/images/${evento.imagemURL}?_ts=${dataAtual}`
      // O this nesse caso serve para limpar a cópia que foi feita do elemento e não o elemento em si
      this.evento.imagemURL = '';
      // carrega dados no form
      this.registerForm.patchValue(this.evento);
      }
    );
  }

  validation() {
    this.registerForm = this.fb.group({
      tema: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
      local: ['', Validators.required],
      dataEvento: ['', Validators.required],
      imagemURL: [''],
      qtdPessoas: ['', [Validators.required, Validators.max(120000)]],
      telefone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      lotes: this.fb.array([this.criaLote()]),
      redesSociais: this.fb.array([this.criarRedeSocial()])
    });
  }

  criaLote(): FormGroup {
    return this.fb.group({
      nome: ['', Validators.required],
      quantidade: ['', Validators.required],
      dataInicio: [''],
      dataFim: ['']});
  }

  criarRedeSocial(): FormGroup {
    return this.fb.group({
      nome: ['', Validators.required],
      url: ['', Validators.required]
      });
  }

  adicionarLote() {
    this.lotes.push(this.criaLote());
  }

  // Adiciona form para adicionar mais uma rede social
  adicionarRedeSocial() {
    this.redesSociais.push(this.criarRedeSocial());
  }

  // Remove quadro de rede social vazio
  removerRedeSocial(id: number) {
    this.redesSociais.removeAt(id);
  }

  removerLote(id: number) {
    this.lotes.removeAt(id);
  }

  onFileChange(file: FileList) {
    const reader = new FileReader();

    reader.onload = (event: any) => this.imagemURL = event.target.result;

    reader.readAsDataURL(file[0]);
  }

}
