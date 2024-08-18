import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Button, Link } from "@mui/material";
import { useAuth0 } from "@auth0/auth0-react";
import FavoriteIcon from "@mui/icons-material/Favorite";
import Paper from "@mui/material/Paper";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import Poster from "../components/Poster";
import CommentCard from "../components/CommentCard";
import { useNavigate } from "react-router-dom";
import "./MovieInfoPage.css";

const config = require("../config.json");

export default function MovieInfoPage() {
  const { loginWithRedirect, user, isAuthenticated, isLoading } = useAuth0(); // isAuthenticated indicates if user is logged in
  const { movie_id } = useParams();
  const [movieData, setMovieData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(
      `${
        process.env.NODE_ENV === "production"
          ? config.production_server_host
          : `${config.server_host}:${config.server_port}`
      }/movie/${movie_id}`
    )
      .then((res) => res.json())
      .then((resJson) => setMovieData(resJson));
  }, [movie_id]);

  const handleRowClick = (personId) => {
    navigate(`/person-info/${personId}`);
  };

  // For Like button
  const [liked, setLiked] = useState(false);
  const handleLikeClick = () => {
    if (!isAuthenticated) {
      loginWithRedirect({
        appState: {
          returnTo: window.location.pathname,
        },
      });
      return;
    }

    fetch(
      `${
        process.env.NODE_ENV === "production"
          ? config.production_server_host
          : `${config.server_host}:${config.server_port}`
      }/movie/${movie_id}/like`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          select: !liked,
          user_id: user.sub,
        }),
      }
    )
      .then((response) => response.json())
      .then((json) => {
        console.log(json);
        setLiked(!liked);
      });
  };

  useEffect(() => {
    if (user === undefined || user.sub === undefined) return;
    fetch(
      `${
        process.env.NODE_ENV === "production"
          ? config.production_server_host
          : `${config.server_host}:${config.server_port}`
      }/movie/${movie_id}/like?user_id=${user.sub}`
    )
      .then((res) => res.json())
      .then((resJson) => {
        console.log(resJson);
        setLiked(resJson.like);
      });
  }, [user, movie_id]);

  // Function to format release date to "YYYY-MM-DD" format
  const formatReleaseDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

  return (
    <div className="movie-info-page">
      <div className="nav-bar-holding-block"></div>
      <Container style={{ color: "white", top: "60px" }}>
        <div style={{ display: "flex", alignItems: "end" }}>
          {/* Poster Div width=440px */}
          <div>
            {movieData.poster_path && <Poster movie={movieData}></Poster>}
          </div>

          {/* Movie info */}
          <div style={{ marginLeft: "60px", marginBottom: "30px" }}>

            {/* Like Bottom */}
            {isAuthenticated && ( // If logged out, hide the like button
              <button
                onClick={handleLikeClick}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer", 
                  marginLeft: "-6px"
                }}
              >
                {liked ? (
                  <FavoriteIcon style={{ color: "red", opacity: "0.5", fontSize: "40px" }} />
                ) : (
                  <FavoriteBorderIcon style={{ color: "white", fontSize: "40px" }} />
                )}
              </button>
            )}
            {/* Title */}
            {movieData.original_title && !isLoading && (
              <h1 style={{ fontSize: "50px", marginTop: "5px" }}>
                {movieData.original_title}
              </h1>
            )}

            {/* English Title */}
            {movieData.original_language !== "en" && (
              <p>
                <b style={{ color: "#bbbbbb" }}>English Title:</b>{" "}
                {movieData.title}
              </p>
            )}

            {console.log(movieData)}

            {/* Genres */}
            {movieData.genre && (
            <div style={{ marginBottom: "30px" }}>
              {movieData.genre.map((genre) => (
              <Button
                key={genre}
                variant="outlined"
                size="small"
                style={{
                  marginRight: "15px",
                  color: "white",
                  backgroundColor: "grey",
                  cursor: "default"
                }}
              >
                {genre}
              </Button>
              ))}
            </div>
            )}

            {/* Overview */}
            {movieData.overview && (
              <p style={{ fontSize: "18px", color: "#bbbbbb" }}>
                {movieData.overview}
              </p>
            )}

            {/* Two columns: Release Date, Runtime, Rating, Count */}
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div style={{ flex: 1 }}>
                {movieData.release_date && (
                  <p>
                    <b style={{ color: "#bbbbbb" }}>Release Date:</b>{" "}
                    {formatReleaseDate(movieData.release_date)}
                  </p>
                )}
                {movieData.runtime && (
                  <p>
                    <b style={{ color: "#bbbbbb" }}>Runtime:</b>{" "}
                    {movieData.runtime} min
                  </p>
                )}
              </div>
              <div style={{ flex: 1 }}>
                {movieData.vote_average && (
                  <p>
                    <b style={{ color: "#bbbbbb" }}>Rating:</b>{" "}
                    {movieData.vote_average}
                  </p>
                )}
                {movieData.vote_count && (
                  <p>
                    <b style={{ color: "#bbbbbb" }}>Rating Count:</b>{" "}
                    {movieData.vote_count}
                  </p>
                )}
              </div>
            </div>

            {/* Production Companies */}
            {movieData.production_companies && (
              <p>
                <b style={{ color: "#bbbbbb" }}>Production Companies:</b>{" "}
                {movieData.production_companies}
              </p>
            )}

            {/* Homepage */}
            {movieData.homepage && (
              <p>
                <b style={{ color: "#bbbbbb" }}>Homepage:</b>{" "}
                {movieData.homepage}
              </p>
            )}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "start", paddingBottom: "100px" }}>
          <div>
            {/* Comments */}
            <CommentCard movieId={movie_id}></CommentCard>
          </div>
          <div style={{ marginLeft: "90px", marginTop: "30px", width: "500px" }}>
            {/* Staff List */}
            <div>
              <TableContainer component={Paper}>
                <Table aria-label="simple table" >
                  <TableHead>
                    <TableRow style={{ backgroundColor: "rgb(25, 25, 25)" }}>
                      <TableCell
                        align="center"
                        style={{
                          fontSize: "40px",
                          letterSpacing: "2px",
                          fontFamily: "EB Garamond, serif",
                          color: "rgb(150, 150, 150)",
                        }}
                      >
                        <i>Staff</i>
                      </TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {movieData.staff &&
                      movieData.staff.filter(
                        (staff) => staff.job_title === "director"
                      ).length > 0 &&
                      movieData.staff
                        .filter((staff) => staff.job_title === "director")
                        .map((staff) => (
                          <TableRow
                            key={staff.person_id + staff.job_title}
                            sx={{
                              "&:last-child td, &:last-child th": { border: 0 },
                            }}
                            style={{ backgroundColor: "rgb(25, 25, 25)" }}
                          >
                          {/* Director's Name */}
                          <TableCell component="th" scope="row" align="center">
                            <b style={{ color: "#bbbbbb" }}>Director: </b>
                            <Link
                              onClick={() => handleRowClick(staff.person_id)}
                              style={{
                                color: "white",
                                cursor: "pointer",
                                fontWeight: "bold",
                              }}
                            >
                              {staff.primary_name}
                            </Link>
                          </TableCell>
                        </TableRow>
                    ))}
                    {movieData.staff &&
                      movieData.staff.filter(
                        (staff) => staff.job_title === "composer"
                      ).length > 0 &&
                      movieData.staff
                        .filter((staff) => staff.job_title === "composer")
                        .map((staff) => (
                          <TableRow
                            key={staff.person_id + staff.job_title}
                            sx={{
                              "&:last-child td, &:last-child th": { border: 0 },
                            }}
                            style={{ backgroundColor: "rgb(25, 25, 25)" }}
                          >
                          {/* Composer's Name */}
                          <TableCell component="th" scope="row" align="center">
                            <b style={{ color: "#bbbbbb" }}>Composer: </b>
                            <Link
                              onClick={() => handleRowClick(staff.person_id)}
                              style={{
                                color: "white",
                                cursor: "pointer",
                                fontWeight: "bold",
                              }}
                            >
                              {staff.primary_name}
                            </Link>
                          </TableCell>
                        </TableRow>
                    ))}
                    {movieData.staff &&
                      movieData.staff.filter(
                        (staff) => staff.job_title === "writer"
                      ).length > 0 &&
                      movieData.staff
                        .filter((staff) => staff.job_title === "writer")
                        .map((staff) => (
                          <TableRow
                            key={staff.person_id + staff.job_title}
                            sx={{
                              "&:last-child td, &:last-child th": { border: 0 },
                            }}
                            style={{ backgroundColor: "rgb(25, 25, 25)" }}
                          >
                          {/* Writer's Name */}
                          <TableCell component="th" scope="row" align="center">
                            <b style={{ color: "#bbbbbb" }}>Writer: </b>
                            <Link
                              onClick={() => handleRowClick(staff.person_id)}
                              style={{
                                color: "white",
                                cursor: "pointer",
                                fontWeight: "bold",
                              }}
                            >
                              {staff.primary_name}
                            </Link>
                          </TableCell>
                        </TableRow>
                    ))}
                    {movieData.staff &&
                      movieData.staff.filter(
                        (staff) => staff.job_title === "producer"
                      ).length > 0 &&
                      movieData.staff
                        .filter((staff) => staff.job_title === "producer")
                        .map((staff) => (
                          <TableRow
                            key={staff.person_id + staff.job_title}
                            sx={{
                              "&:last-child td, &:last-child th": { border: 0 },
                            }}
                            style={{ backgroundColor: "rgb(25, 25, 25)" }}
                          >
                          {/* Producer's Name */}
                          <TableCell component="th" scope="row" align="center">
                            <b style={{ color: "#bbbbbb" }}>Producer: </b>
                            <Link
                              onClick={() => handleRowClick(staff.person_id)}
                              style={{
                                color: "white",
                                cursor: "pointer",
                                fontWeight: "bold",
                              }}
                            >
                              {staff.primary_name}
                            </Link>
                          </TableCell>
                        </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>

            {/* Actor List */}
            <div style={{ marginTop: "50px"}}>
              <TableContainer component={Paper}>
                <Table aria-label="simple table" >
                  <TableHead>
                    <TableRow style={{ backgroundColor: "rgb(25, 25, 25)" }}>
                      <TableCell
                        align="center"
                        style={{
                          fontSize: "40px",
                          letterSpacing: "2px",
                          fontFamily: "EB Garamond, serif",
                          color: "rgb(150, 150, 150)",
                        }}
                      >
                        <i>Actors</i>
                      </TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {movieData.staff &&
                      movieData.staff.filter(
                        (staff) => staff.job_title === "actor"
                      ).length > 0 &&
                      movieData.staff
                        .filter((staff) => staff.job_title === "actor")
                        .map((staff) => (
                          <TableRow
                            key={staff.person_id + staff.job_title}
                            sx={{
                              "&:last-child td, &:last-child th": { border: 0 },
                            }}
                            style={{ backgroundColor: "rgb(25, 25, 25)" }}
                          >
                          {/* Actor's Name */}
                          <TableCell component="th" scope="row" align="center">
                            {console.log(staff)}
                            <b style={{ color: "#bbbbbb" }}>{staff.characters.join(", ")}: </b>
                            <Link
                              onClick={() => handleRowClick(staff.person_id)}
                              style={{color: "white", cursor: "pointer", fontWeight: "bold" }}
                            >
                              {staff.primary_name}
                            </Link>
                          </TableCell>
                        </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
