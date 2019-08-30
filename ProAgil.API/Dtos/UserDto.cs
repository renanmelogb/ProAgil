using System.Collections.Generic;
using ProAgil.Domain.Identity;

namespace ProAgil.API.Dtos
{
    public class UserDto
    {
        public string UserName { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string FullName { get; set; }

        public string role { get; set; }
    }
}
