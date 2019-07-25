using ProAgil.API.Dtos;
using ProAgil.Domain;
using AutoMapper;
using System.Linq;

namespace ProAgil.API.Helpers
{
    public class AutoMapperProfiles : Profile
    {
        public AutoMapperProfiles()
        {
            CreateMap<Evento, EventoDto>()
                .ForMember(dest => dest.Palestrante, opt => {
                    opt.MapFrom(src => src.PalestranteEventos.Select(x => x.Palestrante).ToList());
                }); 

            CreateMap<Palestrante, PalestranteDto>()
                .ForMember(dest => dest.Eventos, opt => {
                    opt.MapFrom(src => src.PalestranteEventos.Select(x => x.Evento).ToList());
                });      

            CreateMap<Lote, LoteDto>();
            CreateMap<RedeSocial, RedeSocialDto>();
        }
    }
}