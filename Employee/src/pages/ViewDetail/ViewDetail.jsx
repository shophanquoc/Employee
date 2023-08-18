import { FetchUserObj, RemoveUser, UpdateEmployee } from "../../Redux/Action";
import { connect } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { confirmAlert } from "react-confirm-alert";
import { useEffect, useState } from "react";
import EditIcon from "@material-ui/icons/Edit";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
// import LinearProgress from "@mui/material/LinearProgress";
import {
  LinearProgress,
  CardActions,
  CardContent,
  CardMedia,
  Box,
  Card,
  styled,
  Stack,
  Avatar,
  Typography,
  Grid,
  Button,
  ButtonGroup,
  Modal,
  Menu,
  MenuItem,
} from "@mui/material";

const ViewDetail = (props) => {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [avatar, setAvatar] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    props.loadUserObj(id);
    if (props.userObj) {
      setEmail(props.userObj.email);
      setFirstName(props.userObj.first_name);
      setLastName(props.userObj.last_name);
      setAvatar(props.userObj.avatar);
    }
  }, [props.userObj]);

  const handleEditClick = () => {
    navigate(`/employee/edit/${id}`);
  };
  const handleDeleteClick = () => {
    confirmAlert({
      title: "Confirm to delete",
      message: "Are you sure to delete this employee?",
      buttons: [
        {
          label: "No",
          onClick: () => {},
        },
        {
          label: "Yes",
          onClick: () => {
            props.removeUser(id);
            toast.success("Successfully Deleted ");
            navigate("/employee");
          },
        },
      ],
    });
  };

  return (
    <>
      {props.userObj.loading ? (
        <LinearProgress />
      ) : (
        <StyledInfCard>
          <Card sx={{ maxWidth: 400 }}>
            <CardMedia
              component="img"
              alt="avatar"
              sx={{
                borderRadius: 1,
                height: 400,
              }}
              image={avatar || "https://source.unsplash.com/random?wallpapers"}
              loading="lazy"
            />

            <CardContent sx={{ padding: "10px 0" }}>
              <Typography gutterBottom variant="h5" component="div">
                {firstName + " " + lastName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Email: {email}
              </Typography>
            </CardContent>
            <CardActions
              sx={{
                display: "flex",
                justifyContent: "space-between",
                padding: "10px 0",
              }}
            >
              <Button
                variant="contained"
                size="small"
                onClick={() => {
                  handleEditClick();
                }}
              >
                {" "}
                <EditIcon />
                Edit
              </Button>
              <Button
                variant="contained"
                size="small"
                color="error"
                onClick={() => {
                  handleDeleteClick();
                }}
              >
                {" "}
                <DeleteForeverIcon />
                Delete
              </Button>
            </CardActions>
          </Card>
        </StyledInfCard>
      )}
    </>
  );
};
const mapStateToProps = (state) => {
  return {
    userObj: state.user.userObj,
    user: state.user,
  };
};
const mapDispatchToProps = (dispatch) => ({
  loadUserObj: (id) => dispatch(FetchUserObj(id)),
  updateUser: (data, id) => dispatch(UpdateEmployee(data, id)),
  removeUser: (id) => dispatch(RemoveUser(id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ViewDetail);

const StyledAvatar = styled(Avatar)(() => ({
  width: 120,
  height: 120,
}));

const StyledInfCard = styled(Card)(() => ({
  // height: 400,
  // maxWidth: "50%",
  // height: "100%",
  boxShadow: "none",
  backgroundColor: "transparent",
  margin: "0",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));
