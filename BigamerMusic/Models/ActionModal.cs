namespace BigamerMusic.Models
{
    public class ActionModal
    {
        // Input Parameters
        public string ProcName { get; set; }            // Stored procedure name
        public string formXml { get; set; }             // JSON or XML input
        public int PrimaryId { get; set; }              // Input Primary ID
        public int UserID { get; set; }                 // User identifier
        public int RoleID { get; set; }                 // Role identifier

        // Output Parameters
        public int MessageStatusId { get; set; }        // Output Message ID (parsed from @MessageID)
        public string MessageText { get; set; }
    }
}
