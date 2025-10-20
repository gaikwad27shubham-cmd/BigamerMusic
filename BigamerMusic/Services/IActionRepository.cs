using BigamerMusic.Models;
using Microsoft.AspNetCore.Mvc.ApplicationModels;
using System.Threading.Tasks;
namespace BigamerMusic.Services
{
    public interface IActionRepository
    {
        Task<ActionModal> ExecuteProcedureAsync(ActionModal modal);
    }
}
