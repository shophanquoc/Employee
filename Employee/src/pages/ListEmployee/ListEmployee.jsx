import * as React from "react";
import { useEffect, useState, useMemo } from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import EditIcon from "@material-ui/icons/Edit";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import LinearProgress from "@mui/material/LinearProgress";
import Box from "@mui/material/Box";
import { connect } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { FetchData, RemoveUser } from "../../Redux/Action";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { confirmAlert } from "react-confirm-alert";
import ReactPaginate from "react-paginate";
import { Tooltip } from "@material-ui/core";

const ListEmployee = (props) => {
  const [pageCount, setPageCount] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  const handlePageClick = (selectedPage) => {
    setCurrentPage(selectedPage);
  };
  const handleDelete = (code, name) => {
    confirmAlert({
      title: `Are you sure to delete '${name}'?`,
      buttons: [
        {
          label: "No",
          onClick: () => {},
        },
        {
          label: "Yes",
          onClick: () => {
            props.removeUser(code);
            toast.success("User Deleted Successfully");
          },
        },
      ],
    });
  };
  useEffect(() => {
    props.loadData(currentPage);
    const pageCountData = Math.ceil(props.user.userList.total_pages);
    setPageCount(pageCountData);
  }, [currentPage, props.user.userList.total_pages]); //for render total pages at first time

  return props.user.loading ? (
    <>
      <Box
        sx={{
          width: "100%",
          marginTop: "20px",
        }}
      >
        <LinearProgress />
      </Box>
    </>
  ) : props.user.userList.errMessage ? (
    <>
      <h2>{props.user.userList.errMessage}</h2>
    </>
  ) : (
    <>
      <Link to="/" sx={{ textDecoration: "none" }}></Link>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell align="center">No</StyledTableCell>
              <StyledTableCell align="center">Avatar</StyledTableCell>
              <StyledTableCell align="center">Name</StyledTableCell>
              <StyledTableCell align="center">Email</StyledTableCell>
              <StyledTableCell align="center">Position</StyledTableCell>
              <StyledTableCell align="center">Action</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {props.user.userList.data.map((user) => {
              return (
                <StyledTableRow align="center" key={user.id}>
                  <StyledTableCell align="center">{user.id}</StyledTableCell>
                  <StyledTableCell component="th" scope="row">
                    <ListItemAvatar align="center">
                      {/* <Avatar alt=" " src={user.avatar} loading="lazy" /> */}
                      {user.avatar ? (
                        <Tooltip title="Click to view details" arrow>
                          <Avatar
                            alt=" "
                            src={user.avatar}
                            loading="lazy"
                            onClick={() => {
                              navigate(`/employee/${user.id}`);
                            }}
                            sx={{
                              "&:hover": {
                                cursor: "pointer",
                                border: "2px solid #008080",
                                transition: "all 0.3s ease-in-out",
                              },
                              border: "2px solid #ccc",
                            }}
                          />
                        </Tooltip>
                      ) : (
                        <Avatar
                          alt=" "
                          src="https://www.w3schools.com/howto/img_avatar.png"
                        />
                      )}
                    </ListItemAvatar>
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {user.first_name + " " + user.last_name}
                  </StyledTableCell>
                  <StyledTableCell align="center">{user.email}</StyledTableCell>
                  <StyledTableCell align="center">Staff</StyledTableCell>
                  <StyledTableCell align="center">
                    <ButtonGroup
                      variant="outlined"
                      aria-label="outlined secondary button group"
                      size="small"
                    >
                      <Tooltip title="Edit Employee" arrow>
                        <Button
                          sx={{
                            "&:hover": {
                              color: "white",
                              backgroundColor: "primary.main",
                            },
                          }}
                          onClick={() => {
                            navigate(`/employee/edit/${user.id}`);
                          }}
                        >
                          <EditIcon />
                        </Button>
                      </Tooltip>
                      <Tooltip title="Delete Forever" arrow>
                        <Button
                          sx={{
                            "&:hover": {
                              color: "white",
                              backgroundColor: "danger.main",
                            },
                          }}
                          onClick={() => {
                            handleDelete(
                              user.id,
                              user.first_name + " " + user.last_name
                            );
                          }}
                        >
                          <DeleteForeverIcon />
                        </Button>
                      </Tooltip>
                    </ButtonGroup>
                  </StyledTableCell>
                </StyledTableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <ReactPaginate
        previousLabel={"← Previous"}
        nextLabel={"Next →"}
        pageCount={pageCount}
        onPageChange={(e) => {
          let selectedPage = e.selected + 1;
          handlePageClick(selectedPage);
        }}
        containerClassName={"pagination"}
        activeClassName={"active"}
        pageClassName={"page-item"}
        pageLinkClassName={"page-link"}
        previousClassName={"page-item"}
        previousLinkClassName={"page-link"}
        nextClassName={"page-item"}
        nextLinkClassName={"page-link"}
      />
    </>
  );
};
//access the state from the store
const mapStateToProps = (state) => {
  return {
    user: state.user,
    userList: state.user.userList,
    data: state.user.userList.data,
  };
};
// dispatch the action to the store
const mapDispatchToProps = (dispatch) => ({
  removeUser: (code) => dispatch(RemoveUser(code)),
  loadData: (currentPage) => dispatch(FetchData(currentPage)),
});
//connect function is used to connect the component to the store
export default connect(mapStateToProps, mapDispatchToProps)(ListEmployee);

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));
