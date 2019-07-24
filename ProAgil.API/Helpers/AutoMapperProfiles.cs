using ProAgil.API.Dtos;
using ProAgil.Domain;
using AutoMapper;

namespace ProAgil.API.Helpers
{
    public class AutoMapperProfiles : Profile
    {
        public AutoMapperProfiles()
        {
            CreateMap<Evento, EventoDto>();
            CreateMap<Lote, LoteDto>();
            CreateMap<Palestrante, PalestranteDto>();
            CreateMap<RedeSocial, RedeSocialDto>();
        }
    }
}