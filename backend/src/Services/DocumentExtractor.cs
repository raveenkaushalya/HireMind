using System;
using System.IO;
using System.Text;
using UglyToad.PdfPig;
using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Wordprocessing;

namespace RecruitmentPlatform.API.Services
{
    public class DocumentExtractor
    {
        // Extracts raw text safely from a PDF file
        public string ExtractTextFromPdf(Stream fileStream)
        {
            var textBuilder = new StringBuilder();

            using (PdfDocument pdf = PdfDocument.Open(fileStream))
            {
                foreach (var page in pdf.GetPages())
                {
                    // If a page has text, append it safely
                    string? pageText = page.Text;
                    if (!string.IsNullOrEmpty(pageText))
                    {
                        textBuilder.AppendLine(pageText);
                    }
                }
            }

            return textBuilder.ToString();
        }

        // Extracts raw text safely from a Word document (.docx)
        public string ExtractTextFromDocx(Stream fileStream)
        {
            var textBuilder = new StringBuilder();

            using (WordprocessingDocument wordDoc = WordprocessingDocument.Open(fileStream, false))
            {
                // Fix: Check if MainDocumentPart and Document are not null before dereferencing
                var body = wordDoc.MainDocumentPart?.Document?.Body;
                if (body != null)
                {
                    foreach (var paragraph in body.Descendants<Paragraph>())
                    {
                        string? innerText = paragraph.InnerText;
                        if (!string.IsNullOrWhiteSpace(innerText))
                        {
                            textBuilder.AppendLine(innerText);
                        }
                    }
                }
            }

            return textBuilder.ToString();
        }
    }
}
