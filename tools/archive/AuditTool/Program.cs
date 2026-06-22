using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using ezTravel.Libs;

namespace AuditTool
{
    class Program
    {
        static void Main(string[] args)
        {
            var connectionString = "Data Source=neyuhtlap\\sqlexpress;Initial Catalog=EZTravel;Integrated Security=True;Encrypt=True;TrustServerCertificate=True";
            var optionsBuilder = new DbContextOptionsBuilder<AppDbContext>();
            optionsBuilder.UseSqlServer(connectionString);

            var dbContext = new AppDbContext(optionsBuilder.Options);
            var model = dbContext.Model;

            var dbTables = new Dictionary<string, HashSet<string>>(StringComparer.OrdinalIgnoreCase);

            using (var conn = new SqlConnection(connectionString))
            {
                conn.Open();
                var cmd = new SqlCommand("SELECT TABLE_NAME, COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS", conn);
                using (var reader = cmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        var tName = reader.GetString(0);
                        var cName = reader.GetString(1);
                        if (!dbTables.ContainsKey(tName))
                        {
                            dbTables[tName] = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
                        }
                        dbTables[tName].Add(cName);
                    }
                }
            }

            var mismatchReport = new List<string>();
            mismatchReport.Add("# Entity Mismatch Report (Phase 2)");
            mismatchReport.Add("");

            var contextAudit = new List<string>();
            contextAudit.Add("# DbContext Audit (Phase 3)");
            contextAudit.Add("");

            foreach (var entityType in model.GetEntityTypes())
            {
                var tableName = entityType.GetTableName();
                var entityName = entityType.Name;
                
                bool tableExists = tableName != null && dbTables.ContainsKey(tableName);
                
                contextAudit.Add($"## Entity: {entityName}");
                contextAudit.Add($"- **Mapped Table**: {tableName ?? "NULL"}");
                
                if (!tableExists)
                {
                    contextAudit.Add($"- **Status**: INVALID (Table does not exist)");
                    mismatchReport.Add($"## Entity: {entityName}");
                    mismatchReport.Add($"**Status**: INVALID");
                    mismatchReport.Add($"- Mapped table `{tableName}` does not exist in the database.");
                    mismatchReport.Add("");
                }
                else
                {
                    contextAudit.Add($"- **Status**: ACTIVE/LEGACY (Table exists)");
                    
                    var tableCols = dbTables[tableName];
                    var mismatches = new List<string>();
                    
                    foreach (var prop in entityType.GetProperties())
                    {
                        var colName = prop.GetColumnName(Microsoft.EntityFrameworkCore.Metadata.StoreObjectIdentifier.Table(tableName, null));
                        if (!tableCols.Contains(colName))
                        {
                            mismatches.Add($"- Property `{prop.Name}` mapped to column `{colName}` which DOES NOT EXIST.");
                        }
                    }
                    
                    if (mismatches.Any())
                    {
                        mismatchReport.Add($"## Entity: {entityName}");
                        foreach(var m in mismatches) mismatchReport.Add(m);
                        mismatchReport.Add("");
                    }
                }
                contextAudit.Add("");
            }

            File.WriteAllLines(@"C:\Users\ADMIN\.gemini\antigravity\brain\796c0c5c-8b1a-4c4d-9302-1eaee4c41f29\EntityMismatchReport.md", mismatchReport);
            File.WriteAllLines(@"C:\Users\ADMIN\.gemini\antigravity\brain\796c0c5c-8b1a-4c4d-9302-1eaee4c41f29\DbContextAudit.md", contextAudit);
            
            Console.WriteLine("Reports generated.");
        }
    }
}
