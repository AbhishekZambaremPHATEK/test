import { filter, cloneDeep } from 'lodash';
// import { Icon } from '@iconify/react';
import { sentenceCase } from 'change-case';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import plusFill from '@iconify/icons-eva/plus-fill';
// import { Link as RouterLink } from 'react-router-dom';
// material
import {
  Card,
  Table,
  Stack,
  Avatar,
  Button,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
  TextField,
  Grid,
  FormGroup,
  FormControlLabel,
  Switch,
  ToggleButton,
  styled,
  ToggleButtonGroup,
  FormLabel,
  RadioGroup,
  Radio,
  CardContent,
  Box,
  CardActions,
  Collapse,
  Alert,
  AlertTitle,
  IconButton
} from '@mui/material';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';
import { DatePicker, LocalizationProvider, LoadingButton } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';

// components
import Page from '../../components/Page';
import Label from '../../components/Label';
import Scrollbar from '../../components/Scrollbar';
import SearchNotFound from '../../components/SearchNotFound';
import { UserListHead, UserListToolbar, UserMoreMenu } from '../../components/_dashboard/user';
//
import USERLIST from '../../_mocks_/user';
import { ChartCases, ChartPredictions, DowndloadPDF } from '../../components/_dashboard/home';

import { getDiseaseLocation, getPrediction, clearhome } from './homeSlice';
// ----------------------------------------------------------------------

