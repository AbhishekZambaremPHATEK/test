import { merge } from 'lodash';
import ReactApexChart from 'react-apexcharts';
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { toInteger } from 'lodash-es';
// material
import { Card, CardHeader, Box } from '@mui/material';
//
import { BaseOptionChart } from '../../charts';

// ----------------------------------------------------------------------

ChartPredictions.propTypes = {
  PredictionResult: PropTypes.array,
  Type: PropTypes.string,
  Disease: PropTypes.array,
  Location: PropTypes.array
};

export default function ChartPredictions({ Type, Location, Disease, PredictionResult }) {
  const [ChartData, setChartData] = useState([]);

  const [ChartLabels, setChartLabels] = useState([]);

  useEffect(() => {
    const arr1 = new Set();
    const arr2 = [];
    const temp = new Set();
    // let temp2 = '';
    let isTriggered = true;

    if (Type === 'Disease') {
      Disease.map((disease, index) => {
        // temp = new Set();
        PredictionResult.map((Result, index2) => {
          if (Result.Disease === disease) {
            // if (Array.from(temp).find((e) => e === Result.Location)) {
            if (Result.Month) arr1.add(`${Result.Month}/${Result.Year}`);
            else arr1.add(Result.Year);
            const obj = {
              name: disease,
              type: 'column',
              data:
                arr2[index]?.data?.length > 0
                  ? [...arr2[index].data, Result.Prediction]
                  : [Result.Prediction]
            };
            arr2[index] = { ...arr2[index], ...obj };
            // } else {
            //   temp.add(Result.Location);
            // }
          }
          isTriggered = false;
          return 0;
        });
        return 0;
      });

      // Disease.map((disease, index) => {
      //   PredictionResult.map((Result, index2) => {
      //     let save;
      //     if (
      //       Result.Disease === disease &&
      //       Array.from(arr1).find((e, index33) => {
      //         if (e === `${Result.Month}/${Result.Year}`) {
      //           save = index33;
      //           return true;
      //         }
      //         return false;
      //       })
      //     ) {
      //       // console.log(arr2[index]);
      //       // arr2[index].data[save] += toInteger(Result.Prediction);
      //       console.log('add', Result.Disease, disease, arr1, arr2);
      //     } else if (Result.Disease === disease) {
      //       console.log('my', Result.Disease, disease, arr1);
      //       const obj = {
      //         name: disease,
      //         type: 'column',
      //         data:
      //           arr2[index]?.data?.length > 0
      //             ? [...arr2[index].data, toInteger(Result.Prediction)]
      //             : [toInteger(Result.Prediction)]
      //       };
      //       arr2[index] = { ...arr2[index], ...obj };
      //     }
      //     if (Result.Month) arr1.add(`${Result.Month}/${Result.Year}`);
      //     else arr1.add(Result.Year);
      //     return 0;
      //   });
      //   return 0;
      // });
    } else if (Type === 'Location') {
      Location.map((location, index) => {
        PredictionResult.map((Result, index2) => {
          let save;
          if (
            Result.Location === location &&
            Array.from(arr1).find((e, index33) => {
              if (e === `${Result.Month}/${Result.Year}` || e === Result.Year) {
                save = index33;
                return true;
              }
              return false;
            })
          ) {
            arr2[index].data[save] += toInteger(Result.Prediction);
            console.log('add', Result.Location, location, arr1);
            // Disease.map((disease, index3) => {
            //   if (Result.Month) arr1.add(`${Result.Month}/${Result.Year}`);
            //   else arr1.add(Result.Year);
            //   if (isTriggered) {
            //     isTriggered = false;
            //     // console.log('test', location, Result.Prediction);
            //     const obj = {
            //       name: location,
            //       type: 'column',
            //       data:
            //         arr2[index]?.data?.length > 0
            //           ? [...arr2[index].data, toInteger(Result.Prediction)]
            //           : [toInteger(Result.Prediction)]
            //     };
            //     arr2[index] = { ...arr2[index], ...obj };
            //   } else if (
            //     disease === Result.Disease &&
            //     Array.from(arr1).find((e) => e === `${Result.Month}/${Result.Year}`)
            //   ) {
            //     // isTriggered = true;
            //     arr2[index].data[arr2[index].data.length - 1] += toInteger(Result.Prediction);
            //   } else if (
            //     disease !== Result.Disease &&
            //     Array.from(arr1).find((e) => e === `${Result.Month}/${Result.Year}`)
            //   ) {
            //     const obj = {
            //       name: location,
            //       type: 'column',
            //       data:
            //         arr2[index]?.data?.length > 0
            //           ? [...arr2[index].data, toInteger(Result.Prediction)]
            //           : [toInteger(Result.Prediction)]
            //     };
            //     arr2[index] = { ...arr2[index], ...obj };
            //     console.log('hii');
            //   }
            //   temp2 = Result.Disease;
            //   return 0;
            // });
          } else if (Result.Location === location) {
            console.log('my', Result.Location, location, arr1);
            const obj = {
              name: location,
              type: 'column',
              data:
                arr2[index]?.data?.length > 0
                  ? [...arr2[index].data, toInteger(Result.Prediction)]
                  : [toInteger(Result.Prediction)]
            };
            arr2[index] = { ...arr2[index], ...obj };
          }
          if (Result.Month) arr1.add(`${Result.Month}/${Result.Year}`);
          else arr1.add(Result.Year);
          return 0;
        });
        return 0;
      });
    }
    // Data.map((disease, index) => {
    //   // temp = new Set();
    //   PredictionResult.map((Result, index2) => {
    //     if (Type === 'Disease' && Result.Disease === disease) {
    //       // if (Array.from(temp).find((e) => e === Result.Location)) {
    //       if (Result.Month) arr1.add(`${Result.Month}/${Result.Year}`);
    //       else arr1.add(Result.Year);
    //       const obj = {
    //         name: disease,
    //         type: 'column',
    //         data:
    //           arr2[index]?.data?.length > 0
    //             ? [...arr2[index].data, Result.Prediction]
    //             : [Result.Prediction]
    //       };
    //       arr2[index] = { ...arr2[index], ...obj };
    //       // } else {
    //       //   temp.add(Result.Location);
    //       // }
    //     } else if (Type === 'Location' && Result.Location === disease) {
    //       if (isTriggered || Array.from(temp).find((e) => e === Result.Disease)) {
    //         console.log('Result.Disease 2: ', temp, Result.Disease);
    //         if (Result.Month) arr1.add(`${Result.Month}/${Result.Year}`);
    //         else arr1.add(Result.Year);
    //         const obj = {
    //           name: disease,
    //           type: 'column',
    //           data:
    //             arr2[index]?.data?.length > 0
    //               ? [...arr2[index].data, Result.Prediction]
    //               : [Result.Prediction]
    //         };
    //         arr2[index] = { ...arr2[index], ...obj };
    //       } else {
    //         console.log('Result.Disease : ', Result.Disease);
    //       }
    //       // temp2 = Result.Disease;
    //       temp.add(Result.Disease);
    //     }
    //     isTriggered = false;
    //     return 0;
    //   });
    //   return 0;
    // });
    setChartData(arr2);
    setChartLabels([...arr1]);
    console.log('PredictionResult : ', PredictionResult);
    console.log('result : ', [...arr1], arr2);
  }, [PredictionResult]);

  const chartOptions = merge(BaseOptionChart(), {
    // stroke: { width: [3, 3, 3] },
    // plotOptions: { bar: { columnWidth: '50%', borderRadius: 4 } },
    // fill: { type: ['solid', 'gradient', 'solid'] },
    labels: ChartLabels,
    // xaxis: { type: 'datetime' },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (y) => {
          if (typeof y !== 'undefined') {
            return `${y.toFixed(0)} cases`;
          }
          return y;
        }
      }
    },
    chart: {
      toolbar: {
        show: true,
        offsetX: 0,
        offsetY: -55,
        tools: {
          download: true,
          selection: true,
          zoom: true,
          zoomin: true,
          zoomout: true,
          pan: true,
          reset: true,
          customIcons: []
        },
        export: {
          csv: {
            filename: `Predictions_BarChart-${new Date()}.csv`,
            columnDelimiter: ',',
            headerCategory: 'Year',
            headerValue: 'value',
            dateFormatter(timestamp) {
              return new Date(timestamp).toDateString();
            }
          },
          svg: {
            filename: `Predictions_BarChart-${new Date()}.csv`
          },
          png: {
            filename: `Predictions_BarChart-${new Date()}.csv`
          }
        },
        autoSelected: 'zoom'
      }
    }
  });

  return (
    <Card>
      <CardHeader title="Predictions" subheader="" />
      <Box sx={{ p: 3, pb: 1 }} dir="ltr">
        {ChartData.length > 0 && (
          <ReactApexChart type="line" series={ChartData} options={chartOptions} height={364} />
        )}
      </Box>
    </Card>
  );
}
