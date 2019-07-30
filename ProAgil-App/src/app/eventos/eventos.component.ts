import { Component, OnInit, TemplateRef } from '@angular/core';
import { EventoService } from '../_services/evento.service';
import { Evento } from '../_models/Evento';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { defineLocale, BsLocaleService, ptBrLocale } from 'ngx-bootstrap';
import { templateJitUrl } from '@angular/compiler';
import { ToastrService } from 'ngx-toastr';

defineLocale('pt-br', ptBrLocale);

// import { HttpClient } from 'selenium-webdriver/http';
// import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.css']
})
export class EventosComponent implements OnInit {

  titulo = 'Eventos';
  dataEvento: string;
  eventosFiltrados: Evento[] = [];
  eventos: Evento[] = [];
  evento: Evento;
  imagemLargura = 50;
  mostrarImagem = false;
  modoSalvar = 'post';
  bodyDeletarEvento = '';
  // Removido por não utilizar mais na abertura do Modal
  // modalRef: BsModalRef;
  registerForm: FormGroup;
  // tslint:disable-next-line:variable-name
  _filtroLista = '';

  file: File;

  constructor(
    private eventoService: EventoService,
    private modalService: BsModalService,
    private fb: FormBuilder,
    private localeService: BsLocaleService,
    private toastr: ToastrService
  ) {
    this.localeService.use('pt-br');
  }

  get filtroLista(): string {
    return this._filtroLista;
  }
  set filtroLista(value: string) {
    this._filtroLista = value;
    this.eventosFiltrados = this.filtroLista ? this.filtrarEventos(this.filtroLista) : this.eventos;
  }

  editarEvento(evento: Evento, template: any) {
    this.modoSalvar = 'put';
    this.openModal(template);
    this.evento = Object.assign({}, evento);
    this.evento = evento;
    evento.imagemURL = '';
    // carrega dados no form
    this.registerForm.patchValue(evento);
  }

  novoEvento(template: any) {
    this.modoSalvar = 'post';
    this.openModal(template);
  }

  excluirEvento(evento: Evento, template: any) {
    this.openModal(template);
    this.evento = evento;
    this.bodyDeletarEvento = `Tem certeza que deseja excluir o Evento: ${evento.tema}, Código: ${evento.tema}`;
  }

  confirmeDelete(template: any) {
    this.eventoService.deleteEvento(this.evento.id).subscribe(
      () => {
          template.hide();
          this.getEventos();
          this.toastr.success('Deletado com sucesso!');
        }, error => {
          this.toastr.error('Erro ao tentar deletar!');
          console.log(error);
        }
    );
  }

  openModal(template: any) {
      this.registerForm.reset();
      template.show();
  }

  ngOnInit() {
    this.validation();
    this.getEventos();
  }

  alternarImagem() {
    this.mostrarImagem = !this.mostrarImagem;
  }

  filtrarEventos(filtrarPor: string): Evento[] {
    filtrarPor = filtrarPor.toLocaleLowerCase();
    return this.eventos.filter(
      evento => evento.tema.toLocaleLowerCase().indexOf(filtrarPor) !== -1
    );
  }

  validation() {
    this.registerForm = this.fb.group({
      tema: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
      local: ['', Validators.required],
      dataEvento: ['', Validators.required],
      imagemURL: ['', Validators.required],
      qtdPessoas: ['', [Validators.required, Validators.max(120000)]],
      telefone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  }

    onFileChange(event) {
      const reader = new FileReader();

      if (event.target.files && event.target.files.length) {
        this.file = event.target.files;
      }
    }

    salvarAlteracao(template: any) {
      if(this.registerForm.valid) {
        if (this.modoSalvar === 'post') {
          this.evento = Object.assign({}, this.registerForm.value);
          this.eventoService.postEvento(this.evento).subscribe(
             (novoEvento: Evento) => {
              console.log(novoEvento);
              template.hide();
              this.getEventos();
              this.toastr.success('Inserido com sucesso!');
            }, error => {
              this.toastr.error(`Erro ao Inserir: ${error}`);
              console.log(error);
            }
          );
        }
        else {
          this.evento = Object.assign({id: this.evento.id}, this.registerForm.value);
          this.eventoService.putEvento(this.evento).subscribe(
             (novoEvento: Evento) => {
              console.log(novoEvento);
              template.hide();
              this.getEventos();
              this.toastr.success('Editado com sucesso!');
            }, error => {
              this.toastr.error(`Erro ao Editar: ${error}`);
              console.log(error);
            }
          );
        }

      }
  }

  getEventos() {
    this.eventoService.getAllEvento().subscribe(
    // tslint:disable-next-line:variable-name
    (_eventos: Evento[]) => {
      this.eventos = _eventos;
      this.eventosFiltrados = this.eventos;
      console.log(this.eventos);
    }, error => {
      this.toastr.error(`Erro ao carregar eventos: ${error}`);
    });
    }

  }

