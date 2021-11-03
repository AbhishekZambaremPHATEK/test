import { merge } from 'lodash';
import { toInteger } from 'lodash-es';
import ReactApexChart from 'react-apexcharts';
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
// material
import { useTheme, styled } from '@mui/material/styles';
import { Card, CardHeader } from '@mui/material';
// utils
import { fNumber } from '../../../utils/formatNumber';
//
import { BaseOptionChart } from '../../charts';

// ----------------------------------------------------------------------

const CHART_HEIGHT = 372;
const LEGEND_HEIGHT = 72;

const ChartWrapperStyle = styled('div')(({ theme }) => ({
  height: CHART_HEIGHT,
  marginTop: theme.spacing(5),
  '& .apexcharts-canvas svg': { height: CHART_HEIGHT },
  '& .apexcharts-canvas svg,.apexcharts-canvas foreignObject': {
    overflow: 'visible'
  },
  '& .apexcharts-legend': {
    height: LEGEND_HEIGHT,
    alignContent: 'center',
    position: 'relative !important',
    borderTop: `solid 1px ${theme.palette.divider}`,
    top: `calc(${CHART_HEIGHT - LEGEND_HEIGHT}px) !important`
  }
}));

// ----------------------------------------------------------------------

ChartCases.propTypes = {
  PredictionResult: PropTypes.array,
  Type: PropTypes.string,
  Data: PropTypes.array
};

export default function ChartCases({ Type, Data, PredictionResult }) {
  const theme = useTheme();

  const [Disease, setDisease] = useState([]);
  const [Prediction, setPrediction] = useState([]);

  useEffect(() => {
    const arr1 = Data;
    const arr2 = new Array(arr1.length).fill(0);
    PredictionResult.map((Result) => {
      arr1.map((disease, index) => {
        if (Type === 'Disease' ? Result.Disease === disease : disease === Result.Location)
          arr2[index] += toInteger(Result.Prediction);
        return 0;
      });
      // arr2.push(Result.Prediction);
      return 0;
    });
    setDisease(arr1);
    setPrediction(arr2);
    // console.log('result : ', PredictionResult);
    // console.log(arr1, arr2);
  }, [PredictionResult]);

  const chartOptions = merge(BaseOptionChart(), {
    // colors: [
    //   theme.palette.primary.main,
    //   theme.palette.info.main,
    //   theme.palette.warning.main,
    //   theme.palette.error.main
    // ],
    labels: Disease,
    stroke: { colors: [theme.palette.background.paper] },
    legend: { floating: true, horizontalAlign: 'center' },
    dataLabels: { enabled: true, dropShadow: { enabled: false } },
    tooltip: {
      fillSeriesColor: false,
      y: {
        formatter: (seriesName) => fNumber(seriesName),
        title: {
          formatter: (seriesName) => `#${seriesName}`
        }
      }
    },
    plotOptions: {
      pie: { donut: { labels: { show: false } } }
    }
  });

  return (
    <Card>
      <CardHeader title={Type === 'Disease' ? 'Cases By Disease' : 'Cases By Location'} />
      <ChartWrapperStyle dir="ltr">
        {Prediction.filter((zero) => zero !== 0).length > 0 && (
          <ReactApexChart type="pie" series={Prediction} options={chartOptions} height={280} />
        )}
      </ChartWrapperStyle>
    </Card>
  );
}
