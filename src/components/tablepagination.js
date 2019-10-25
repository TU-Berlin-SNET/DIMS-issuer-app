import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles, useTheme } from '@material-ui/core/styles';

import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';

import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';
import MoreAttributes from './moreAttributesDialog.js'
import Box from '@material-ui/core/Box'
import Tooltip from '@material-ui/core/Tooltip';
import Grid from '@material-ui/core/Grid'
import MoreHoriz from '@material-ui/icons/MoreHoriz';


const useStyles1 = makeStyles(theme => ({
  root: {
    flexShrink: 0,
    color: theme.palette.text.secondary,
    marginLeft: theme.spacing(2.5),
  },
}));

function TablePaginationActions(props) {
  const classes = useStyles1();
  const theme = useTheme();
  const { count, page, rowsPerPage, onChangePage } = props;

  function handleFirstPageButtonClick(event) {
    onChangePage(event, 0);
  }

  function handleBackButtonClick(event) {
    onChangePage(event, page - 1);
  }

  function handleNextButtonClick(event) {
    onChangePage(event, page + 1);
  }

  function handleLastPageButtonClick(event) {
    onChangePage(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  }

  return (
    <div className={classes.root}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="First Page"
      >
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="Previous Page">
        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="Next Page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="Last Page"
      >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </div>
  );
}

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onChangePage: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};


const useStyles2 = makeStyles(theme => ({
  root: {
    width: '100%',

  },
  table: {
  
  },
  tableWrapper: {
    overflowX: 'auto',
    width: '100%'
  },
}));

var rows = [];
var rowsDefault=['-','-','no..','-','-','-']


export default function CustomPaginationActionsTable(props) {

  //if(props.data.length !== rows.length){More
      rows = props.data
  //}

    const [selected, setSelected] = React.useState([]);
    const classes = useStyles2();
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);  
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage); 
    const isSelected = row => row === selected;

    function handleClick(event, row) {
      setSelected(row);
      props.onEdit(event, row)
      }
    
      function handleDoubleClick(event, row) {
        setSelected(row);
        if(props.hasOwnProperty('onDoubleClick')) props.onDoubleClick(row);
      }

    function rowFunction1(row){
      props.rowFunction1(row)
    }
    function rowFunction2(row){
      props.rowFunction2(row)
    }
    function rowFunction3(row){
      props.rowFunction3(row)
    }
    function rowFunction4(row){
      props.rowFunction4(row)
    }

    function handleChangePage(event, newPage) {
      setPage(newPage);
    }
  
    function handleChangeRowsPerPage(event) {
      setRowsPerPage(parseInt(event.target.value, 10));
    }
    if(props.data.length===0){
      return( 
        <div className={classes.tableWrapper}>
          <Table className={classes.table}>
            <TableBody>
              {rowsDefault.map((row, index) => {
                return(
                  <TableRow key={index}>
                    <TableCell align='center'>
                      {row}
                    </TableCell>
                </TableRow>
              )})}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  colSpan={6}
                  count={rows.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  SelectProps={{
                    inputProps: { 'aria-label': 'Rows per page' },
                    native: true,
                  }}
                  onChangePage={handleChangePage}
                  onChangeRowsPerPage={handleChangeRowsPerPage}
                  ActionsComponent={TablePaginationActions}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      )
    }
    else {
      return (
        <div className={classes.tableWrapper}>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
              {props.showAttr.map((attribute, i) => {
                return (                  
                  <TableCell key={i} align='center' children={attribute}></TableCell>
                  )
                }
              )}
              <TableCell align='center'> {"{...}"}</TableCell>
              <TableCell align='center'> actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => {
                const isItemSelected = isSelected(row);
                return(
                <TableRow key={index} 
                  hover
                  onClick={(event)=>handleClick(event,row )}
                  onDoubleClick={(event) => handleDoubleClick(event,row)}
                  selected= {isItemSelected}
                >
                  {props.showAttr.map((attribute, i) => {
                 if(attribute.includes('.')){
                      let pathToAttribute = attribute.split(".")
                      var lengthOfPath = pathToAttribute.length - 1
                      let currentAttribute = attribute
                      let newRow = row
                      for(let i=0; i<lengthOfPath; i++){
                        currentAttribute = pathToAttribute[i]
                        if(newRow[currentAttribute] !== null)
                          newRow = newRow[currentAttribute]
                        else return <TableCell key={i} align='center' children={null}></TableCell>
                      }
                      currentAttribute = pathToAttribute[lengthOfPath]
                      return( <TableCell key={i} align='center' children={newRow[currentAttribute]}></TableCell>)
                    } 
                    if(i===0){ return (                  
                      <TableCell key={i} align='center'  component="th" scope="row" children={row[attribute]}></TableCell>)}
                    else{ 
                      return( 
                      <TableCell key={i} align='center' children={row[attribute]}></TableCell>
                      )
                    }
                  })}
                  <TableCell align='center' >      
                    <MoreAttributes row={row} icon={<MoreHoriz/>} iconText=''/>
                  </TableCell>
                  
                  <TableCell align='center' > 
                  <Grid container justify='center' spacing={0}>
                  { props.rowFunctions.map((func, index) => {
                  return(
                      <Grid item key={index}>
                      <Tooltip title={func.rowFunctionName}>
                        <IconButton onClick={() => func.rowFunction(row)}>
                          {func.rowFunctionIcon} 
                        </IconButton>
                      </Tooltip>
                      </Grid>
                      )})
                 
                }
                      </Grid>    
                    </TableCell>
                </TableRow>
                )
              })}
  
              {emptyRows > 0 && (
                <TableRow style={{ height: 48 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  colSpan={6}
                  count={rows.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  SelectProps={{
                    inputProps: { 'aria-label': 'Rows per page' },
                    native: true,
                  }}
                  onChangePage={handleChangePage}
                  onChangeRowsPerPage={handleChangeRowsPerPage}
                  ActionsComponent={TablePaginationActions}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </div>
    );
    }
  }
