import jsPDF from 'jspdf';

/**
 * Downloads each ticket as a separate PDF file
 * @param bookingId - The ID of the booking
 */
export async function downloadSeparateTickets(bookingId: string) {
  try {
    // Call the API to get separate ticket HTML
    const response = await fetch('/api/generate-separate-tickets-pdf', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ bookingId }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate separate tickets');
    }

    const data = await response.json();

    // Process each ticket HTML and convert to PDF
    for (const ticket of data.tickets) {
      // Create a temporary iframe to render the HTML
      const iframe = document.createElement('iframe');
      iframe.style.position = 'absolute';
      iframe.style.left = '-9999px';
      iframe.style.width = '800px';
      iframe.style.height = '600px';
      document.body.appendChild(iframe);

      // Wait for the iframe to load
      await new Promise(resolve => {
        iframe.onload = resolve;
        iframe.srcdoc = ticket.html;
      });

      // Get the content from the iframe
      const content = iframe.contentDocument?.body;

      if (content) {
        // Use html2canvas to capture the content as an image
        const html2canvas = (await import('html2canvas')).default;
        const canvas = await html2canvas(content, {
          scale: 1,
          useCORS: true,
          allowTaint: true,
          width: content.scrollWidth,
          height: content.scrollHeight,
          windowWidth: content.scrollWidth,
          windowHeight: content.scrollHeight,
        });

        // Create a PDF from the canvas with exact ticket dimensions
        const pdf = new jsPDF({
          orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
          unit: 'px',
          format: [canvas.width, canvas.height],
        });

        // Add the image to the PDF to fill the entire page
        pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, canvas.width, canvas.height);

        // Save the PDF
        pdf.save(ticket.filename.replace('.html', '.pdf'));
      }

      // Clean up the iframe
      document.body.removeChild(iframe);
    }

    return true;
  } catch (error) {
    console.error('Error downloading separate tickets:', error);
    throw error;
  }
}