export default function Home() {
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const dispatch = useDispatch();
  const homeStore = useSelector((state) => state.home);

  const [FromMonth, setFromMonth] = useState('None');
  const [ToMonth, setToMonth] = useState('None');
  const [FromYear, setFromYear] = useState(null);
  const [ToYear, setToYear] = useState(null);
  const [isUnorderedDates, setisUnorderedDates] = useState(false);
  const [Month, setMonth] = useState([]);
  const [AllMonth, setAllMonth] = useState([
    { month_id: 0, month_name: 'None' },
    { month_id: 1, month_name: 'January' },
    { month_id: 2, month_name: 'February' },
    { month_id: 3, month_name: 'March' },
    { month_id: 4, month_name: 'April' },
    { month_id: 5, month_name: 'May' },
    { month_id: 6, month_name: 'June' },
    { month_id: 7, month_name: 'July' },
    { month_id: 8, month_name: 'August' },
    { month_id: 9, month_name: 'September' },
    { month_id: 10, month_name: 'October' },
    { month_id: 11, month_name: 'November' },
    { month_id: 12, month_name: 'December' }
  ]);
  const [Year, setYear] = useState([]);
  const [AllYear, setAllYear] = useState([]);

  const [Disease, setDisease] = useState([]);
  const [Location, setLocation] = useState([]);
  const [AllDisease, setAllDisease] = useState([]);
  const [AllLocation, setAllLocation] = useState([]);

  const [PredictionFields, setPredictionFields] = useState([]);
  const [PredictionResult, setPredictionResult] = useState([]);

  const [isSubmitting, setSubmitting] = useState(false);
  const [showerror, setShowerror] = useState(false);
  const [showerrorMessage, setShowerrorMessage] = useState('Error : No Response While Submmiting');

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250
      }
    }
  };

  useEffect(() => {
    dispatch(getDiseaseLocation());
    const currentYear = new Date().getFullYear();
    const arr = [];
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i <= 10; i++) {
      arr.push(currentYear + i);
    }
    setAllYear(arr);
    return () => {
      dispatch(clearhome());
    };
  }, []);

  useEffect(() => {
    if (homeStore.status === 'idle') {
      // for diseaselocation
      if (homeStore.data.diseaselocation?.status === 'success') {
        setAllDisease(homeStore.data.diseaselocation.disease);
        setAllLocation(homeStore.data.diseaselocation.location);
      }

      // for prediction
      if (homeStore.data.prediction?.status === 'success') {
        const TABLE_HEAD = [];
        if (homeStore.data.prediction.fields.length > 0) {
          homeStore.data.prediction.fields.map((name) => {
            TABLE_HEAD.push({ id: name, label: name, alignRight: false });
            return 0;
          });
        }
        const temp = cloneDeep(homeStore.data.prediction.result);
        homeStore.data.prediction.result.map((l, index) =>
          AllDisease.map((location) => {
            // eslint-disable-next-line eqeqeq
            if (location.disease_id == l.Disease) temp[index].Disease = location.disease_name;
            return true;
          })
        );
        homeStore.data.prediction.result.map((l, index) =>
          AllLocation.map((location) => {
            // eslint-disable-next-line eqeqeq
            if (location.location_id == l.Location) temp[index].Location = location.location_name;
            return true;
          })
        );
        homeStore.data.prediction.result.map((l, index) =>
          AllMonth.map((location) => {
            // eslint-disable-next-line eqeqeq
            if (location.month_id == l.Month) temp[index].Month = location.month_name;
            return true;
          })
        );

        setPredictionFields(TABLE_HEAD);
        setPredictionResult(temp);
        setSubmitting(false);
        if (showerror) setShowerror(false);
        // console.log(PredictionFields, PredictionResult);
      } else if (homeStore.data.prediction?.status === 'fail') {
        setSubmitting(false);
        setShowerrorMessage(homeStore.data.prediction.message);
        setShowerror(true);
      }
    }
  }, [homeStore]);

  const handleChangeDisease = (event) => {
    const {
      target: { value }
    } = event;
    setDisease(
      // On autofill we get a the stringified value.
      typeof value === 'string' ? value.split(',') : value
    );
    // console.log(Disease);
    // console.log(newarr);
  };

  const handleChangeLocation = (event) => {
    const {
      target: { value }
    } = event;
    setLocation(
      // On autofill we get a the stringified value.
      typeof value === 'string' ? value.split(',') : value
    );
    // console.log(Location);
    // console.log(newarr);
  };

  const handleChangeMonth = (event) => {
    const {
      target: { value }
    } = event;
    setMonth(
      // On autofill we get a the stringified value.
      typeof value === 'string' ? value.split(',') : value
    );
  };

  const handleChangeYear = (event) => {
    const {
      target: { value }
    } = event;
    setYear(
      // On autofill we get a the stringified value.
      typeof value === 'string' ? value.split(',') : value
    );
  };

  const onSubmit = () => {
    setPredictionFields([]);
    setPredictionResult([]);
    setSubmitting(true);
    const DiseaseArr = [];
    const LocationArr = [];
    const MonthArr = [];
    const YearArr = [];
    const ToMonthArr = [];
    const ToYearArr = [];
    Disease.map((l) =>
      AllDisease.map((location) => {
        if (location.disease_name === l) DiseaseArr.push(location.disease_id);
        return true;
      })
    );
    Location.map((l) =>
      AllLocation.map((location) => {
        if (location.location_name === l) LocationArr.push(location.location_id);
        return true;
      })
    );
    if (isUnorderedDates) {
      Month.map((l) =>
        AllMonth.map((location) => {
          if (location.month_name === l) MonthArr.push(location.month_id);
          return true;
        })
      );
    } else {
      // const dateObj1 = new Date(FromMonth);
      const dateObj11 = new Date(FromYear);
      // MonthArr.push(dateObj1.getMonth() + 1);
      AllMonth.map((location) => {
        if (location.month_name === FromMonth && location.month_id !== 0)
          MonthArr.push(location.month_id);
        return true;
      });
      YearArr.push(dateObj11.getFullYear());

      // const dateObj2 = new Date(ToMonth);
      const dateObj21 = new Date(ToYear);
      // ToMonthArr.push(dateObj2.getMonth() + 1);
      AllMonth.map((location) => {
        if (location.month_name === ToMonth && location.month_id !== 0)
          ToMonthArr.push(location.month_id);
        return true;
      });
      // ToMonthArr.push(ToMonth);
      ToYearArr.push(dateObj21.getFullYear());
    }
    console.log('submit : ', {
      disease: DiseaseArr,
      location: LocationArr,
      from_year: isUnorderedDates ? Year : YearArr,
      from_month: MonthArr,
      to_year: ToYearArr,
      to_month: ToMonthArr
    });
    dispatch(
      getPrediction({
        disease: DiseaseArr,
        location: LocationArr,
        from_year: isUnorderedDates ? Year : YearArr,
        from_month: MonthArr,
        to_year: ToYearArr,
        to_month: ToMonthArr
      })
    );
  };

  function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  }

  function getComparator(order, orderBy) {
    return order === 'desc'
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  }

  function applySortFilter(array, comparator, query) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    if (query) {
      return filter(
        array,
        (_user) =>
          _user.Disease?.toString().toLowerCase().indexOf(query.toLowerCase()) !== -1 ||
          _user.Location?.toString().toLowerCase().indexOf(query.toLowerCase()) !== -1 ||
          _user.Month?.toString().toLowerCase().indexOf(query.toLowerCase()) !== -1 ||
          _user.Year?.toString().toLowerCase().indexOf(query.toLowerCase()) !== -1 ||
          _user.Prediction?.toString().toLowerCase().indexOf(query.toLowerCase()) !== -1
      );
    }
    return stabilizedThis.map((el) => el[0]);
  }

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = PredictionResult.map((n, index) => index);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - PredictionResult.length) : 0;

  const filteredUsers = applySortFilter(
    PredictionResult,
    getComparator(order, orderBy),
    filterName
  );

  const isUserNotFound = filteredUsers.length === 0;

  return (
    <Page title="Home | Minimal-UI">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Prediction
          </Typography>
          {/* <Button
            variant="contained"
            component={RouterLink}
            to="#"
            startIcon={<Icon icon={plusFill} />}
          >
            New User
          </Button> */}
        </Stack>
        <Box mb={3}>
          <Card>
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl sx={{ width: '100%' }} error={showerror && Disease.length === 0}>
                    <InputLabel id="demo-multiple-checkbox-label">Disease</InputLabel>
                    <Select
                      labelId="demo-multiple-checkbox-label"
                      id="demo-multiple-checkbox"
                      multiple
                      value={Disease}
                      onChange={handleChangeDisease}
                      input={<OutlinedInput label="Disease" />}
                      renderValue={(selected) => selected.join(', ')}
                      MenuProps={MenuProps}
                    >
                      {AllDisease.map((ADisease) => (
                        <MenuItem key={ADisease.disease_id} value={ADisease.disease_name}>
                          <Checkbox checked={Disease.indexOf(ADisease.disease_name) > -1} />
                          <ListItemText primary={ADisease.disease_name} />
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl sx={{ width: '100%' }} error={showerror && Location.length === 0}>
                    <InputLabel id="demo-multiple-checkbox-label">Location</InputLabel>
                    <Select
                      labelId="demo-multiple-checkbox-label"
                      id="demo-multiple-checkbox"
                      multiple
                      value={Location}
                      onChange={handleChangeLocation}
                      input={<OutlinedInput label="Location" />}
                      renderValue={(selected) => selected.join(', ')}
                      MenuProps={MenuProps}
                    >
                      {AllLocation.map((ALocation) => (
                        <MenuItem key={ALocation.location_id} value={ALocation.location_name}>
                          <Checkbox checked={Location.indexOf(ALocation.location_name) > -1} />
                          <ListItemText primary={ALocation.location_name} />
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={12} md={6}>
                  <FormControl component="fieldset">
                    <FormLabel component="legend">Dates</FormLabel>
                    <RadioGroup
                      row
                      aria-label="gender"
                      name="controlled-radio-buttons-group"
                      value={isUnorderedDates ? 'true' : 'false'}
                      onChange={(e) => {
                        if (e.target.value === 'true') setisUnorderedDates(true);
                        else setisUnorderedDates(false);
                        // setisUnorderedDates(!isUnorderedDates);
                      }}
                    >
                      <FormControlLabel value="true" control={<Radio />} label="Month/Year Wise" />
                      <FormControlLabel value="false" control={<Radio />} label="Range Wise" />
                    </RadioGroup>
                  </FormControl>
                </Grid>
                {isUnorderedDates ? (
                  <>
                    <Grid item xs={12} sm={5} md={3}>
                      <FormControl sx={{ width: '100%' }}>
                        <InputLabel id="demo-multiple-checkbox-label">Months</InputLabel>
                        <Select
                          labelId="demo-multiple-checkbox-label"
                          id="demo-multiple-checkbox"
                          multiple
                          value={Month}
                          onChange={handleChangeMonth}
                          input={<OutlinedInput label="Months" />}
                          renderValue={(selected) => selected.join(', ')}
                          MenuProps={MenuProps}
                        >
                          {AllMonth.map((AMonth) => (
                            <MenuItem key={AMonth.month_id} value={AMonth.month_name}>
                              <Checkbox checked={Month.indexOf(AMonth.month_name) > -1} />
                              <ListItemText primary={AMonth.month_name} />
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={5} md={3}>
                      <FormControl sx={{ width: '100%' }} error={showerror}>
                        <InputLabel id="demo-multiple-checkbox-label">Years</InputLabel>
                        <Select
                          labelId="demo-multiple-checkbox-label"
                          id="demo-multiple-checkbox"
                          multiple
                          value={Year}
                          onChange={handleChangeYear}
                          input={<OutlinedInput label="Years" />}
                          renderValue={(selected) => selected.join(', ')}
                          MenuProps={MenuProps}
                        >
                          {AllYear.map((AYear) => (
                            <MenuItem key={AYear} value={AYear}>
                              <Checkbox checked={Year.indexOf(AYear) > -1} />
                              <ListItemText primary={AYear} />
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                  </>
                ) : (
                  <>
                    <Grid item xs={12} sm={5} md={3}>
                      {/* <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                          views={['month']}
                          label="From Month"
                          // minDate={new Date('2012-03-01')}
                          // maxDate={new Date('2023-06-01')}
                          value={FromMonth}
                          onChange={(newValue) => {
                            setFromMonth(newValue);
                          }}
                          renderInput={(params) => <TextField {...params} helperText={null} />}
                        />
                      </LocalizationProvider> */}
                      <FormControl sx={{ width: '100%' }} error={showerror}>
                        <InputLabel id="demo-multiple-checkbox-label">From Month</InputLabel>
                        <Select
                          labelId="demo-multiple-checkbox-label"
                          id="demo-multiple-checkbox"
                          value={FromMonth}
                          onChange={(newValue) => {
                            setFromMonth(newValue.target.value);
                          }}
                          input={<OutlinedInput label="From Month" />}
                        >
                          {AllMonth.map((AYear) => (
                            <MenuItem key={AYear.month_id} value={AYear.month_name}>
                              <ListItemText primary={AYear.month_name} />
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={5} md={3}>
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                          views={['year']}
                          label="From Year"
                          // minDate={new Date('2012-03-01')}
                          // maxDate={new Date('2023-06-01')}
                          value={FromYear}
                          onChange={(newValue) => {
                            setFromYear(newValue);
                          }}
                          renderInput={(params) => <TextField {...params} helperText={null} />}
                        />
                      </LocalizationProvider>
                    </Grid>
                    {FromMonth && FromYear && (
                      <>
                        <Grid item xs={12} sm={5} md={3}>
                          {/* <FormControl sx={{ width: '100%' }}>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                              <DatePicker
                                views={['month']}
                                label="To Month"
                                minDate={new Date(FromMonth)}
                                // maxDate={new Date('2023-06-01')}
                                value={ToMonth}
                                onChange={(newValue) => {
                                  setToMonth(newValue);
                                }}
                                renderInput={(params) => (
                                  <TextField {...params} helperText={null} />
                                )}
                              />
                            </LocalizationProvider>
                          </FormControl> */}
                          <FormControl sx={{ width: '100%' }} error={showerror}>
                            <InputLabel id="demo-multiple-checkbox-label">To Month</InputLabel>
                            <Select
                              labelId="demo-multiple-checkbox-label"
                              id="demo-multiple-checkbox"
                              value={ToMonth}
                              onChange={(newValue) => {
                                setToMonth(newValue.target.value);
                              }}
                              input={<OutlinedInput label="From Month" />}
                            >
                              {AllMonth.map((AYear) => (
                                <MenuItem key={AYear.month_id} value={AYear.month_name}>
                                  <ListItemText primary={AYear.month_name} />
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={5} md={3}>
                          <FormControl sx={{ width: '100%' }}>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                              <DatePicker
                                views={['year']}
                                label="To Year"
                                minDate={new Date(FromYear)}
                                // maxDate={new Date('2023-06-01')}
                                value={ToYear}
                                onChange={(newValue) => {
                                  setToYear(newValue);
                                }}
                                renderInput={(params) => (
                                  <TextField {...params} helperText={null} />
                                )}
                              />
                            </LocalizationProvider>
                          </FormControl>
                        </Grid>
                      </>
                    )}
                  </>
                )}
                {/* <Grid item xs={12} sm={12} md={4}>
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={isUnorderedDates}
                          onChange={() => {
                            setisUnorderedDates(!isUnorderedDates);
                          }}
                        />
                      }
                      label={isUnorderedDates ? 'Month/year Dates' : 'Ordered Dates'}
                    />
                  </FormGroup>
                </Grid> */}
                {/* <Grid item xs={12} sm={12} md={4}>
                  <ToggleButton
                    value="check"
                    selected={isUnorderedDates}
                    onChange={() => {
                      setisUnorderedDates(!isUnorderedDates);
                    }}
                  >
                    {isUnorderedDates ? 'Unordered Dates' : 'Ordered Dates'}
                  </ToggleButton>
                </Grid> */}
                <Grid item xs={12} sm={12} md={12}>
                  <Collapse in={showerror}>
                    <Alert
                      severity="error"
                      action={
                        <IconButton
                          aria-label="close"
                          color="inherit"
                          size="small"
                          onClick={() => {
                            setShowerror(false);
                          }}
                        >
                          {/* <CloseIcon fontSize="inherit" /> */}X
                        </IconButton>
                      }
                      sx={{ mb: 2 }}
                    >
                      <AlertTitle>Error</AlertTitle>
                      {showerrorMessage}
                    </Alert>
                  </Collapse>
                </Grid>
                <Grid item xs={12} sm={12} md={12}>
                  <LoadingButton
                    // fullWidth
                    // size="large"
                    type="submit"
                    variant="contained"
                    loading={isSubmitting}
                    onClick={onSubmit}
                  >
                    Submit
                  </LoadingButton>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Box>
        <Collapse in={PredictionFields.length > 0}>
          <Grid container spacing={3}>
            {/* <Grid item xs={12} sm={12} md={12}>
              <Card>
                <UserListToolbar
                  numSelected={selected.length}
                  filterName={filterName}
                  onFilterName={handleFilterByName}
                />

                <Scrollbar>
                  <TableContainer sx={{ minWidth: 800 }}>
                    <Table>
                      <UserListHead
                        order={order}
                        orderBy={orderBy}
                        headLabel={PredictionFields}
                        rowCount={PredictionResult.length}
                        numSelected={selected.length}
                        onRequestSort={handleRequestSort}
                        onSelectAllClick={handleSelectAllClick}
                      />
                      <TableBody>
                        {filteredUsers
                          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                          .map((row, index) => {
                            // const { Disease, Location, Month, Year, Prediction } = row;
                            const isItemSelected = selected.indexOf(index) !== -1;

                            return (
                              <TableRow
                                hover
                                key={index}
                                tabIndex={-1}
                                role="checkbox"
                                selected={isItemSelected}
                                aria-checked={isItemSelected}
                              >
                                <TableCell padding="checkbox">
                                  <Checkbox
                                    checked={isItemSelected}
                                    onChange={(event) => handleClick(event, index)}
                                  />
                                </TableCell>
                                {PredictionFields.map((result, index) => (
                                  <TableCell key={index} align="left">
                                    {row[result.id]}
                                  </TableCell>
                                ))}
                              </TableRow>
                            );
                          })}
                        {emptyRows > 0 && (
                          <TableRow style={{ height: 53 * emptyRows }}>
                            <TableCell colSpan={6} />
                          </TableRow>
                        )}
                      </TableBody>
                      {isUserNotFound && (
                        <TableBody>
                          <TableRow>
                            <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                              <SearchNotFound searchQuery={filterName} />
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      )}
                    </Table>
                  </TableContainer>
                </Scrollbar>

                <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  component="div"
                  count={PredictionResult.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </Card>
            </Grid> */}
            <Grid item xs={12} md={12} lg={12}>
              <ChartPredictions
                Type="Disease"
                Location={Location}
                Disease={Disease}
                PredictionResult={PredictionResult}
              />
            </Grid>

            <Grid item xs={12} md={12} lg={12}>
              <ChartPredictions
                Type="Location"
                Location={Location}
                Disease={Disease}
                PredictionResult={PredictionResult}
              />
            </Grid>

            <Grid item xs={12} md={6} lg={6}>
              <ChartCases Type="Disease" Data={Disease} PredictionResult={PredictionResult} />
            </Grid>
            <Grid item xs={12} md={6} lg={6}>
              <ChartCases Type="Location" Data={Location} PredictionResult={PredictionResult} />
            </Grid>

            <Grid item xs={12} md={12} lg={12}>
              <DowndloadPDF
                PredictionFields={PredictionFields}
                PredictionResult={PredictionResult}
              />
            </Grid>
          </Grid>
        </Collapse>
      </Container>
    </Page>
  );
}
