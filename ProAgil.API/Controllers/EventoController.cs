using System.Collections.Generic;
using System.IO;
using System.Net.Mime;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Net.Http.Headers;
using ProAgil.API.Dtos;
using ProAgil.Domain;
using ProAgil.Repository;

namespace ProAgil.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EventoController : ControllerBase
    {
        private readonly IProAgilRepository _repo;
        private readonly IMapper _mapper;

        public EventoController(IProAgilRepository repo, IMapper mapper)
        {
            _repo = repo;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            try
            {
                var eventos =  await _repo.GetAllEventoAsync(true);

                var results = _mapper.Map<IEnumerable<EventoDto>>(eventos);

                return Ok(results);
            }
            catch (System.Exception ex)
            {
                
                return this.StatusCode(StatusCodes.Status500InternalServerError, $"Banco de Dados Falhou {ex.Message}");
            }       
        }

                [HttpPost("upload")]
        public async Task<IActionResult> upload()
        {
            try
            {
                // Pega o arquivo
                var file = Request.Form.Files[0];
                // Diretório onde quero armazenar o arquivo
                var folderName = Path.Combine("Resources", "Images");
                // Comvinando diretório onde quero salvar o arquivo + diretório da aplicação
                var pathToSave = Path.Combine(Directory.GetCurrentDirectory(), folderName);

                if(file.Length > 0)
                {
                    // Pegando o nome do arquivo
                    var filename = ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName;
                    // Se vier aspas duplas ou espaço faz replace
                    var fullPath = Path.Combine(pathToSave, filename.ToString().Replace("\"", " ".Trim()));

                    // Criar arquivo
                    using(var stream = new FileStream(fullPath, FileMode.Create))
                    {
                        file.CopyTo(stream);
                    }
                }

                return Ok();
            }
            catch (System.Exception ex)
            {
                
                return this.StatusCode(StatusCodes.Status500InternalServerError, $"Banco de Dados Falhou {ex.Message}");
            }   

            return BadRequest("Erro ao tentar realizar upload");  
        }

        [HttpGet("{EventoId}")]
        public async Task<IActionResult> Get(int EventoId)
        {
            try
            {
                var evento =  await _repo.GetEventoAsyncById(EventoId, true);

                var results = _mapper.Map<EventoDto>(evento);

                return Ok(results);
            }
            catch (System.Exception)
            {
                
                return this.StatusCode(StatusCodes.Status500InternalServerError, "Banco de Dados Falhou");
            }       
        }

         [HttpGet("getByTema/{tema}")]
        public async Task<IActionResult> Get(string tema)
        {
            try
            {
                var results =  await _repo.GetAllEventoAsyncByTema(tema, true);

                return Ok(results);
            }
            catch (System.Exception)
            {
                
                return this.StatusCode(StatusCodes.Status500InternalServerError, "Banco de Dados Falhou");
            }       
        }

        [HttpPost]
        public async Task<IActionResult> Post(EventoDto model)
        {
            try
            {
                var evento = _mapper.Map<Evento>(model);

                _repo.Add(evento);

                if(await _repo.SaveChangesAsync())
                {
                    //Se for inserido com sucesso chama a API get para retornar o resultado.
                    return Created($"api/evento/{model.Id}", _mapper.Map<EventoDto>(evento));
                }
                
            }
            catch (System.Exception ex)
            {
                
                return this.StatusCode(StatusCodes.Status500InternalServerError, $"Banco de Dados Falhou {ex.Message}");
            }       

            return BadRequest();
        }

        [HttpPut("{EventoId}")]
        public async Task<IActionResult> Put(int EventoId, EventoDto model)
        {
            try
            {
                //Verifica se o registro existe, o false pois não preciso dos palestrantes
                var evento = await _repo.GetEventoAsyncById(EventoId, false);
                if(evento == null) return NotFound();

                _mapper.Map(model, evento);

                _repo.Update(evento);

                if(await _repo.SaveChangesAsync())
                {
                    //Se for inserido com sucesso chama a API get para retornar o resultado.
                    return Created($"api/evento/{model.Id}", _mapper.Map<EventoDto>(evento));
                }
                
            }
            catch (System.Exception ex)
            {
                
                return this.StatusCode(StatusCodes.Status500InternalServerError, $"Banco de Dados Falhou {ex.Message}");
            }       

            return BadRequest();
        }

        [HttpDelete("{EventoId}")]
        public async Task<IActionResult> Delete(int EventoId)
        {
            try
            {
                //Verifica se o registro existe, o false pois não preciso dos palestrantes
                var evento = await _repo.GetEventoAsyncById(EventoId, false);

                if(evento == null) return NotFound();

                //Se encontrar, deleta o registro.
                _repo.Delete(evento);

                if(await _repo.SaveChangesAsync())
                {
                    return Ok();
                }
                
            }
            catch (System.Exception)
            {
                
                return this.StatusCode(StatusCodes.Status500InternalServerError, "Banco de Dados Falhou");
            }       

            return BadRequest();
        }


    }
}