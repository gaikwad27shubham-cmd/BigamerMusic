using System;
using System.Data;
using System.Threading.Tasks;
using BigamerMusic.Models;
using Dapper;
using Microsoft.Data.SqlClient;

namespace BigamerMusic.Services
{
    public class DapperActionRepository : IActionRepository
    {
        private readonly string _connectionString;
        public DapperActionRepository(string connectionString)
        {
            _connectionString = connectionString;
        }
        public async Task<ActionModal> ExecuteProcedureAsync(ActionModal modal)
        {
            using var connection = new SqlConnection(_connectionString);
            var parms = new DynamicParameters();

            // Input parameters
            parms.Add("@JsonString", modal.formXml);
            parms.Add("@PrimaryID", modal.PrimaryId);
            parms.Add("@UserId", modal.UserID);
            parms.Add("@RoleId", modal.RoleID);

            // Output parameters
            parms.Add("@MessageID", dbType: DbType.String, direction: ParameterDirection.Output, size: 10);
            parms.Add("@Message", dbType: DbType.String, direction: ParameterDirection.Output, size: 500);

            try
            {
                await connection.ExecuteAsync(
                    modal.ProcName,
                    parms,
                    commandType: CommandType.StoredProcedure,
                    commandTimeout: 300
                );
            }
            catch (Exception ex)
            {
                // Log or handle exception
                Console.WriteLine(ex.Message);
            }

            // Retrieve output parameters
            string messageId = parms.Get<string>("@MessageID");
            string message = parms.Get<string>("@Message");

            return new ActionModal
            {
                MessageStatusId = Convert.ToInt32(messageId),
                MessageText = message
            };
        }
    }
}
