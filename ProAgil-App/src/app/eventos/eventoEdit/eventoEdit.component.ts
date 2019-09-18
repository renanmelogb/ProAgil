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
  dataAtual: string;

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
      this.imagemURL = `http://localhost:5000/resources/images/${this.evento.imagemURL}?_ts=${this.dataAtual}`;
      // O this nesse caso serve para limpar a cópia que foi feita do elemento e não o elemento em si
      this.evento.imagemURL = '';
      // carrega dados no form
      this.registerForm.patchValue(this.evento);

      this.evento.lotes.forEach(lote => {
        this.lotes.push(this.criaLote(lote));
      });
      this.evento.redesSociais.forEach(redeSocial => {
        this.redesSociais.push(this.criarRedeSocial(redeSocial));
      });
      }
    );
  }

  validation() {
    this.registerForm = this.fb.group({
      id: [],
      tema: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
      local: ['', Validators.required],
      dataEvento: ['', Validators.required],
      imagemURL: [''],
      qtdPessoas: ['', [Validators.required, Validators.max(120000)]],
      telefone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      lotes: this.fb.array([]),
      redesSociais: this.fb.array([])
    });
  }

  criaLote(lote: any): FormGroup {
    return this.fb.group({
      id: [lote.id],
      nome: [lote.nome, Validators.required],
      quantidade: [lote.quantidade, Validators.required],
      dataInicio: [lote.dataInicio],
      dataFim: [lote.dataFim]});
  }

  criarRedeSocial(redeSocial: any): FormGroup {
    return this.fb.group({
      id: [redeSocial.id],
      nome: [redeSocial.nome, Validators.required],
      url: [redeSocial.url, Validators.required]
      });
  }

  adicionarLote() {
    this.lotes.push(this.criaLote({ id: 0 }));
  }

  // Adiciona form para adicionar mais uma rede social
  adicionarRedeSocial() {
    this.redesSociais.push(this.criarRedeSocial({ id: 0 }));
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

    this.file = event.target.files;
    reader.readAsDataURL(file[0]);
  }

  salvarEvento() {
    this.evento = Object.assign({id: this.evento.id}, this.registerForm.value);
    this.evento.imagemURL = this.fileNameToUpdate;
    this.uploadImagem();

    this.eventoService.putEvento(this.evento).subscribe(
       (novoEvento: Evento) => {
        this.toastr.success('Editado com sucesso!');
      }, error => {
        this.toastr.error(`Erro ao Editar: ${error}`);
        console.log(error);
      }
    );
  }

  uploadImagem() {
      // Valida se alterou a imagem para fazer upload
      if (this.registerForm.get('imagemURL').value !== '') {
        this.eventoService.postUpload(this.file, this.fileNameToUpdate)
        .subscribe(
          () => {
            this.dataAtual = new Date().getMilliseconds().toString();
            this.imagemURL = `http://localhost:5000/resources/images/${this.evento.imagemURL}?_ts=${this.dataAtual}`;
          }
        );
      }
  }
}
