import { Buyer } from "./buyer.model"
import {Vehicle} from "../vehicals";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;
const uniqid = require('uniqid');

export const createBuyer= async (req, res) => {
  try {
    const data = req.body;
    data.orderId = uniqid();
    const create = await  Buyer.create(data);
    if(Object.keys(create).length){
      const result = await Vehicle.findByIdAndUpdate(data.vehicleId,{status: "sold"});
      res.status(200).send({done: true, data: create })
    }else {
      res.status(200).send({done: false, data: create })
    }
  } catch (err) {
    console.log(err)
    res.status(422).send({done: false, message: err.message, error: "Error in create users!"})
  }
}
export const findBuyer= async (req, res) => {
  try {
    const id = req.params.id;
    const create = await  Buyer.find({vehicleId:id});
    res.status(200).send({done: true, data: create })
  } catch (err) {
    console.log(err)
    res.status(422).send({done: false, message: err.message, error: "Error in create users!"})
  }
}

export const generatePdf = async (req, res) => {
  try {

    const data = req.body;
    const bookingDetail = data && data.bookingDetails || {};
    const documentDefinition = {
      content: [

        {text: 'INVOICE', style: 'title'},
        {text: `\nORDER ID: ${data.orderId}`, style: 'subheader'},

        {
          style: 'tableExample',margin:[40,15],
          table: {
            headerRows: 1,
            body: [
              [{text: 'DATE', style: 'tableHeader',margin:[0,6,0,0]}, {text: 'LOCATION', style: 'tableHeader',margin:[200,6,0,0]}],
              [{text: `From : ${bookingDetail.pickUpDate}`,margin:[0,5,0,0], style: ''}, {text: `Pick-Up  : ${bookingDetail.city}`,margin:[200,5,0,0]}],
              [{text: `To : ${bookingDetail.returnDate}`,margin:[0,5,0,0], style: ''}, {text: `Drop-off  : ${bookingDetail.dropLocation}`,margin:[200,5,0,0]}],
              [{text: `Days : ${bookingDetail.day}`, style: '',margin:[0,5,0,0]}, {text: '',margin:[200,0,0,0]}],

            ]
          },
          layout: 'noBorders'
        },
        {
          style: 'tableExample',margin:[40,10],
          table: {
            headerRows: 1,
            body: [
              [{text: 'CAR', style: 'tableHeader'}, {text: 'ADD-ONS', style: 'tableHeader',margin:[232,0,0]}],
              [{text: `${data.model} ${data.company}`, style: ''}, {text: ` GPS : RS ${bookingDetail.gpsSum}`, style: '',margin:[232,5,0,0]}],
              [{text: '', style: ''}, {text: `Insurance : Rs ${bookingDetail.insuranceSum}`, style: '',margin:[232,5,0,0]}],

            ]
          },
          layout: 'noBorders'
        },
        {
          style: 'tableExample',margin:[40,10],
          table: {
            headerRows: 1,
            body: [
              [{text: 'TAXES & FEES', style: 'tableHeader'}, {text: 'TOTAL', style: 'tableHeader',margin:[212,0,0,0]}],
              [{text: 'Sales Tax (1%)', style: ''}, {text: `Payment : Rs ${bookingDetail.total}`, style: '',margin:[212,0,0,0]}],

            ]
          },
          layout: 'noBorders'
        },

        {
          style: 'tableExample',margin:[40,20],
          table: {
            headerRows: 1,
            body: [
              [{text: 'BILLING INFORMATION', style: 'tableHeader'}],
              [{text: `Name : ${data.firstName} ${data.lastName}` , style: ''}],
              [{text: `Email  : ${data.email}` , style: ''}],
              [{text: `Driver’s License ID : ${data.drivingLicenceNumber}`, style: ''}],
              [{text: `Phone  : ${data.mobile}`, style: ''}],
              [{text: `Address  : ${data.address}`, style: ''}],
              [{text: `Country  : ${data.country}`, style: ''}],
              [{text: `State  : ${data.state}`, style: ''}],
              [{text: `City   : ${data.city}`, style: ''}],
            ]
          },
          layout: 'noBorders'
        },
        {text: '\n\n\nSignature: __________________________',margin:[290,0,0,0]},
      ],
      styles: {
        canvas: {
          display:'block'
        },
        title:{
          alignment:'center',
          bold: true,
          fontSize: 16
        },
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 0, 0, 10]
        },
        subheader: {
          fontSize: 14,
          alignment:'center',
          margin: [0, 10, 0, 5]
        },
        tableExample: {
          margin: [0, 5, 0, 15]
        },
        tableHeader: {
          bold: true,
          fontSize: 13,
          color: 'black'
        }
      },
      defaultStyle: {
        border:'black'
      }
    }
    const pdfDoc = pdfMake.createPdf(documentDefinition);
    pdfDoc.getBase64((data) => {
      res.writeHead(200);
      const download = Buffer.from(data.toString('utf-8'), 'base64');
      res.end(download);
    });
  } catch (err) {
    console.log(err);
    res.status(422).send({done: false, message: err.message, error: "Error in create category!"})
  }
};

