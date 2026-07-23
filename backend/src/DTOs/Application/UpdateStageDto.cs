namespace RecruitmentPlatform.API.DTOs.Application
{
    public class UpdateStageDto
    {
        public string NewStage { get; set; } = string.Empty;
        public string? Date { get; set; }
        public string? Time { get; set; }
        public string? Notes { get; set; }
    }
}
