import { BookingRepositoryService } from '../repository/Booking.repository.service';
import { VehicleRepositoryService } from '../repository/Vehicle.repository.service';
import { UserRepositoryService } from '../repository/User.repository.service';
import { Request, Response } from 'express';
import { BookingInterface, BookingStatus } from '../interfaces/Booking.interface';
import * as pdfMakeT from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

// Assign fonts to pdfMake
const pdfMake = pdfMakeT as any;
pdfMake.vfs = pdfFonts.pdfMake.vfs;

export class BookingControllerService {
  private bookingRepository: BookingRepositoryService;
  private vehicleRepository: VehicleRepositoryService;
  private userRepository: UserRepositoryService;

  constructor() {
    this.bookingRepository = new BookingRepositoryService();
    this.vehicleRepository = new VehicleRepositoryService();
    this.userRepository = new UserRepositoryService();
  }

  // ... existing functions ...

  async generateAllBookingsReport(req: Request, res: Response): Promise<void> {
    try {
      const bookings: BookingInterface[] = await this.bookingRepository.getAllBookings();

      const documentDefinition: pdfMakeT.TDocumentDefinitions = {
        content: [
          { text: 'All Bookings Report', style: 'header' },
          { text: '\n' }, // Add some space
        ],
        styles: {
          header: {
            fontSize: 18,
            bold: true,
            margin: [0, 0, 0, 10]
          },
          tableHeader: {
            bold: true,
            fontSize: 12,
            color: 'black'
          }
        },
        defaultStyle: {
          fontSize: 10,
        }
      };

      // Add booking data to the document definition
      if (bookings && bookings.length > 0) {
        const tableBody = [
          [
            { text: 'Booking ID', style: 'tableHeader' },
            { text: 'User Name', style: 'tableHeader' },
            { text: 'Vehicle Model', style: 'tableHeader' },
            { text: 'Start Date', style: 'tableHeader' },
            { text: 'End Date', style: 'tableHeader' },
            { text: 'Status', style: 'tableHeader' },
            { text: 'Total Cost', style: 'tableHeader' },
          ],
          ...bookings.map((booking: BookingInterface) => [
            booking.id?.toString() || '',
            booking.user?.name || 'N/A',
            booking.vehicle?.model || 'N/A',
            new Date(booking.startDate).toLocaleDateString(),
            new Date(booking.endDate).toLocaleDateString(),
            booking.status,
            `$${(booking.price || 0).toFixed(2)}`,
          ]),
        ];

        documentDefinition.content.push({
          table: {
            headerRows: 1,
            widths: ['auto', 'auto', '*', 'auto', 'auto', 'auto', 'auto'],
            body: tableBody
          }
        });
      } else {
        documentDefinition.content.push({ text: 'No bookings found.' });
      }

      const pdfDoc = pdfMake.createPdfKitDocument(documentDefinition);

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename="all_bookings_report.pdf"');

      pdfDoc.pipe(res);
      pdfDoc.end();

    } catch (error) {
      console.error("Error generating all bookings report:", error);
      res.status(500).send("Error generating report");
    }
  }
} 