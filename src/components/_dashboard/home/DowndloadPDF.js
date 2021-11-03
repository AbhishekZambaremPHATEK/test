import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import { Button } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { Page, Text, View, Document, StyleSheet, PDFDownloadLink, Link } from '@react-pdf/renderer';
import {
  Table,
  TableHeader,
  TableCell,
  TableBody,
  DataTableCell
} from '@david.kucsai/react-pdf-table';
// import ReactDOMServer from 'react-dom/server';
// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: '#ffffff'
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1
  },
  header: {
    padding: 10,
    fontStyle: 'Bold',
    backgroundColor: 'whitesmoke'
  },
  row: {
    padding: 10
  },
  title: {
    margin: 20,
    fontSize: 25,
    textAlign: 'center',
    backgroundColor: '#e4e4e4',
    textTransform: 'uppercase'
  }
});

DowndloadPDF.propTypes = {
  PredictionResult: PropTypes.array,
  PredictionFields: PropTypes.array
};

export default function DowndloadPDF({ PredictionFields, PredictionResult }) {
  // Create Document Component
  const MyDocument = () => (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.title}>Prediction</Text>
          <Table data={PredictionResult}>
            <TableHeader>
              {/* <TableCell>First Name</TableCell>
              <TableCell>Last Name</TableCell>
              <TableCell>DOB</TableCell>
              <TableCell>Country</TableCell>
              <TableCell>Phone Number</TableCell> */}
              {PredictionFields.length > 0 &&
                PredictionFields.map((Field, index) => (
                  <TableCell style={styles.header} key={index}>
                    {Field.label}
                  </TableCell>
                ))}
            </TableHeader>
            <TableBody>
              {PredictionFields.map((result, index) => (
                <DataTableCell style={styles.row} key={index} getContent={(r) => r[result.id]} />
              ))}
              {/* <DataTableCell getContent={(r) => r.firstName} />
              <DataTableCell getContent={(r) => r.lastName} />
              <DataTableCell getContent={(r) => r.dob.toLocaleString()} />
              <DataTableCell getContent={(r) => r.country} />
              <DataTableCell getContent={(r) => r.phoneNumber} /> */}
            </TableBody>
          </Table>
        </View>
        {/* <View style={styles.section}>
          <Text>Section #2</Text>
        </View> */}
      </Page>
    </Document>
  );

  return (
    <PDFDownloadLink
      document={<MyDocument />}
      fileName={`Predictions-${new Date()}`}
      style={{
        color: 'white',
        textDecoration: 'none'
        //   padding: '8px 22px'
      }}
    >
      <Button fullWidth size="large" variant="contained">
        Downdload PDF
      </Button>
    </PDFDownloadLink>

    // <LoadingButton
    //   fullWidth
    //   size="large"
    //   type="submit"
    //   variant="contained"
    //   loading={isSubmitting}
    //   onClick={generatePDF}
    // >
    //   Downdload PDF
    // </LoadingButton>
  );
}
